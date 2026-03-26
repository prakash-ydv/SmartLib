// ============================================================
// 🔍 ADMIN SEARCH BAR — IES SMARTLIB
// Mobile-First | Active Filter Chips | Dark Navy
// File: src/components/common/SearchBar.jsx
// ============================================================

import React, { useState, useRef, useEffect } from "react";
import {
  Search, X, ChevronDown, SlidersHorizontal, RotateCcw,
} from "lucide-react";

// ── Filter options ───────────────────────────────────────────
const AVAILABILITY_OPTIONS = [
  { value: "all",         label: "All Books" },
  { value: "available",   label: "Available Only" },
  { value: "unavailable", label: "Unavailable Only" },
];

const IMAGE_OPTIONS = [
  { value: "all",      label: "All Books" },
  { value: "no-image", label: "No Cover Image" },
];

const SORT_OPTIONS = [
  { value: "default",     label: "Default Order" },
  { value: "most-viewed", label: "Most Viewed" },
];

// ── Custom select ────────────────────────────────────────────
const FilterSelect = ({ id, label, value, onChange, options }) => (
  <div className="flex flex-col gap-1.5 flex-1 min-w-[140px]">
    <label htmlFor={id} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-[44px] pl-3 pr-8 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#0f172a] focus:outline-none appearance-none cursor-pointer transition-colors hover:border-gray-300"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
);

// ============================================================
// 🔍 ADMIN SEARCH BAR
// ============================================================
function SearchBar({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories = [],
  filters,
  updateFilter,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const inputRef = useRef(null);

  // Count active filters
  const activeCount = [
    filters?.availability !== "all" && filters?.availability,
    filters?.image !== "all" && filters?.image,
    filters?.sort !== "default" && filters?.sort,
    selectedCategory !== "all" && selectedCategory,
  ].filter(Boolean).length;

  const handleReset = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    updateFilter("availability", "all");
    updateFilter("image", "all");
    updateFilter("sort", "default");
    inputRef.current?.focus();
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      {/* Top accent */}
      <div className="h-[3px]" style={{ background: "linear-gradient(90deg,#0f172a,#4f46e5,#7c3aed)" }} aria-hidden="true" />

      <div className="p-4 md:p-5">

        {/* ── Search input + filter toggle ─────────────── */}
        <div className="flex gap-3 mb-0">

          {/* Search input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" aria-hidden="true" />
            <input
              ref={inputRef}
              type="search"
              placeholder="Search by title, author, ISBN…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full min-h-[44px] pl-10 pr-10 py-2.5 text-sm font-medium text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#0f172a] focus:bg-white focus:outline-none transition-all placeholder-gray-400"
              aria-label="Search books"
              autoComplete="off"
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(""); inputRef.current?.focus(); }}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-gray-200 transition-colors"
                aria-label="Clear search"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>

          {/* Filter toggle */}
          <button
            onClick={() => setShowFilters((v) => !v)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-sm font-bold transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a] ${
              showFilters || activeCount > 0
                ? "bg-[#0f172a] border-[#0f172a] text-white"
                : "bg-gray-50 border-gray-200 text-gray-700 hover:border-gray-300"
            }`}
            aria-expanded={showFilters}
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Filters</span>
            {activeCount > 0 && (
              <span className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-white text-[#0f172a] text-[10px] font-black">
                {activeCount}
              </span>
            )}
          </button>

          {/* Reset — only when active */}
          {(activeCount > 0 || searchQuery) && (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-sm font-semibold transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
              aria-label="Reset all filters"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>

        {/* ── Active filter chips ───────────────────────── */}
        {activeCount > 0 && (
          <div className="flex flex-wrap gap-2 mt-3" aria-label="Active filters">
            {selectedCategory !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0f172a] text-white text-xs font-semibold rounded-full">
                Dept: {selectedCategory}
                <button onClick={() => setSelectedCategory("all")} className="hover:opacity-70" aria-label="Remove department filter">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters?.availability !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-xs font-semibold rounded-full">
                {AVAILABILITY_OPTIONS.find(o => o.value === filters.availability)?.label}
                <button onClick={() => updateFilter("availability", "all")} className="hover:opacity-70" aria-label="Remove availability filter">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters?.image !== "all" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 text-white text-xs font-semibold rounded-full">
                {IMAGE_OPTIONS.find(o => o.value === filters.image)?.label}
                <button onClick={() => updateFilter("image", "all")} className="hover:opacity-70" aria-label="Remove image filter">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
            {filters?.sort !== "default" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 text-white text-xs font-semibold rounded-full">
                {SORT_OPTIONS.find(o => o.value === filters.sort)?.label}
                <button onClick={() => updateFilter("sort", "default")} className="hover:opacity-70" aria-label="Remove sort filter">
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}
          </div>
        )}

        {/* ── Filter panel ──────────────────────────────── */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

              {/* Department */}
              <div className="flex flex-col gap-1.5 flex-1">
                <label htmlFor="dept-filter" className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
                  Department
                </label>
                <div className="relative">
                  <select
                    id="dept-filter"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full min-h-[44px] pl-3 pr-8 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#0f172a] focus:outline-none appearance-none cursor-pointer transition-colors"
                  >
                    <option value="all">All Departments</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                </div>
              </div>

              {/* Availability */}
              <FilterSelect
                id="avail-filter"
                label="Availability"
                value={filters?.availability || "all"}
                onChange={(v) => updateFilter("availability", v)}
                options={AVAILABILITY_OPTIONS}
              />

              {/* Cover image */}
              <FilterSelect
                id="img-filter"
                label="Cover Image"
                value={filters?.image || "all"}
                onChange={(v) => updateFilter("image", v)}
                options={IMAGE_OPTIONS}
              />

              {/* Sort */}
              <FilterSelect
                id="sort-filter"
                label="Sort By"
                value={filters?.sort || "default"}
                onChange={(v) => updateFilter("sort", v)}
                options={SORT_OPTIONS}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchBar;