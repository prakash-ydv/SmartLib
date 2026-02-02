import { useState, useMemo } from 'react';

/**
 * Custom Hook for Book Search & Filter
 * Updated to work with real backend schema
 * @param {array} books - All books array
 * @returns {object} - Filtered books and filter controls
 */
function useBookFilters(books) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // ============================================
  // FILTERED BOOKS (Memoized)
  // ============================================
  const filteredBooks = useMemo(() => {
    let result = [...books];

    // Search Filter (updated for backend schema)
    if (searchQuery.trim()) {
      const search = searchQuery.toLowerCase();
      result = result.filter(
        (book) =>
          book.title?.toLowerCase().includes(search) ||
          book.author?.toLowerCase().includes(search) ||
          book.isbn?.toLowerCase().includes(search) ||
          book.publisher?.toLowerCase().includes(search) ||
          book.description?.toLowerCase().includes(search)
      );
    }

    // Department Filter (was category, now department)
    if (selectedCategory !== 'all') {
      result = result.filter((book) => book.department === selectedCategory);
    }

    return result;
  }, [books, searchQuery, selectedCategory]);

  // ============================================
  // RESET FILTERS
  // ============================================
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
  };

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredBooks,
    resetFilters,
  };
}

export default useBookFilters;