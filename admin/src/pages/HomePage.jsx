import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Edit2,
  Trash2,
  BookOpen,
  Eye,
  EyeOff,
  Search,
  Filter,
  X,
  Download,
} from "lucide-react";
import AddBook from "../components/AddBook";

// Main Admin Component
export default function HomePage() {
  const [books, setBooks] = useState([]);
  const [categories] = useState([
    "Fiction",
    "Non-Fiction",
    "Science",
    "History",
  ]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    bookCover: "",
    isbn: "",
    publicationYear: new Date().getFullYear(),
    category: "",
    isAvailable: true,
  });

  // Load data from localStorage on mount
  useEffect(() => {
    const savedBooks = localStorage.getItem("libraryBooks");
    if (savedBooks) {
      setBooks(JSON.parse(savedBooks));
    } else {
      // Demo data for first time
      const demoBooks = [
        {
          id: "1",
          title: "The Great Gatsby",
          author: "F. Scott Fitzgerald",
          description: "A classic American novel set in the Jazz Age",
          bookCover:
            "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
          isbn: "978-0743273565",
          publicationYear: 1925,
          category: "Fiction",
          isAvailable: true,
        },
        {
          id: "2",
          title: "To Kill a Mockingbird",
          author: "Harper Lee",
          description:
            "A gripping tale of racial injustice and childhood innocence",
          bookCover:
            "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
          isbn: "978-0061120084",
          publicationYear: 1960,
          category: "Fiction",
          isAvailable: true,
        },
        {
          id: "3",
          title: "1984",
          author: "George Orwell",
          description: "A dystopian social science fiction novel",
          bookCover:
            "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400",
          isbn: "978-0451524935",
          publicationYear: 1949,
          category: "Fiction",
          isAvailable: false,
        },
      ];
      setBooks(demoBooks);
      localStorage.setItem("libraryBooks", JSON.stringify(demoBooks));
    }
  }, []);

  // Save to localStorage whenever books change
  useEffect(() => {
    if (books.length > 0) {
      localStorage.setItem("libraryBooks", JSON.stringify(books));
    }
  }, [books]);

  // Filter books
  useEffect(() => {
    let filtered = books;

    if (searchQuery) {
      filtered = filtered.filter(
        (book) =>
          book.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.author?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          book.isbn?.includes(searchQuery)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((book) => book.category === selectedCategory);
    }

    setFilteredBooks(filtered);
  }, [books, searchQuery, selectedCategory]);

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      description: "",
      bookCover: "",
      isbn: "",
      publicationYear: new Date().getFullYear(),
      category: "",
      isAvailable: true,
    });
    setEditingBook(null);
  };

  const handleAddBook = () => {
    if (!formData.title || !formData.author || !formData.category) {
      alert("Please fill in all required fields (Title, Author, Category)");
      return;
    }

    const newBook = {
      id: Date.now().toString(),
      ...formData,
    };
    setBooks([newBook, ...books]);
    setIsAddModalOpen(false);
    resetForm();
  };

  const handleEditBook = () => {
    if (!formData.title || !formData.author || !formData.category) {
      alert("Please fill in all required fields (Title, Author, Category)");
      return;
    }

    const updatedBooks = books.map((book) =>
      book.id === editingBook.id ? { ...editingBook, ...formData } : book
    );
    setBooks(updatedBooks);
    setIsEditModalOpen(false);
    resetForm();
  };

  const handleDeleteBook = (bookId) => {
    if (window.confirm("Are you sure you want to delete this book?")) {
      setBooks(books.filter((book) => book.id !== bookId));
    }
  };

  const toggleAvailability = (book) => {
    const updatedBooks = books.map((b) =>
      b.id === book.id ? { ...b, isAvailable: !b.isAvailable } : b
    );
    setBooks(updatedBooks);
  };

  const startEdit = (book) => {
    setEditingBook(book);
    setFormData({
      title: book.title || "",
      author: book.author || "",
      description: book.description || "",
      bookCover: book.bookCover || "",
      isbn: book.isbn || "",
      publicationYear: book.publicationYear || new Date().getFullYear(),
      category: book.category || "",
      isAvailable: book.isAvailable ?? true,
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Library Management System
                </h1>
                <p className="text-sm text-gray-500">Admin Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Add New Book</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Import From Sheet</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <AddBook />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Books</p>
                <p className="text-2xl font-bold text-gray-900">
                  {books.length}
                </p>
              </div>
              <BookOpen className="h-8 w-8 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Available</p>
                <p className="text-2xl font-bold text-green-600">
                  {books.filter((book) => book.isAvailable).length}
                </p>
              </div>
              <Eye className="h-8 w-8 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unavailable</p>
                <p className="text-2xl font-bold text-red-600">
                  {books.filter((book) => !book.isAvailable).length}
                </p>
              </div>
              <EyeOff className="h-8 w-8 text-red-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {categories.length}
                </p>
              </div>
              <Filter className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books by title, author, or ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent lg:w-48"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Books Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              Books Management ({filteredBooks.length} of {books.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cover
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISBN
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <img
                        src={
                          book.bookCover ||
                          "https://via.placeholder.com/48x64?text=No+Cover"
                        }
                        alt={book.title}
                        className="w-12 h-16 object-cover rounded"
                        onError={(e) => {
                          e.target.src =
                            "https://via.placeholder.com/48x64?text=No+Cover";
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {book.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {book.publicationYear}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{book.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {book.category}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.isbn}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          book.isAvailable
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {book.isAvailable ? "Available" : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleAvailability(book)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                          title={
                            book.isAvailable
                              ? "Mark Unavailable"
                              : "Mark Available"
                          }
                        >
                          {book.isAvailable ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => startEdit(book)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Book"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredBooks.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                No books found matching your criteria
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
