// client/src/pages/BookDetailPage.jsx
// Example: Single book detail page with view count

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {getBookById, updateBookViews } from "../api/bookAPI";
import LoadingSkeleton from "../components/LoadingSkeleton";

export default function BookDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBookDetail();
  }, [id]);

  const fetchBookDetail = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch book details
      const bookData = awaitgetBookById(id);
      setBook(bookData);

      // Update view count (non-blocking)
      updateBookViews(id).catch((err) => {
        console.log("View count update failed:", err);
        // Don't show error to user for view count
      });
    } catch (err) {
      setError(err.message || "Failed to load book details");
      console.error("Error fetching book:", err);
    } finally {
      setLoading(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="book-detail-page">
        <LoadingSkeleton />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-container">
        <h2>❌ Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate(-1)}>← Go Back</button>
        <button onClick={fetchBookDetail}>🔄 Try Again</button>
      </div>
    );
  }

  // Book not found
  if (!book) {
    return (
      <div className="empty-state">
        <h2>📭 Book Not Found</h2>
        <button onClick={() => navigate(-1)}>← Go Back</button>
      </div>
    );
  }

  // Book details
  return (
    <div className="book-detail-page">
      {/* Back Button */}
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Back to Books
      </button>

      {/* Book Content */}
      <div className="book-detail-container">
        {/* Book Cover */}
        <div className="book-cover-section">
          <img
            src={book.cover_url || "/placeholder-book.png"}
            alt={book.title}
            className="detail-cover"
            onError={(e) => {
              e.target.src = "/placeholder-book.png";
            }}
          />
          
          {/* Availability Badge */}
          <div className={`availability-badge ${book.isAvailable ? "available" : "unavailable"}`}>
            {book.isAvailable ? "✅ Available" : "❌ Not Available"}
          </div>
        </div>

        {/* Book Information */}
        <div className="book-info-section">
          <h1>{book.title}</h1>

          {book.author && (
            <p className="author">
              <strong>Author:</strong> {book.author}
            </p>
          )}

          {/* Metadata Grid */}
          <div className="metadata-grid">
            <div className="meta-item">
              <span className="label">Department:</span>
              <span className="value">{book.department}</span>
            </div>

            {book.isbn && (
              <div className="meta-item">
                <span className="label">ISBN:</span>
                <span className="value">{book.isbn}</span>
              </div>
            )}

            {book.publisher && (
              <div className="meta-item">
                <span className="label">Publisher:</span>
                <span className="value">{book.publisher}</span>
              </div>
            )}

            {book.edition && (
              <div className="meta-item">
                <span className="label">Edition:</span>
                <span className="value">{book.edition}</span>
              </div>
            )}

            {book.views !== undefined && (
              <div className="meta-item">
                <span className="label">Views:</span>
                <span className="value">👁 {book.views}</span>
              </div>
            )}

            {book.copies && book.copies.length > 0 && (
              <div className="meta-item">
                <span className="label">Copies Available:</span>
                <span className="value">{book.copies.length}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {book.description && (
            <div className="description-section">
              <h3>Description</h3>
              <p>{book.description}</p>
            </div>
          )}

          {/* Copy IDs (if needed) */}
          {book.copies && book.copies.length > 0 && (
            <div className="copies-section">
              <h3>Available Copies</h3>
              <div className="copy-list">
                {book.copies.map((copyId, index) => (
                  <span key={index} className="copy-id">
                    {copyId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button className="primary-btn">
              📖 Issue Book
            </button>
            <button className="secondary-btn">
              ❤️ Add to Wishlist
            </button>
          </div>
        </div>
      </div>

      {/* Related Books Section (Optional) */}
      {/* You can add similar books from same department */}
    </div>
  );
}