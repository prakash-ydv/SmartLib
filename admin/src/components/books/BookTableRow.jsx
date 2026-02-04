// 📁 Location: admin/src/components/books/BookTableRow.jsx
// ✅ Book Table Row Component - FIXED

import React from "react";
import { Edit2, Trash2, Eye, EyeOff } from "lucide-react";

/**
 * ✅ FIXED Book Table Row Component
 *
 * CHANGES:
 * - book.category → book.department (backend schema)
 * - book.id → book._id || book.id (MongoDB ID)
 * - Added book.views display
 * - Fixed all handlers to use correct ID
 */
function BookTableRow({ book, onToggleAvailability, onEdit, onDelete }) {
  // ✅ Get correct ID from backend
  const bookId = book._id || book.id;

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      {/* Book Cover */}
      <td className="px-4 py-4 whitespace-nowrap">
        <img
          src={book.cover_url || "https://placehold.co/400x600?text=No+Cover"}
          alt={book.title}
          className="w-12 h-16 object-cover rounded shadow-sm border shrink-0"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = "https://placehold.co/400x600?text=No+Cover";
          }}
        />
      </td>

      {/* Title & Publisher */}
      <td className="px-4 py-4 truncate">
        <div
          className="text-sm font-medium text-gray-900 truncate"
          title={book.title}
        >
          {book.title}
        </div>
        {book.publisher && (
          <div
            className="text-xs text-gray-500 mt-1 truncate"
            title={book.publisher}
          >
            {book.publisher}
          </div>
        )}
        {book.edition && (
          <div className="text-xs text-gray-400">Edition: {book.edition}</div>
        )}
      </td>

      {/* Author */}
      <td className="px-4 py-4 whitespace-nowrap truncate">
        <div className="text-sm text-gray-900 truncate" title={book.author}>
          {book.author || "N/A"}
        </div>
      </td>

      {/* ✅ FIXED: Department (not category) */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 rounded">
          {book.department || "N/A"}
        </span>
      </td>

      {/* ISBN */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 font-mono">
          {book.isbn || "N/A"}
        </div>
      </td>

      {/* ✅ ADDED: Views Count */}
      <td className="px-4 py-4 whitespace-nowrap">
        <div className="flex items-center text-sm text-gray-600">
          <Eye className="h-4 w-4 mr-1" />
          {book.views || 0}
        </div>
      </td>

      {/* Status Badge */}
      <td className="px-4 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
            book.isAvailable
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {book.isAvailable ? "Available" : "Unavailable"}
        </span>
      </td>

      {/* Action Buttons - ✅ FIXED: Use correct bookId */}
      <td className="pr-4 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">
          {/* Toggle Availability Button */}
          <button
            onClick={() => onToggleAvailability(bookId)} // ✅ FIXED
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            title={book.isAvailable ? "Mark Unavailable" : "Mark Available"}
          >
            {!book.isAvailable ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(book)} // Pass entire book object
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Edit Book"
          >
            <Edit2 className="h-4 w-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(bookId)} // ✅ FIXED
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            title="Delete Book"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default BookTableRow;
