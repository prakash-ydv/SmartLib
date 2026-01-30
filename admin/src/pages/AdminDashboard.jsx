import React, { useState } from 'react';

// Layout Components
import AdminHeader from '../components/layout/AdminHeader';
import AdminFooter from '../components/layout/AdminFooter';

// Book Components
import BookStats from '../components/books/BookStats';
import BookTable from '../components/books/BookTable';
import BookForm from '../components/books/BookForm';

// Common Components
import Modal from '../components/common/Modal';
import SearchBar from '../components/common/SearchBar';

// Custom Hooks
import { useBooks } from '../hooks/useBooks';  // ✅ Correct
import useBookFilters from '../hooks/useBookFilters';

// Constants
const CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'History',
  'Biography',
  'Technology',
  'Philosophy',
  'Poetry',
  'Drama',
  'Mystery',
];

function AdminDashboard() {
  // ============================================
  // HOOKS
  // ============================================
  const {
    books,
    isLoading,
    error,
    addBook,
    updateBook,
    deleteBook,
    toggleAvailability,
  } = useBooks();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    filteredBooks,
  } = useBookFilters(books);

  // ============================================
  // LOCAL STATE
  // ============================================
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

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

  // ============================================
  // FORM HANDLERS
  // ============================================
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
    setEditingBook(null);
  };

  const handleAddBook = async () => {
    // Validation
    if (!formData.title || !formData.author || !formData.category) {
      alert('Please fill in all required fields (Title, Author, Category)');
      return;
    }

    await addBook(formData);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditBook = async () => {
    // Validation
    if (!formData.title || !formData.author || !formData.category) {
      alert('Please fill in all required fields (Title, Author, Category)');
      return;
    }

    await updateBook(editingBook.id, formData);
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await deleteBook(bookId);
    }
  };

  const startEdit = (book) => {
    setEditingBook(book);
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
    setIsEditModalOpen(true);
  };

  // ============================================
  // EXPORT CSV
  // ============================================
  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Title,Author,Category,ISBN,Publication Year,Status\n' +
      books
        .map(
          (book) =>
            `"${book.title}","${book.author}","${book.category}","${book.isbn}","${book.publicationYear}","${
              book.isAvailable ? 'Available' : 'Unavailable'
            }"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'library_catalog.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ============================================
  // ERROR STATE
  // ============================================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Admin Panel
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <AdminHeader
        onAddBook={() => {
          resetForm();
          setIsAddModalOpen(true);
        }}
        onExportCSV={exportCSV}
        totalBooks={books.length}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-20">
        
        {/* Stats Cards */}
        <div className="mb-8">
          <BookStats books={books} categoriesCount={CATEGORIES.length} />
        </div>

        {/* Search & Filter */}
        <div className="mb-6">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={CATEGORIES}
          />
        </div>

        {/* Books Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600">Loading books...</p>
          </div>
        ) : (
          <BookTable
            books={filteredBooks}
            totalBooks={books.length}
            onToggleAvailability={toggleAvailability}
            onEditBook={startEdit}
            onDeleteBook={handleDeleteBook}
          />
        )}
      </main>

      {/* Footer */}
      <AdminFooter />

      {/* Add Book Modal */}
      {isAddModalOpen && (
        <Modal
          title="Add New Book"
          onClose={() => {
            setIsAddModalOpen(false);
            resetForm();
          }}
        >
          <BookForm
            formData={formData}
            setFormData={setFormData}
            categories={CATEGORIES}
            onSubmit={handleAddBook}
            onCancel={() => {
              setIsAddModalOpen(false);
              resetForm();
            }}
            submitLabel="Add Book"
          />
        </Modal>
      )}

      {/* Edit Book Modal */}
      {isEditModalOpen && (
        <Modal
          title="Edit Book"
          onClose={() => {
            setIsEditModalOpen(false);
            resetForm();
          }}
        >
          <BookForm
            formData={formData}
            setFormData={setFormData}
            categories={CATEGORIES}
            onSubmit={handleEditBook}
            onCancel={() => {
              setIsEditModalOpen(false);
              resetForm();
            }}
            submitLabel="Update Book"
          />
        </Modal>
      )}
    </div>
  );
}

export default AdminDashboard;