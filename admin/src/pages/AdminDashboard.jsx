import { createContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";

import { AuthContext } from "../context/Authcontext";



// Layout Components
import AdminHeader from '../components/layout/AdminHeader';
import AdminFooter from '../components/layout/AdminFooter';

// Book Components
import BookStats from '../components/books/BookStats';
import BookTable from '../components/books/BookTable';

// Pages
import AddBook from './Addbook';
import EditBook from './EditBook';

// Common Components
import SearchBar from '../components/common/SearchBar';

// Hooks
import { useBooks } from '../hooks/useBooks';
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ===============================
  // DATA HOOKS
  // ===============================
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

  // ===============================
  // UI STATE
  // ===============================
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  // ===============================
  // HANDLERS
  // ===============================
  
  /**
   * Handle Logout
   */
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      logout();
      navigate('/login');
    }
  };

  /**
   * Open Edit Form
   */
  const handleEditBook = (book) => {
    setSelectedBook(book);
    setIsEditFormOpen(true);
    setIsAddFormOpen(false); // Close add form if open
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Open Add Form
   */
  const handleOpenAddForm = () => {
    setIsAddFormOpen(true);
    setIsEditFormOpen(false); // Close edit form if open
    setSelectedBook(null);
    
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Delete Book
   */
  const handleDeleteBook = async (bookId) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      await deleteBook(bookId);
    }
  };

  /**
   * Export CSV
   */
  const exportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Title,Author,Category,ISBN,Publication Year,Status\n' +
      books
        .map(
          (book) =>
            `"${book.title}","${book.author}","${book.category}","${book.isbn || ''}","${book.publicationYear || ''}","${
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

  // ===============================
  // ERROR STATE
  // ===============================
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
            className="px-6 py-3 bg-blue-600 text-white rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Bar with User Info & Logout */}
      <div className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">
                {user?.name || 'Admin User'}
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Header */}
      <AdminHeader
        onAddBook={handleOpenAddForm}
        onExportCSV={exportCSV}
        totalBooks={books.length}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        
        {/* Add Book Form (Inline) */}
        <AddBook
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          categories={CATEGORIES}
          onBookAdded={async (bookData) => {
            await addBook(bookData);
          }}
        />

        {/* Edit Book Form (Inline) */}
        <EditBook
          isOpen={isEditFormOpen}
          book={selectedBook}
          onClose={() => {
            setIsEditFormOpen(false);
            setSelectedBook(null);
          }}
          categories={CATEGORIES}
          onBookUpdated={async (updatedBookData) => {
            await updateBook(updatedBookData);
          }}
        />

        {/* Stats */}
        <div className="mb-8">
          <BookStats books={books} categoriesCount={CATEGORIES.length} />
        </div>

        {/* Search */}
        <div className="mb-6">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={CATEGORIES}
          />
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600">Loading books...</p>
          </div>
        ) : (
          <BookTable
            books={filteredBooks}
            totalBooks={books.length}
            onToggleAvailability={toggleAvailability}
            onDeleteBook={handleDeleteBook}
            onEditBook={handleEditBook}
          />
        )}
      </main>

      {/* Footer */}
      <AdminFooter />
    </div>
  );
}

export default AdminDashboard;