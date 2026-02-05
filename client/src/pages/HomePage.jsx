// ============================================
// 🏠 HOME PAGE - SIMPLIFIED & WORKING
// ============================================
// Location: client/src/pages/HomePage.jsx
// Purpose: Main page - displays all books
// ============================================

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

// ============================================
// 📦 CONTEXT
// ============================================
import { useBooks } from "../context/BookContext";

// ============================================
// 📄 COMPONENTS (Already exist in your project)
// ============================================
import Hero from "../components/Hero";
import EnhancedSearchFilter from "../components/EnhancedSearchFilter";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";
import LoadingSkeleton from "../components/LoadingSkeleton";

// ============================================
// 🏠 HOME PAGE COMPONENT
// ============================================
function HomePage() {
  const navigate = useNavigate();

  // --------------------------------------------
  // 📦 GET DATA FROM CONTEXT
  // --------------------------------------------
  const {
    allBooks,         // All books array from backend
    loading,          // Loading state
    error,            // Error message
    fetchAllBooks,    // Function to load books
    refreshBooks,     // Manual refresh function
  } = useBooks();

  // --------------------------------------------
  // 📊 LOCAL STATE
  // --------------------------------------------
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    branch: "all",
    year: "all",
    genre: "all",
    availability: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  // --------------------------------------------
  // 🔄 INITIAL DATA LOAD
  // --------------------------------------------
  useEffect(() => {
    console.log("📚 HomePage: Loading books from backend...");
    fetchAllBooks();
  }, [fetchAllBooks]);

  // --------------------------------------------
  // 🔍 FILTER BOOKS (Client-side)
  // --------------------------------------------
  const filteredBooks = useMemo(() => {
    console.log(`🔍 Filtering ${allBooks.length} books...`);
    
    let result = [...allBooks];

    // 1. Search filter (title, author, ISBN, publisher)
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

    // 2. Department filter
    if (filters.branch !== "all") {
      result = result.filter(
        (book) => book.department?.toUpperCase() === filters.branch.toUpperCase()
      );
    }

    // 3. Availability filter
    if (filters.availability !== "all") {
      const isAvailable = filters.availability === "available";
      result = result.filter((book) => {
        const available = book.isAvailable || (book.copies && book.copies.length > 0);
        return available === isAvailable;
      });
    }

    console.log(`✅ Filtered to ${result.length} books`);
    return result;
  }, [allBooks, searchTerm, filters]);

  // --------------------------------------------
  // 📄 PAGINATION (Client-side)
  // --------------------------------------------
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBooks.slice(startIndex, endIndex);
  }, [filteredBooks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;

  // --------------------------------------------
  // 📊 STATISTICS
  // --------------------------------------------
  const stats = useMemo(
    () => ({
      total: allBooks.length,
      available: allBooks.filter(
        (b) => b.isAvailable || (b.copies && b.copies.length > 0)
      ).length,
      showing: filteredBooks.length,
    }),
    [allBooks, filteredBooks]
  );

  // --------------------------------------------
  // 🎯 EVENT HANDLERS
  // --------------------------------------------

  // Handle search term change
  const handleSearchChange = (value) => {
    console.log(`🔍 Search: "${value}"`);
    setSearchTerm(value);
    setCurrentPage(1); // Reset to page 1
  };

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    console.log("🎛️ Filters changed:", newFilters);
    setFilters(newFilters);
    setCurrentPage(1); // Reset to page 1
  };

  // Handle reset
  const handleReset = () => {
    console.log("🔄 Resetting all filters");
    setSearchTerm("");
    setFilters({
      branch: "all",
      year: "all",
      genre: "all",
      availability: "all",
    });
    setCurrentPage(1);
  };

  // Handle page change
  const handlePageChange = (page) => {
    console.log(`📄 Page changed to: ${page}`);
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: "smooth" });
  };

  // Handle items per page change
  const handleItemsPerPageChange = (newItemsPerPage) => {
    console.log(`📊 Items per page: ${newItemsPerPage}`);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  // Handle book click
  const handleBookClick = (bookId) => {
    console.log(`📖 Book clicked: ${bookId}`);
    navigate(`/book/${bookId}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    console.log("🔄 Manual refresh triggered");
    refreshBooks();
  };

  // --------------------------------------------
  // ❌ ERROR STATE
  // --------------------------------------------
  if (error && !loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Books
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------
  // 🎨 MAIN RENDER
  // --------------------------------------------
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Main Container */}
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-[1800px] mx-auto">
        
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
              📚 SmartLib Catalog
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {loading
                ? "Loading books from database..."
                : `Browse ${stats.total.toLocaleString()} books from our collection`}
            </p>
          </div>
          
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "⏳ Loading..." : "🔄 Refresh"}
          </button>
        </div>

        {/* Search & Filter Section */}
        <EnhancedSearchFilter
          searchTerm={searchTerm}
          setSearchTerm={handleSearchChange}
          filters={filters}
          setFilters={handleFilterChange}
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
            
            <div className="flex items-center gap-4">
              <div className="text-xs sm:text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1.5 rounded-lg">
                {totalPages > 0
                  ? `Page ${currentPage} of ${totalPages}`
                  : "No pages"}
              </div>
              <div className="text-xs sm:text-sm text-gray-600 font-medium bg-green-100 px-3 py-1.5 rounded-lg">
                {stats.available} Available
              </div>
            </div>
          </div>

          {/* Content Area */}
          {loading && allBooks.length === 0 ? (
            // ⏳ Initial Loading State
            <div className="min-h-[50vh] flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4"></div>
                <p className="text-lg text-gray-600 font-medium">
                  Loading books from MongoDB Atlas...
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  Using workaround to fetch all books
                </p>
              </div>
            </div>
          ) : paginatedBooks.length > 0 ? (
            <>
              {/* 📚 Books Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedBooks.map((book) => (
                  <BookCard
                    key={book._id || book.id}
                    book={book}
                    onClick={handleBookClick}
                  />
                ))}
              </div>

              {/* 📄 Pagination */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={filteredBooks.length}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          ) : (
            // 📭 Empty State
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
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                No books found
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">
                {allBooks.length === 0
                  ? "No books available in the library database"
                  : "Try adjusting your search or filters"}
              </p>
              {allBooks.length > 0 && (
                <button
                  onClick={handleReset}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm sm:text-base"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;