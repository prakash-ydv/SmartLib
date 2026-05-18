// src/api/bookAPI.js
import axios from "axios";

// ✅ In dev:  VITE_SERVER_URL is not set → falls back to "/api" → Vite proxy handles it
// ✅ In prod: VITE_SERVER_URL=https://smartlib-xgxi.onrender.com (set in Netlify env vars)
const BASE_URL = import.meta.env.VITE_SERVER_URL || "/api";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ── Retry interceptor ─────────────────────────────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    const isRetryable =
      !error.response || (error.response.status >= 500 && error.response.status < 600);

    config._retryCount = config._retryCount || 0;

    if (isRetryable && config._retryCount < 2) {
      config._retryCount += 1;
      const delay = config._retryCount * 2000;
      console.warn(`⚠️ Retry ${config._retryCount}/2 in ${delay}ms...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return axiosInstance(config);
    }

    return Promise.reject(error);
  }
);

// ─── BUILD PARAMS ─────────────────────────────────────────────────────────────
function buildBookListParams(page, limit, filters = {}) {
  const params = new URLSearchParams({
    page:  String(page),
    limit: String(limit),
  });

  const query        = filters.query?.trim();
  const faculty      = filters.faculty;
  const department   = filters.department;
  const availability = filters.availability;
  const sort         = filters.sort;
  const language     = filters.language;

  if (query)                                    params.set("q",            query);
  if (faculty      && faculty      !== "all")   params.set("faculty",      faculty);
  if (department   && department   !== "all")   params.set("department",   department);
  if (availability && availability !== "all")   params.set("availability", availability);
  if (sort         && sort         !== "default") params.set("sort",       sort);
  if (language     && language     !== "all")   params.set("language",     language);

  return params.toString();
}

// ─── ALL BOOKS (paginated + filtered) ────────────────────────────────────────
export async function getAllBooks(page = 1, limit = 24, filters = {}) {
  try {
    const params = buildBookListParams(page, limit, filters);
    const { data } = await axiosInstance.get(`/search/all-books?${params}`);
    return {
      status:     "success",
      data:       data?.data       || [],
      pagination: data?.pagination || {},
    };
  } catch (error) {
    console.error("❌ getAllBooks error:", error.message);
    throw error;
  }
}

// ─── SINGLE BOOK ──────────────────────────────────────────────────────────────
export async function getBookById(bookId) {
  if (!bookId) return null;

  try {
    const { data } = await axiosInstance.get(`/books/${bookId}`);
    return data?.data || null;
  } catch (error) {
    if (error.response && error.response.status !== 404) {
      console.warn("⚠️ getBookById failed:", error.message);
    }
  }

  // Fallback: paginated search
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

// ─── FACULTY META ─────────────────────────────────────────────────────────────
// Faculties aur unke departments backend se fetch karta hai
export async function getFacultyMeta() {
  try {
    const { data } = await axiosInstance.get("/search/faculty-meta");
    return {
      faculties:          data?.data?.faculties          || [],
      facultyDepartments: data?.data?.facultyDepartments || {},
    };
  } catch (error) {
    console.error("❌ getFacultyMeta error:", error.message);
    // Fallback: empty (FilterPanel gracefully handle karega)
    return { faculties: [], facultyDepartments: {} };
  }
}

// ─── POPULAR BOOKS ────────────────────────────────────────────────────────────
export async function getPopularBooks(page = 1, limit = 10) {
  try {
    const { data } = await axiosInstance.get(
      `/search/most-viewed?page=${page}&limit=${limit}`
    );
    return {
      status:     "success",
      data:       data?.data       || [],
      pagination: data?.pagination || {},
    };
  } catch (error) {
    console.error("❌ getPopularBooks error:", error.message);
    throw error;
  }
}

// ─── INCREMENT VIEWS ──────────────────────────────────────────────────────────
export async function incrementBookViews(bookId) {
  try {
    const { data } = await axiosInstance.patch(`/update/book/views/${bookId}`);
    return data;
  } catch {
    return null; // Silent fail — non-critical
  }
}

export const updateBookViews = incrementBookViews;

// ─── BOOK DESCRIPTION (AI) ────────────────────────────────────────────────────
export async function getBookDescription(bookId) {
  try {
    const { data } = await axiosInstance.get(`/feature/description/${bookId}`);
    return data?.description || "";
  } catch (error) {
    console.error("❌ getBookDescription error:", error.message);
    throw error;
  }
}

// ─── SEARCH BOOKS ─────────────────────────────────────────────────────────────
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

export default {
  getAllBooks,
  getBookById,
  getFacultyMeta,
  getPopularBooks,
  incrementBookViews,
  updateBookViews,
  getBookDescription,
  searchBooks,
};