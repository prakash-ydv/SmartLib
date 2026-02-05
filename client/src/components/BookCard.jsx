// ============================================
// 📚 BOOK CARD COMPONENT
// ============================================
// Location: client/src/components/BookCard.jsx
// Purpose: Display single book in grid
// ============================================

import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, User, Building2 } from "lucide-react";

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

  // ============================================
  // 🎨 RENDER
  // ============================================
  return (
    <div
      onClick={handleClick}
      className="group relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md hover:shadow-2xl hover:border-indigo-300 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      {/* Top Accent Bar */}
      <div className="h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>

      {/* Book Cover Section */}
      <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {bookCover ? (
          <img
            src={bookCover}
            alt={bookTitle}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}

        {/* Fallback Icon */}
        <div
          className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100"
          style={{ display: bookCover ? "none" : "flex" }}
        >
          <BookOpen className="h-20 w-20 text-indigo-600 opacity-40" />
        </div>

        {/* Department Badge */}
        <div className="absolute top-3 left-3 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-bold rounded-lg">
          {bookDepartment}
        </div>

        {/* Availability Badge */}
        <div
          className={`absolute top-3 right-3 px-3 py-1.5 text-xs font-bold rounded-lg backdrop-blur-sm ${
            isAvailable
              ? "bg-green-500/90 text-white"
              : "bg-red-500/90 text-white"
          }`}
        >
          {isAvailable ? "Available" : "Issued"}
        </div>

        {/* Views Counter */}
        {bookViews > 0 && (
          <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold rounded-lg flex items-center gap-1">
            👁️ {bookViews}
          </div>
        )}
      </div>

      {/* Book Info Section */}
      <div className="p-5 space-y-3">
        
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors min-h-[56px]">
          {bookTitle}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2 text-gray-600">
          <User className="h-4 w-4 flex-shrink-0" />
          <p className="text-sm font-medium truncate">{bookAuthor}</p>
        </div>

        {/* Edition Badge */}
        {bookEdition && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">
            📖 {bookEdition}
          </div>
        )}

        {/* Divider */}
        <div className="border-t-2 border-gray-100"></div>

        {/* Footer - ISBN & Publisher */}
        <div className="space-y-2">
          {bookIsbn && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="font-semibold">ISBN:</span>
              <span className="font-mono">{bookIsbn}</span>
            </div>
          )}
          
          {bookPublisher && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Building2 className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{bookPublisher}</span>
            </div>
          )}
        </div>

        {/* View Details Button */}
        <button className="w-full mt-3 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-semibold group-hover:from-purple-600 group-hover:to-pink-600 transition-all duration-300 transform group-hover:scale-105 shadow-md">
          View Details →
        </button>
      </div>
    </div>
  );
};

export default BookCard;