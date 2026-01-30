import React from 'react';
import { BookOpen, Eye, EyeOff, Filter } from 'lucide-react';

/**
 * Book Statistics Cards
 * @param {array} books - All books array
 * @param {number} categoriesCount - Total categories count
 */
function BookStats({ books, categoriesCount }) {
  // Calculate stats
  const totalBooks = books.length;
  const availableBooks = books.filter(book => book.isAvailable).length;
  const unavailableBooks = books.filter(book => !book.isAvailable).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      
      {/* Total Books Card */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Books</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{totalBooks}</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-full">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </div>
        </div>
      </div>
      
      {/* Available Books Card */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Available</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {availableBooks}
            </p>
          </div>
          <div className="p-3 bg-green-50 rounded-full">
            <Eye className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>
      
      {/* Unavailable Books Card */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Unavailable</p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {unavailableBooks}
            </p>
          </div>
          <div className="p-3 bg-red-50 rounded-full">
            <EyeOff className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>
      
      {/* Categories Card */}
      <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500 font-medium">Categories</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{categoriesCount}</p>
          </div>
          <div className="p-3 bg-indigo-50 rounded-full">
            <Filter className="h-8 w-8 text-indigo-600" />
          </div>
        </div>
      </div>
      
    </div>
  );
}

export default BookStats;