// src/api/bookAPI.js
import axios from "axios";

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
export async function getAllBooks(page = 1, limit = 100) {
  try {
    const { data } = await axiosInstance.get(
      `/search/all-books?page=${page}&limit=${limit}`
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
    const { data } = await axiosInstance.get(`/books/${bookId}/description`);
    return data;
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

export default {
  getAllBooks,
  getPopularBooks,
  incrementBookViews,
  updateBookViews,
  getBookDescription,
  searchBooks,
};