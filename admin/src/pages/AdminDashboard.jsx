import { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { adminLogout } from '../api/axios';

// Layout Components
import AdminHeader from '../components/layout/AdminHeader';
import AdminFooter from '../components/layout/AdminFooter';

// Book Components
import BookStats from '../components/books/BookStats';
import BookTable from '../components/books/BookTable';

// Pages
import AddBook from './AddBook';
import EditBook from './EditBook';

// Common Components
import SearchBar from '../components/common/SearchBar';

// Hooks
import { useBooks } from '../hooks/useBooks';
import useBookFilters from '../hooks/useBookFilters';

// Data
import { DEPARTMENTS } from '../api/axios';

/**
 * ✅ ADMIN DASHBOARD - PRODUCTION READY
 * 
 * WHAT WAS FIXED:
 * ❌ OLD: onBookAdded callback was wrapping addBook causing duplicate calls
 * ✅ NEW: Direct function reference - clean data flow
 * 
 * DATA FLOW:
 * 1. useBooks() hook manages all book operations
 * 2. AddBook/EditBook call callbacks with data
 * 3. Callbacks call useBooks functions directly
 * 4. useBooks auto-refreshes after operations
 * 5. Dashboard re-renders with new data
 * 
 * FEATURES:
 * - Real-time book management
 * - Auto-refresh after CRUD operations
 * - Search and filter
 * - CSV export
 * - User menu with logout
 * - Error handling
 * - Loading states
 */
function AdminDashboard() {
  const navigate = useNavigate();

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
    refreshBooks, // Manual refresh if needed
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
  const [showUserMenu, setShowUserMenu] = useState(false);

  // ===============================
  // HANDLERS - User Actions
  // ===============================
  
  /**
   * Handle Logout
   */
  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      adminLogout();
      navigate('/login', { replace: true });
    }
  };

  /**
   * Handle Settings
   */
  const handleSettings = () => {
    alert('Settings feature coming soon!');
    // navigate('/settings');
  };

  /**
   * Open Edit Form
   */
  const handleEditBook = (book) => {
    console.log('📝 Dashboard: Opening edit form for book:', book._id || book.id);
    setSelectedBook(book);
    setIsEditFormOpen(true);
    setIsAddFormOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * Open Add Form
   */
  const handleOpenAddForm = () => {
    console.log('➕ Dashboard: Opening add book form');
    setIsAddFormOpen(true);
    setIsEditFormOpen(false);
    setSelectedBook(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /**
   * ✅ FIXED: Handle Add Book - Direct reference
   */
  const handleAddBook = async (bookData) => {
    console.log('➕ Dashboard: Adding book...', bookData);
    
    const result = await addBook(bookData);
    
    console.log('➕ Dashboard: Add result:', result);
    
    // Return result to AddBook component
    return result;
  };

  /**
   * ✅ FIXED: Handle Update Book - Direct reference
   */
  const handleUpdateBook = async (updatedBookData) => {
    console.log('✏️ Dashboard: Updating book...', updatedBookData._id || updatedBookData.id);
    
    const result = await updateBook(updatedBookData);
    
    console.log('✏️ Dashboard: Update result:', result);
    
    // Return result to EditBook component
    return result;
  };

  /**
   * Handle Delete Book
   */
  const handleDeleteBook = async (bookId) => {
    console.log('🗑️ Dashboard: Delete requested for book:', bookId);
    
    if (window.confirm('Are you sure you want to delete this book?')) {
      const result = await deleteBook(bookId);
      
      if (result.success) {
        console.log('✅ Dashboard: Book deleted successfully');
      } else {
        console.error('❌ Dashboard: Delete failed:', result.error);
        alert('Failed to delete book: ' + result.error);
      }
    }
  };

  /**
   * Handle Toggle Availability
   */
  const handleToggleAvailability = async (bookId) => {
    console.log('🔄 Dashboard: Toggle availability for book:', bookId);
    
    const result = await toggleAvailability(bookId);
    
    if (!result.success) {
      console.error('❌ Dashboard: Toggle failed:', result.error);
      alert('Failed to update availability: ' + result.error);
    }
  };

  /**
   * Export CSV
   */
  const exportCSV = () => {
    console.log('📥 Dashboard: Exporting', books.length, 'books to CSV');
    
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      'Title,Author,Department,ISBN,Publisher,Edition,Views\n' +
      books
        .map(
          (book) =>
            `"${book.title}","${book.author || ''}","${book.department}","${book.isbn || ''}","${book.publisher || ''}","${book.edition || ''}","${book.views || 0}"`
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'library_catalog.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    console.log('✅ Dashboard: CSV export completed');
  };

  // ===============================
  // ERROR STATE
  // ===============================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Failed to Load Admin Panel
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ===============================
  // RENDER
  // ===============================
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      
      {/* ========================================= */}
      {/* TOP BAR - User Info & Menu */}
      {/* ========================================= */}
      <div className="bg-white shadow-sm border-b fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          
          {/* User Info */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">Admin User</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </div>
          
          {/* User Menu Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
              <span>Menu</span>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleSettings();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Settings</span>
                </button>
                
                <div className="border-t border-gray-200 my-1"></div>
                
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    handleLogout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Click outside to close menu */}
      {showUserMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}

      {/* ========================================= */}
      {/* HEADER - Actions Bar */}
      {/* ========================================= */}
      <AdminHeader
        onAddBook={handleOpenAddForm}
        onExportCSV={exportCSV}
        totalBooks={books.length}
      />

      {/* ========================================= */}
      {/* MAIN CONTENT */}
      {/* ========================================= */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32">
        
        {/* ✅ FIXED: Add Book Form - Direct callback reference */}
        <AddBook
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          onBookAdded={handleAddBook}
        />

        {/* ✅ FIXED: Edit Book Form - Direct callback reference */}
        <EditBook
          isOpen={isEditFormOpen}
          book={selectedBook}
          onClose={() => {
            setIsEditFormOpen(false);
            setSelectedBook(null);
          }}
          onBookUpdated={handleUpdateBook}
        />

        {/* Stats Section */}
        <div className="mb-8">
          <BookStats books={books} categoriesCount={DEPARTMENTS.length} />
        </div>

        {/* Search & Filter Section */}
        <div className="mb-6">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={DEPARTMENTS} 
          />
        </div>

        {/* Books Table Section */}
        {isLoading ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-r-transparent mb-4"></div>
            <p className="text-gray-600">Loading books...</p>
          </div>
        ) : (
          <BookTable
            books={filteredBooks}
            totalBooks={books.length}
            onToggleAvailability={handleToggleAvailability}
            onDeleteBook={handleDeleteBook}
            onEditBook={handleEditBook}
          />
        )}
      </main>

      {/* ========================================= */}
      {/* FOOTER */}
      {/* ========================================= */}
      <AdminFooter />
    </div>
  );
}

export default AdminDashboard;