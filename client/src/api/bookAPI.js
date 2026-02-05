// 🔧 FINAL FIXED bookAPI.js
// 📁 client/src/api/bookAPI.js

import axios from "axios";

const VITE_SERVER_URL =
  import.meta.env.VITE_SERVER_URL ||
  "https://smartlib-xgxi.onrender.com";

const axiosInstance = axios.create({
  baseURL: VITE_SERVER_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== GET ALL BOOKS ====================

export async function getAllBooks() {
  try {

    let allBooks = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {

      const url =
        `/search/all-books?page=${page}&limit=100`;

      console.log("Fetching page:", page);

      const { data } =
        await axiosInstance.get(url);

      const books =
        Array.isArray(data)
          ? data
          : data.data || [];

      if (books.length === 0) {
        hasMore = false;
      } else {
        allBooks.push(...books);
        page++;
      }

      // safety stop
      if (page > 50) break;
    }

    console.log(
      "✅ Total books fetched:",
      allBooks.length
    );

    return {
      status: "success",
      data: allBooks,
      pagination: {
        currentPage: 1,
        totalPages: 1,
        totalItems: allBooks.length,
        pageSize: allBooks.length,
      },
    };

  } catch (error) {

    console.error(error);

    throw error;
  }
}



  
// ==================== GET BOOK BY ID ====================

export async function getBookById(bookId) {
  try {

    const { data } =
      await axiosInstance.get(
        `/search/book?id=${bookId}`
      );

    return data;

  } catch (error) {

    console.error("❌ Error fetching book:", error);

    throw error;
  }
}

// ==================== GET POPULAR BOOKS ====================

export async function getPopularBooks(
  page = 1,
  limit = 10
) {
  try {

    const { data } =
      await axiosInstance.get(
        `/search/most-viewed?page=${page}&limit=${limit}`
      );

    const books =
      Array.isArray(data)
        ? data
        : data.data || [];

    return {
      status: "success",
      data: books,
      pagination: {
        currentPage: page,
        totalPages:
          data.totalPages ||
          Math.ceil(books.length / limit),
        totalItems:
          data.totalItems ||
          books.length,
        pageSize: limit,
      },
    };

  } catch (error) {

    console.error(error);

    throw error;
  }
}

// ==================== UPDATE VIEWS ====================

export async function updateBookViews(bookId) {
  try {

    const { data } =
      await axiosInstance.patch(
        `/update/book/views/${bookId}`
      );

    return data;

  } catch {

    return null;
  }
}

// alias for BookContext
export const incrementBookViews =
  updateBookViews;

// ==================== SEARCH BOOKS ====================

export async function searchBooks(query) {
  try {

    const { data } =
      await axiosInstance.get(
        `/search/book?title=${encodeURIComponent(query)}`
      );

    return Array.isArray(data)
      ? data
      : data.data || [];

  } catch (error) {

    throw error;
  }
}

// ==================== HELPERS ====================

export function getDepartmentsList() {
  return [
    "ALL",
    "CSE",
    "IT",
    "ECE",
    "EEE",
    "MECH",
    "CIVIL",
    "MBA",
    "MCA",
    "BBA",
    "BCA",
  ];
}

export function isBookAvailable(book) {
  return book?.isAvailable;
}

// ==================== DEFAULT EXPORT ====================

export default {
  getAllBooks,
  getBookById,
  getPopularBooks,
  updateBookViews,
  incrementBookViews,
  searchBooks,
  getDepartmentsList,
  isBookAvailable,
};
