
import React from 'react';
import { Edit2, Trash2, Eye, EyeOff } from 'lucide-react';

/**
 * Book Table Row Component
 * @param {object} book - Book data
 * @param {function} onToggleAvailability - Toggle availability handler
 * @param {function} onEdit - Edit handler
 * @param {function} onDelete - Delete handler
 */
function BookTableRow({ book, onToggleAvailability, onEdit, onDelete }) {
  return (
    <tr className="hover:bg-gray-50 transition-colors">

      {/* Book Cover */}
      <td className="px-6 py-4 whitespace-nowrap">
        {/* इस इमेज टैग को अपने पुराने इमेज टैग की जगह लगाएं */}
        <img
          src={book.cover_url ? book.cover_url : "https://placehold.co/400x600?text=No+Cover"}
          alt={book.title}
          className="w-12 h-16 object-cover rounded shadow-sm border"
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = "https://placehold.co/400x600?text=No+Cover";
          }}
        />
      </td>

      {/* Title & Year */}
      <td className="px-6 py-4">
        <div className="text-sm font-medium text-gray-900">{book.title}</div>
        <div className="text-xs text-gray-500 mt-1">{book.publicationYear}</div>
      </td>

      {/* Author */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-900">{book.author}</div>
      </td>

      {/* Category */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500">{book.category}</div>
      </td>

      {/* ISBN */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="text-sm text-gray-500 font-mono">{book.isbn}</div>
      </td>

      {/* Status Badge */}
      <td className="px-6 py-4 whitespace-nowrap">
        <span
          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${book.isAvailable
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
            }`}
        >
          {book.isAvailable ? 'Available' : 'Unavailable'}
        </span>
      </td>

      {/* Action Buttons */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center space-x-2">

          {/* Toggle Availability Button */}
          <button
            onClick={() => onToggleAvailability(book)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
            title={book.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
          >
            {book.isAvailable ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>

          {/* Edit Button */}
          <button
            onClick={() => onEdit(book)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
            title="Edit Book"
          >
            <Edit2 className="h-4 w-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={() => onDelete(book.id)}
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