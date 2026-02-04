import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../api/axios";

// Layout Components
import AdminHeader from "../components/layout/AdminHeader";
import AdminFooter from "../components/layout/AdminFooter";

// Book Components
import BookStats from "../components/books/BookStats";
import BookTable from "../components/books/BookTable";
import BookTableSkeleton from "../components/books/BookTableSkeleton";

// Pages
import AddBook from "./AddBook";
import EditBook from "./EditBook";

// Common Components
import SearchBar from "../components/common/SearchBar";
import ConfirmationModal from "../components/common/ConfirmationModal";

// Hooks
import { useBooks } from "../hooks/useBooks";
import useBookFilters from "../hooks/useBookFilters";

// Data
import { DEPARTMENTS } from "../api/axios";

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
    stats,
    isLoading,
    error,
    addBook,
    updateBook,
    deleteBook,
    toggleAvailability,
    refreshBooks, // Manual refresh if needed
    // Pagination props
    page,
    totalPages,
    totalItems,
    changePage,
    searchBooks, // ✅ Added searchBooks
    currentFilter,
    setFilter,
  } = useBooks();

  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    // filteredBooks, // ❌ DISABLE client-side filter for titles
  } = useBookFilters(books);

  // ===============================
  // SEARCH EFFECT
  // ===============================
  // ✅ Server-side search with debounce
  // Using useEffect to watch searchQuery from filter hook
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500); // 500ms debounce

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Trigger search when debounced query changes
  useEffect(() => {
    // Only search if query changed to avoid initial double load
    if (debouncedQuery !== undefined) {
      // If we have a category selected, we might want to filtered client side OR send to backend
      // For now, let's assume search title overrides everything or works with it.
      // The requirement is specific to "Get /search/book?title=..."

      // Call the search function from useBooks
      // If query is empty, it reloads all books
      // If query has text, it hits the search endpoint
      // Pass the query directly
      searchBooks(debouncedQuery);
    }
  }, [debouncedQuery]); // Dependency on debouncedQuery

  // Filter for Category (Client-side for now, as API might not support both yet)
  const displayBooks = books.filter((book) => {
    if (selectedCategory === "all") return true;
    return book.department === selectedCategory;
  });

  // ===============================
  // UI STATE
  // ===============================
  const [isAddFormOpen, setIsAddFormOpen] = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  // Delete Confirmation State
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState(null);

  // ===============================
  // HANDLERS - User Actions
  // ===============================

  /**
   * Handle Logout
   */
  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      adminLogout();
      navigate("/login", { replace: true });
    }
  };

  /**
   * Handle Settings
   */
  const handleSettings = () => {
    alert("Settings feature coming soon!");
    // navigate('/settings');
  };

  /**
   * Open Edit Form
   */
  const handleEditBook = (book) => {
    console.log(
      "📝 Dashboard: Opening edit form for book:",
      book._id || book.id,
    );
    setSelectedBook(book);
    setIsEditFormOpen(true);
    setIsAddFormOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Open Add Form
   */
  const handleOpenAddForm = () => {
    console.log("➕ Dashboard: Opening add book form");
    setIsAddFormOpen(true);
    setIsEditFormOpen(false);
    setSelectedBook(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * ✅ FIXED: Handle Add Book - Direct reference
   */
  const handleAddBook = async (bookData) => {
    console.log("➕ Dashboard: Adding book...", bookData);

    const result = await addBook(bookData);

    console.log("➕ Dashboard: Add result:", result);

    // Return result to AddBook component
    return result;
  };

  /**
   * ✅ FIXED: Handle Update Book - Direct reference
   */
  const handleUpdateBook = async (updatedBookData) => {
    console.log(
      "✏️ Dashboard: Updating book...",
      updatedBookData._id || updatedBookData.id,
    );

    const result = await updateBook(updatedBookData);

    console.log("✏️ Dashboard: Update result:", result);

    // Return result to EditBook component
    return result;
  };

  /**
   * Handle Delete Book
   */
  const handleDeleteBook = (bookId) => {
    setBookToDelete(bookId);
    setDeleteModalOpen(true);
  };

  /**
   * User Confirmed Delete
   */
  const confirmDelete = async () => {
    if (bookToDelete) {
      await deleteBook(bookToDelete);
      setDeleteModalOpen(false);
      setBookToDelete(null);
    }
  };

  /**
   * Handle Toggle Availability
   */
  const handleToggleAvailability = async (bookId) => {
    console.log("🔄 Dashboard: Toggle availability for book:", bookId);

    const result = await toggleAvailability(bookId);

    if (!result.success) {
      console.error("❌ Dashboard: Toggle failed:", result.error);
      alert("Failed to update availability: " + result.error);
    }
  };

  /**
   * Export CSV
   */
  const exportCSV = () => {
    console.log("📥 Dashboard: Exporting", books.length, "books to CSV");

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Title,Author,Department,ISBN,Publisher,Edition,Views\n" +
      books
        .map(
          (book) =>
            `"${book.title}","${book.author || ""}","${book.department}","${book.isbn || ""}","${book.publisher || ""}","${book.edition || ""}","${book.views || 0}"`,
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "library_catalog.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log("✅ Dashboard: CSV export completed");
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
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24">
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

        {/* Delete Confirmation Modal */}
        <ConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Book"
          message="Are you sure you want to permanently delete this book? This action cannot be undone."
          confirmText="Delete Book"
        />

        {/* Stats Section */}
        <div className="mb-8">
          <BookStats stats={stats} categoriesCount={DEPARTMENTS.length} />
        </div>

        {/* Search & Filter Section */}
        <div className="mb-6">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={DEPARTMENTS}
            currentFilter={currentFilter}
            setFilter={setFilter}
          />
        </div>

        {/* Books Table Section */}
        {isLoading ? (
          <BookTableSkeleton />
        ) : (
          <BookTable
            books={displayBooks}
            totalBooks={totalItems}
            onToggleAvailability={handleToggleAvailability}
            onDeleteBook={handleDeleteBook}
            onEditBook={handleEditBook}
          />
        )}

        {/* Pagination Controls */}
        {!isLoading && books.length > 0 && (
          <div className="mt-6 flex items-center justify-between bg-white px-4 py-3 sm:px-6 rounded-lg shadow">
            <div className="flex flex-1 justify-between sm:hidden">
              <button
                onClick={() => changePage(page - 1)}
                disabled={page === 1}
                className={`relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${page === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Previous
              </button>
              <button
                onClick={() => changePage(page + 1)}
                disabled={page === totalPages}
                className={`relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 ${page === totalPages ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{(page - 1) * 20 + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(page * 20, totalItems)}
                  </span>{" "}
                  of <span className="font-medium">{totalItems}</span> results
                </p>
              </div>
              <div>
                <nav
                  className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                  aria-label="Pagination"
                >
                  <button
                    onClick={() => changePage(page - 1)}
                    disabled={page === 1}
                    className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${page === 1 ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <span className="sr-only">Previous</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>

                  {/* Page Numbers */}
                  {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (
                      pageNum === 1 ||
                      pageNum === totalPages ||
                      (pageNum >= page - 1 && pageNum <= page + 1)
                    ) {
                      return (
                        <button
                          key={pageNum}
                          onClick={() => changePage(pageNum)}
                          aria-current={page === pageNum ? "page" : undefined}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                            page === pageNum
                              ? "z-10 bg-blue-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                              : "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    } else if (pageNum === page - 2 || pageNum === page + 2) {
                      return (
                        <span
                          key={pageNum}
                          className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                        >
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => changePage(page + 1)}
                    disabled={page === totalPages}
                    className={`relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 ${page === totalPages ? "cursor-not-allowed opacity-50" : ""}`}
                  >
                    <span className="sr-only">Next</span>
                    <svg
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
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
