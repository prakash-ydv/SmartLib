// ============================================
// 📦 BOOK CONTEXT - OPTIMIZED VERSION
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

export function BookProvider({ children }) {
  
  // State
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]); // ← NEW: Store filtered results
  const [loading, setLoading] = useState(true); // ← Start as true
  const [error, setError] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Ref for cleanup
  const isMounted = useRef(true);

  // ============================================
  // 🚀 INITIAL LOAD - Auto fetch on mount
  // ============================================
  useEffect(() => {
    fetchAllBooks();
    
    // Cleanup on unmount
    return () => {
      isMounted.current = false;
    };
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
      
      if (!isMounted.current) return; // ← Prevent state update if unmounted
      
      const books = response.data || [];
      setAllBooks(books);
      setFilteredBooks(books); // ← Initialize filtered books
      console.log(`✅ BookContext: Loaded ${books.length} books`);
      
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
  }, []);

  // ============================================
  // 📖 FETCH SINGLE BOOK BY ID
  // ============================================
  const fetchBookById = useCallback(async (bookId) => {
    console.log(`📖 BookContext: Fetching book ${bookId}`);
    
    setLoading(true);
    setError(null);

    try {
      const book = await getBookById(bookId);
      
      if (!isMounted.current) return null;
      
      console.log("✅ BookContext: Book fetched:", book.title);
      return book;
      
    } catch (err) {
      if (!isMounted.current) return null;
      
      const errorMsg = err.message || "Failed to load book details";
      setError(errorMsg);
      console.error("❌ BookContext Error:", errorMsg);
      
      return null;
      
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []);

  // ============================================
  // 🏢 FILTER BY DEPARTMENT
  // ============================================
  const filterByDepartment = useCallback((department) => {
    console.log(`🏢 BookContext: Filtering by ${department}`);
    
    setSelectedDepartment(department);
    
    let filtered = allBooks;
    
    // Apply department filter
    if (department !== "ALL" && department !== "all") {
      filtered = filtered.filter(
        (book) => book.department?.toUpperCase() === department.toUpperCase()
      );
    }
    
    // Apply search query if exists
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
    
    // Apply search
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
    
    // Apply department filter if active
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
    // Re-apply filters when allBooks updates
    if (searchQuery.trim() || selectedDepartment !== "ALL") {
      searchBooks(searchQuery);
    } else {
      setFilteredBooks(allBooks);
    }
  }, [allBooks]); // Only depend on allBooks

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

  const clearError = useCallback(() => {
    setError(null);
  }, []);
  
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
    filteredBooks, // ← NEW: Filtered results
    loading,
    error,
    selectedDepartment,
    searchQuery,
    
    // Actions
    fetchAllBooks,
    fetchBookById,
    fetchPopularBooks,
    filterByDepartment,
    searchBooks,
    updateBookViews,
    refreshBooks,
    clearError,
    resetFilters, // ← NEW
    
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
  
  if (!context) {
    throw new Error("useBooks must be used inside BookProvider");
  }
  
  return context;
}

export default BookContext;