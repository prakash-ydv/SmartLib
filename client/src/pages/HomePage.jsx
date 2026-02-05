// ============================================
// 🏠 HOME PAGE - MOBILE-FIRST OPTIMIZED
// ============================================

import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";

// Context
import { useBooks } from "../context/BookContext";

// Components

import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";

// ============================================
// 📦 LOADING SPINNER COMPONENT
// ============================================
const LoadingSpinner = ({ size = "md", message }) => {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16"
  };

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
      <div className={`${sizes[size]} animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4`} />
      {message && (
        <p className="text-base md:text-lg text-gray-600 font-medium text-center max-w-md">
          {message}
        </p>
      )}
    </div>
  );
};

// ============================================
// 🏠 HOME PAGE COMPONENT
// ============================================
function HomePage() {
  const navigate = useNavigate();
  const booksGridRef = useRef(null);

  // Context
  const {
    allBooks,
    loading,
    error,
    fetchAllBooks,
    refreshBooks,
  } = useBooks();

  // Local State
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    branch: "all",
    year: "all",
    genre: "all",
    availability: "all",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  // ============================================
  // 🔄 INITIAL DATA LOAD
  // ============================================
  useEffect(() => {
    console.log("📚 HomePage: Loading books...");
    fetchAllBooks();
  }, [fetchAllBooks]);

  // ============================================
  // 🔍 FILTER BOOKS (Client-side)
  // ============================================
  const filteredBooks = useMemo(() => {
    let result = [...allBooks];

    // Search filter
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

    // Department filter
    if (filters.branch !== "all") {
      result = result.filter(
        (book) => book.department?.toUpperCase() === filters.branch.toUpperCase()
      );
    }

    // Availability filter
    if (filters.availability !== "all") {
      const isAvailable = filters.availability === "available";
      result = result.filter((book) => {
        const available = book.isAvailable || (book.copies && book.copies.length > 0);
        return available === isAvailable;
      });
    }

    return result;
  }, [allBooks, searchTerm, filters]);

  // ============================================
  // 📄 PAGINATION
  // ============================================
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBooks.slice(startIndex, endIndex);
  }, [filteredBooks, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage) || 1;

  // ============================================
  // 📊 STATISTICS
  // ============================================
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

  // ============================================
  // 🎯 EVENT HANDLERS
  // ============================================

  const handleSearchChange = (value) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm("");
    setFilters({
      branch: "all",
      year: "all",
      genre: "all",
      availability: "all",
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);

    // Smart scroll to grid top
    if (booksGridRef.current) {
      const headerOffset = 100; // Account for fixed header
      const elementPosition = booksGridRef.current.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleBookClick = (bookId) => {
    navigate(`/book/${bookId}`);
  };

  const handleRefresh = () => {
    refreshBooks();
  };

  // ============================================
  // ❌ ERROR STATE
  // ============================================
  if (error && !loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl md:text-6xl mb-4">⚠️</div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Books
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold min-h-[44px]"
            >
              🔄 Try Again
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-semibold min-h-[44px]"
            >
              Reload Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // 🎨 MAIN RENDER
  // ============================================
  return (
    <>
      {/* Hero Section */}
      <Hero />

      {/* Main Container - Mobile First */}
      <div className="container-custom section-padding">

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              📚 SmartLib Catalog
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {loading && allBooks.length === 0
                ? "Loading books from database..."
                : `Browse ${stats.total.toLocaleString()} books from our collection`}
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed min-h-[44px] flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
                <span className="hidden sm:inline">Loading...</span>
              </>
            ) : (
              <>
                <span>🔄</span>
                <span className="hidden sm:inline">Refresh</span>
              </>
            )}
          </button>
        </div>

        {/* Search & Filter Section */}
        <div className="space-y-4">
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={handleSearchChange}
          />

          <FilterPanel
            filters={filters}
            setFilters={handleFilterChange}
            stats={stats}
            onReset={handleReset}
          />
        </div>

        {/* Books Section */}
        <div className="mt-8 md:mt-12" ref={booksGridRef}>

          {/* Section Header - Mobile Optimized */}
          <div className="flex flex-col gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 md:w-2 h-6 md:h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full shrink-0" />
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                Library Catalog
              </h2>
            </div>

            {/* Stats Row - Mobile Friendly */}
            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <div className="text-xs md:text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1.5 rounded-lg">
                {totalPages > 0 ? `Page ${currentPage} of ${totalPages}` : "No pages"}
              </div>
              <div className="text-xs md:text-sm text-gray-600 font-medium bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg">
                {stats.showing} Showing
              </div>
              <div className="text-xs md:text-sm text-gray-600 font-medium bg-green-100 text-green-700 px-3 py-1.5 rounded-lg">
                {stats.available} Available
              </div>
            </div>
          </div>

          {/* Content Area */}
          {loading && allBooks.length === 0 ? (
            // ⏳ Initial Loading
            <LoadingSpinner
              size="lg"
              message="Loading books from MongoDB Atlas..."
            />

          ) : paginatedBooks.length > 0 ? (
            <>
              {/* 📚 Books Grid - Mobile First */}
              <div className="books-grid mb-8 md:mb-12">
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
            // 📭 Empty State - Mobile Optimized
            <div className="text-center py-12 md:py-20 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full mb-4 md:mb-6">
                <svg
                  className="w-8 h-8 md:w-10 md:h-10 text-gray-400"
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
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                No books found
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-6 max-w-md mx-auto">
                {allBooks.length === 0
                  ? "No books available in the library database"
                  : "Try adjusting your search or filters"}
              </p>
              {allBooks.length > 0 && (
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm md:text-base min-h-[44px]"
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