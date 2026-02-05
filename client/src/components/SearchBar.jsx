// ============================================
// 🔍 SEARCH BAR COMPONENT - MOBILE-FIRST
// Simple | Fast | Accessible
// ============================================

import React from 'react';
import { Search, X } from 'lucide-react';

const SearchBar = ({ searchTerm, setSearchTerm }) => {
  return (
    <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
      <div className="relative">
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl border-2 border-gray-200 focus-within:border-indigo-500 focus-within:bg-white focus-within:shadow-md transition-all">
          <Search 
            className="h-5 w-5 text-gray-400 ml-4 flex-shrink-0" 
            aria-hidden="true"
          />
          <input
            type="search"
            placeholder="Search by title, author, ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 px-2 py-3 md:py-4 text-sm md:text-base text-gray-800 placeholder-gray-400 bg-transparent outline-none font-medium"
            aria-label="Search books"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="min-h-[44px] min-w-[44px] flex items-center justify-center hover:bg-gray-100 rounded-lg transition-colors mr-1"
              aria-label="Clear search"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchBar;