// ============================================
// 📄 PAGINATION COMPONENT - SIMPLIFIED
// Mobile-First | Clean | Accessible
// ============================================

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

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

  return (
    <div className="mt-8 space-y-4">
      
      {/* Main Pagination Card */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Gradient Top Border */}
        <div className="h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600" aria-hidden="true" />
        
        <div className="p-4 md:p-6">
          
          {/* Mobile Layout */}
          <div className="flex flex-col gap-4 md:hidden">
            
            {/* Items Info */}
            <div className="flex items-center justify-center gap-2 text-xs text-gray-600 bg-gray-50 px-4 py-2.5 rounded-lg">
              <span className="font-bold text-indigo-600">{startItem}-{endItem}</span>
              <span>of</span>
              <span className="font-bold text-gray-900">{totalItems.toLocaleString()}</span>
            </div>
            
            {/* Pagination Controls */}
            <div className="flex items-center justify-between gap-2">
              
              {/* First + Previous */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(1)}
                  disabled={currentPage === 1}
                  className="min-h-[44px] min-w-[44px] p-3 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-ring"
                  aria-label="Go to first page"
                >
                  <ChevronsLeft className="h-5 w-5 text-gray-600" aria-hidden="true" />
                </button>

                <button
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="min-h-[44px] min-w-[44px] p-3 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-ring"
                  aria-label="Go to previous page"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" aria-hidden="true" />
                </button>
              </div>

              {/* Current Page Indicator */}
              <div className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold shadow-lg">
                <span className="text-sm">{currentPage}</span>
                <span className="text-indigo-200 mx-1">/</span>
                <span className="text-sm">{totalPages}</span>
              </div>

              {/* Next + Last */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="min-h-[44px] min-w-[44px] p-3 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-ring"
                  aria-label="Go to next page"
                >
                  <ChevronRight className="h-5 w-5 text-gray-600" aria-hidden="true" />
                </button>

                <button
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="min-h-[44px] min-w-[44px] p-3 rounded-lg border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-ring"
                  aria-label="Go to last page"
                >
                  <ChevronsRight className="h-5 w-5 text-gray-600" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Items Per Page */}
            <div className="flex items-center justify-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-3 rounded-lg border border-indigo-100">
              <label htmlFor="itemsPerPage-mobile" className="text-sm font-semibold text-gray-700">
                Per page:
              </label>
              <select
                id="itemsPerPage-mobile"
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="min-h-[44px] px-4 py-2 bg-white border-2 border-indigo-200 rounded-lg text-sm font-bold text-indigo-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all cursor-pointer"
              >
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
                <option value={96}>96</option>
              </select>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex items-center justify-between gap-6">
            
            {/* Items Info & Per Page */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-200">
                <span className="text-gray-500">Showing</span>
                <span className="font-bold text-indigo-600">{startItem}</span>
                <span className="text-gray-500">to</span>
                <span className="font-bold text-indigo-600">{endItem}</span>
                <span className="text-gray-500">of</span>
                <span className="font-bold text-gray-900">{totalItems.toLocaleString()}</span>
              </div>
              
              <div className="flex items-center gap-3 bg-gradient-to-r from-indigo-50 to-purple-50 px-4 py-2.5 rounded-xl border border-indigo-100">
                <label htmlFor="itemsPerPage-desktop" className="text-sm font-semibold text-gray-700">
                  Per page:
                </label>
                <select
                  id="itemsPerPage-desktop"
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
                className="p-2.5 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-ring"
                aria-label="Go to first page"
              >
                <ChevronsLeft className="h-5 w-5 text-gray-600" aria-hidden="true" />
              </button>

              {/* Previous Page */}
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2.5 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-ring"
                aria-label="Go to previous page"
              >
                <ChevronLeft className="h-5 w-5 text-gray-600" aria-hidden="true" />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1.5">
                {getPageNumbers().map((page, index) => (
                  page === '...' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-400 font-bold">
                      •••
                    </span>
                  ) : (
                    <button
                      key={page}
                      onClick={() => onPageChange(page)}
                      className={`min-w-[44px] px-4 py-2.5 rounded-xl font-bold transition-all duration-200 focus-ring ${
                        currentPage === page
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg transform scale-105'
                          : 'border-2 border-gray-200 text-gray-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-600'
                      }`}
                      aria-label={`Go to page ${page}`}
                      aria-current={currentPage === page ? 'page' : undefined}
                    >
                      {page}
                    </button>
                  )
                ))}
              </div>

              {/* Next Page */}
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-ring"
                aria-label="Go to next page"
              >
                <ChevronRight className="h-5 w-5 text-gray-600" aria-hidden="true" />
              </button>

              {/* Last Page */}
              <button
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2.5 rounded-xl border-2 border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all focus-ring"
                aria-label="Go to last page"
              >
                <ChevronsRight className="h-5 w-5 text-gray-600" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pagination;