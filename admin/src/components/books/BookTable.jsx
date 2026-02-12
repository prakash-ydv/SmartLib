// 📁 Location: admin/src/components/books/BookTable.jsx
// ✅ Books Data Table Component - FIXED

import React from "react";
import { BookOpen } from "lucide-react";
import BookTableRow from "./BookTableRow";

/**
 * ✅ FIXED Books Table Component
 *
 * CHANGES:
 * - Fixed key prop: book.id → book._id || book.id
 * - This matches backend MongoDB _id field
 */
function BookTable({
  books,
  totalBooks,
  onToggleAvailability,
  onEditBook,
  onDeleteBook,
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Books Management ({books.length} of {totalBooks})
        </h2>
      </div>

      <div className="w-full">
        {/* Mobile View: Premium Cards */}
        <div className="md:hidden space-y-4 p-4 bg-gray-50/50">
          {books.map((book) => (
            <div
              key={book._id || book.id}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200"
            >
              <div className="flex gap-4">
                {/* Cover Image - Fixed Aspect Ratio */}
                <div className="flex-shrink-0 w-20 h-28 bg-gray-100 rounded-lg overflow-hidden shadow-sm border border-gray-200 relative group">
                  {book.cover_url ? (
                    <img
                      src={book.cover_url}
                      alt={book.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <BookOpen className="h-8 w-8" />
                    </div>
                  )}
                  {/* Views Overlay */}
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 backdrop-blur-sm p-1 text-center">
                    <p className="text-[10px] font-medium text-white flex items-center justify-center gap-1">
                      <span className="w-1 h-1 rounded-full bg-green-400"></span>
                      {book.views || 0} views
                    </p>
                  </div>
                </div>

                {/* Info Container */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-semibold text-gray-900 leading-tight line-clamp-2">
                        {book.title}
                      </h3>
                      {/* Status Pill */}
                      <span
                        className={`flex-shrink-0 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wide ${
                          book.isAvailable
                            ? "bg-green-50 text-green-700 border border-green-200/50"
                            : "bg-red-50 text-red-700 border border-red-200/50"
                        }`}
                      >
                        {book.isAvailable ? "Available" : "Not Available"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mt-1 truncate">
                      {book.author}
                    </p>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-3 mt-2 text-xs text-gray-500">
                      <span className="flex items-center gap-1 bg-gray-100 px-1.5 py-0.5 rounded">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        {book.department}
                      </span>
                      <span className="font-mono text-gray-400">
                        {book.isbn}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between gap-3">
                <button
                  onClick={() => onToggleAvailability(book._id || book.id)}
                  className={`flex-1 flex items-center justify-center px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    book.isAvailable
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-green-50 text-green-700 hover:bg-green-100"
                  }`}
                >
                  {book.isAvailable ? "Mark Unavailable" : "Mark Available"}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEditBook(book)}
                    className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all"
                    aria-label="Edit"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>
                  <button
                    onClick={() => onDeleteBook(book._id || book.id)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                    aria-label="Delete"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop View: Table */}
        <table className="w-full table-fixed divide-y divide-gray-200 hidden md:table">
          {/* Table Head */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                Cover
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[22%]">
                Title
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                Author
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                Department
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                ISBN
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                Views
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[12%]">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-[10%]">
                Actions
              </th>
            </tr>
          </thead>

          {/* Table Body - ✅ FIXED KEY PROP */}
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <BookTableRow
                key={book._id || book.id} // ✅ FIXED: Use _id from MongoDB
                book={book}
                onToggleAvailability={onToggleAvailability}
                onEdit={onEditBook}
                onDelete={onDeleteBook}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {books.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-sm">
            No books found matching your criteria
          </p>
        </div>
      )}
    </div>
  );
}

export default BookTable;
