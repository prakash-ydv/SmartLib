import React, { useState } from 'react';
import { Filter, RotateCcw, ChevronDown, BookOpen, CheckCircle, TrendingUp } from 'lucide-react';

// ============================================
// 📦 FILTER DATA (ADD THIS)
// ============================================
const DEPARTMENTS = [
  { value: 'CS', label: 'Computer Science' },
  { value: 'IT', label: 'Information Technology' },
  { value: 'ECE', label: 'Electronics & Communication' },
  { value: 'EE', label: 'Electrical Engineering' },
  { value: 'MECH', label: 'Mechanical Engineering' },
  { value: 'CIVIL', label: 'Civil Engineering' },
  { value: 'CHEM', label: 'Chemical Engineering' },
  { value: 'MBA', label: 'Management (MBA)' },
  { value: 'BBA', label: 'Business Administration' },
  { value: 'BCOM', label: 'Commerce' },
  { value: 'PHYSICS', label: 'Physics' },
  { value: 'CHEMISTRY', label: 'Chemistry' },
  { value: 'MATHEMATICS', label: 'Mathematics' },
  { value: 'ENGLISH', label: 'English Literature' },
  { value: 'LAW', label: 'Law' },
  { value: 'MEDICAL', label: 'Medical Sciences' },
  { value: 'PHARMACY', label: 'Pharmacy' },
  { value: 'GENERAL', label: 'General & Reference' },
];

const YEARS = [
  { value: '1', label: '1st Year' },
  { value: '2', label: '2nd Year' },
  { value: '3', label: '3rd Year' },
  { value: '4', label: '4th Year' },
  { value: 'pg', label: 'Post-Graduation' },
  { value: 'phd', label: 'PhD / Research' },
];

const AVAILABILITY = [
  { value: 'all', label: 'All Books' },
  { value: 'available', label: 'Available Now' },
  { value: 'unavailable', label: 'Currently Issued' },
];

// ============================================
// 🎛️ FILTER PANEL COMPONENT
// ============================================
const FilterPanel = ({ 
  filters, 
  setFilters, 
  stats, 
  onReset 
}) => {
  // ... rest of your component code
  const [showFilters, setShowFilters] = useState(false);

  // Count active filters
  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="space-y-4">
      
      {/* Filter Toggle Button - Mobile */}
      <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-md border border-gray-200">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg hover:from-indigo-100 hover:to-purple-100 transition-all border border-indigo-200 font-semibold text-gray-700 min-h-[44px]"
        >
          <Filter className="h-4 w-4 text-indigo-600" aria-hidden="true" />
          <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full min-w-[20px]">
              {activeFiltersCount}
            </span>
          )}
        </button>

        {/* Quick Stats - Desktop Only */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen className="h-4 w-4 text-indigo-600" aria-hidden="true" />
            <span>Total: <strong className="text-gray-900">{stats.total.toLocaleString()}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
            <span>Available: <strong className="text-gray-900">{stats.available.toLocaleString()}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <TrendingUp className="h-4 w-4 text-purple-600" aria-hidden="true" />
            <span>Results: <strong className="text-gray-900">{stats.showing.toLocaleString()}</strong></span>
          </div>
        </div>
      </div>

      {/* Filters Section - Collapsible */}
      {showFilters && (
        <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 p-4 md:p-6">
          
          {/* Filter Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Department Filter */}
            <div className="space-y-2">
              <label 
                htmlFor="department-filter"
                className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wide"
              >
                <div className="w-1 h-4 bg-indigo-600 rounded-full" aria-hidden="true" />
                Department
              </label>
              <div className="relative">
                <select
                  id="department-filter"
                  value={filters.branch}
                  onChange={(e) => handleFilterChange('branch', e.target.value)}
                  className="w-full min-h-[44px] px-4 py-3 text-sm bg-white border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all cursor-pointer font-medium text-gray-800 appearance-none pr-10"
                >
                  <option value="all">All Departments</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.value} value={dept.value}>
                      {dept.label}
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" 
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Year Filter */}
            <div className="space-y-2">
              <label 
                htmlFor="year-filter"
                className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wide"
              >
                <div className="w-1 h-4 bg-purple-600 rounded-full" aria-hidden="true" />
                Year
              </label>
              <div className="relative">
                <select
                  id="year-filter"
                  value={filters.year}
                  onChange={(e) => handleFilterChange('year', e.target.value)}
                  className="w-full min-h-[44px] px-4 py-3 text-sm bg-white border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all cursor-pointer font-medium text-gray-800 appearance-none pr-10"
                >
                  <option value="all">All Years</option>
                  {YEARS.map((year) => (
                    <option key={year.value} value={year.value}>
                      {year.label}
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" 
                  aria-hidden="true"
                />
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2">
              <label 
                htmlFor="availability-filter"
                className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wide"
              >
                <div className="w-1 h-4 bg-green-600 rounded-full" aria-hidden="true" />
                Availability
              </label>
              <div className="relative">
                <select
                  id="availability-filter"
                  value={filters.availability}
                  onChange={(e) => handleFilterChange('availability', e.target.value)}
                  className="w-full min-h-[44px] px-4 py-3 text-sm bg-white border-2 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all cursor-pointer font-medium text-gray-800 appearance-none pr-10"
                >
                  {AVAILABILITY.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown 
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" 
                  aria-hidden="true"
                />
              </div>
            </div>
          </div>

          {/* Reset Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              className="mt-6 w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-red-300 hover:border-red-500 hover:bg-red-50 text-red-600 hover:text-red-700 font-bold rounded-lg transition-all shadow-sm hover:shadow-md min-h-[44px]"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset All Filters ({activeFiltersCount})
            </button>
          )}
        </div>
      )}

      {/* Stats Cards - Mobile Only */}
      <div className="md:hidden grid grid-cols-3 gap-3">
        
        {/* Total */}
        <div className="bg-white rounded-lg p-3 shadow-md border border-gray-200 text-center">
          <BookOpen className="h-5 w-5 text-indigo-600 mx-auto mb-1" aria-hidden="true" />
          <p className="text-xs text-gray-600 font-medium mb-0.5">Total</p>
          <p className="text-lg font-bold text-gray-900">{stats.total}</p>
        </div>

        {/* Available */}
        <div className="bg-white rounded-lg p-3 shadow-md border border-gray-200 text-center">
          <CheckCircle className="h-5 w-5 text-green-600 mx-auto mb-1" aria-hidden="true" />
          <p className="text-xs text-gray-600 font-medium mb-0.5">Available</p>
          <p className="text-lg font-bold text-gray-900">{stats.available}</p>
        </div>

        {/* Results */}
        <div className="bg-white rounded-lg p-3 shadow-md border border-gray-200 text-center">
          <TrendingUp className="h-5 w-5 text-purple-600 mx-auto mb-1" aria-hidden="true" />
          <p className="text-xs text-gray-600 font-medium mb-0.5">Results</p>
          <p className="text-lg font-bold text-gray-900">{stats.showing}</p>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;