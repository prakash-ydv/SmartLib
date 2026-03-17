import https from "https";

// ─── CONFIGURATION ────────────────────────────────────────────────────────────

const GEMINI_KEYS = [
  process.env.GEMINI_KEY_1,
  process.env.GEMINI_KEY_2,
  process.env.GEMINI_KEY_3,
].filter(Boolean); // removes undefined keys if not set

const MODEL_CHAIN = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash",
];

const CONFIG = {
  MAX_RETRIES: 5,
  BASE_DELAY_MS: 2000,
  MAX_DELAY_MS: 64000,
  REQUEST_GAP_MS: 6500, // 60s / 10 RPM + buffer
  CONCURRENCY: 1,
  CACHE_TTL_MS: 60 * 60 * 1000, // 1 hour
};

// ─── STATE ────────────────────────────────────────────────────────────────────

let keyIndex = 0;
let modelIndex = 0;
let activeRequests = 0;
let lastRequestTime = 0;
const queue = [];
const inFlight = new Map(); // prevent duplicate requests for same book
const cache = new Map();   // in-memory cache

// ─── CACHE ────────────────────────────────────────────────────────────────────

function cacheGet(bookId) {
  const entry = cache.get(bookId);
  if (!entry) return null;
  if (Date.now() - entry.ts > CONFIG.CACHE_TTL_MS) {
    cache.delete(bookId);
    return null;
  }
  return entry.value;
}

function cacheSet(bookId, description) {
  cache.set(bookId, { value: description, ts: Date.now() });
}

// ─── UTILS ────────────────────────────────────────────────────────────────────

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function getBackoff(attempt) {
  const delay = Math.min(CONFIG.BASE_DELAY_MS * 2 ** attempt, CONFIG.MAX_DELAY_MS);
  const jitter = delay * 0.2 * (Math.random() - 0.5);
  return Math.floor(delay + jitter);
}

function extractRetryDelay(json) {
  try {
    for (const d of json?.error?.details || []) {
      if (d?.retryDelay) {
        const s = parseInt(d.retryDelay, 10);
        if (!isNaN(s)) return s * 1000 + 1000;
      }
    }
  } catch (_) {}
  return null;
}

function getCurrentKey() {
  return GEMINI_KEYS[keyIndex % GEMINI_KEYS.length];
}

function rotateKey() {
  keyIndex++;
  console.warn(`[KEY] Rotated to key ${(keyIndex % GEMINI_KEYS.length) + 1}`);
}

function getCurrentModel() {
  return MODEL_CHAIN[modelIndex % MODEL_CHAIN.length];
}

function rotateModel() {
  if (modelIndex < MODEL_CHAIN.length - 1) {
    modelIndex++;
    console.warn(`[MODEL] Switched to ${getCurrentModel()}`);
    return true;
  }
  console.error("[MODEL] All models exhausted");
  return false;
}

// ─── WORLD CLASS PROMPT ───────────────────────────────────────────────────────

function buildPrompt(title, author) {
  return `You are an expert academic librarian and book curator at a top university library.

Write a compelling 2-3 sentence description for the following academic book:

Title: "${title}"
Author: ${author}

Requirements:
- Hook the student in the first sentence
- Mention the core topics or skills they will gain
- End with why this book is essential for their academic journey
- Tone: Professional yet exciting, like a knowledgeable mentor recommending a book
- Plain text only — no bullet points, no markdown, no formatting

Respond with the description only. Nothing else.`;
}

// ─── STATIC FALLBACK ─────────────────────────────────────────────────────────

function staticFallback(title, author) {
  return `${title} by ${author} is a comprehensive academic resource that equips students with foundational and advanced knowledge in their field. Written with clarity and depth, it bridges theoretical concepts with real-world applications, making it an indispensable companion for academic excellence and professional growth.`;
}

// ─── RAW HTTPS REQUEST ────────────────────────────────────────────────────────

function rawGeminiRequest(payload, key, model) {
  return new Promise((resolve, reject) => {
    const req = https.request(
      {
        hostname: "generativelanguage.googleapis.com",
        path: `/v1beta/models/${model}:generateContent?key=${key}`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(payload),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error(`JSON parse failed: ${data.slice(0, 100)}`));
          }
        });
      }
    );
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error("Request timeout"));
    });
    req.on("error", (e) => reject(new Error(`Network: ${e.message}`)));
    req.write(payload);
    req.end();
  });
}

// ─── RETRY LOGIC ─────────────────────────────────────────────────────────────

async function geminiWithRetry(payload) {
  let attempt = 0;
  let keyRotations = 0;

  while (attempt <= CONFIG.MAX_RETRIES) {
    const model = getCurrentModel();
    const key = getCurrentKey();

    console.log(`[GEMINI] Attempt ${attempt + 1} | model: ${model} | key: ${(keyIndex % GEMINI_KEYS.length) + 1}`);

    try {
      const result = await rawGeminiRequest(payload, key, model);
      const code = result?.error?.code;

      // 429 — rate limited
      if (code === 429) {
        const wait = extractRetryDelay(result) || getBackoff(attempt);
        console.warn(`[429] Rate limited. Wait: ${(wait / 1000).toFixed(1)}s`);
        rotateKey();
        keyRotations++;
        if (keyRotations >= GEMINI_KEYS.length) {
          await sleep(wait);
          keyRotations = 0;
        } else {
          await sleep(1000);
        }
        attempt++;
        continue;
      }

      // 404 — wrong model
      if (code === 404) {
        console.warn(`[404] Model "${model}" not found`);
        const rotated = rotateModel();
        if (!rotated) throw new Error("All models exhausted");
        continue;
      }

      // other API error
      if (code) throw new Error(`Gemini error ${code}: ${result?.error?.message}`);

      // success
      console.log(`[GEMINI] Success on attempt ${attempt + 1}`);
      return result;

    } catch (err) {
      if (attempt >= CONFIG.MAX_RETRIES) throw err;
      const wait = getBackoff(attempt);
      console.error(`[GEMINI] ${err.message} | retry in ${(wait / 1000).toFixed(1)}s`);
      await sleep(wait);
      attempt++;
    }
  }

  throw new Error("Max retries exceeded");
}

// ─── QUEUE ────────────────────────────────────────────────────────────────────

function enqueue(payload) {
  return new Promise((resolve, reject) => {
    queue.push({ payload, resolve, reject });
    console.log(`[QUEUE] Size: ${queue.length}`);
    processQueue();
  });
}

async function processQueue() {
  if (activeRequests >= CONFIG.CONCURRENCY || queue.length === 0) return;

  activeRequests++;
  const { payload, resolve, reject } = queue.shift();

  try {
    const gap = CONFIG.REQUEST_GAP_MS - (Date.now() - lastRequestTime);
    if (gap > 0 && lastRequestTime !== 0) {
      console.log(`[QUEUE] Throttle: ${gap}ms`);
      await sleep(gap);
    }
    lastRequestTime = Date.now();
    resolve(await geminiWithRetry(payload));
  } catch (err) {
    reject(err);
  } finally {
    activeRequests--;
    setTimeout(processQueue, CONFIG.REQUEST_GAP_MS);
  }
}

// ─── MAIN EXPORTED FUNCTION ───────────────────────────────────────────────────

/**
 * getOrGenerateDescription
 * 
 * Flow:
 * 1. DB mein description hai → return karo (cache mein bhi save)
 * 2. Cache mein hai → return karo
 * 3. AI se generate karo → DB mein save karo → return karo
 * 4. AI fail → static fallback return karo
 * 
 * @param {Object} book - Mongoose book document
 * @returns {Promise<string>} - description string
 */
async function getOrGenerateDescription(book) {
  const bookId = String(book._id);

  // 1. DB mein already hai
  if (book.description && book.description.trim()) {
    cacheSet(bookId, book.description);
    return book.description;
  }

  // 2. Cache mein hai
  const cached = cacheGet(bookId);
  if (cached) {
    console.log(`[CACHE] Hit: ${book.title}`);
    return cached;
  }

  // 3. Same book ke liye duplicate request already chal rahi hai
  if (inFlight.has(bookId)) {
    console.log(`[DEDUP] Waiting for in-flight: ${book.title}`);
    return inFlight.get(bookId);
  }

  // 4. Generate karo
  const promise = (async () => {
    let description;

    if (GEMINI_KEYS.length === 0) {
      console.warn("[CONFIG] No Gemini keys found — using static fallback");
      description = staticFallback(book.title, book.author);
    } else {
      try {
        const payload = JSON.stringify({
          contents: [{ parts: [{ text: buildPrompt(book.title, book.author) }] }],
          generationConfig: {
            maxOutputTokens: 250,
            temperature: 0.8,
          },
        });

        const result = await enqueue(payload);
        const text = result?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
        description = text || staticFallback(book.title, book.author);

      } catch (err) {
        console.error(`[FALLBACK] AI failed for "${book.title}": ${err.message}`);
        description = staticFallback(book.title, book.author);
      }
    }

    // DB mein permanently save karo — fire and forget
    book.description = description;
    book.save()
      .then(() => console.log(`[DB] Saved description: ${book.title}`))
      .catch((e) => console.error(`[DB] Save failed: ${e.message}`));

    // Cache mein save karo
    cacheSet(bookId, description);

    return description;
  })();

  inFlight.set(bookId, promise);
  promise.finally(() => inFlight.delete(bookId));

  return promise;
}

export default getOrGenerateDescription;