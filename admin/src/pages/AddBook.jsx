import React, { useState } from 'react';
import BookForm from '../components/books/BookForm';

/**
 * ➕ Add Book - Inline Form (No Modal)
 * Opens directly on the same page
 */
const AddBook = ({ isOpen, onClose, onBookAdded, categories }) => {
  
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

  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      author: '',
      description: '',
      bookCover: '',
      isbn: '',
      publicationYear: new Date().getFullYear(),
      category: '',
      isAvailable: true,
    });
  };

  // Handle submit
  const handleSubmit = async () => {
    // Validation
    if (!formData.title || !formData.author || !formData.category) {
      alert('Please fill all required fields!');
      return;
    }

    setIsSubmitting(true);

    try {
      const newBook = {
        ...formData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };

      if (onBookAdded) {
        await onBookAdded(newBook);
      }

      alert('Book added successfully!');
      resetForm();
      onClose();
    } catch (error) {
      alert('Failed to add book: ' + error.message);
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

      {/* Book Form */}
      <BookForm
        formData={formData}
        setFormData={setFormData}
        categories={categories}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isSubmitting ? 'Adding...' : 'Add Book'}
        disabled={isSubmitting}
      />
    </div>
  );
};

export default AddBook;