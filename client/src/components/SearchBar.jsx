// ============================================
// 🔍 SEARCH BAR — SMARTLIB
// Debounced - Recent Searches - Mobile-First
// ============================================

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, X, Clock, TrendingUp, Sparkles } from "lucide-react";

const RECENT_KEY  = "smartlib_recent_searches";
const MAX_RECENT  = 6;
const DEBOUNCE_MS = 350;

// ── Helpers ───────────────────────────────────────────────────────────────────
const getRecentSearches = () => {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || "[]");
  } catch {
    return [];
  }
};

const saveRecentSearch = (term) => {
  if (!term.trim()) return;
  const existing = getRecentSearches().filter(
    (s) => s.toLowerCase() !== term.toLowerCase()
  );
  localStorage.setItem(
    RECENT_KEY,
    JSON.stringify([term.trim(), ...existing].slice(0, MAX_RECENT))
  );
};

const clearRecentSearches = () => localStorage.removeItem(RECENT_KEY);

// ── Popular Suggestions ───────────────────────────────────────────────────────
// Faculty-aware — covers multiple departments
const SUGGESTIONS = [
  "Data Structures",
  "R.S. Aggarwal",
  "Computer Networks",
  "Engineering Physics",
  "Business Management",
  "Organic Chemistry",
  "GATE 2025",
  "Aptitude",
];

// ─── SEARCH BAR ───────────────────────────────────────────────────────────────
const SearchBar = ({ searchQuery, setSearchQuery }) => {
  const [inputValue, setInputValue]         = useState(searchQuery || "");
  const [focused, setFocused]               = useState(false);
  const [recentSearches, setRecentSearches] = useState(getRecentSearches);

  const debounceRef  = useRef(null);
  const inputRef     = useRef(null);
  const containerRef = useRef(null);

  // Sync external searchQuery → local input (e.g. hero search or reset)
  useEffect(() => {
    if (searchQuery !== inputValue) setInputValue(searchQuery || "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => () => clearTimeout(debounceRef.current), []);

  // Debounced search trigger
  const triggerSearch = useCallback(
    (value) => {
      clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => setSearchQuery(value), DEBOUNCE_MS);
    },
    [setSearchQuery]
  );

  const handleChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    triggerSearch(val);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && inputValue.trim()) {
      clearTimeout(debounceRef.current);
      setSearchQuery(inputValue.trim());
      saveRecentSearch(inputValue.trim());
      setRecentSearches(getRecentSearches());
      setFocused(false);
      inputRef.current?.blur();
    }
    if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const handleClear = () => {
    setInputValue("");
    setSearchQuery("");
    clearTimeout(debounceRef.current);
    inputRef.current?.focus();
  };

  const handleSelect = (term) => {
    setInputValue(term);
    setSearchQuery(term);
    saveRecentSearch(term);
    setRecentSearches(getRecentSearches());
    setFocused(false);
    inputRef.current?.blur();
  };

  const handleClearRecent = (e) => {
    e.stopPropagation();
    clearRecentSearches();
    setRecentSearches([]);
  };

  const showDropdown = focused && inputValue.trim() === "";
  const hasRecent    = recentSearches.length > 0;

  return (
    <div ref={containerRef} className="relative">

      {/* ── Input ──────────────────────────────────────────────────── */}
      <div
        className={`flex items-center gap-3 bg-white rounded-2xl border-2 transition-all duration-200 shadow-sm ${
          focused
            ? "border-indigo-500 shadow-lg shadow-indigo-100"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        {/* Search Icon */}
        <div className="pl-4 shrink-0">
          <Search
            className={`h-5 w-5 transition-colors duration-200 ${
              focused ? "text-indigo-500" : "text-gray-400"
            }`}
          />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="search"
          value={inputValue}
          onChange={handleChange}
          onFocus={() => setFocused(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search by title, author, ISBN, subject, tags..."
          className="flex-1 py-3.5 md:py-4 text-sm md:text-base text-gray-900 placeholder-gray-400 bg-transparent outline-none font-medium"
          aria-label="Search books"
          autoComplete="off"
          spellCheck="false"
        />

        {/* Clear Button */}
        {inputValue && (
          <button
            type="button"
            onClick={handleClear}
            className="mr-2 p-2 rounded-xl hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* ── Dropdown ───────────────────────────────────────────────── */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-30 animate-in slide-in-from-top">

          {/* Recent Searches */}
          {hasRecent && (
            <div className="p-3 border-b border-gray-50">
              <div className="flex items-center justify-between mb-2 px-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  Recent Searches
                </p>
                <button
                  onClick={handleClearRecent}
                  className="text-[10px] text-gray-400 hover:text-red-500 font-semibold transition-colors"
                >
                  Clear all
                </button>
              </div>
              <ul>
                {recentSearches.map((term, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => handleSelect(term)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                    >
                      <Clock className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                      <span className="text-sm text-gray-700 font-medium truncate">{term}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Popular Suggestions */}
          <div className="p-3">
            <div className="flex items-center gap-1.5 mb-2 px-1">
              <Sparkles className="h-3 w-3 text-indigo-400" />
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Popular Searches
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSelect(s)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-indigo-50 hover:text-indigo-700 border border-gray-200 hover:border-indigo-200 rounded-full text-xs font-semibold text-gray-600 transition-all duration-150"
                >
                  <TrendingUp className="h-3 w-3" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;