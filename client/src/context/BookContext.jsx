// src/context/BookContext.jsx
import {
  createContext,
  useState,
  useContext,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { getAllBooks } from "../api/bookAPI";

export const BookContext = createContext(null);

export function BookProvider({ children }) {
  const [allBooks, setAllBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Guard against double-fetch (StrictMode fires effects twice in dev)
  const hasFetchedRef = useRef(false);

  const fetchAllBooks = useCallback(async () => {
    // ✅ Prevent duplicate in-flight requests
    if (loading) return;

    try {
      setLoading(true);
      setError(null);

      // Step 1: First page to get total
      const firstResponse = await getAllBooks(1, 100);
      const pagination = firstResponse.pagination || {};
      const totalItems = pagination.total || 0;
      const firstBatch = firstResponse.data || [];

      if (totalItems === 0 || firstBatch.length === 0) {
        setAllBooks(firstBatch);
        return;
      }

      const limit = 100;
      const totalPages = Math.ceil(totalItems / limit);

      if (totalPages <= 1) {
        setAllBooks(firstBatch);
        return;
      }

      // Step 2: Fetch remaining pages in parallel
      const pagePromises = [];
      for (let page = 2; page <= totalPages; page++) {
        pagePromises.push(getAllBooks(page, limit));
      }

      const responses = await Promise.all(pagePromises);
      const remainingBooks = responses.flatMap((res) => res.data || []);
      const allFetchedBooks = [...firstBatch, ...remainingBooks];

      setAllBooks(allFetchedBooks);
      console.log(`✅ Loaded ${allFetchedBooks.length} books total`);
    } catch (err) {
      console.error("❌ Fetch error:", err.message);

      // ✅ User-friendly error messages
      if (err.code === "ECONNABORTED") {
        setError("Server is waking up, please wait a moment and try again.");
      } else if (!err.response) {
        setError("Cannot reach the server. Check your connection.");
      } else {
        setError("Failed to load books. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []); // ✅ No deps — stable reference, won't re-create

  // ✅ Force refresh — clears cache guard too
  const refreshBooks = useCallback(() => {
    hasFetchedRef.current = false;
    setAllBooks([]);
    setError(null);
    fetchAllBooks();
  }, [fetchAllBooks]);

  // ✅ Single fetch on mount — not duplicated in HomePage
  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchAllBooks();
  }, [fetchAllBooks]);

  return (
    <BookContext.Provider
      value={{ allBooks, loading, error, fetchAllBooks, refreshBooks }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (!context) throw new Error("useBooks must be used inside BookProvider");
  return context;
}