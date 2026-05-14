import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  addBook as apiAddBook,
  deleteBook as apiDeleteBook,
  getAllBooks,
  getBooksWithoutImage,
  getDashboardStats,
  getMostViewedBooks,
  getUnavailableBooks,
  toggleBookAvailability as apiToggleAvailability,
  updateBook as apiUpdateBook,
} from "../api/axios";
import { getBookId, getCopyCount, isBookAvailable } from "../constants/catalog";

const POLL_INTERVAL_MS = 30_000;
const PAGE_SIZE = 10;

const normalizeBookForUI = (book = {}) => {
  const copies = Array.isArray(book.copies)
    ? book.copies.filter(Boolean)
    : book.copies
      ? [String(book.copies)]
      : [];

  return {
    ...book,
    copies,
    copyCount: getCopyCount({ ...book, copies }),
    isAvailable: isBookAvailable({ ...book, copies }),
  };
};

const normalizeBooksForUI = (rawBooks = []) => rawBooks.map(normalizeBookForUI);

const getSafeNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
};

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    unavailableBooks: 0,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const page = Math.max(parseInt(searchParams.get("page") || "1", 10), 1);
  const filters = useMemo(
    () => ({
      q: searchParams.get("q") || "",
      department: searchParams.get("department") || "all",
      availability: searchParams.get("availability") || "all",
      image: searchParams.get("image") || "all",
      sort: searchParams.get("sort") || "default",
    }),
    [searchParams],
  );

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const loadBooks = useCallback(
    async (silent = false) => {
      try {
        if (!silent) setLoading(true);
        setError(null);

        const apiFilters = {
          q: filters.q,
          department: filters.department,
          availability: filters.availability,
        };

        let booksPromise;
        if (filters.image === "no-image") {
          booksPromise = getBooksWithoutImage(page, PAGE_SIZE, apiFilters);
        } else if (filters.sort === "most-viewed") {
          booksPromise =
            filters.q || filters.department !== "all" || filters.availability !== "all"
              ? getAllBooks(page, PAGE_SIZE, apiFilters)
              : getMostViewedBooks(page, PAGE_SIZE, apiFilters);
        } else if (filters.availability === "unavailable") {
          booksPromise = getUnavailableBooks(page, PAGE_SIZE, apiFilters);
        } else {
          booksPromise = getAllBooks(page, PAGE_SIZE, apiFilters);
        }

        const [booksResponse, statsResponse] = await Promise.all([
          booksPromise,
          getDashboardStats(),
        ]);

        if (statsResponse?.status === "success") {
          setStats(statsResponse.data);
        }

        if (booksResponse?.status === "success") {
          const normalizedBooks = normalizeBooksForUI(booksResponse.data || []);
          if (filters.sort === "most-viewed") {
            normalizedBooks.sort((a, b) => (b.views || 0) - (a.views || 0));
          }
          const pagination = booksResponse.pagination || {};
          const safeTotalItems = getSafeNumber(
            pagination.totalItems ?? booksResponse.totalItems,
            normalizedBooks.length,
          );
          const safeTotalPages = Math.max(
            1,
            getSafeNumber(
              pagination.totalPages ?? booksResponse.totalPages,
              Math.ceil(safeTotalItems / PAGE_SIZE),
            ),
          );

          setBooks(normalizedBooks);
          setTotalItems(safeTotalItems);
          setTotalPages(safeTotalPages);
        } else {
          setBooks([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } catch (err) {
        if (!silent) {
          setError(err.message || "Failed to load books");
          setBooks([]);
          setTotalItems(0);
          setTotalPages(1);
        }
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [filters, page],
  );

  useEffect(() => {
    loadBooks();
  }, [loadBooks, refreshTrigger]);

  useEffect(() => {
    const pollId = setInterval(() => {
      loadBooks(true);
    }, POLL_INTERVAL_MS);

    return () => clearInterval(pollId);
  }, [loadBooks]);

  const refreshBooks = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const addBook = async (bookData) => {
    try {
      const response = await apiAddBook(bookData);
      refreshBooks();
      return { success: true, book: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateBook = async (updatedBookData) => {
    try {
      const bookId = getBookId(updatedBookData);
      if (!bookId) throw new Error("Book ID missing");

      const payload = { ...updatedBookData };
      delete payload._id;
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;
      delete payload.views;
      delete payload.__v;
      delete payload.acc_list;
      delete payload.copyCount;

      await apiUpdateBook(bookId, payload);
      refreshBooks();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteBook = async (bookId) => {
    try {
      await apiDeleteBook(bookId);
      refreshBooks();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleAvailability = async (bookId) => {
    try {
      const book = books.find((item) => getBookId(item) === bookId);
      if (!book) throw new Error("Book not found");

      await apiToggleAvailability(bookId, book.isAvailable);
      refreshBooks();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateFilter = useCallback(
    (key, value) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);

        if (!value || value === "all" || value === "default") {
          next.delete(key);
        } else {
          next.set(key, value);
        }

        next.set("page", "1");
        return next;
      });
    },
    [setSearchParams],
  );

  return {
    books,
    stats,
    isLoading: loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    toggleAvailability,
    refreshBooks,
    page,
    totalPages,
    totalItems,
    filters,
    updateFilter,
    pageSize: PAGE_SIZE,
    changePage: (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setSearchParams((prev) => {
          const next = new URLSearchParams(prev);
          next.set("page", newPage.toString());
          return next;
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
  };
}
