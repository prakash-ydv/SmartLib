import React, { useState } from 'react';
import BookForm from '../components/books/BookForm';
import { addBook } from '../api/axios'; // ← Real API import

/**
 * ➕ Add Book - Real Backend Integration
 */
const AddBook = ({ isOpen, onClose, onBookAdded }) => {
  
  // Form state - MATCHED TO BACKEND SCHEMA
  const [formData, setFormData] = useState({
    title: '',              // Required
    description: '',        // Optional
    author: '',            // Optional
    department: '',        // Required (enum)
    isbn: '',              // Optional (but unique if provided)
    publisher: '',         // Optional
    edition: '',           // Optional
    cover_url: '',         // Optional
    copies: [],            // Optional (array of strings)
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

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
      // Clean data - remove empty fields
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => {
          if (Array.isArray(v)) return v.length > 0;
          return v !== '' && v !== null && v !== undefined;
        })
      );

      // 🚀 REAL API CALL
      const response = await addBook(cleanData);

      // Notify parent component
      if (onBookAdded) {
        await onBookAdded(response.data || response);
      }

      alert('✅ Book added successfully!');
      resetForm();
      onClose();
      
    } catch (err) {
      console.error('Add book error:', err);
      setError(err.message || 'Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    resetForm();
    onClose();
  };

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 mt-10 border-2 border-blue-500">

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">➕ Add New Book</h2>
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
        submitLabel={isSubmitting ? 'Adding Book...' : 'Add Book'}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default AddBook;