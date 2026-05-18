import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw, AlertTriangle, Library } from "lucide-react";

import { useBooks } from "../context/BookContext";
import { getLiveCatalogStats } from "../utils/bookDisplay";
import Hero from "../components/Hero";
import SearchBar from "../components/SearchBar";
import FilterPanel from "../components/FilterPanel";
import BookCard from "../components/BookCard";
import Pagination from "../components/Pagination";

// ─── LOADING SPINNER ──────────────────────────────────────────────────────────
const LoadingSpinner = ({ size = "md", message }) => {
  const sizes = { sm: "h-8 w-8", md: "h-12 w-12", lg: "h-16 w-16" };

  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center px-4">
      <div
        className={`${sizes[size]} animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-4`}
      />
      {message && (
        <p className="text-base md:text-lg text-gray-600 font-medium text-center max-w-md">
          {message}
        </p>
      )}
    </div>
  );
};

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function HomePage() {
  const navigate     = useNavigate();
  const booksGridRef = useRef(null);

  const { allBooks, loading, error, fetchBooks, pagination } = useBooks();

  const [searchQuery, setSearchQuery] = useState("");

  // ── New Filter State ───────────────────────────────────────────────
  // faculty    → top-level category  (e.g. "Engineering & Technology")
  // department → sub-filter          (e.g. "CSE")
  // availability → "all" | "available" | "unavailable"
  const [filters, setFilters] = useState({
    faculty:      "all",
    department:   "all",
    availability: "all",
  });

  const [currentPage, setCurrentPage]   = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(24);

  // ── Build request filters (passed to API) ──────────────────────────
  const requestFilters = useMemo(
    () => ({
      query:        searchQuery,
      faculty:      filters.faculty,
      department:   filters.department,
      availability: filters.availability,
    }),
    [searchQuery, filters.faculty, filters.department, filters.availability]
  );

  const totalPages = pagination.totalPages || 1;
  const totalItems = pagination.totalItems || allBooks.length;

  // ── Fetch on filter/page change ────────────────────────────────────
  useEffect(() => {
    fetchBooks(currentPage, itemsPerPage, requestFilters);
  }, [currentPage, fetchBooks, itemsPerPage, requestFilters]);

  // ── Stats ──────────────────────────────────────────────────────────
  const stats = useMemo(
    () => getLiveCatalogStats({ totalItems, pageBooks: allBooks }),
    [allBooks, totalItems]
  );

  // ── Scroll to catalog ──────────────────────────────────────────────
  const scrollToCatalog = () => {
    if (!booksGridRef.current) return;
    const headerOffset    = 100;
    const elementPosition = booksGridRef.current.getBoundingClientRect().top;
    const offsetPosition  = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({ top: offsetPosition, behavior: "smooth" });
  };

  // ── Handlers ───────────────────────────────────────────────────────
  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleHeroSearch = (term) => {
    setSearchQuery(term);
    setCurrentPage(1);
    setTimeout(scrollToCatalog, 150);
  };

  // FilterPanel setFilters directly call karta hai
  // filters mein faculty + department + availability hote hain
  const handleFilterChange = (newFilters) => {
    setFilters({
      faculty:      newFilters.faculty      || "all",
      department:   newFilters.department   || "all",
      availability: newFilters.availability || "all",
    });
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchQuery("");
    setFilters({ faculty: "all", department: "all", availability: "all" });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setTimeout(scrollToCatalog, 50);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handleRefresh = () => {
    fetchBooks(currentPage, itemsPerPage, requestFilters);
  };

  // ── Error State ────────────────────────────────────────────────────
  if (error && !loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-50 text-amber-600 mb-4">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Books
          </h2>
          <p className="text-sm md:text-base text-gray-600 mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold min-h-[44px]"
            >
              Try Again
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

  // ── Main Render ────────────────────────────────────────────────────
  return (
    <>
      <Hero onSearch={handleHeroSearch} catalogStats={stats} />

      <div className="container-custom section-padding">

        {/* ── Header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
          <div className="flex-1">
            <h1 className="flex items-center gap-3 text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              <Library className="h-7 w-7 text-indigo-600" />
              SmartLib Catalog
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              {loading && allBooks.length === 0
                ? "Loading books from database..."
                : `Browse ${stats.total.toLocaleString()} matching books from our collection`}
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={loading}
            className="px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm disabled:bg-gray-400 disabled:cursor-not-allowed min-h-[44px] flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-r-transparent" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span className="hidden sm:inline">
              {loading ? "Loading..." : "Refresh"}
            </span>
          </button>
        </div>

        {/* ── Search + Filter ─────────────────────────────────────── */}
        <div className="space-y-4">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={handleSearchChange}
          />

          <FilterPanel
            filters={filters}
            setFilters={handleFilterChange}
            stats={stats}
            onReset={handleReset}
          />
        </div>

        {/* ── Books Grid ──────────────────────────────────────────── */}
        <div className="mt-8 md:mt-12" ref={booksGridRef}>
          <div className="flex flex-col gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 md:w-2 h-6 md:h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full shrink-0" />
              <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900">
                Library Catalog
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2 md:gap-4">
              <div className="text-xs md:text-sm text-gray-600 font-medium bg-gray-100 px-3 py-1.5 rounded-lg">
                Page {currentPage} of {totalPages}
              </div>
              <div className="text-xs md:text-sm font-medium bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg">
                {stats.showing} Showing
              </div>
              <div className="text-xs md:text-sm font-medium bg-green-100 text-green-700 px-3 py-1.5 rounded-lg">
                {stats.availableOnPage} Available on this page
              </div>
            </div>
          </div>

          {/* Loading */}
          {loading && allBooks.length === 0 ? (
            <LoadingSpinner size="lg" message="Loading books from library..." />
          ) : allBooks.length > 0 ? (
            <>
              <div className="books-grid mb-8 md:mb-12">
                {allBooks.map((book) => (
                  <BookCard
                    key={book._id || book.id}
                    book={book}
                    onClick={(bookId) => navigate(`/book/${bookId}`)}
                  />
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                itemsPerPage={itemsPerPage}
                totalItems={totalItems}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </>
          ) : (
            /* No Results */
            <div className="text-center py-12 md:py-20 px-4">
              <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full mb-4 md:mb-6">
                <Library className="w-8 h-8 md:w-10 md:h-10 text-gray-400" />
              </div>
              <h3 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-900 mb-2">
                No books found
              </h3>
              <p className="text-sm md:text-base text-gray-600 mb-6 max-w-md mx-auto">
                Try adjusting your search or filters.
              </p>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold text-sm md:text-base min-h-[44px]"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;