import React from 'react';

const LoadingSkeleton = ({ count = 12 }) => {
  return (
    <div className="books-grid">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="relative bg-white rounded-2xl overflow-hidden border-2 border-gray-100 shadow-md"
        >
          {/* Top Accent Bar - Animated */}
          <div className="h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 skeleton"></div>

          {/* Image Section */}
          <div className="relative h-56 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 skeleton overflow-hidden">
            {/* Animated Shimmer Overlay */}
            <div className="absolute inset-0 skeleton"></div>
            
            {/* Badge Placeholders */}
            <div className="absolute top-3 left-3 w-16 h-6 bg-gray-400/50 rounded-lg skeleton"></div>
            <div className="absolute top-3 right-3 w-20 h-6 bg-gray-400/50 rounded-lg skeleton"></div>
            
            {/* Book Icon Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gray-300/30 rounded-full skeleton"></div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5 space-y-4">
            {/* Title - Two Lines */}
            <div className="space-y-2.5">
              <div className="h-5 bg-gray-200 rounded-lg skeleton"></div>
              <div className="h-5 bg-gray-200 rounded-lg w-4/5 skeleton"></div>
            </div>

            {/* Author Line */}
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-200 rounded skeleton"></div>
              <div className="h-4 bg-gray-200 rounded w-3/5 skeleton"></div>
            </div>

            {/* Genre Badge & Date */}
            <div className="flex items-center gap-2">
              <div className="h-7 bg-gray-200 rounded-full w-24 skeleton"></div>
              <div className="h-4 bg-gray-200 rounded w-16 skeleton"></div>
            </div>

            {/* Divider */}
            <div className="border-t-2 border-gray-100"></div>

            {/* Footer - ISBN & Availability */}
            <div className="flex items-center justify-between gap-2">
              <div className="h-7 bg-gray-200 rounded w-24 skeleton"></div>
              <div className="h-8 bg-gray-200 rounded-lg w-28 skeleton"></div>
            </div>

            {/* Publisher Line */}
            <div className="h-3 bg-gray-200 rounded w-2/3 skeleton"></div>
          </div>

          {/* Shimmer Wave Effect */}
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none"></div>
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;