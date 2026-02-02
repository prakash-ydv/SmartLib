import { useState, useEffect } from 'react';
import {
  searchBookByTitle,  // ✅ This was working
  addBook as apiAddBook,
  updateBook as apiUpdateBook
} from '../api/axios';

export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
  try {
    setLoading(true);
    setError(null);

    console.log('🔄 Loading books...'); // ← ADD THIS

    const response = await searchBookByTitle(' ');
    
    console.log('📦 API Response:', response); // ← ADD THIS
    console.log('📚 Books data:', response?.data); // ← ADD THIS

    if (response && response.data) {
      const sortedBooks = [...response.data].sort((a, b) => (b.views || 0) - (a.views || 0));
      console.log('✅ Sorted books:', sortedBooks); // ← ADD THIS
      setBooks(sortedBooks);
    } else {
      console.log('❌ No data in response'); // ← ADD THIS
      setBooks([]);
    }

    setLoading(false);
  } catch (err) {
    console.error('❌ Failed to load books:', err);
    setError(err.message || 'Failed to fetch books');
    setLoading(false);
    setBooks([]);
  }
};

  const addBook = async (bookData) => {
    try {
      const response = await apiAddBook(bookData);
      await loadBooks(); // ✅ This will refresh after add
      return { success: true, book: response.data || response };
    } catch (err) {
      console.error('Failed to add book:', err);
      return { success: false, error: err.message };
    }
  };

  const updateBook = async (updatedBookData) => {
    try {
      const bookId = updatedBookData._id || updatedBookData.id;

      if (!bookId) {
        throw new Error('Book ID is required for update');
      }

      const { _id, id, createdAt, updatedAt, views, isAvailable, __v, ...updateData } = updatedBookData;

      const response = await apiUpdateBook(bookId, updateData);
      await loadBooks(); // ✅ This will refresh after update

      return { success: true, book: response.data || response };
    } catch (err) {
      console.error('Failed to update book:', err);
      return { success: false, error: err.message };
    }
  };

  const deleteBook = async (bookId) => {
    setBooks(books.filter(book => (book._id || book.id) !== bookId));
    return { success: true };
  };

  const toggleAvailability = async (bookId) => {
    const updatedBooks = books.map(b =>
      (b._id || b.id) === bookId ? { ...b, isAvailable: !b.isAvailable } : b
    );
    setBooks(updatedBooks);
    return { success: true };
  };

  return {
    books,
    isLoading: loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    toggleAvailability,
    refreshBooks: loadBooks
  };
}