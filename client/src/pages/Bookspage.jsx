// client/src/pages/BooksPage.jsx
// Example: How to use BookContext with real API

import { useContext, useEffect, useState } from "react";
import { BookContext } from "../context/BookContext";
import { getDepartmentsList } from "../api/bookAPI";
import BookCard from "../components/BookCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import Pagination from "../components/Pagination";

export default function BooksPage() {
  const {
    allBooks,
    loading,
    error,
    pagination,
    fetchBooks,
    refreshBooks,
    clearError,
  } = useContext(BookContext);

  const [selectedDepartment, setSelectedDepartment] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  
  const departments = getDepartmentsList();

  // Initial load and when filters change
  useEffect(() => {
    const dept = selectedDepartment === "ALL" ? "" : selectedDepartment;
    fetchBooks(currentPage, 12, dept);
  }, [currentPage, selectedDepartment, fetchBooks]);

  // Handle department filter change
  const handleDepartmentChange = (dept) => {
    setSelectedDepartment(dept);
    setCurrentPage(1); // Reset to first page
  };

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle manual refresh
  const handleRefresh = () => {
    refreshBooks();
  };

  return (
    <div className="books-page">
      {/* Header Section */}
      <div className="page-header">
        <h1>📚 Library Books</h1>
        <button 
          onClick={handleRefresh} 
          className="refresh-btn"
          disabled={loading}
        >
          {loading ? "⏳ Loading..." : "🔄 Refresh"}
        </button>
      </div>

      {/* Department Filter */}
      <div className="filter-section">
        <label htmlFor="dept-filter">Filter by Department:</label>
        <select
          id="dept-filter"
          value={selectedDepartment}
          onChange={(e) => handleDepartmentChange(e.target.value)}
          disabled={loading}
        >
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <span className="result-count">
          {pagination.totalItems > 0 && (
            <>Showing {allBooks.length} of {pagination.totalItems} books</>
          )}
        </span>
      </div>

      {/* Error Display */}
      {error && (
        <div className="error-banner">
          <p>❌ {error}</p>
          <button onClick={clearError}>✕</button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="books-grid">
          {[...Array(6)].map((_, i) => (
            <LoadingSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Books Grid */}
      {!loading && allBooks.length > 0 && (
        <div className="books-grid">
          {allBooks.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && allBooks.length === 0 && !error && (
        <div className="empty-state">
          <p>📭 No books found</p>
          <p>Try selecting a different department</p>
        </div>
      )}

      {/* Pagination */}
      {!loading && allBooks.length > 0 && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}