/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getAllBooks, getBookById, getFacultyMeta } from "../api/bookAPI";

export const BookContext = createContext(null);

export function BookProvider({ children }) {
  const [allBooks, setAllBooks]     = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState(null);

  // ── Faculty Meta (faculties + facultyDepartments) ─────────────────
  const [facultyMeta, setFacultyMeta] = useState({
    faculties: [],
    facultyDepartments: {},
  });
  const [metaLoading, setMetaLoading] = useState(false);

  // ── Fetch Faculty Meta (once on mount) ────────────────────────────
  useEffect(() => {
    async function loadMeta() {
      try {
        setMetaLoading(true);
        const meta = await getFacultyMeta();
        setFacultyMeta(meta);
      } catch (err) {
        console.error("FacultyMeta fetch failed:", err.message);
      } finally {
        setMetaLoading(false);
      }
    }
    loadMeta();
  }, []);

  // ── Fetch Books ───────────────────────────────────────────────────
  const fetchBooks = useCallback(async (page = 1, limit = 24, filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAllBooks(page, limit, filters);

      setAllBooks(res.data || []);
      setPagination(res.pagination || {});
    } catch (err) {
      console.error("Fetch error:", err.message);
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBooks = useCallback(
    (filters = {}) => fetchBooks(1, 24, filters),
    [fetchBooks]
  );

  const clearError = useCallback(() => setError(null), []);

  // ── Cache lookup ──────────────────────────────────────────────────
  const getBookFromCache = useCallback(
    (bookId) => {
      if (!bookId) return null;
      return allBooks.find((book) => (book._id || book.id) === bookId) || null;
    },
    [allBooks]
  );

  const fetchBookById = useCallback(
    async (bookId) => {
      const cached = getBookFromCache(bookId);
      if (cached) return cached;
      return getBookById(bookId);
    },
    [getBookFromCache]
  );

  return (
    <BookContext.Provider
      value={{
        // Books
        allBooks,
        pagination,
        loading,
        error,
        fetchBooks,
        refreshBooks,
        clearError,
        getBookFromCache,
        fetchBookById,

        // Faculty Meta
        facultyMeta,
        metaLoading,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  return useContext(BookContext);
}