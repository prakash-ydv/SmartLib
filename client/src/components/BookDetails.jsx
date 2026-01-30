// src/components/BookDetails.jsx - COMPLETE FIXED VERSION
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Star,
  BookOpen,
  User,
  Hash,
  Loader2,
  Building2,
  Tag,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

// Branch color mappings (department-based)
const branchColors = {
  agriculture: { bg: 'from-green-500 to-emerald-500', text: 'text-green-600' },
  mechanical: { bg: 'from-red-500 to-orange-500', text: 'text-red-600' },
  civil: { bg: 'from-yellow-500 to-orange-500', text: 'text-yellow-600' },
  electrical: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-600' },
  computer: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-600' },
  electronics: { bg: 'from-indigo-500 to-purple-500', text: 'text-indigo-600' },
  biotechnology: { bg: 'from-teal-500 to-green-500', text: 'text-teal-600' },
  chemical: { bg: 'from-orange-500 to-red-500', text: 'text-orange-600' },
  general: { bg: 'from-gray-500 to-slate-500', text: 'text-gray-600' }
};

// Helper function to get branch color
const getBranchColor = (department) => {
  if (!department) return branchColors.general;
  
  const deptLower = department.toLowerCase();
  
  // Match department to color scheme
  if (deptLower.includes('agriculture') || deptLower.includes('agri')) return branchColors.agriculture;
  if (deptLower.includes('mechanical') || deptLower.includes('mech')) return branchColors.mechanical;
  if (deptLower.includes('civil')) return branchColors.civil;
  if (deptLower.includes('electrical') || deptLower.includes('eee')) return branchColors.electrical;
  if (deptLower.includes('computer') || deptLower.includes('cs') || deptLower.includes('it')) return branchColors.computer;
  if (deptLower.includes('electronics') || deptLower.includes('ece') || deptLower.includes('etc')) return branchColors.electronics;
  if (deptLower.includes('bio')) return branchColors.biotechnology;
  if (deptLower.includes('chemical')) return branchColors.chemical;
  
  return branchColors.general;
};

export default function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [book, setBook] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Static rating for display (decoration purpose)
  const staticRating = 4.5;

  // Load book data from backend
  useEffect(() => {
    const fetchBook = async () => {
      try {
        setIsLoading(true);

        const res = await fetch(`http://localhost:8080/api/books/${id}`);

        if (!res.ok) {
          console.error("API Error: Book not found");
          setBook(null);
          setIsLoading(false);
          return;
        }

        const data = await res.json();

        // Backend data ko frontend format mein map karo
        const mappedBook = {
          _id: data._id,
          title: data.title,
          author: data.author,
          publisher: data.publisher,
          branch: data.department,    // department → branch
          genre: data.subject,        // subject → genre
          accNo: data["Acc no"]?.[""] || data["Acc no"] || "N/A"  // Handle accession number
        };

        console.log("✅ Backend Response:", data);
        console.log("✅ Mapped Book:", mappedBook);

        setBook(mappedBook);

      } catch (error) {
        console.error("❌ Failed to fetch book:", error);
        setBook(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) fetchBook();
  }, [id]);

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

  const branchStyle = getBranchColor(book.branch);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
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
                  <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/70 backdrop-blur-sm text-white text-xs font-bold rounded-lg">
                    {book.branch}
                  </div>
                </div>

                {/* Stats Section */}
                <div className="p-6 space-y-4">
                  {/* Static Star Rating Display */}
                  <div className="text-center py-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200">
                    <div className="flex items-center justify-center space-x-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-6 w-6 ${
                            i < Math.floor(staticRating)
                              ? "fill-yellow-400 text-yellow-400"
                              : i < staticRating
                              ? "fill-yellow-200 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{staticRating}</p>
                    <p className="text-xs text-gray-600 mt-1">Library Rating</p>
                  </div>

                  {/* Accession Number */}
                  {book.accNo && book.accNo !== "N/A" && (
                    <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Accession No.
                      </label>
                      <p className="text-gray-900 font-bold mt-1 font-mono text-lg">{book.accNo}</p>
                    </div>
                  )}
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
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
                {book.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-gray-600">
                <div className="flex items-center bg-gray-50 px-3 py-2 rounded-lg">
                  <User className="h-4 w-4 mr-2 text-indigo-600" />
                  <span className="text-sm font-medium">by {book.author}</span>
                </div>
              </div>
            </div>

            {/* Book Metadata Card */}
            <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-indigo-600" />
                Book Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <User className="h-3 w-3" />
                    Author
                  </label>
                  <p className="text-gray-900 font-medium mt-1">{book.author}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <Tag className="h-3 w-3" />
                    Subject
                  </label>
                  <p className="text-gray-900 font-medium mt-1">{book.genre}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    Department
                  </label>
                  <p className="text-gray-900 font-medium mt-1">{book.branch}</p>
                </div>

                {book.publisher && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                      <Building2 className="h-3 w-3" />
                      Publisher
                    </label>
                    <p className="text-gray-900 font-medium mt-1">{book.publisher}</p>
                  </div>
                )}

                {book.accNo && book.accNo !== "N/A" && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide flex items-center gap-1">
                      <Hash className="h-3 w-3" />
                      Accession Number
                    </label>
                    <p className="text-gray-900 font-medium mt-1 font-mono text-sm">{book.accNo}</p>
                  </div>
                )}

              </div>
            </div>

            {/* Library Notice */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg border-2 border-indigo-200 p-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    How to Borrow This Book
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Visit the library with your student ID card to check availability and issue this book. 
                    Our librarians will be happy to assist you during library hours.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}