import React from 'react';

const LoadingSkeleton = ({ count = 12 }) => {
  return (
    <div className="books-grid">
      {[...Array(count)].map((_, index) => (
        <div
          key={index}
          className="relative bg-white rounded-xl md:rounded-2xl overflow-hidden border border-gray-200 shadow-sm animate-pulse"
        >
          {/* Top Accent Bar */}
          <div className="h-1 md:h-2 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />

          {/* Image Section - Responsive Height */}
          <div className="relative h-48 sm:h-52 md:h-56 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-200 overflow-hidden">
            
            {/* Badge Placeholders */}
            <div className="absolute top-2 md:top-3 left-2 md:left-3 w-14 md:w-16 h-5 md:h-6 bg-gray-400/50 rounded-md md:rounded-lg" />
            <div className="absolute top-2 md:top-3 right-2 md:right-3 w-16 md:w-20 h-5 md:h-6 bg-gray-400/50 rounded-md md:rounded-lg" />
            
            {/* Book Icon Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-300/30 rounded-full" />
            </div>
          </div>

          {/* Content Section - Responsive Padding */}
          <div className="p-3 md:p-4 lg:p-5 space-y-3 md:space-y-4">
            
            {/* Title - Two Lines */}
            <div className="space-y-2 md:space-y-2.5">
              <div className="h-4 md:h-5 bg-gray-200 rounded-lg" />
              <div className="h-4 md:h-5 bg-gray-200 rounded-lg w-4/5" />
            </div>

            {/* Author Line */}
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 md:w-4 md:h-4 bg-gray-200 rounded" />
              <div className="h-3 md:h-4 bg-gray-200 rounded w-3/5" />
            </div>

            {/* Genre Badge */}
            <div className="h-6 md:h-7 bg-gray-200 rounded-full w-20 md:w-24" />

            {/* Divider */}
            <div className="border-t border-gray-100 md:border-t-2" />

            {/* Footer Lines */}
            <div className="space-y-1.5 md:space-y-2">
              <div className="h-3 bg-gray-200 rounded w-2/3" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>

            {/* Button */}
            <div className="h-11 md:h-12 bg-gray-200 rounded-lg md:rounded-xl" />
          </div>

          {/* Shimmer Wave Effect */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

export default LoadingSkeleton;