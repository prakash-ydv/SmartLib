import { useState, useEffect } from 'react';

// 🎨 DEMO DATA - Backend ready hone tak ye use hoga
const DEMO_BOOKS = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic American novel set in the Jazz Age that explores themes of wealth, love, and the American Dream.',
    bookCover: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400',
    isbn: '978-0743273565',
    publicationYear: 1925,
    category: 'Fiction',
    isAvailable: true
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A gripping tale of racial injustice and childhood innocence in the American South.',
    bookCover: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400',
    isbn: '978-0061120084',
    publicationYear: 1960,
    category: 'Fiction',
    isAvailable: true
  },
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian social science fiction novel about totalitarianism and surveillance.',
    bookCover: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400',
    isbn: '978-0451524935',
    publicationYear: 1949,
    category: 'Fiction',
    isAvailable: false
  },
  {
    id: '4',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    description: 'A brief history of humankind from the Stone Age to the modern era.',
    bookCover: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400',
    isbn: '978-0062316097',
    publicationYear: 2011,
    category: 'History',
    isAvailable: true
  },
  {
    id: '5',
    title: 'The Selfish Gene',
    author: 'Richard Dawkins',
    description: 'A revolutionary approach to understanding evolution and natural selection.',
    bookCover: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400',
    isbn: '978-0198788607',
    publicationYear: 1976,
    category: 'Science',
    isAvailable: true
  },
  {
    id: '6',
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    description: 'The exclusive biography of the Apple co-founder and tech visionary.',
    bookCover: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400',
    isbn: '978-1451648539',
    publicationYear: 2011,
    category: 'Biography',
    isAvailable: true
  },
  {
    id: '7',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    description: 'A handbook of agile software craftsmanship for writing clean, maintainable code.',
    bookCover: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400',
    isbn: '978-0132350884',
    publicationYear: 2008,
    category: 'Technology',
    isAvailable: true
  },
  {
    id: '8',
    title: 'Meditations',
    author: 'Marcus Aurelius',
    description: 'Personal writings by the Roman Emperor on Stoic philosophy.',
    bookCover: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400',
    isbn: '978-0812968255',
    publicationYear: 180,
    category: 'Philosophy',
    isAvailable: false
  },
  {
    id: '9',
    title: 'The Lean Startup',
    author: 'Eric Ries',
    description: 'How constant innovation creates radically successful businesses.',
    bookCover: 'https://images.unsplash.com/photo-1551135049-8a33b5883817?w=400',
    isbn: '978-0307887894',
    publicationYear: 2011,
    category: 'Technology',
    isAvailable: true
  },
  {
    id: '10',
    title: 'The Odyssey',
    author: 'Homer',
    description: 'Ancient Greek epic poem attributed to Homer.',
    bookCover: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400',
    isbn: '978-0140268867',
    publicationYear: -700,
    category: 'Poetry',
    isAvailable: true
  }
];

/**
 * ⚠️ DEMO MODE - Frontend Preview Version
 * 
 * Backend calls are DISABLED for frontend testing.
 * All operations work with local state only.
 * 
 * 🔮 To enable backend:
 * 1. Uncomment all "PRODUCTION MODE" sections
 * 2. Comment out all "DEMO MODE" sections
 * 3. Ensure backend API is running
 */
export function useBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================
  // 📥 LOAD BOOKS ON MOUNT
  // ==========================================
  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    // ⚠️ DEMO MODE: Load from demo data
    setLoading(true);
    setTimeout(() => {
      setBooks(DEMO_BOOKS);
      setLoading(false);
    }, 300); // Simulating network delay

    /* 🔮 PRODUCTION MODE: Uncomment when backend ready
    try {
      setLoading(true);
      const response = await fetch('/api/admin/books');
      if (!response.ok) throw new Error('Failed to fetch books');
      const data = await response.json();
      setBooks(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
    */
  };

  // ==========================================
  // ➕ ADD BOOK
  // ==========================================
  const addBook = async (bookData) => {
    // ⚠️ DEMO MODE: Add to local state
    const newBook = {
      ...bookData,
      id: Date.now().toString()
    };
    setBooks([newBook, ...books]);
    return { success: true, book: newBook };

    /* 🔮 PRODUCTION MODE: Uncomment when backend ready
    try {
      const response = await fetch('/api/admin/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      if (!response.ok) throw new Error('Failed to add book');
      const newBook = await response.json();
      setBooks([newBook, ...books]);
      return { success: true, book: newBook };
    } catch (err) {
      return { success: false, error: err.message };
    }
    */
  };

  // ==========================================
  // ✏️ UPDATE BOOK
  // ==========================================
  const updateBook = async (bookId, bookData) => {
    // ⚠️ DEMO MODE: Update in local state
    const updatedBooks = books.map(book =>
      book.id === bookId ? { ...book, ...bookData } : book
    );
    setBooks(updatedBooks);
    return { success: true };

    /* 🔮 PRODUCTION MODE: Uncomment when backend ready
    try {
      const response = await fetch(`/api/admin/books/${bookId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookData)
      });
      if (!response.ok) throw new Error('Failed to update book');
      const updatedBook = await response.json();
      setBooks(books.map(book => book.id === bookId ? updatedBook : book));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
    */
  };

  // ==========================================
  // 🗑️ DELETE BOOK
  // ==========================================
  const deleteBook = async (bookId) => {
    // ⚠️ DEMO MODE: Delete from local state
    setBooks(books.filter(book => book.id !== bookId));
    return { success: true };

    /* 🔮 PRODUCTION MODE: Uncomment when backend ready
    try {
      const response = await fetch(`/api/admin/books/${bookId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete book');
      setBooks(books.filter(book => book.id !== bookId));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
    */
  };

  // ==========================================
  // 👁️ TOGGLE AVAILABILITY
  // ==========================================
  const toggleAvailability = async (bookId) => {
    // ⚠️ DEMO MODE: Toggle in local state
    const updatedBooks = books.map(b =>
      b.id === bookId ? { ...b, isAvailable: !b.isAvailable } : b
    );
    setBooks(updatedBooks);
    return { success: true };

    /* 🔮 PRODUCTION MODE: Uncomment when backend ready
    try {
      const book = books.find(b => b.id === bookId);
      const response = await fetch(`/api/admin/books/${bookId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isAvailable: !book.isAvailable })
      });
      if (!response.ok) throw new Error('Failed to toggle availability');
      const updatedBook = await response.json();
      setBooks(books.map(b => b.id === bookId ? updatedBook : b));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
    */
  };

  return {
    books,
    loading,
    error,
    addBook,
    updateBook,
    deleteBook,
    toggleAvailability,
    refreshBooks: loadBooks
  };
}