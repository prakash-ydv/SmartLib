// ============================================
// 📦 BOOK CONTEXT - REAL-TIME POLLING
// Auto-refresh every 30s — zero backend changes
// ============================================

import { createContext, useState, useContext, useCallback, useEffect, useRef } from "react";
import { 
  getAllBooks, 
  getBookById, 
  getPopularBooks,
  searchBooks as apiSearchBooks,
  incrementBookViews
} from "../api/bookAPI";

export const BookContext = createContext(null);

// ✅ Polling interval — 30 seconds
const POLL_INTERVAL_MS = 30_000;

export function BookProvider({ children }) {
  
  // State
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // ✅ NEW: Last updated timestamp — shown in UI
  const [lastUpdated, setLastUpdated] = useState(null);
  
  // Refs
  const isMounted   = useRef(true);
  const pollRef     = useRef(null); // ✅ polling timer ref

  // ============================================
  // 🚀 INITIAL LOAD
  // ============================================
  useEffect(() => {
    fetchAllBooks();
    
    return () => {
      isMounted.current = false;
      // ✅ Clear polling on unmount
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  // ============================================
  // ✅ POLLING — silent background refresh
  // Starts after first successful load
  // ============================================
  const startPolling = useCallback(() => {
    // Clear any existing interval first
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      if (!isMounted.current) return;

      try {
        const response = await getAllBooks();
        if (!isMounted.current) return;

        const books = response.data || [];

        // ✅ Only update if data actually changed — avoids unnecessary re-renders
        setAllBooks((prev) => {
          const prevIds = prev.map((b) => b._id || b.id).join(",");
          const newIds  = books.map((b) => b._id || b.id).join(",");
          if (prevIds === newIds && prev.length === books.length) return prev;
          console.log("🔄 BookContext: Polling — data updated");
          return books;
        });

        setLastUpdated(new Date());
      } catch (err) {
        // Silent fail — polling should never crash the app
        console.warn("⚠️ BookContext: Polling failed silently", err.message);
      }
    }, POLL_INTERVAL_MS);
  }, []);

  // ============================================
  // 🔄 FETCH ALL BOOKS
  // ============================================
  const fetchAllBooks = useCallback(async () => {
    console.log("🔄 BookContext: Fetching all books...");
    
    setLoading(true);
    setError(null);

    try {
      const response = await getAllBooks();
      
      if (!isMounted.current) return;
      
      const books = response.data || [];
      setAllBooks(books);
      setFilteredBooks(books);
      setLastUpdated(new Date());
      console.log(`✅ BookContext: Loaded ${books.length} books`);

      // ✅ Start polling after first successful load
      startPolling();
      
      return books;
      
    } catch (err) {
      if (!isMounted.current) return;
      
      const errorMsg = err.message || "Failed to load books";
      setError(errorMsg);
      console.error("❌ BookContext Error:", errorMsg);
      
      return [];
      
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, [startPolling]);

  // ============================================
  // 📖 GET BOOK FROM CACHE
  // ============================================
  const getBookFromCache = useCallback((bookId) => {
    console.log(`📖 BookContext: Getting book ${bookId} from cache`);
    
    const book = allBooks.find(
      (b) => b._id === bookId || b.id === bookId
    );
    
    if (book) {
      console.log(`✅ BookContext: Found "${book.title}" in cache`);
      return book;
    }
    
    console.warn(`⚠️ BookContext: Book ${bookId} not found in cache`);
    return null;
  }, [allBooks]);

  // ============================================
  // 📖 FETCH SINGLE BOOK BY ID (FALLBACK)
  // ============================================
  const fetchBookById = useCallback(async (bookId) => {
    console.log(`📖 BookContext: Attempting to fetch book ${bookId}`);
    
    const cachedBook = getBookFromCache(bookId);
    if (cachedBook) {
      console.log("✅ Using cached book instead of API");
      return cachedBook;
    }
    
    console.log("⚠️ Book not in cache, trying API...");
    setLoading(true);
    setError(null);

    try {
      const book = await getBookById(bookId);
      if (!isMounted.current) return null;
      console.log("✅ BookContext: Book fetched:", book?.title);
      return book;
    } catch (err) {
      if (!isMounted.current) return null;
      const errorMsg = "Book not found. Please go back and try again.";
      setError(errorMsg);
      console.error("❌ BookContext Error:", err.message);
      return null;
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [getBookFromCache]);

  // ============================================
  // 🏢 FILTER BY DEPARTMENT
  // ============================================
  const filterByDepartment = useCallback((department) => {
    console.log(`🏢 BookContext: Filtering by ${department}`);
    setSelectedDepartment(department);
    
    let filtered = allBooks;
    if (department !== "ALL" && department !== "all") {
      filtered = filtered.filter(
        (book) => book.department?.toUpperCase() === department.toUpperCase()
      );
    }
    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title?.toLowerCase().includes(search) ||
          book.author?.toLowerCase().includes(search) ||
          book.isbn?.toLowerCase().includes(search) ||
          book.publisher?.toLowerCase().includes(search)
      );
    }
    setFilteredBooks(filtered);
    console.log(`✅ BookContext: Filtered to ${filtered.length} books`);
  }, [allBooks, searchQuery]);

  // ============================================
  // 🔍 SEARCH BOOKS
  // ============================================
  const searchBooks = useCallback((query) => {
    console.log(`🔍 BookContext: Searching for "${query}"`);
    setSearchQuery(query);
    
    let filtered = allBooks;
    if (query.trim()) {
      const search = query.toLowerCase();
      filtered = filtered.filter(
        (book) =>
          book.title?.toLowerCase().includes(search) ||
          book.author?.toLowerCase().includes(search) ||
          book.isbn?.toLowerCase().includes(search) ||
          book.publisher?.toLowerCase().includes(search)
      );
    }
    if (selectedDepartment !== "ALL" && selectedDepartment !== "all") {
      filtered = filtered.filter(
        (book) => book.department?.toUpperCase() === selectedDepartment.toUpperCase()
      );
    }
    setFilteredBooks(filtered);
    console.log(`✅ BookContext: Found ${filtered.length} books`);
  }, [allBooks, selectedDepartment]);

  // ============================================
  // 🔄 AUTO-UPDATE filtered books when allBooks changes
  // ============================================
  useEffect(() => {
    if (searchQuery.trim() || selectedDepartment !== "ALL") {
      searchBooks(searchQuery);
    } else {
      setFilteredBooks(allBooks);
    }
  }, [allBooks]);

  // ============================================
  // 👁️ INCREMENT BOOK VIEWS
  // ============================================
  const updateBookViews = useCallback(async (bookId) => {
    try {
      await incrementBookViews(bookId);
    } catch (err) {
      console.warn("⚠️ View count update failed (non-critical)");
    }
  }, []);

  // ============================================
  // 🔥 FETCH POPULAR BOOKS
  // ============================================
  const fetchPopularBooks = useCallback(async (page = 1, limit = 10) => {
    try {
      const response = await getPopularBooks(page, limit);
      return response.data || [];
    } catch (err) {
      console.error("❌ Popular books error:", err);
      return [];
    }
  }, []);

  // ============================================
  // 🔄 REFRESH & CLEAR
  // ============================================
  const refreshBooks = useCallback(() => {
    return fetchAllBooks();
  }, [fetchAllBooks]);

  const clearError = useCallback(() => setError(null), []);
  
  const resetFilters = useCallback(() => {
    setSelectedDepartment("ALL");
    setSearchQuery("");
    setFilteredBooks(allBooks);
  }, [allBooks]);

  // ============================================
  // 📤 CONTEXT VALUE
  // ============================================
  const contextValue = {
    // State
    allBooks,
    filteredBooks,
    loading,
    error,
    selectedDepartment,
    searchQuery,

    // ✅ NEW: last updated time — use in UI if needed
    lastUpdated,
    
    // Actions
    fetchAllBooks,
    fetchBookById,
    getBookFromCache,
    fetchPopularBooks,
    filterByDepartment,
    searchBooks,
    updateBookViews,
    refreshBooks,
    clearError,
    resetFilters,
    
    // Setters
    setSelectedDepartment,
    setSearchQuery,
  };

  return (
    <BookContext.Provider value={contextValue}>
      {children}
    </BookContext.Provider>
  );
}

// ============================================
// 🪝 CUSTOM HOOK
// ============================================
export function useBooks() {
  const context = useContext(BookContext);
  if (!context) throw new Error("useBooks must be used inside BookProvider");
  return context;
}

export default BookContext;