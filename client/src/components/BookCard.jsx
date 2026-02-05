// ============================================
// 📚 BOOK CARD COMPONENT - MOBILE OPTIMIZED
// ============================================

import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, User, Building2, Eye } from "lucide-react";

const BookCard = ({ book, onClick }) => {
  const navigate = useNavigate();

  // ============================================
  // 📊 SAFE DATA EXTRACTION
  // ============================================
  const bookId = book?._id || book?.id;
  const bookTitle = book?.title || "Untitled Book";
  const bookAuthor = book?.author || "Unknown Author";
  const bookDepartment = book?.department || "General";
  const bookCover = book?.cover_url || null;
  const bookViews = book?.views || 0;
  const bookEdition = book?.edition || null;
  const bookPublisher = book?.publisher || null;
  const bookIsbn = book?.isbn || null;

  // Check availability
  const isAvailable = book?.isAvailable || (book?.copies && book.copies.length > 0);

  // ============================================
  // 🎯 HANDLE CLICK
  // ============================================
  const handleClick = () => {
    if (onClick) {
      onClick(bookId);
    } else {
      navigate(`/book/${bookId}`);
    }
  };

  // Prevent button click from triggering card click
  const handleButtonClick = (e) => {
    e.stopPropagation();
    handleClick();
  };

  // ============================================
  // 🎨 RENDER - MOBILE FIRST
  // ============================================
  return (
    <article
      onClick={handleClick}
      className="group relative bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1 will-change-transform"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${bookTitle} by ${bookAuthor}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Top Accent Bar - Thinner on mobile */}
      <div className="h-1 md:h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />

      {/* Book Cover Section - Responsive Height */}
      <div className="relative h-48 sm:h-52 md:h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {bookCover ? (
          <img
            src={bookCover}
            alt={bookTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextElementSibling.style.display = "flex";
            }}
          />
        ) : null}

        {/* Fallback Icon */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100"
          style={{ display: bookCover ? "none" : "flex" }}
          aria-hidden="true"
        >
          <BookOpen className="h-16 w-16 md:h-20 md:w-20 text-indigo-600 opacity-40" />
        </div>

        {/* Badges Container - Mobile Optimized */}
        <div className="absolute inset-0 p-2 md:p-3 pointer-events-none">
          
          {/* Top Row: Department & Availability */}
          <div className="flex items-start justify-between gap-2">
            
            {/* Department Badge */}
            <div className="px-2 py-1 md:px-3 md:py-1.5 bg-black/70 backdrop-blur-sm text-white text-[10px] md:text-xs font-bold rounded-md md:rounded-lg max-w-[120px] truncate">
              {bookDepartment}
            </div>

            {/* Availability Badge */}
            <div
              className={`px-2 py-1 md:px-3 md:py-1.5 text-[10px] md:text-xs font-bold rounded-md md:rounded-lg backdrop-blur-sm ${
                isAvailable
                  ? "bg-green-500/90 text-white"
                  : "bg-red-500/90 text-white"
              }`}
            >
              {isAvailable ? "✓ Available" : "✗ Issued"}
            </div>
          </div>

          {/* Bottom Row: Views Counter */}
          {bookViews > 0 && (
            <div className="absolute bottom-2 md:bottom-3 left-2 md:left-3 px-2 py-1 md:px-3 md:py-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] md:text-xs font-bold rounded-md md:rounded-lg flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{bookViews > 999 ? `${(bookViews / 1000).toFixed(1)}k` : bookViews}</span>
            </div>
          )}
        </div>
      </div>

      {/* Book Info Section - Responsive Padding */}
      <div className="p-3 md:p-4 lg:p-5 space-y-2 md:space-y-3">
        
        {/* Title - Responsive Font */}
        <h3 className="text-base md:text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors leading-snug">
          {bookTitle}
        </h3>

        {/* Author - Responsive */}
        <div className="flex items-center gap-2 text-gray-600">
          <User className="h-3.5 w-3.5 md:h-4 md:w-4 shrink-0" />
          <p className="text-xs md:text-sm font-medium truncate">{bookAuthor}</p>
        </div>

        {/* Edition Badge - Conditional */}
        {bookEdition && (
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 md:px-3 md:py-1.5 bg-purple-50 text-purple-700 text-[10px] md:text-xs font-bold rounded-full">
            <span>📖</span>
            <span className="truncate max-w-[120px]">{bookEdition}</span>
          </div>
        )}

        {/* Divider - Thinner on mobile */}
        <div className="border-t border-gray-100 md:border-t-2" />

        {/* Footer Info - Compact on mobile */}
        <div className="space-y-1.5 md:space-y-2">
          {bookIsbn && (
            <div className="flex items-start gap-2 text-[10px] md:text-xs text-gray-500">
              <span className="font-semibold shrink-0">ISBN:</span>
              <span className="font-mono break-all">{bookIsbn}</span>
            </div>
          )}
          
          {bookPublisher && (
            <div className="flex items-center gap-2 text-[10px] md:text-xs text-gray-500">
              <Building2 className="h-3 w-3 shrink-0" />
              <span className="truncate">{bookPublisher}</span>
            </div>
          )}
        </div>

        {/* View Details Button - Touch Friendly */}
        <button
          onClick={handleButtonClick}
          className="w-full mt-2 md:mt-3 px-4 py-3 md:py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg md:rounded-xl font-semibold text-sm md:text-base hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 min-h-[44px]"
          aria-label={`View details for ${bookTitle}`}
        >
          <span className="flex items-center justify-center gap-2">
            <span>View Details</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </span>
        </button>
      </div>
    </article>
  );
};

export default BookCard;