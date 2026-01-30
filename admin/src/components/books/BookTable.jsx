// 📁 Location: admin/src/components/books/BookTable.jsx
// ✅ Books Data Table Component

import React from 'react';
import { BookOpen } from 'lucide-react';
import BookTableRow from './BookTableRow';

/**
 * Books Table Component
 * @param {array} books - Filtered books to display
 * @param {number} totalBooks - Total books count
 * @param {function} onToggleAvailability - Toggle book availability
 * @param {function} onEditBook - Edit book handler
 * @param {function} onDeleteBook - Delete book handler
 */
function BookTable({ 
  books, 
  totalBooks, 
  onToggleAvailability, 
  onEditBook, 
  onDeleteBook 
}) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      
      {/* Table Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Books Management ({books.length} of {totalBooks})
        </h2>
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          
          {/* Table Head */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cover
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ISBN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map((book) => (
              <BookTableRow
                key={book.id}
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