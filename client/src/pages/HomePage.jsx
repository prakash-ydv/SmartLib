// ✅ OPTIMIZED & BUG-FREE HomePage.jsx
// 📁 Location: src/pages/HomePage.jsx

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import useSWR from "swr";
import { useNavigate } from "react-router-dom";

// Environment Variables
const BASE_URL = import.meta.env.VITE_BASE_URL;

// Component Imports
import Hero from "../components/Hero";
import EnhancedSearchFilter from "../components/EnhancedSearchFilter";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import LoadingSkeleton from "../components/LoadingSkeleton";

// API & Context
import { getDepartmentBook } from "../api/fetchBookAPI";
import { BookContext } from "../context/BookContext";

function HomePage() {
  const navigate = useNavigate();

  // ============================================
  // CONTEXT MANAGEMENT
  // ============================================
  const context = useContext(BookContext);
  if (!context) {
    throw new Error("BookContext must be used inside BookProvider");
  }
  const { allBooks, setAllBooks } = context;

  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    branch: "all",
    year: "all",
    genre: "all",
    availability: "all",
  });

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  // ✅ FIX: Added missing isLoading state
  const [isLoading, setIsLoading] = useState(false);

  // ============================================
  // DATA FETCHING (SWR)
  // ============================================
  const { data, error, isLoading: isFetchingBooks } = useSWR(
    `${BASE_URL}/get/books/agriculture`,
    getDepartmentBook
  );

  // Update allBooks when data changes
  useEffect(() => {
    if (!data) return;
    
    // TODO: Remove slice when backend returns all books
    const someBooks = data.slice(0, 12);
    setAllBooks(someBooks);
    
    console.log("📚 Loaded Books:", someBooks.length);
  }, [data, setAllBooks]);

  // ============================================
  // MEMOIZED COMPUTED VALUES
  // ============================================

  // Filtered Books based on search and filters
  const filteredBooks = useMemo(() => {
    if (!allBooks || allBooks.length === 0) return [];
    
    let result = [...allBooks];

    // Search Filter
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (book) =>
          book.title?.toLowerCase().includes(search) ||
          book.author?.toLowerCase().includes(search) ||
          book.isbn?.toLowerCase().includes(search) ||
          book.publisher?.toLowerCase().includes(search)
      );
    }

    // Branch Filter
    if (filters.branch !== "all") {
      result = result.filter((book) => book.branch === filters.branch);
    }

    // Year Filter
    if (filters.year !== "all") {
      result = result.filter((book) => book.year === filters.year);
    }

    // Genre Filter
    if (filters.genre !== "all") {
      result = result.filter((book) => book.genre === filters.genre);
    }

    // Availability Filter
    if (filters.availability !== "all") {
      const isAvailable = filters.availability === "available";
      result = result.filter((book) => book.available === isAvailable);
    }

    return result;
  }, [searchTerm, filters, allBooks]);

  // ✅ FIX: Paginated Books (was missing in render)
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBooks.slice(startIndex, endIndex);
  }, [filteredBooks, currentPage, itemsPerPage]);

  // Statistics for display
  const stats = useMemo(
    () => ({
      total: allBooks?.length || 0,
      available: allBooks?.filter((b) => b.available).length || 0,
      showing: filteredBooks.length,
    }),
    [allBooks, filteredBooks]
  );

  // Total Pages
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;

  // ============================================
  // EVENT HANDLERS
  // ============================================

  // Reset all filters
  const handleReset = useCallback(() => {
    setSearchTerm("");
    setFilters({
      branch: "all",
      year: "all",
      genre: "all",
      availability: "all",
    });
    setCurrentPage(1);
  }, []);

  // Page change with smooth scroll
  const handlePageChange = useCallback((page) => {
    setIsLoading(true);
    setCurrentPage(page);
    
    // Smooth scroll to top of content
    window.scrollTo({ top: 400, behavior: "smooth" });

    // Simulate loading for smooth UX
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  // Items per page change
  const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page
  }, []);

  // Book click handler - Navigate to details
  const handleBookClick = useCallback(
    (bookId) => {
      navigate(`/book/${bookId}`);
    },
    [navigate]
  );

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  // ============================================
  // ERROR HANDLING
  // ============================================
  if (error) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Books
          </h2>
          <p className="text-gray-600 mb-4">
            {error.message || "Something went wrong"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Main Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-[1800px] mx-auto">
        
        {/* Search & Filter Section */}
        <EnhancedSearchFilter
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filters={filters}
          setFilters={setFilters}
          stats={stats}
          onReset={handleReset}
        />

        {/* Books Section */}
        <div className="mt-8 sm:mt-12">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-6">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-1.5 sm:w-2 h-6 sm:h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full"></div>
              Library Catalog
            </h2>
            <div className="text-xs sm:text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1.5 rounded-lg">
              {totalPages > 0
                ? `Page ${currentPage} of ${totalPages}`
                : "No pages"}
            </div>
          </div>

          {/* Content Area */}
          {isFetchingBooks ? (
            // Initial Loading State
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
                <p className="text-lg text-gray-600 font-medium">
                  Loading books from library...
                </p>
                <p className="text-sm text-gray-500 mt-2">Please wait</p>
              </div>
            </div>
          ) : isLoading ? (
            // Pagination Loading State
            <LoadingSkeleton count={itemsPerPage} />
          ) : (
            <>
              {/* Books Grid or Empty State */}
              {paginatedBooks.length > 0 ? (
                <div className="books-grid">
                  {paginatedBooks.map((book, index) => (
                    <BookCard
                      key={book._id || book.id || index}
                      book={book}
                      onClick={() => handleBookClick(book._id || book.id || index)}
                    />
                  ))}
                </div>
              ) : (
                // Empty State
                <div className="text-center py-12 sm:py-20 px-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4 sm:mb-6">
                    <svg
                      className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                    No books found
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                    Try adjusting your search or filters
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm sm:text-base"
                  >
                    Clear All Filters
                  </button>
                </div>
              )}

              {/* Pagination */}
              {paginatedBooks.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={filteredBooks.length}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;