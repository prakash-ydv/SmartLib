import { createContext, useState, useContext, useCallback, useEffect } from "react";
import { getAllBooks } from "../api/bookAPI";

export const BookContext = createContext(null);

export function BookProvider({ children }) {

  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // ✅ FIXED FETCH (pagination based)
  const fetchBooks = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      const response = await getAllBooks(pageNum, 20); // 🔥 limit = 20

      const books = response.data?.data || [];

      if (pageNum === 1) {
        setAllBooks(books);
      } else {
        setAllBooks(prev => [...prev, ...books]);
      }

      setFilteredBooks(prev => pageNum === 1 ? books : [...prev, ...books]);

      // ✅ check if more data exists
      if (books.length < 20) {
        setHasMore(false);
      }

    } catch (err) {
      console.error("❌ Fetch error:", err.message);
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Initial load (ONLY ONCE)
  useEffect(() => {
    fetchBooks(1);
  }, []);

  // ✅ Load more (for infinite scroll / button)
  const loadMoreBooks = useCallback(() => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);
    fetchBooks(nextPage);
  }, [page, hasMore, loading, fetchBooks]);

  // ✅ Search (local)
  const searchBooks = useCallback((query) => {
    if (!query.trim()) {
      setFilteredBooks(allBooks);
      return;
    }

    const search = query.toLowerCase();

    const filtered = allBooks.filter(book =>
      book.title?.toLowerCase().includes(search) ||
      book.author?.toLowerCase().includes(search)
    );

    setFilteredBooks(filtered);
  }, [allBooks]);

  const contextValue = {
    allBooks,
    filteredBooks,
    loading,
    error,
    hasMore,

    fetchBooks,
    loadMoreBooks,
    searchBooks
  };

  return (
    <BookContext.Provider value={contextValue}>
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  const context = useContext(BookContext);
  if (!context) throw new Error("useBooks must be used inside BookProvider");
  return context;
}