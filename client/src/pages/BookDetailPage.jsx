// ============================================
// 📖 BOOK DETAIL PAGE - PRODUCTION READY
// Mobile-First | Accessible | Optimized
// ============================================

import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Book,
  User,
  Hash,
  Building2,
  Calendar,
  Eye,
  Copy,
  Heart,
  BookOpen,
  AlertCircle,
  ChevronRight,
  Layers,
} from "lucide-react";

// Context
import { useBooks } from "../context/BookContext";

// API
import { updateBookViews, getBookDescription } from "../api/bookAPI";

// Components
import BookCard from "../components/BookCard";

// ============================================
// 🔢 CONFIG
// ============================================
const RELATED_BOOKS_LIMIT = 6;

// ============================================
// 🎨 LOADING SKELETON COMPONENT
// ============================================
const BookDetailSkeleton = () => (
  <div className="container-custom section-padding">
    <div className="mb-6">
      <div className="h-10 w-32 bg-gray-200 rounded-lg skeleton" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
      {/* Image Skeleton */}
      <div className="md:col-span-1">
        <div className="aspect-[3/4] bg-gray-200 rounded-xl skeleton" />
      </div>

      {/* Info Skeleton */}
      <div className="md:col-span-2 space-y-4">
        <div className="h-8 bg-gray-200 rounded-lg skeleton" />
        <div className="h-6 w-3/4 bg-gray-200 rounded-lg skeleton" />
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg skeleton" />
          ))}
        </div>
        <div className="h-32 bg-gray-200 rounded-lg skeleton" />
      </div>
    </div>
  </div>
);

// ============================================
// 📦 RELATED BOOKS SKELETON
// ============================================
const RelatedBooksSkeleton = () => (
  <div className="books-grid">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="rounded-xl overflow-hidden border border-gray-200">
        <div className="h-1 bg-gray-200" />
        <div className="h-48 bg-gray-200 skeleton" />
        <div className="p-4 space-y-3">
          <div className="h-5 bg-gray-200 rounded skeleton" />
          <div className="h-4 w-2/3 bg-gray-200 rounded skeleton" />
          <div className="h-10 bg-gray-200 rounded-lg skeleton mt-2" />
        </div>
      </div>
    ))}
  </div>
);

// ============================================
// 📖 BOOK DETAIL PAGE
// ============================================
export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ allBooks aur contextLoading bhi lo
  const { getBookFromCache, allBooks, loading: contextLoading } = useBooks();

  // State
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Description state
  const [description, setDescription] = useState("");
  const [descLoading, setDescLoading] = useState(false);

  // ============================================
  // 🔄 FETCH BOOK
  // id ya allBooks change hone pe re-run hoga
  // ============================================
  useEffect(() => {
    // ✅ Books abhi load ho rahi hain — wait karo
    if (contextLoading || allBooks.length === 0) {
      setLoading(true);
      return;
    }
    fetchBookDetail();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, contextLoading, allBooks]);

  const fetchBookDetail = () => {
    setLoading(true);
    setError(null);
    setImageError(false); // ✅ naye book pe image error reset

    try {
      const bookData = getBookFromCache(id);

      if (!bookData) {
        setError("Book not found. Please go back and try again.");
        return;
      }

      setBook(bookData);

      // Description handle karo
      if (bookData.description && bookData.description.trim()) {
        setDescription(bookData.description);
      } else {
        setDescription(""); // ✅ purani description clear karo
        fetchDescription(id);
      }

      // View count — non blocking
      updateBookViews(id).catch((err) => {
        console.log("View count update failed:", err);
      });

    } catch (err) {
      setError(err.message || "Failed to load book details");
      console.error("Error fetching book:", err);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // 🤖 FETCH DESCRIPTION FROM AI
  // ============================================
  const fetchDescription = async (bookId) => {
    setDescLoading(true);
    try {
      const desc = await getBookDescription(bookId);
      if (desc) setDescription(desc);
    } catch (err) {
      console.error("Description fetch failed:", err);
    } finally {
      setDescLoading(false);
    }
  };

  // ============================================
  // 🔗 RELATED BOOKS — memoized
  // Sirf tab recompute hoga jab book ya allBooks change ho
  // ============================================
  const relatedBooks = useMemo(() => {
    if (!book || !allBooks.length) return [];

    const currentId = book._id || book.id;

    // Primary: same department
    const byDepartment = allBooks.filter((b) => {
      const bId = b._id || b.id;
      return (
        bId !== currentId &&
        b.department &&
        book.department &&
        b.department.toUpperCase() === book.department.toUpperCase()
      );
    });

    if (byDepartment.length >= 2) {
      return byDepartment.slice(0, RELATED_BOOKS_LIMIT);
    }

    // Fallback: same author
    const byAuthor = allBooks.filter((b) => {
      const bId = b._id || b.id;
      return (
        bId !== currentId &&
        b.author &&
        book.author &&
        b.author.toLowerCase() === book.author.toLowerCase()
      );
    });

    // Merge: department pehle, phir author (no duplicates)
    const merged = [
      ...byDepartment,
      ...byAuthor.filter(
        (b) => !byDepartment.some((d) => (d._id || d.id) === (b._id || b.id))
      ),
    ];

    return merged.slice(0, RELATED_BOOKS_LIMIT);
  }, [book, allBooks]);

  // ============================================
  // 🎯 HANDLERS
  // ============================================
  const handleGoBack = () => navigate(-1);
  const handleImageError = () => setImageError(true);

  // ============================================
  // 🎨 LOADING STATE
  // ============================================
  if (loading || contextLoading) {
    return <BookDetailSkeleton />;
  }

  // ============================================
  // ❌ ERROR STATE
  // ============================================
  if (error) {
    return (
      <div className="container-custom section-padding">
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-red-100 rounded-full mb-4 md:mb-6">
              <AlertCircle className="w-8 h-8 md:w-10 md:h-10 text-red-600" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Failed to Load Book
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-6">{error}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button onClick={handleGoBack} className="btn btn-secondary">
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
              <button onClick={fetchBookDetail} className="btn btn-primary">
                🔄 Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // 📭 EMPTY STATE
  // ============================================
  if (!book) {
    return (
      <div className="container-custom section-padding">
        <div className="min-h-[60vh] flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="text-5xl md:text-6xl mb-4">📭</div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              Book Not Found
            </h2>
            <p className="text-sm md:text-base text-gray-600 mb-6">
              The book you're looking for doesn't exist or has been removed.
            </p>
            <button onClick={handleGoBack} className="btn btn-primary">
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // 📚 MAIN RENDER
  // ============================================
  return (
    <div className="container-custom section-padding">

      {/* Back Button */}
      <button
        onClick={handleGoBack}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-all mb-6 min-h-[44px] focus-ring"
        aria-label="Go back to previous page"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">

        {/* ============================================ */}
        {/* 📸 BOOK COVER SECTION                       */}
        {/* ============================================ */}
        <div className="md:col-span-1">
          <div className="sticky top-24">
            <div className="relative group">
              <div className="aspect-[3/4] bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden shadow-xl">
                {!imageError ? (
                  <img
                    src={book.cover_url || "/placeholder-book.png"}
                    alt={`Cover of ${book.title}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={handleImageError}
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
                    <Book className="h-16 w-16 text-gray-400 mb-3" />
                    <p className="text-sm text-gray-500 font-medium">
                      {book.title}
                    </p>
                  </div>
                )}
              </div>

              {/* Availability Badge */}
              <div
                className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                  book.isAvailable || (book.copies && book.copies.length > 0)
                    ? "bg-green-500/90 text-white"
                    : "bg-red-500/90 text-white"
                }`}
              >
                {book.isAvailable || (book.copies && book.copies.length > 0)
                  ? "✓ Available"
                  : "✗ Not Available"}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              {book.views !== undefined && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg p-3 text-center border border-indigo-100">
                  <Eye className="h-5 w-5 text-indigo-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600 font-medium">Views</p>
                  <p className="text-lg font-bold text-gray-900">
                    {book.views || 0}
                  </p>
                </div>
              )}

              {book.copies && book.copies.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 text-center border border-green-100">
                  <Copy className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600 font-medium">Copies</p>
                  <p className="text-lg font-bold text-gray-900">
                    {book.copies.length}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* 📝 BOOK INFORMATION SECTION                 */}
        {/* ============================================ */}
        <div className="md:col-span-2 space-y-6">

          {/* Title & Author */}
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              {book.title}
            </h1>
            {book.author && (
              <p className="flex items-center gap-2 text-base md:text-lg text-gray-600">
                <User className="h-5 w-5" aria-hidden="true" />
                <span>
                  by <strong>{book.author}</strong>
                </span>
              </p>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                <span className="text-xs uppercase font-semibold text-gray-500">
                  Department
                </span>
              </div>
              <p className="text-sm font-bold text-gray-900">
                {book.department || "N/A"}
              </p>
            </div>

            {book.isbn && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  <span className="text-xs uppercase font-semibold text-gray-500">
                    ISBN
                  </span>
                </div>
                <p className="text-sm font-mono font-bold text-gray-900">
                  {book.isbn}
                </p>
              </div>
            )}

            {book.publisher && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  <span className="text-xs uppercase font-semibold text-gray-500">
                    Publisher
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {book.publisher}
                </p>
              </div>
            )}

            {book.edition && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  <span className="text-xs uppercase font-semibold text-gray-500">
                    Edition
                  </span>
                </div>
                <p className="text-sm font-bold text-gray-900">
                  {book.edition}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Book className="h-5 w-5 text-indigo-600" />
              Description
            </h3>

            {descLoading && (
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-r-transparent shrink-0" />
                <p className="text-sm text-gray-500 italic">
                  Generating description...
                </p>
              </div>
            )}

            {!descLoading && description && (
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                {description}
              </p>
            )}

            {!descLoading && !description && (
              <p className="text-sm text-gray-400 italic">
                No description available.
              </p>
            )}
          </div>

          {/* Copy IDs */}
          {book.copies && book.copies.length > 0 && (
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Copy className="h-5 w-5 text-green-600" />
                Available Copies
              </h3>
              <div className="flex flex-wrap gap-2">
                {book.copies.map((copyId, index) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-green-50 text-green-700 text-xs font-mono font-semibold rounded-lg border border-green-200"
                  >
                    {copyId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              className="btn btn-primary flex-1"
              onClick={() => alert("Issue book functionality coming soon!")}
            >
              <BookOpen className="h-5 w-5" />
              Issue Book
            </button>
            <button
              className="btn btn-secondary flex-1"
              onClick={() => alert("Wishlist functionality coming soon!")}
            >
              <Heart className="h-5 w-5" />
              Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* 🔗 RELATED BOOKS SECTION                    */}
      {/* ============================================ */}
      {relatedBooks.length > 0 && (
        <section
          aria-labelledby="related-books-heading"
          className="mt-16 md:mt-20"
        >
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6 md:mb-8">
            <div className="flex items-center gap-3">
              <div className="w-1.5 md:w-2 h-6 md:h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full shrink-0" />
              <div>
                <h2
                  id="related-books-heading"
                  className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-900"
                >
                  Related Books
                </h2>
                <p className="text-xs md:text-sm text-gray-500 mt-0.5 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5" />
                  {book.department
                    ? `More from ${book.department} department`
                    : `More by ${book.author}`}
                </p>
              </div>
            </div>

            {/* Count pill */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 text-indigo-700 text-xs md:text-sm font-semibold rounded-full border border-indigo-100 shrink-0">
              <ChevronRight className="h-3.5 w-3.5" />
              {relatedBooks.length} book{relatedBooks.length !== 1 ? "s" : ""}
            </span>
          </div>

          {/* Gradient Divider */}
          <div className="h-px bg-gradient-to-r from-indigo-200 via-purple-200 to-transparent mb-8" />

          {/* Books Grid */}
          <div className="books-grid">
            {relatedBooks.map((relatedBook) => (
              <BookCard
                key={relatedBook._id || relatedBook.id}
                book={relatedBook}


              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}