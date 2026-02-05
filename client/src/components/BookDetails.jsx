// ============================================
// 📖 BOOK DETAIL PAGE - PRODUCTION READY
// Mobile-First | Accessible | Optimized
// ============================================

import { useState, useEffect } from "react";
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
  AlertCircle
} from "lucide-react";

// API imports (make sure these exist!)
import { getBookById, updateBookViews } from "../api/bookAPI";

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
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-16 bg-gray-200 rounded-lg skeleton" />
          ))}
        </div>
        <div className="h-32 bg-gray-200 rounded-lg skeleton" />
      </div>
    </div>
  </div>
);

// ============================================
// 📖 BOOK DETAIL PAGE
// ============================================
export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // State
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Fetch book on mount
  useEffect(() => {
    fetchBookDetail();
  }, [id]);

  // Fetch book details
  const fetchBookDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fix: Space between await and function
      const bookData = await getBookById(id);
      setBook(bookData);

      // Update view count (non-blocking)
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

  // Handle back navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
  };

  // ============================================
  // 🎨 LOADING STATE
  // ============================================
  if (loading) {
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
              <button
                onClick={handleGoBack}
                className="btn btn-secondary"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </button>
              <button
                onClick={fetchBookDetail}
                className="btn btn-primary"
              >
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
            <button
              onClick={handleGoBack}
              className="btn btn-primary"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Catalog
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ============================================
  // 📚 BOOK DETAILS RENDER
  // ============================================
  return (
    <div className="container-custom section-padding">
      
      {/* Back Button - Mobile Friendly */}
      <button
        onClick={handleGoBack}
        className="inline-flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-indigo-600 font-semibold rounded-lg hover:bg-gray-100 transition-all mb-6 min-h-[44px] focus-ring"
        aria-label="Go back to previous page"
      >
        <ArrowLeft className="h-5 w-5" />
        <span>Back</span>
      </button>

      {/* Main Content - Mobile First Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 lg:gap-12">
        
        {/* ============================================ */}
        {/* 📸 BOOK COVER SECTION */}
        {/* ============================================ */}
        <div className="md:col-span-1">
          <div className="sticky top-24">
            {/* Book Cover */}
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
              <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
                book.isAvailable || (book.copies && book.copies.length > 0)
                  ? "bg-green-500/90 text-white"
                  : "bg-red-500/90 text-white"
              }`}>
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
                  <p className="text-lg font-bold text-gray-900">{book.views || 0}</p>
                </div>
              )}
              
              {book.copies && book.copies.length > 0 && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-3 text-center border border-green-100">
                  <Copy className="h-5 w-5 text-green-600 mx-auto mb-1" />
                  <p className="text-sm text-gray-600 font-medium">Copies</p>
                  <p className="text-lg font-bold text-gray-900">{book.copies.length}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* 📝 BOOK INFORMATION SECTION */}
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
                <span>by <strong>{book.author}</strong></span>
              </p>
            )}
          </div>

          {/* Metadata Grid - Mobile First */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Department */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
              <div className="flex items-center gap-2 mb-1">
                <Building2 className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                <span className="text-xs uppercase font-semibold text-gray-500">Department</span>
              </div>
              <p className="text-sm font-bold text-gray-900">{book.department || "N/A"}</p>
            </div>

            {/* ISBN */}
            {book.isbn && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Hash className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  <span className="text-xs uppercase font-semibold text-gray-500">ISBN</span>
                </div>
                <p className="text-sm font-mono font-bold text-gray-900">{book.isbn}</p>
              </div>
            )}

            {/* Publisher */}
            {book.publisher && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <BookOpen className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  <span className="text-xs uppercase font-semibold text-gray-500">Publisher</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{book.publisher}</p>
              </div>
            )}

            {/* Edition */}
            {book.edition && (
              <div className="bg-white border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-indigo-600" aria-hidden="true" />
                  <span className="text-xs uppercase font-semibold text-gray-500">Edition</span>
                </div>
                <p className="text-sm font-bold text-gray-900">{book.edition}</p>
              </div>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                <Book className="h-5 w-5 text-indigo-600" />
                Description
              </h3>
              <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                {book.description}
              </p>
            </div>
          )}

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

          {/* Action Buttons - Mobile Friendly */}
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
    </div>
  );
}