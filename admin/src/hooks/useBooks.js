// ============================================================
// 📚 useBooks HOOK — IES SMARTLIB ADMIN
// CRUD + Real-time polling + Consistent refresh
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  getAllBooks,
  addBook as apiAddBook,
  updateBook as apiUpdateBook,
  deleteBook as apiDeleteBook,
  toggleBookAvailability as apiToggleAvailability,
  getDashboardStats,
  searchBookByTitle,
  getUnavailableBooks,
  getBooksWithoutImage,
  getMostViewedBooks
} from '../api/axios';

// ✅ Silent polling interval — 30 seconds
const POLL_INTERVAL_MS = 30_000;

// ============================================================
// 🔧 GROUP RAW BACKEND ROWS FOR UI
// Multiple rows with same ISBN = one book with copies count
// ============================================================
const groupBooksForUI = (rawBooks = []) => {
  const map = {};

  rawBooks.forEach(book => {
    const key =
      book.isbn ||
      `${book.title}-${book.author}-${book.edition}-${book.publisher}`;

    if (!map[key]) {
      map[key] = { ...book, acc_list: [], copies: 0 };
    }

    const acc = book.acc || book.accession || book.accessionNumber || null;
    if (acc && !map[key].acc_list.includes(acc)) {
      map[key].acc_list.push(acc);
    }

    map[key].copies = map[key].acc_list.length;
  });

  return Object.values(map);
};

// ============================================================
// 📚 MAIN useBooks HOOK
// ============================================================
export function useBooks() {
  const [books, setBooks]               = useState([]);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats]               = useState({
    totalBooks: 0,
    availableBooks: 0,
    unavailableBooks: 0,
  });

  const [searchParams, setSearchParams] = useSearchParams();

  const page  = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const filters = {
    availability: searchParams.get("availability") || "all",
    image:        searchParams.get("image")        || "all",
    sort:         searchParams.get("sort")         || "default",
  };

  // ============================================================
  // 🔄 LOAD BOOKS — used for initial load + refresh
  // silent=true → no loading spinner (used by polling)
  // ============================================================
  const loadBooks = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      setError(null);

      let booksPromise;
      if (filters.availability === 'unavailable') {
        booksPromise = getUnavailableBooks(page, limit);
      } else if (filters.image === 'no-image') {
        booksPromise = getBooksWithoutImage(page, limit);
      } else if (filters.sort === 'most-viewed') {
        booksPromise = getMostViewedBooks(page, limit);
      } else {
        booksPromise = getAllBooks(page, limit);
      }

      const [booksResponse, statsResponse] = await Promise.all([
        booksPromise,
        getDashboardStats(),
      ]);

      if (statsResponse?.status === 'success') {
        setStats(statsResponse.data);
      }

      if (booksResponse?.status === 'success') {
        let rawBooks = booksResponse.data || [];

        if (filters.image === 'no-image') {
          rawBooks = rawBooks.filter((b) => !b.image && !b.cover_url);
        }
        if (filters.sort === 'most-viewed') {
          rawBooks.sort((a, b) => (b.views || 0) - (a.views || 0));
        }

        const groupedBooks   = groupBooksForUI(rawBooks);
        const pagination     = booksResponse?.pagination || {};

        const parsedTotalItems = Number(
          pagination.totalItems ?? booksResponse.totalItems ?? booksResponse.total ?? groupedBooks.length
        );
        const safeTotalItems = Number.isFinite(parsedTotalItems) && parsedTotalItems >= 0
          ? parsedTotalItems
          : groupedBooks.length;

        const parsedTotalPages = Number(
          pagination.totalPages ?? booksResponse.totalPages
        );
        const safeTotalPages = Number.isFinite(parsedTotalPages) && parsedTotalPages > 0
          ? parsedTotalPages
          : Math.max(1, Math.ceil(safeTotalItems / limit));

        setBooks(groupedBooks);
        setTotalItems(safeTotalItems);
        setTotalPages(safeTotalPages);
      } else {
        setBooks([]);
        setTotalItems(0);
        setTotalPages(1);
      }

      setLoading(false);
    } catch (err) {
      console.error('❌ Load books failed:', err);
      if (!silent) {
        setError(err.message || 'Failed to load books');
        setBooks([]);
        setTotalItems(0);
        setTotalPages(1);
        setLoading(false);
      }
    }
  }, [
    refreshTrigger,
    page,
    filters.availability,
    filters.image,
    filters.sort,
  ]);

  // Initial load + refresh trigger
  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // ✅ Silent polling — har 30s pe background refresh
  useEffect(() => {
    const pollId = setInterval(() => {
      loadBooks(true); // silent = true — no spinner
    }, POLL_INTERVAL_MS);

    return () => clearInterval(pollId);
  }, [loadBooks]);

  // ============================================================
  // ➕ ADD BOOK — triggers instant refresh
  // ============================================================
  const addBook = async (bookData) => {
    try {
      const response = await apiAddBook(bookData);
      // ✅ Instant refresh — client sees new book within seconds
      setRefreshTrigger(prev => prev + 1);
      return { success: true, book: response.data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ============================================================
  // ✏️ UPDATE BOOK — triggers instant refresh
  // ============================================================
  const updateBook = async (updatedBookData) => {
    try {
      const bookId = updatedBookData._id || updatedBookData.id;
      if (!bookId) throw new Error('Book ID missing');

      const {
        _id, id, createdAt, updatedAt, views, __v,
        acc_list, copies,
        ...payload
      } = updatedBookData;

      await apiUpdateBook(bookId, payload);
      // ✅ Instant refresh
      setRefreshTrigger(prev => prev + 1);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ============================================================
  // 🗑️ DELETE BOOK — ✅ FIXED: now uses refreshTrigger (consistent)
  // ============================================================
  const deleteBook = async (bookId) => {
    try {
      await apiDeleteBook(bookId);
      // ✅ FIXED: was loadBooks(true), now consistent with others
      setRefreshTrigger(prev => prev + 1);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ============================================================
  // 🔄 TOGGLE AVAILABILITY — triggers instant refresh
  // ============================================================
  const toggleAvailability = async (bookId) => {
    try {
      const book = books.find(b => (b._id || b.id) === bookId);
      if (!book) throw new Error('Book not found');

      await apiToggleAvailability(bookId, book.isAvailable);
      // ✅ Instant refresh
      setRefreshTrigger(prev => prev + 1);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  // ============================================================
  // 🔍 SEARCH BOOKS
  // ============================================================
  const searchBooks = async (query) => {
    try {
      if (!query || query.trim() === '') {
        loadBooks();
        return;
      }

      setLoading(true);
      const response = await searchBookByTitle(query);

      if (response?.status === 'success') {
        const grouped = groupBooksForUI(response.data || []);
        setBooks(grouped);
        setTotalItems(grouped.length);
        setTotalPages(1);
      } else {
        setBooks([]);
        setTotalItems(0);
        setTotalPages(1);
      }

      setLoading(false);
    } catch (err) {
      setError(err.message || 'Search failed');
      setLoading(false);
    }
  };

  // ============================================================
  // 🔄 MANUAL REFRESH
  // ============================================================
  const refreshBooks = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  // ============================================================
  // 📤 RETURN
  // ============================================================
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
    searchBooks,
    page,
    totalPages,
    totalItems,
    changePage: (newPage) => {
      if (newPage >= 1 && newPage <= totalPages) {
        setSearchParams(prev => {
          const next = new URLSearchParams(prev);
          next.set("page", newPage.toString());
          return next;
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    filters,
    updateFilter: (key, value) => {
      setSearchParams(prev => {
        const next = new URLSearchParams(prev);
        next.set(key, value);
        next.set("page", "1");
        return next;
      });
    },
  };
}