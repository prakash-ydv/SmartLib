import React, { useState } from 'react';
import BookForm from '../components/books/BookForm';
import { uploadBulkBooks } from '../api/axios';

const AddBook = ({ isOpen, onClose, onBookAdded, onBulkUploaded }) => {
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

  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

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
    setSelectedFile(null);
    setUploadResult(null);
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.department) {
      setError('Title and Department are required!');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const cleanData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => {
          if (Array.isArray(v)) return v.length > 0;
          return v !== '' && v !== null && v !== undefined;
        })
      );

      if (onBookAdded) {
        const result = await onBookAdded(cleanData);

        if (result && result.success) {
          alert('Book added successfully!');
          resetForm();
          onClose();
        } else {
          setError(result?.error || 'Failed to add book. Please try again.');
        }
      } else {
        setError('No callback provided. Contact developer.');
      }
    } catch (err) {
      setError(err.message || 'Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel',
      'text/csv',
    ];

    if (
      !allowedTypes.includes(file.type) &&
      !file.name.endsWith('.xlsx') &&
      !file.name.endsWith('.xls') &&
      !file.name.endsWith('.csv')
    ) {
      setError('Invalid file type. Please upload Excel (.xlsx, .xls) or CSV file.');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    setSelectedFile(file);
    setError(null);
    setUploadResult(null);
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) {
      setError('Please select a file first.');
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const result = await uploadBulkBooks(selectedFile);
      const report = result.report || {};

      setUploadResult({
        success: true,
        message: result.message || 'Books uploaded successfully!',
        count: result.count || 0,
        report,
      });

      setSelectedFile(null);
      if (typeof onBulkUploaded === 'function') {
        await onBulkUploaded(report);
      }
    } catch (err) {
      setError(err.message || 'Upload failed. Please check your file format and try again.');
      setUploadResult({
        success: false,
        message: err.message,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const now = Date.now();
    const rand1 = Math.floor(Math.random() * 9000) + 1000;
    const rand2 = Math.floor(Math.random() * 9000) + 1000;
    const rand3 = Math.floor(Math.random() * 9000) + 1000;

    const template = `title,description,author,department,isbn,publisher,edition,cover_url,acc
Introduction to AI,Basics of Artificial Intelligence,Stuart Russell,CSE,ISBN-${now}-${rand1},Pearson,4th,https://example.com/ai.jpg,ACC-${now}-${rand1}
Data Structures,Advanced Data Structures,Thomas Cormen,IT,ISBN-${now}-${rand2},MIT Press,3rd,https://example.com/ds.jpg,ACC-${now}-${rand2}
Digital Electronics,Fundamentals of Digital Design,Morris Mano,ECE,ISBN-${now}-${rand3},PHI,5th,https://example.com/digital.jpg,ACC-${now}-${rand3}`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `book_template_${now}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleCancel = () => {
    if (isSubmitting || isUploading) return;

    const hasData =
      Object.values(formData).some((v) => (Array.isArray(v) ? v.length > 0 : v !== '')) ||
      selectedFile !== null;

    if (hasData) {
      if (!window.confirm('Are you sure? All entered data will be lost.')) {
        return;
      }
    }

    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 mt-10 border-2 border-blue-500">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Add New Book</h2>
        </div>

        <button
          onClick={handleCancel}
          className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting || isUploading}
          title="Close"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {isSubmitting && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
          <p>Adding book to library...</p>
        </div>
      )}

      {uploadResult && uploadResult.success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          <p className="font-semibold">Success!</p>
          <p className="text-sm">{uploadResult.message}</p>
          {uploadResult.count > 0 && <p className="text-sm mt-1">{uploadResult.count} book(s) imported successfully.</p>}
          {uploadResult.report && (
            <p className="text-xs mt-2">
              Inserted: {uploadResult.report.inserted || 0} | Updated: {uploadResult.report.updated || 0} | Skipped: {uploadResult.report.skipped || 0}
            </p>
          )}
        </div>
      )}

      <BookForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isSubmitting ? 'Adding Book...' : 'Add Book'}
        disabled={isSubmitting || isUploading}
      />

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select File (.xlsx, .xls, or .csv)</label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: <span className="font-medium">{selectedFile.name}</span> ({(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadTemplate}
            disabled={isUploading}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          >
            Download Template
          </button>

          <button
            onClick={handleBulkUpload}
            disabled={!selectedFile || isUploading}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Uploading...' : 'Upload Books'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
