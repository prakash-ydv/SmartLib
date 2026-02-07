import React, { useState } from 'react';
import BookForm from '../components/books/BookForm';
import { uploadBulkBooks } from '../api/axios';

const AddBook = ({ isOpen, onClose, onBookAdded, onBulkUploaded }) => {

  // ===============================
  // MANUAL FORM STATE
  // ===============================
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

  // ===============================
  // BULK UPLOAD STATE
  // ===============================
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  // ===============================
  // RESET FORM
  // ===============================
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

  // ===============================
  // MANUAL SUBMIT (Existing)
  // ===============================
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

      console.log('📝 AddBook: Submitting clean data:', cleanData);

      if (onBookAdded) {
        const result = await onBookAdded(cleanData);

        if (result && result.success) {
          alert('✅ Book added successfully!');
          resetForm();
          onClose();
        } else {
          setError(result?.error || 'Failed to add book. Please try again.');
        }
      } else {
        setError('No callback provided. Contact developer.');
      }

    } catch (err) {
      console.error('❌ AddBook: Error during submit:', err);
      setError(err.message || 'Failed to add book. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ===============================
  // ✅ NEW: BULK FILE UPLOAD
  // ===============================
  const handleFileSelect = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    // Validate file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];

    if (!allowedTypes.includes(file.type) &&
      !file.name.endsWith('.xlsx') &&
      !file.name.endsWith('.xls') &&
      !file.name.endsWith('.csv')) {
      setError('Invalid file type. Please upload Excel (.xlsx, .xls) or CSV file.');
      return;
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
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
      console.log('📤 Uploading file:', selectedFile.name);

      const result = await uploadBulkBooks(selectedFile);

      console.log('✅ Upload result:', result);

      // Handle success
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
      console.error('❌ Bulk upload failed:', err);
      setError(err.message || 'Upload failed. Please check your file format and try again.');
      setUploadResult({
        success: false,
        message: err.message
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = `title,description,author,department,isbn,publisher,edition,cover_url,acc
Database Systems,Introduction to DBMS,Ramez Elmasri,CSE,9780133970777,Pearson,7th,https://example.com/db.jpg,C001
Operating Systems,OS Concepts,Abraham,IT,9781118063330,Wiley,9th,,C002`;

    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'book_upload_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  // ===============================
  // HANDLE CANCEL
  // ===============================
  const handleCancel = () => {
    if (isSubmitting || isUploading) return;

    const hasData = Object.values(formData).some(v =>
      Array.isArray(v) ? v.length > 0 : v !== ''
    ) || selectedFile !== null;

    if (hasData) {
      if (!window.confirm('Are you sure? All entered data will be lost.')) {
        return;
      }
    }

    resetForm();
    onClose();
  };

  // ===============================
  // RENDER
  // ===============================

  if (!isOpen) return null;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 mt-10 border-2 border-blue-500">

      {/* Header */}
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

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-start space-x-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Error</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Manual Entry Submitting State */}
      {isSubmitting && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center space-x-3">
          <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-r-transparent"></div>
          <p>Adding book to library...</p>
        </div>
      )}

      {/* Upload Success Message */}
      {uploadResult && uploadResult.success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg flex items-start space-x-3">
          <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-semibold">Success!</p>
            <p className="text-sm">{uploadResult.message}</p>
            {uploadResult.count > 0 && (
              <p className="text-sm mt-1">{uploadResult.count} book(s) imported successfully.</p>
            )}
            {uploadResult.report && (
              <p className="text-xs mt-2">
                Inserted: {uploadResult.report.inserted || 0} | Updated: {uploadResult.report.updated || 0} | Skipped: {uploadResult.report.skipped || 0}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Manual Entry Form */}
      <BookForm
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitLabel={isSubmitting ? 'Adding Book...' : 'Add Book'}
        disabled={isSubmitting || isUploading}
      />

      {/* Divider */}
      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
        </div>
      </div>

      {/* ✅ NEW: Bulk Upload Section */}
      <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Bulk Upload</h3>
            <p className="text-sm text-gray-600">Upload multiple books via Excel or CSV file</p>
          </div>
        </div>

        {/* File Input */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select File (.xlsx, .xls, or .csv)
          </label>
          <input
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileSelect}
            disabled={isUploading}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          {selectedFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected: <span className="font-medium">{selectedFile.name}</span> ({(selectedFile.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>

        {/* Upload Progress */}
        {isUploading && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg flex items-center space-x-3">
            <div className="inline-block h-5 w-5 animate-spin rounded-full border-2 border-blue-600 border-r-transparent"></div>
            <p>Uploading and processing file...</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            onClick={handleDownloadTemplate}
            disabled={isUploading}
            className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Download Template</span>
          </button>

          <button
            onClick={handleBulkUpload}
            disabled={!selectedFile || isUploading}
            className="flex items-center space-x-2 px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <span>{isUploading ? 'Uploading...' : 'Upload Books'}</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <span className="font-semibold">⚠️ Important:</span> Use template headers.
            Preferred headers: <code className="bg-yellow-100 px-1 rounded">title, author, department, acc</code>. Old typo headers are also accepted.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddBook;
