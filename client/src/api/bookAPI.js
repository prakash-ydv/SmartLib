import axios from "axios";

const VITE_SERVER_URL = import.meta.env.VITE_SERVER_URL || "/api";
const API_READ_TOKEN = import.meta.env.VITE_BOOKS_API_TOKEN?.trim();
const BOOKS_CACHE_KEY = "smartlib_books_cache_v1";

const getReadToken = () => {
  try {
    return (
      API_READ_TOKEN ||
      localStorage.getItem("smartlib_read_token") ||
      localStorage.getItem("token") ||
      ""
    );
  } catch {
    return API_READ_TOKEN || "";
  }
};

const saveBooksCache = (books) => {
  try {
    localStorage.setItem(BOOKS_CACHE_KEY, JSON.stringify(books || []));
  } catch {
    // Ignore cache write failures
  }
};

const loadBooksCache = () => {
  try {
    const raw = localStorage.getItem(BOOKS_CACHE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const axiosInstance = axios.create({
  baseURL: VITE_SERVER_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = getReadToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function getAllBooks() {
  try {
    let allBooks = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
      const url = `/search/all-books?page=${page}&limit=100`;
      console.log("Fetching page:", page);

      const { data } = await axiosInstance.get(url);

      const books = Array.isArray(data) ? data : data.data || [];

      if (books.length === 0) {
        hasMore = false;
      } else {
        allBooks.push(...books);
        page++;
      }

      if (page > 50) break;
    }

    console.log("Loaded books:", allBooks.length);
    saveBooksCache(allBooks);

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
    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      const cachedBooks = loadBooksCache();
      if (cachedBooks.length > 0) {
        console.warn("Books API unauthorized, using cached books.");
        return {
          status: "success",
          data: cachedBooks,
          source: "cache",
          pagination: {
            currentPage: 1,
            totalPages: 1,
            totalItems: cachedBooks.length,
            pageSize: cachedBooks.length,
          },
        };
      }

      console.warn("Books API unauthorized and no cache found. Returning empty list.");
      return {
        status: "success",
        data: [],
        source: "empty",
        pagination: {
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          pageSize: 0,
        },
      };
    }

    console.error(error);
    throw error;
  }
}

export async function getBookById(bookId) {
  console.warn("getBookById is deprecated. Use BookContext.getBookFromCache instead.");
  return null;
}

export async function getPopularBooks(page = 1, limit = 10) {
  try {
    const { data } = await axiosInstance.get(`/search/most-viewed?page=${page}&limit=${limit}`);

    const books = Array.isArray(data) ? data : data.data || [];

    return {
      status: "success",
      data: books,
      pagination: {
        currentPage: page,
        totalPages: data.totalPages || Math.ceil(books.length / limit),
        totalItems: data.totalItems || books.length,
        pageSize: limit,
      },
    };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function updateBookViews(bookId) {
  try {
    const { data } = await axiosInstance.patch(`/update/book/views/${bookId}`);
    return data;
  } catch {
    return null;
  }
}

export const incrementBookViews = updateBookViews;

export async function searchBooks(query) {
  try {
    const { data } = await axiosInstance.get(`/search/book?title=${encodeURIComponent(query)}`);
    return Array.isArray(data) ? data : data.data || [];
  } catch (error) {
    throw error;
  }
}

export function getDepartmentsList() {
  return ["ALL", "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "MBA", "MCA", "BBA", "BCA"];
}

export function isBookAvailable(book) {
  return book?.isAvailable;
}

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
