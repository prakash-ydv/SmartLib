// src/components/BookDetails.jsx - FIXED VERSION
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  Calendar,
  BookOpen,
  User,
  Hash,
  MessageCircle,
  Send,
  Loader2,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { booksData } from "../data/booksData";

// Branch color mappings
const branchColors = {
  cs: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-600' },
  mech: { bg: 'from-red-500 to-orange-500', text: 'text-red-600' },
  civil: { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-600' },
  ece: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-600' },
  biotech: { bg: 'from-green-500 to-emerald-500', text: 'text-green-600' },
  general: { bg: 'from-gray-500 to-slate-500', text: 'text-gray-600' }
};

// Mock reviews data (localStorage mein store karenge)
const getStoredReviews = (bookId) => {
  try {
    const stored = localStorage.getItem(`reviews_${bookId}`);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveReviews = (bookId, reviews) => {
  try {
    localStorage.setItem(`reviews_${bookId}`, JSON.stringify(reviews));
  } catch (error) {
    console.error('Failed to save reviews:', error);
  }
};

export default function BookDetails() {
  const { id } = useParams(); // URL se book ID lena
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Load book data from booksData based on ID
  useEffect(() => {
    const loadBookData = async () => {
      setIsLoading(true);
      
      // Simulate API delay for smooth UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Find book by ID from booksData (handle both string and number IDs)
      const foundBook = booksData.find(b => String(b.id) === String(id));
      
      if (foundBook) {
        setBook(foundBook);
        // Load reviews from localStorage
        const storedReviews = getStoredReviews(id);
        setReviews(storedReviews);
      } else {
        setBook(null);
      }
      
      setIsLoading(false);
    };

    if (id) {
      loadBookData();
    }
  }, [id]);

  const handleSubmitReview = async () => {
    if (!reviewText.trim() || !reviewerName.trim()) return;

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newReview = {
      _id: Date.now().toString(),
      reviewerName: reviewerName.trim(),
      rating,
      reviewText: reviewText.trim(),
      reviewDate: new Date().toISOString(),
      isRecommended: rating >= 4,
    };

    const updatedReviews = [newReview, ...reviews];
    setReviews(updatedReviews);
    
    // Save to localStorage
    saveReviews(id, updatedReviews);
    
    // Reset form
    setReviewText("");
    setReviewerName("");
    setRating(5);
    setIsSubmitting(false);
    setShowSuccess(true);

    setTimeout(() => setShowSuccess(false), 3000);
  };

  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0;

  // Loading State
  if (isLoading) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-indigo-600 mx-auto mb-4 animate-spin" />
          <p className="text-lg text-gray-600">Loading book details...</p>
        </div>
      </div>
    );
  }

  // Not Found State
  if (!book) {
    return (
      <div className="min-h-[60vh] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center px-4">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Book not found
          </h1>
          <p className="text-gray-600 mb-6">
            The book you're looking for doesn't exist or has been removed.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-semibold"
          >
            Return to Catalog
          </button>
        </div>
      </div>
    );
  }

  const branchStyle = branchColors[book.branch] || branchColors.general;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl flex items-center gap-3 animate-slideInRight">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <p className="text-green-700 font-semibold">
              Review submitted successfully!
            </p>
          </div>
        )}

        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-all font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Catalog
          </button>
        </div>

        {/* Book Details */}
        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Book Cover */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Book Cover Card */}
              <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-100 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r ${branchStyle.bg}`}></div>
                <div className={`aspect-[3/4] relative bg-gradient-to-br ${branchStyle.bg} flex items-center justify-center`}>
                  {/* Book Icon */}
                  <BookOpen className="h-32 w-32 text-white drop-shadow-2xl" />
                  
                  {/* Branch Badge */}
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-bold rounded-lg uppercase">
                    {book.branch}
                  </div>
                  
                  {/* Year Badge */}
                  {book.year && (
                    <div className="absolute top-4 right-4 px-3 py-1.5 bg-white/95 text-gray-800 text-xs font-bold rounded-lg">
                      Year {book.year}
                    </div>
                  )}
                </div>
                
                {/* Stats Section */}
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="text-lg font-bold text-gray-900">
                        {reviews.length > 0 ? averageRating.toFixed(1) : '0.0'}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({reviews.length} {reviews.length === 1 ? 'review' : 'reviews'})
                      </span>
                    </div>
                  </div>
                  
                  {/* Availability */}
                  <div className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold text-sm ${
                    book.available 
                      ? 'bg-green-50 text-green-700 border-2 border-green-200' 
                      : 'bg-red-50 text-red-700 border-2 border-red-200'
                  }`}>
                    {book.available ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        Available Now
                      </>
                    ) : (
                      <>
                        <XCircle className="h-5 w-5" />
                        Currently Issued
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Book Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className={`px-3 py-1.5 bg-gradient-to-r ${branchStyle.bg} text-white rounded-full text-sm font-bold`}>
                  {book.genre}
                </span>
                {book.publicationYear && (
                  <div className="flex items-center text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg">
                    <Calendar className="h-4 w-4 mr-1.5" />
                    <span className="text-sm font-semibold">{book.publicationYear}</span>
                  </div>
                )}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {book.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4 mr-2 text-indigo-600" />
                  <span className="text-sm font-medium">by {book.author}</span>
                </div>
                {book.isbn && (
                  <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg font-mono">
                    <Hash className="h-4 w-4 mr-2 text-indigo-600" />
                    <span className="text-xs font-medium">{book.isbn}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            {book.description && (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-indigo-600" />
                  Description
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {book.description}
                </p>
              </div>
            )}

            {/* Book Metadata Card */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Book Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Author
                  </label>
                  <p className="text-gray-900 font-medium mt-1">{book.author}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Genre
                  </label>
                  <p className="text-gray-900 font-medium mt-1">{book.genre}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-xl">
                  <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                    Branch
                  </label>
                  <p className="text-gray-900 font-medium mt-1 uppercase">{book.branch}</p>
                </div>
                {book.isbn && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      ISBN
                    </label>
                    <p className="text-gray-900 font-medium mt-1 font-mono text-sm">{book.isbn}</p>
                  </div>
                )}
                {book.publicationYear && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Publication Year
                    </label>
                    <p className="text-gray-900 font-medium mt-1">{book.publicationYear}</p>
                  </div>
                )}
                {book.publisher && (
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <label className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                      Publisher
                    </label>
                    <p className="text-gray-900 font-medium mt-1">{book.publisher}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="h-6 w-6 text-indigo-600" />
              Reviews ({reviews.length})
            </h2>
          </div>

          {/* Add Review Form */}
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
            <h3 className="text-lg font-bold text-gray-900 flex items-center mb-6">
              <MessageCircle className="h-5 w-5 mr-2 text-indigo-600" />
              Write a Review
            </h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="reviewerName" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    id="reviewerName"
                    type="text"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                  />
                </div>
                <div>
                  <label htmlFor="rating" className="block text-sm font-semibold text-gray-700 mb-2">
                    Rating
                  </label>
                  <select
                    id="rating"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer font-medium"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ Excellent</option>
                    <option value={4}>⭐⭐⭐⭐ Very Good</option>
                    <option value={3}>⭐⭐⭐ Good</option>
                    <option value={2}>⭐⭐ Fair</option>
                    <option value={1}>⭐ Poor</option>
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="reviewText" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Review
                </label>
                <textarea
                  id="reviewText"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share your thoughts about this book..."
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                />
              </div>
              <button
                onClick={handleSubmitReview}
                disabled={isSubmitting || !reviewText.trim() || !reviewerName.trim()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed font-semibold shadow-lg hover:shadow-xl"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Review
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-4">
            {reviews.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-12 text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">
                  No reviews yet. Be the first to review this book!
                </p>
              </div>
            ) : (
              reviews.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6 hover:border-indigo-200 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-bold text-gray-900">
                        {review.reviewerName}
                      </h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.reviewDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {review.isRecommended && (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 leading-relaxed">
                    {review.reviewText}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}