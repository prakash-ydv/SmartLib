// ============================================================
// 🏛️ ADMIN DASHBOARD — IES SMARTLIB
// Custom Modals | Fixed Spacing | Production Ready
// ============================================================

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../api/axios";

// Layout
import AdminHeader, { DeleteConfirmModal } from "../components/layout/AdminHeader";
import AdminFooter from "../components/layout/AdminFooter";

// Book Components
import BookStats from "../components/books/BookStats";
import BookTable from "../components/books/BookTable";
import BookTableSkeleton from "../components/books/BookTableSkeleton";

// Pages
import AddBook from "./Addbook";
import EditBook from "./EditBook";

// Common
import SearchBar from "../components/common/SearchBar";

// Hooks & Data
import { useBooks } from "../hooks/useBooks";
import { DEPARTMENTS } from "../api/axios";

// ============================================================
// 🔔 TOAST NOTIFICATION — replaces alert()
// ============================================================
const Toast = ({ message, type = "error", onClose }) => {
  if (!message) return null;

  const styles = {
    error:   "bg-red-50 border-red-200 text-red-700",
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    info:    "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl text-sm font-semibold max-w-sm w-[calc(100%-2rem)] animate-in slide-in-from-top ${styles[type]}`}>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-lg leading-none">×</button>
    </div>
  );
};

// ============================================================
// 🏛️ ADMIN DASHBOARD
// ============================================================
function AdminDashboard() {
  const navigate = useNavigate();

  // ── Data hooks ──────────────────────────────────────────
  const {
    books, stats, isLoading, error,
    addBook, updateBook, deleteBook,
    toggleAvailability, refreshBooks, searchBooks,
    page, totalPages, totalItems,
    changePage, filters, updateFilter,
  } = useBooks();

  // ── UI state ────────────────────────────────────────────
  const [isAddFormOpen, setIsAddFormOpen]   = useState(false);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [selectedBook, setSelectedBook]     = useState(null);
  const [searchQuery, setSearchQuery]       = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Delete modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    bookId: null,
    bookTitle: "",
  });

  // Toast state
  const [toast, setToast] = useState({ message: "", type: "error" });

  // ── Toast helper ─────────────────────────────────────────
  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "error" }), 4000);
  };

  // ── Handlers ─────────────────────────────────────────────

  const handleLogout = async () => {
    await adminLogout();
    navigate("/login", { replace: true });
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setIsEditFormOpen(true);
    setIsAddFormOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenAddForm = () => {
    setIsAddFormOpen(true);
    setIsEditFormOpen(false);
    setSelectedBook(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAddBook = async (bookData) => {
    const result = await addBook(bookData);
    if (result?.success) showToast("Book added successfully!", "success");
    return result;
  };

  const handleBulkUploadComplete = async () => refreshBooks();

  const handleUpdateBook = async (updatedBookData) => {
    const result = await updateBook(updatedBookData);
    if (result?.success) showToast("Book updated successfully!", "success");
    return result;
  };

  // ── Delete — open custom modal ────────────────────────────
  const handleDeleteBook = (bookId) => {
    const book = books.find((b) => (b._id || b.id) === bookId);
    setDeleteModal({
      isOpen: true,
      bookId,
      bookTitle: book?.title || "",
    });
  };

  // ── Delete — confirm ──────────────────────────────────────
  const handleDeleteConfirm = async () => {
    const { bookId } = deleteModal;
    setDeleteModal({ isOpen: false, bookId: null, bookTitle: "" });

    const result = await deleteBook(bookId);
    if (result?.success) {
      showToast("Book deleted successfully.", "success");
    } else {
      showToast("Failed to delete book: " + (result?.error || "Unknown error"), "error");
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, bookId: null, bookTitle: "" });
  };

  const handleToggleAvailability = async (bookId) => {
    const result = await toggleAvailability(bookId);
    if (!result?.success) {
      showToast("Failed to update availability: " + (result?.error || "Unknown error"), "error");
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query?.trim()) {
      searchBooks(query);
    } else {
      refreshBooks();
    }
  };

  // ── Department-wise CSV export ────────────────────────────
  const exportCSV = (department = "all") => {
    const exportData =
      department === "all"
        ? books
        : books.filter(
            (b) => b.department?.toLowerCase() === department.toLowerCase()
          );

    if (exportData.length === 0) {
      showToast(`No books found for department: ${department}`, "info");
      return;
    }

    const filename =
      department === "all"
        ? "smartlib_full_catalog.csv"
        : `smartlib_${department.replace(/\s+/g, "_").toLowerCase()}.csv`;

    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Title,Author,Department,ISBN,Publisher,Edition,Views,Available\n" +
      exportData
        .map(
          (book) =>
            `"${book.title}","${book.author || ""}","${book.department || ""}","${book.isbn || ""}","${book.publisher || ""}","${book.edition || ""}","${book.views || 0}","${book.isAvailable ? "Yes" : "No"}"`
        )
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast(`Exported ${exportData.length} books — ${filename}`, "success");
  };

  // ── Error state ───────────────────────────────────────────
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Failed to Load Admin Panel</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3 bg-[#0f172a] text-white rounded-xl hover:bg-[#1e293b] transition-colors font-semibold"
            >
              Try Again
            </button>
            <button
              onClick={handleLogout}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-semibold"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main render ───────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <AdminHeader
        onAddBook={handleOpenAddForm}
        onExportCSV={exportCSV}
        totalBooks={totalItems || books.length}
      />

      {/* ✅ FIXED: pt-[67px] = 3px accent + 64px header */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-[67px] pb-10">

        {/* Add Book Form */}
        <AddBook
          isOpen={isAddFormOpen}
          onClose={() => setIsAddFormOpen(false)}
          onBookAdded={handleAddBook}
          onBulkUploaded={handleBulkUploadComplete}
        />

        {/* Edit Book Form */}
        <EditBook
          isOpen={isEditFormOpen}
          book={selectedBook}
          onClose={() => { setIsEditFormOpen(false); setSelectedBook(null); }}
          onBookUpdated={handleUpdateBook}
        />

        {/* ── Stats — always first ─────────────────────── */}
        <div className="mt-6 mb-6">
          <BookStats stats={stats} categoriesCount={DEPARTMENTS.length} />
        </div>

        {/* ── Search & Filter ──────────────────────────── */}
        <div className="mb-5">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={handleSearch}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={DEPARTMENTS}
            filters={filters}
            updateFilter={updateFilter}
          />
        </div>

        {/* ── Books Table ──────────────────────────────── */}
        {isLoading ? (
          <BookTableSkeleton />
        ) : (
          <BookTable
            books={books}
            totalBooks={totalItems || books.length}
            onToggleAvailability={handleToggleAvailability}
            onDeleteBook={handleDeleteBook}
            onEditBook={handleEditBook}
          />
        )}

        {/* ── Pagination ───────────────────────────────── */}
        {!isLoading && totalPages > 1 && (
          <div className="mt-5 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            {/* Accent line */}
            <div className="h-[3px]" style={{ background: "linear-gradient(90deg,#0f172a,#4f46e5,#7c3aed)" }} />
            <div className="px-5 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-500 font-medium">
                Page <span className="font-bold text-gray-900">{page}</span> of{" "}
                <span className="font-bold text-gray-900">{totalPages}</span>
                <span className="text-gray-400 ml-2">· {totalItems} total books</span>
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => changePage(page - 1)}
                  disabled={page <= 1}
                  className="min-h-[40px] px-4 py-2 text-sm font-semibold rounded-xl border-2 border-gray-200 text-gray-600 hover:border-[#0f172a] hover:bg-[#0f172a] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => {
                      if (totalPages <= 7) return true;
                      if (p === 1 || p === totalPages) return true;
                      return Math.abs(p - page) <= 1;
                    })
                    .map((p) => (
                      <button
                        key={p}
                        onClick={() => changePage(p)}
                        className={`min-w-[40px] h-10 px-3 text-sm rounded-xl border-2 font-bold transition-all ${
                          p === page
                            ? "bg-[#0f172a] text-white border-[#0f172a]"
                            : "bg-white text-gray-600 border-gray-200 hover:border-[#0f172a] hover:bg-[#0f172a] hover:text-white"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                </div>

                <button
                  onClick={() => changePage(page + 1)}
                  disabled={page >= totalPages}
                  className="min-h-[40px] px-4 py-2 text-sm font-semibold rounded-xl border-2 border-gray-200 text-gray-600 hover:border-[#0f172a] hover:bg-[#0f172a] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <AdminFooter />

      {/* ── Delete Confirm Modal ──────────────────────── */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        bookTitle={deleteModal.bookTitle}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />

      {/* ── Toast Notification ───────────────────────── */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "error" })}
      />
    </div>
  );
}

export default AdminDashboard;