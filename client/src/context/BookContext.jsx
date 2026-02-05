// ============================================
// 📦 BOOK CONTEXT - STATE MANAGEMENT (FIXED)
// ============================================
// Location: client/src/context/BookContext.jsx
// Purpose: Centralized state for all books
// Makes data accessible across all components
// ============================================

import { createContext, useState, useContext, useCallback } from "react";
import { 
  getAllBooks, 
  getBookById, 
  getPopularBooks,
  searchBooks as apiSearchBooks,
  incrementBookViews
} from "../api/bookAPI";

// ============================================
// 🌐 CREATE CONTEXT
// ============================================
export const BookContext = createContext(null);

// ============================================
// 🏗️ PROVIDER COMPONENT
// ============================================
export function BookProvider({ children }) {
  
  // --------------------------------------------
  // 📊 STATE VARIABLES
  // --------------------------------------------
  
  // All books from backend
  const [allBooks, setAllBooks] = useState([]);
  
  // Loading state (true when fetching data)
  const [loading, setLoading] = useState(false);
  
  // Error message (null if no error)
  const [error, setError] = useState(null);
  
  // Currently selected department filter
  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  
  // Search query
  const [searchQuery, setSearchQuery] = useState("");

  // --------------------------------------------
  // 🔄 FETCH ALL BOOKS
  // --------------------------------------------
  const fetchAllBooks = useCallback(async () => {
    console.log("🔄 BookContext: Fetching all books...");
    
    setLoading(true);
    setError(null);

    try {
      const response = await getAllBooks();
      
      setAllBooks(response.data || []);
      console.log(`✅ BookContext: Loaded ${response.data?.length || 0} books`);
      
      return response.data;
      
    } catch (err) {
      const errorMsg = err.message || "Failed to load books";
      setError(errorMsg);
      console.error("❌ BookContext Error:", errorMsg);
      
      return [];
      
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------------------------
  // 📖 FETCH SINGLE BOOK BY ID
  // --------------------------------------------
  const fetchBookById = useCallback(async (bookId) => {
    console.log(`📖 BookContext: Fetching book ${bookId}`);
    
    setLoading(true);
    setError(null);

    try {
      const book = await getBookById(bookId);
      console.log("✅ BookContext: Book fetched:", book.title);
      
      return book;
      
    } catch (err) {
      const errorMsg = err.message || "Failed to load book details";
      setError(errorMsg);
      console.error("❌ BookContext Error:", errorMsg);
      
      return null;
      
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------------------------
  // 🔥 FETCH POPULAR BOOKS
  // --------------------------------------------
  const fetchPopularBooks = useCallback(async (page = 1, limit = 10) => {
    console.log("🔥 BookContext: Fetching popular books...");
    
    setLoading(true);
    setError(null);

    try {
      const response = await getPopularBooks(page, limit);
      console.log(`✅ BookContext: Loaded ${response.data?.length || 0} popular books`);
      
      return response.data;
      
    } catch (err) {
      const errorMsg = err.message || "Failed to load popular books";
      setError(errorMsg);
      console.error("❌ BookContext Error:", errorMsg);
      
      return [];
      
    } finally {
      setLoading(false);
    }
  }, []);

  // --------------------------------------------
  // 🏢 FILTER BY DEPARTMENT (Client-side)
  // --------------------------------------------
  const filterByDepartment = useCallback(async (department) => {
    console.log(`🏢 BookContext: Filtering by ${department}`);
    
    setSelectedDepartment(department);
    
    // If "ALL", just return all books (no filtering needed)
    if (department === "ALL" || department === "all") {
      console.log("✅ Showing all books (no filter)");
      return allBooks;
    }
    
    // Client-side filter from existing books
    const filtered = allBooks.filter(
      (book) => book.department?.toUpperCase() === department.toUpperCase()
    );
    
    console.log(`✅ BookContext: Filtered to ${filtered.length} books`);
    return filtered;
    
  }, [allBooks]);

  // --------------------------------------------
  // 🔍 SEARCH BOOKS (Client-side)
  // --------------------------------------------
  const searchBooks = useCallback(async (query) => {
    console.log(`🔍 BookContext: Searching for "${query}"`);
    
    setSearchQuery(query);
    
    // If empty query, return all books
    if (!query.trim()) {
      return allBooks;
    }
    
    // Client-side search
    const search = query.toLowerCase();
    const results = allBooks.filter(
      (book) =>
        book.title?.toLowerCase().includes(search) ||
        book.author?.toLowerCase().includes(search) ||
        book.isbn?.toLowerCase().includes(search) ||
        book.publisher?.toLowerCase().includes(search)
    );
    
    console.log(`✅ BookContext: Found ${results.length} books`);
    return results;
    
  }, [allBooks]);

  // --------------------------------------------
  // 👁️ INCREMENT BOOK VIEWS (Non-blocking)
  // --------------------------------------------
  const updateBookViews = useCallback(async (bookId) => {
    console.log(`👁️ BookContext: Updating views for ${bookId}`);
    
    try {
      await incrementBookViews(bookId);
      console.log("✅ Views updated");
    } catch (err) {
      // Don't block UI for view count failure
      console.warn("⚠️ View count update failed (non-critical)");
    }
  }, []);

  // --------------------------------------------
  // 🔄 REFRESH BOOKS (Manual reload)
  // --------------------------------------------
  const refreshBooks = useCallback(() => {
    console.log("🔄 BookContext: Manual refresh triggered");
    return fetchAllBooks();
  }, [fetchAllBooks]);

  // --------------------------------------------
  // ❌ CLEAR ERROR
  // --------------------------------------------
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // --------------------------------------------
  // 📤 CONTEXT VALUE (What we share)
  // --------------------------------------------
  const contextValue = {
    // State
    allBooks,
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
    
    // Direct setters (if needed)
    setAllBooks,
    setSelectedDepartment,
    setSearchQuery,
  };

  // --------------------------------------------
  // 🎁 PROVIDE CONTEXT TO CHILDREN
  // --------------------------------------------
  return (
    <BookContext.Provider value={contextValue}>
      {children}
    </BookContext.Provider>
  );
}

// ============================================
// 🪝 CUSTOM HOOK (Easy access to context)
// ============================================

export function useBooks() {
  const context = useContext(BookContext);
  
  if (!context) {
    throw new Error("useBooks must be used inside BookProvider");
  }
  
  return context;
}

// ============================================
// 📤 DEFAULT EXPORT
// ============================================
export default BookContext;