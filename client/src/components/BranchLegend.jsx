// src/components/BranchLegend.jsx - FULLY FIXED
import React from 'react';

const BranchLegend = () => {
  const branches = [
    { 
      id: 'cs', 
      name: 'Computer Science', 
      color: '#3b82f6',
      gradient: 'from-blue-500 to-cyan-500'
    },
    { 
      id: 'mech', 
      name: 'Mechanical Engineering', 
      color: '#ef4444',
      gradient: 'from-red-500 to-orange-500'
    },
    { 
      id: 'civil', 
      name: 'Civil Engineering', 
      color: '#f59e0b',
      gradient: 'from-yellow-500 to-amber-500'
    },
    { 
      id: 'ece', 
      name: 'Electronics & Communication', 
      color: '#a855f7',
      gradient: 'from-purple-500 to-pink-500'
    },
    { 
      id: 'biotech', 
      name: 'Biotechnology', 
      color: '#10b981',
      gradient: 'from-green-500 to-emerald-500'
    },
    { 
      id: 'general', 
      name: 'General', 
      color: '#6b7280',
      gradient: 'from-gray-500 to-slate-500'
    }
  ];

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
        Branch Categories
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
        {branches.map((branch) => (
          <div 
            key={branch.id}
            className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg hover:bg-gray-50 transition-all duration-200 group cursor-pointer"
          >
            <div 
              className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-gradient-to-r ${branch.gradient} shadow-lg group-hover:scale-110 transition-transform duration-200 flex-shrink-0`}
            />
            <span className="text-xs sm:text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors">
              {branch.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BranchLegend;