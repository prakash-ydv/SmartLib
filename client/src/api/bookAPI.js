import axios from "axios";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL || "/api";

const axiosInstance = axios.create({
  baseURL: VITE_SERVER_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ FIXED: Only ONE request (no loop)
export async function getAllBooks(page = 1, limit = 20) {
  try {
    const { data } = await axiosInstance.get(
      `/search/all-books?page=${page}&limit=${limit}`
    );

    const books = data?.data || [];

    return {
      status: "success",
      data: books,
      pagination: data?.pagination || {},
    };

  } catch (error) {
    console.error("❌ getAllBooks error:", error.message);
    throw error;
  }
}

// ✅ Popular books
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
    console.error(error);
    throw error;
  }
}

// ✅ Update views
export async function incrementBookViews(bookId) {
  try {
    const { data } = await axiosInstance.patch(
      `/update/book/views/${bookId}`
    );
    return data;
  } catch {
    return null;
  }
}

// ✅ Search
export async function searchBooks(query) {
  try {
    const { data } = await axiosInstance.get(
      `/search/book?title=${encodeURIComponent(query)}`
    );
    return data?.data || [];
  } catch (error) {
    throw error;
  }
}

export default {
  getAllBooks,
  getPopularBooks,
  incrementBookViews,
  searchBooks,
};