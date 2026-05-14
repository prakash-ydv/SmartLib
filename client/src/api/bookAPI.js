// src/api/bookAPI.js
import axios from "axios";
import { DEPARTMENTS } from "../utils/bookDisplay";

// ✅ In dev:  VITE_SERVER_URL is not set → falls back to "/api" → Vite proxy handles it
// ✅ In prod: VITE_SERVER_URL=https://smartlib-xgxi.onrender.com (set in Netlify env vars)
const BASE_URL = import.meta.env.VITE_SERVER_URL || "/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000, // ✅ 60s — covers Render.com cold start (can take 30-50s)
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Retry interceptor — retries up to 2 times on network errors or 5xx
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;

    // Only retry on network errors or 5xx server errors, not 4xx client errors
    const isRetryable =
      !error.response || (error.response.status >= 500 && error.response.status < 600);

    config._retryCount = config._retryCount || 0;

    if (isRetryable && config._retryCount < 2) {
      config._retryCount += 1;
      const delay = config._retryCount * 2000; // 2s, then 4s
      console.warn(`⚠️ Request failed. Retry ${config._retryCount}/2 in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return axiosInstance(config);
    }

    return Promise.reject(error);
  }
);

// ✅ All Books (paginated)
function buildBookListParams(page, limit, filters = {}) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  const query = filters.query?.trim();
  const department = filters.department || filters.branch;
  const availability = filters.availability;

  if (query) params.set("q", query);
  if (department && department !== "all") params.set("department", department);
  if (availability && availability !== "all") {
    params.set("availability", availability);
  }

  return params.toString();
}

export async function getAllBooks(page = 1, limit = 100, filters = {}) {
  try {
    const params = buildBookListParams(page, limit, filters);
    const { data } = await axiosInstance.get(
      `/search/all-books?${params}`
    );
    return {
      status: "success",
      data: data?.data || [],
      pagination: data?.pagination || {},
    };
  } catch (error) {
    console.error("❌ getAllBooks error:", error.message);
    throw error;
  }
}

// ✅ Single Book
// Preferred endpoint is /books/:id. The fallback keeps the page working with
// older backend deployments that only expose paginated listing endpoints.
export async function getBookById(bookId) {
  if (!bookId) return null;

  try {
    const { data } = await axiosInstance.get(`/books/${bookId}`);
    return data?.data || null;
  } catch (error) {
    if (error.response && error.response.status !== 404) {
      console.warn("⚠️ getBookById direct lookup failed:", error.message);
    }
  }

  let page = 1;
  let totalPages = 1;

  do {
    const res = await getAllBooks(page, 50);
    const book = (res.data || []).find((item) => (item._id || item.id) === bookId);

    if (book) return book;

    totalPages = Number(res.pagination?.totalPages || 1);
    page += 1;
  } while (page <= totalPages);

  return null;
}

// ✅ Popular Books
export async function getPopularBooks(page = 1, limit = 10) {
  try {
    const { data } = await axiosInstance.get(
      `/search/most-viewed?page=${page}&limit=${limit}`
    );
    return {
      status: "success",
      data: data?.data || [],
      pagination: data?.pagination || {},
    };
  } catch (error) {
    console.error("❌ getPopularBooks error:", error.message);
    throw error;
  }
}

// ✅ Increment Book Views
export async function incrementBookViews(bookId) {
  try {
    const { data } = await axiosInstance.patch(`/update/book/views/${bookId}`);
    return data;
  } catch {
    // Silent fail — view count is non-critical
    return null;
  }
}

// ✅ Alias
export const updateBookViews = incrementBookViews;

// ✅ Get Book Description
export async function getBookDescription(bookId) {
  try {
    const { data } = await axiosInstance.get(`/feature/description/${bookId}`);
    return data?.description || "";
  } catch (error) {
    console.error("❌ getBookDescription error:", error.message);
    throw error;
  }
}

// ✅ Search Books
export async function searchBooks(query) {
  try {
    const { data } = await axiosInstance.get(
      `/search/book?title=${encodeURIComponent(query)}`
    );
    return data?.data || [];
  } catch (error) {
    console.error("❌ searchBooks error:", error.message);
    throw error;
  }
}

export function getDepartmentsList() {
  return ["ALL", ...DEPARTMENTS.map((department) => department.value)];
}

export default {
  getAllBooks,
  getBookById,
  getPopularBooks,
  incrementBookViews,
  updateBookViews,
  getBookDescription,
  searchBooks,
  getDepartmentsList,
};
