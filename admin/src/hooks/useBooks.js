import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  getAllBooks,
  addBook as apiAddBook,
  updateBook as apiUpdateBook,
  deleteBook as apiDeleteBook,
  toggleBookAvailability as apiToggleAvailability,
  getDashboardStats
} from '../api/axios';

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({ totalBooks: 0, availableBooks: 0, unavailableBooks: 0 });

  // Pagination State
  const [searchParams, setSearchParams] = useSearchParams();

  // Pagination State - Derived from URL
  const page = parseInt(searchParams.get("page") || "1", 10);

  // const [page, setPage] = useState(1); // REMOVED local state
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10; // Fixed limit as per requirement

  const loadBooks = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true); // only show loading spinner if not silent
      setError(null);

      console.log(`🔄 Loading books (Page ${page}) ${silent ? '(Silent)' : ''}...`);

      const [booksResponse, statsResponse] = await Promise.all([
        getAllBooks(page, limit),
        getDashboardStats()
      ]);

      console.log('📦 API Response:', booksResponse);

      // Handle Stats
      if (statsResponse?.status === 'success') {
        setStats(statsResponse.data);
      }

      if (booksResponse?.status === 'success') {
        let fetchedBooks = booksResponse.data || [];

        // Handle pagination metadata
        if (booksResponse.pagination) {
          setTotalPages(booksResponse.pagination.totalPages);
          setTotalItems(booksResponse.pagination.totalItems);
        }

        console.log('✅ Loaded', fetchedBooks.length, 'books');
        setBooks(fetchedBooks);
      } else {
        console.warn('⚠️ No books found');
        setBooks([]);
      }

      setLoading(false);

    } catch (err) {
      console.error('❌ Failed to load books:', err);
      setError(err.message || 'Failed to fetch books');
      setLoading(false);
      setBooks([]);
    }
  }, [refreshTrigger, page]); // Reload when refresh or page changes

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setSearchParams({ page: newPage.toString() });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const addBook = async (bookData) => {
    try {
      console.log('➕ Adding book...', bookData);

      const response = await apiAddBook(bookData);

      console.log('✅ Book added successfully:', response);

      // Force refresh to show new book immediately
      setRefreshTrigger(prev => prev + 1);

      return {
        success: true,
        book: response.data || response,
        message: 'Book added successfully! 🎉'
      };

    } catch (err) {
      console.error('❌ Failed to add book:', err);

      return {
        success: false,
        error: err.message || 'Failed to add book'
      };
    }
  };

  const updateBook = async (updatedBookData) => {
    try {
      const bookId = updatedBookData._id || updatedBookData.id;

      if (!bookId) {
        throw new Error('Book ID required');
      }

      console.log('✏️ Updating book:', bookId);

      const { _id, id, createdAt, updatedAt, views, isAvailable, __v, ...updateData } = updatedBookData;

      const response = await apiUpdateBook(bookId, updateData);

      console.log('✅ Book updated:', response);

      setRefreshTrigger(prev => prev + 1);

      return {
        success: true,
        book: response.data || response,
        message: 'Book updated successfully! ✏️'
      };

    } catch (err) {
      console.error('❌ Failed to update book:', err);

      return {
        success: false,
        error: err.message || 'Failed to update book'
      };
    }
  };

  const deleteBook = async (bookId) => {
    try {
      console.log('🗑️ Deleting book:', bookId);

      // Optimistic update
      setBooks(prevBooks => prevBooks.filter(book =>
        (book._id || book.id) !== bookId
      ));

      const response = await apiDeleteBook(bookId);

      console.log('✅ Book deleted:', response);

      // Trigger silent server refresh to get fresh data without UI flicker
      loadBooks(true);

      return {
        success: true,
        message: 'Book deleted successfully! 🗑️'
      };

    } catch (err) {
      console.error('❌ Failed to delete book:', err);

      // Rollback on error
      setRefreshTrigger(prev => prev + 1);

      return {
        success: false,
        error: err.message || 'Failed to delete book'
      };
    }
  };

  const toggleAvailability = async (bookId) => {
    try {
      console.log('🔄 Toggling availability:', bookId);

      // Optimistic update
      setBooks(prevBooks =>
        prevBooks.map(book =>
          (book._id || book.id) === bookId
            ? { ...book, isAvailable: !book.isAvailable }
            : book
        )
      );

      const response = await apiToggleAvailability(bookId);

      console.log('✅ Availability toggled:', response);

      return {
        success: true,
        message: 'Availability updated! 🔄'
      };

    } catch (err) {
      console.error('❌ Failed to toggle availability:', err);

      // Rollback on error
      setRefreshTrigger(prev => prev + 1);

      return {
        success: false,
        error: err.message || 'Failed to update availability'
      };
    }
  };

  const refreshBooks = useCallback(() => {
    console.log('🔄 Manual refresh triggered');
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return {
    books,
    stats,
    isLoading: loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    toggleAvailability,
    refreshBooks,
    // Pagination
    page,
    totalPages,
    totalItems,
    changePage
  };
}