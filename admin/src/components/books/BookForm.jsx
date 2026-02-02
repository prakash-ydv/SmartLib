import React from 'react';
import { DEPARTMENTS } from '../../api/axios';

/**
 * 📝 Reusable Book Form Component - REAL BACKEND SCHEMA
 * Used by both AddBook and EditBook pages
 */
function BookForm({ 
  formData, 
  setFormData, 
  onSubmit, 
  onCancel, 
  submitLabel,
  disabled = false 
}) {
  return (
    <div className="space-y-4">
      
      {/* Title & Author Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter book title"
            disabled={disabled}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author
          </label>
          <input
            type="text"
            value={formData.author}
            onChange={(e) => setFormData({...formData, author: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter author name"
            disabled={disabled}
          />
        </div>
      </div>
      
      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Enter book description"
          disabled={disabled}
        />
      </div>

      {/* Department & ISBN Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Department <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.department}
            onChange={(e) => setFormData({...formData, department: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={disabled}
            required
          >
            <option value="">Select department</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            ISBN
          </label>
          <input
            type="text"
            value={formData.isbn}
            onChange={(e) => setFormData({...formData, isbn: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="978-0000000000"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Publisher & Edition Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Publisher
          </label>
          <input
            type="text"
            value={formData.publisher}
            onChange={(e) => setFormData({...formData, publisher: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter publisher name"
            disabled={disabled}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Edition
          </label>
          <input
            type="text"
            value={formData.edition}
            onChange={(e) => setFormData({...formData, edition: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 1st, 2nd, Revised"
            disabled={disabled}
          />
        </div>
      </div>

      {/* Cover URL */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Book Cover URL
        </label>
        <input
          type="url"
          value={formData.cover_url}
          onChange={(e) => setFormData({...formData, cover_url: e.target.value})}
          placeholder="https://example.com/cover.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={disabled}
        />
      </div>

      {/* Copies (Optional - Advanced) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Book Copies (IDs)
          <span className="text-xs text-gray-500 ml-2">(Optional - comma separated)</span>
        </label>
        <input
          type="text"
          value={formData.copies?.join(', ') || ''}
          onChange={(e) => {
            const copiesArray = e.target.value
              .split(',')
              .map(s => s.trim())
              .filter(s => s !== '');
            setFormData({...formData, copies: copiesArray});
          }}
          placeholder="e.g., COPY001, COPY002"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          disabled={disabled}
        />
        <p className="text-xs text-gray-500 mt-1">
          Enter book copy IDs separated by commas
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t">
        <button
          onClick={onCancel}
          type="button"
          className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          disabled={disabled}
        >
          Cancel
        </button>
        <button
          onClick={onSubmit}
          type="button"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
        >
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

export default BookForm;