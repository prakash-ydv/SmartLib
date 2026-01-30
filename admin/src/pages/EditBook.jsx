import React, { useState, useEffect } from 'react';
import BookForm from '../components/books/BookForm';

/**
 * ✏️ Edit Book - Inline Form (No Modal)
 * Opens directly on the same page
 */
const EditBook = ({ isOpen, book, onClose, onBookUpdated, categories }) => {
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    bookCover: '',
    isbn: '',
    publicationYear: new Date().getFullYear(),
    category: '',
    isAvailable: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Load book data
  useEffect(() => {
    if (isOpen && book) {
      setFormData({
        title: book.title || '',
        author: book.author || '',
        description: book.description || '',
        bookCover: book.bookCover || '',
        isbn: book.isbn || '',
        publicationYear: book.publicationYear || new Date().getFullYear(),
        category: book.category || '',
        isAvailable: book.isAvailable ?? true,
      });
      setError(null);
      setHasChanges(false);
    }
  }, [isOpen, book]);

  // Track changes
  useEffect(() => {
    if (book) {
      const changed = 
        formData.title !== (book.title || '') ||
        formData.author !== (book.author || '') ||
        formData.description !== (book.description || '') ||
        formData.bookCover !== (book.bookCover || '') ||
        formData.isbn !== (book.isbn || '') ||
        formData.publicationYear !== (book.publicationYear || new Date().getFullYear()) ||
        formData.category !== (book.category || '') ||
        formData.isAvailable !== (book.isAvailable ?? true);
      
      setHasChanges(changed);
    }
  }, [formData, book]);

  // Validate
  const validateForm = () => {
    if (!formData.title || !formData.title.trim()) {
      setError('Title is required');
      return false;
    }
    if (!formData.author || !formData.author.trim()) {
      setError('Author is required');
      return false;
    }
    if (!formData.category) {
      setError('Category is required');
      return false;
    }
    return true;
  };

  // Submit
  const handleSubmit = async () => {
    if (!hasChanges) {
      setError('No changes to save');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const updatedBook = {
        ...book,
        ...formData,
        updatedAt: new Date().toISOString(),
      };

      if (onBookUpdated) {
        await onBookUpdated(updatedBook);
      }

      alert('Book updated successfully!');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update book');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Cancel
  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('Discard changes?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  // Don't render if not open
  if (!isOpen || !book) return null;

  return (
     <div className="bg-white rounded-lg shadow-lg p-6 mb-6 mt-10 border-2 border-blue-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">✏️ Edit Book</h2>
        <button
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          disabled={isSubmitting}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Unsaved Changes Warning */}
      {hasChanges && !error && (
        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-700 font-medium">
            ⚠️ You have unsaved changes
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Book Form */}
      <BookForm
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isSubmitting ? 'Updating...' : 'Update Book'}
        disabled={isSubmitting || !hasChanges}
      />

      {/* Loading Overlay */}
      {isSubmitting && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent mb-2"></div>
            <p className="text-sm text-gray-600 font-medium">Updating book...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBook;