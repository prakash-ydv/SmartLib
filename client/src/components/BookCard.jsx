import React from "react";
import { useNavigate } from "react-router-dom";
import { BookOpen, Building2, Eye, User } from "lucide-react";
import { getBookId, getCopyCount, isBookAvailable } from "../utils/bookDisplay";

const BookCard = ({ book, onClick }) => {
  const navigate = useNavigate();

  const bookId = getBookId(book);
  const bookTitle = book?.title || "Untitled Book";
  const bookAuthor = book?.author || "Unknown Author";
  const bookDepartment = book?.department || "General";
  const bookCover = book?.cover_url || null;
  const bookViews = book?.views || 0;
  const bookEdition = book?.edition || null;
  const bookPublisher = book?.publisher || null;
  const bookIsbn = book?.isbn || null;

  const available = isBookAvailable(book);
  const copyCount = getCopyCount(book);

  const handleClick = () => {
    if (!bookId) return;

    if (onClick) {
      onClick(bookId);
      return;
    }

    navigate(`/book/${bookId}`);
  };

  const handleButtonClick = (event) => {
    event.stopPropagation();
    handleClick();
  };

  return (
    <article
      onClick={handleClick}
      className="group relative bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-indigo-300 shadow-sm hover:shadow-2xl transition-all duration-300 cursor-pointer hover:-translate-y-1"
      role="button"
      tabIndex={0}
      aria-label={`View details for ${bookTitle} by ${bookAuthor}`}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleClick();
        }
      }}
    >
      {/* Top Gradient Border */}
      <div className="h-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" />

      {/* Image Section */}
      <div className="relative h-60 sm:h-64 md:h-72 bg-white overflow-hidden flex items-center justify-center">
        {bookCover ? (
          <img
            src={bookCover}
            alt={bookTitle}
            className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.style.display = "none";

              if (event.currentTarget.nextElementSibling) {
                event.currentTarget.nextElementSibling.style.display =
                  "flex";
              }
            }}
          />
        ) : null}

        {/* Fallback Image */}
        <div
          className="absolute inset-0 hidden items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100"
          style={{
            display: bookCover ? "none" : "flex",
          }}
          aria-hidden="true"
        >
          <BookOpen className="h-20 w-20 text-indigo-500 opacity-40" />
        </div>

        {/* Top Badges */}
        <div className="absolute inset-0 p-3 pointer-events-none">
          <div className="flex items-start justify-between gap-2">
            {/* Department */}
            <div className="px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-bold rounded-lg max-w-[130px] truncate">
              {bookDepartment}
            </div>

            {/* Availability */}
            <div
              className={`px-3 py-1.5 text-xs font-bold rounded-lg backdrop-blur-sm ${
                available
                  ? "bg-green-500/90 text-white"
                  : "bg-red-500/90 text-white"
              }`}
            >
              {available ? "Available" : "Issued"}
            </div>
          </div>

          {/* Views */}
          {bookViews > 0 && (
            <div className="absolute bottom-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-xs font-bold rounded-lg flex items-center gap-1 shadow">
              <Eye className="h-3.5 w-3.5" />

              <span>
                {bookViews > 999
                  ? `${(bookViews / 1000).toFixed(1)}k`
                  : bookViews}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
          {bookTitle}
        </h3>

        {/* Author */}
        <div className="flex items-center gap-2 text-gray-600">
          <User className="h-4 w-4 shrink-0" />

          <p className="text-sm font-medium truncate">
            {bookAuthor}
          </p>
        </div>

        {/* Edition */}
        {bookEdition && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">
            <span className="truncate max-w-[140px]">
              {bookEdition}
            </span>
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-gray-200" />

        {/* Book Details */}
        <div className="space-y-2">
          {bookIsbn && (
            <div className="flex items-start gap-2 text-xs text-gray-500">
              <span className="font-semibold shrink-0">
                ISBN:
              </span>

              <span className="font-mono break-all">
                {bookIsbn}
              </span>
            </div>
          )}

          {bookPublisher && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Building2 className="h-3.5 w-3.5 shrink-0" />

              <span className="truncate">
                {bookPublisher}
              </span>
            </div>
          )}

          {copyCount > 0 && (
            <div className="text-xs text-gray-500">
              <span className="font-semibold">{copyCount}</span>{" "}
              {copyCount === 1 ? "copy" : "copies"} recorded
            </div>
          )}
        </div>

        {/* Button */}
        <button
          onClick={handleButtonClick}
          className="w-full mt-3 px-4 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-base hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label={`View details for ${bookTitle}`}
        >
          <span className="flex items-center justify-center gap-2">
            <span>View Details</span>

            <span className="transition-transform duration-300 group-hover:translate-x-1">
              -&gt;
            </span>
          </span>
        </button>
      </div>
    </article>
  );
};

export default BookCard;
