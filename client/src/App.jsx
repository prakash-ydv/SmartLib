// src/App.jsx - FINAL RESPONSIVE VERSION
import React, { useState, useEffect, useMemo, useCallback } from "react";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import all enhanced components
import Header from "./components/Header";
import Hero from "./components/Hero";
import EnhancedSearchFilter from "./components/EnhancedSearchFilter";
import BookCard from "./components/BookCard";
import Pagination from "./components/Pagination";
import LoadingSkeleton from "./components/LoadingSkeleton";
import Footer from "./components/Footer";
import BookDetails from "./components/BookDetails";
import BranchLegend from "./components/BranchLegend";
import CampusAccessGate from "./components/CampusAccessGate";

import { booksData } from "./data/booksData";

function App() {
  // State Management
  const [books] = useState(booksData);
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
  
  // Loading State
  const [isLoading, setIsLoading] = useState(false);

  // Memoized Filtered Books
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Search filter
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(search) ||
          book.author.toLowerCase().includes(search) ||
          book.isbn.toLowerCase().includes(search) ||
          (book.publisher && book.publisher.toLowerCase().includes(search))
      );
    }

    // Branch filter
    if (filters.branch !== "all") {
      result = result.filter((book) => book.branch === filters.branch);
    }

    // Year filter
    if (filters.year !== "all") {
      result = result.filter((book) => book.year === filters.year);
    }

    // Genre filter
    if (filters.genre !== "all") {
      result = result.filter((book) => book.genre === filters.genre);
    }

    // Availability filter
    if (filters.availability !== "all") {
      result = result.filter((book) =>
        filters.availability === "available" ? book.available : !book.available
      );
    }

    return result;
  }, [searchTerm, filters, books]);

  // Paginated Books
  const paginatedBooks = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredBooks.slice(startIndex, endIndex);
  }, [filteredBooks, currentPage, itemsPerPage]);

  // Stats
  const stats = useMemo(() => ({
    total: books.length,
    available: books.filter((b) => b.available).length,
    showing: filteredBooks.length,
  }), [books, filteredBooks]);

  // Total Pages
  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // Reset handler
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

  // Page change handler
  const handlePageChange = useCallback((page) => {
    setIsLoading(true);
    setCurrentPage(page);
    window.scrollTo({ top: 400, behavior: 'smooth' });
    
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  // Items per page change handler
  const handleItemsPerPageChange = useCallback((newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  }, []);

  // Book click handler
  const handleBookClick = useCallback((book) => {
    window.location.href = `/book/${book.id}`;
  }, []);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filters]);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Header />

        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />

                {/* Main Container - FIXED RESPONSIVE */}
                <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12 py-8 max-w-[1800px] mx-auto">
                  
                  {/* Search & Filter */}
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
                        Page {currentPage} of {totalPages}
                      </div>
                    </div>

                    {/* Loading State */}
                    {isLoading ? (
                      <LoadingSkeleton count={itemsPerPage} />
                    ) : (
                      <>
                        {/* Books Grid */}
                        {paginatedBooks.length > 0 ? (
                          <div className="books-grid">
                            {paginatedBooks.map((book) => (
                              <BookCard 
                                key={book.id} 
                                book={book}
                                onClick={handleBookClick}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12 sm:py-20 px-4">
                            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full mb-4 sm:mb-6">
                              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2">No books found</h3>
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
            }
          />

          {/* Book Details Page */}
          <Route path="/book/:id" element={<BookDetails />} />
        </Routes>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;