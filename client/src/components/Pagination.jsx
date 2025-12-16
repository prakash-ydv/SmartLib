import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Info } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  itemsPerPage, 
  totalItems,
  onItemsPerPageChange 
}) => {
  
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        pages.push(currentPage - 1);
        pages.push(currentPage);
        pages.push(currentPage + 1);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  const progressPercentage = ((currentPage / totalPages) * 100).toFixed(1);

  return (
    <div className="mt-8 space-y-4">
      {/* Progress Bar */}
      <div className="bg-white rounded-xl shadow-md border-2 border-gray-100 p-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-indigo-600" />
            <span className="text-sm font-semibold text-gray-700">
              Browsing Progress
            </span>
          </div>
          <span className="text-sm font-bold text-indigo-600">
            {progressPercentage}%
          </span>
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Main Pagination Card */}
      <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 overflow-hidden">
        
        {/* Gradient Top Border */}
        <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600"></div>
        
        <div className="p-4 sm:p-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Items Info & Per Page Selector */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2.5 rounded-xl border-2 border-gray-100">
                <span className="text-gray-500">Showing</span>
                <span className="font-bold text-indigo-600">{startItem}</span>
                <span className="text-gray-500">to</span>
                <span className="font-bold text-indigo-600">{endItem}</span>
                <span className="text-gray-500">of</span>
                <span className="font-bold text-gray-900">{totalItems.toLocaleString()}</span>
                <span className="text-gray-500">books</span>
              </div>
              
              <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2.5 rounded-xl border-2 border-indigo-100">
                <label htmlFor="itemsPerPage" className="text-sm font-semibold text-gray-700 whitespace-nowrap">
                  Items per page:
                </label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                  className="px-3 py-1.5 bg-white border-2 border-indigo-200 rounded-lg text-sm font-bold text-indigo-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all cursor-pointer"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                  <option value={96}>96</option>
                </select>
              </div>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              
              {/* First Page */}
              <button
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent transition-all group"
                title="First page"
                aria-label="Go to first page"
              >
                <ChevronsLeft className="h-5 w-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent transition-all group"
                title="Previous page"
                aria-label="Go to previous page"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
              </button>

              {/* Page Numbers - Desktop */}
              <div className="hidden sm:flex items-center gap-1.5">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400 font-bold">
                      •••
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`min-w-[44px] px-4 py-2.5 rounded-xl font-bold transition-all duration-200 ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200 transform scale-105 border-2 border-indigo-600'
                          : 'border-2 border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600 hover:scale-105'
                      }`}
                      aria-label={`Go to page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              {/* Mobile Current Page Indicator */}
              <div className="sm:hidden flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold shadow-lg">
                <span>{currentPage}</span>
                <span className="text-indigo-200">/</span>
                <span>{totalPages}</span>
              </div>

              {/* Next Page */}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent transition-all group"
                title="Next page"
                aria-label="Go to next page"
              >
                <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:border-gray-200 disabled:hover:bg-transparent transition-all group"
                title="Last page"
                aria-label="Go to last page"
              >
                <ChevronsRight className="h-5 w-5 text-gray-600 group-hover:text-indigo-600 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Jump (Optional - Advanced Feature) */}
      <div className="hidden lg:flex items-center justify-center gap-3 text-sm text-gray-600">
        <span>Quick jump:</span>
        <div className="flex items-center gap-2">
          {[1, Math.floor(totalPages / 4), Math.floor(totalPages / 2), Math.floor(3 * totalPages / 4), totalPages].map((page, idx) => (
            page > 0 && page <= totalPages && (
              <button
                key={idx}
                onClick={() => onPageChange(page)}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  currentPage === page
                    ? 'bg-indigo-100 text-indigo-600 border-2 border-indigo-300'
                    : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                }`}
              >
                {page === 1 ? 'Start' : page === totalPages ? 'End' : page}
              </button>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pagination;