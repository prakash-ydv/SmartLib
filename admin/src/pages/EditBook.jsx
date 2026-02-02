import React, { useState, useEffect } from 'react';
import BookForm from '../components/books/BookForm';

/**
 * ✏️ Edit Book - Real Backend Integration
 */
const EditBook = ({ isOpen, book, onClose, onBookUpdated }) => {
  
  // Form state - MATCHED TO BACKEND SCHEMA
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    author: '',
    department: '',
    isbn: '',
    publisher: '',
    edition: '',
    cover_url: '',
    copies: [],
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================
  // POPULATE FORM WHEN BOOK CHANGES
  // ==========================================
  useEffect(() => {
    if (book) {
      setFormData({
        _id: book._id || book.id, // Store ID for update
        title: book.title || '',
        description: book.description || '',
        author: book.author || '',
        department: book.department || '',
        isbn: book.isbn || '',
        publisher: book.publisher || '',
        edition: book.edition || '',
        cover_url: book.cover_url || '',
        copies: book.copies || [],
      });
    }
  }, [book]);

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      author: '',
      department: '',
      isbn: '',
      publisher: '',
      edition: '',
      cover_url: '',
      copies: [],
    });
    setError(null);
  };

  // Handle submit - REAL API CALL
  const handleSubmit = async () => {
    // Validation
    if (!formData.title || !formData.department) {
      setError('Title and Department are required!');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // 🚀 REAL API CALL through parent component
      if (onBookUpdated) {
        await onBookUpdated(formData);
      }

      alert('✅ Book updated successfully!');
      resetForm();
      onClose();
      
    } catch (err) {
      console.error('Update book error:', err);
      setError(err.message || 'Failed to update book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  // Don't render if not open or no book selected
  if (!isOpen || !book) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 mt-10 border-2 border-green-500">

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

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* Book Form */}
      <BookForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isSubmitting ? 'Updating Book...' : 'Update Book'}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default EditBook;