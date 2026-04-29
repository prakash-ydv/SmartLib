import {
  createContext,
  useState,
  useContext,
} from "react";
import { getAllBooks } from "../api/bookAPI";

export const BookContext = createContext(null);

export function BookProvider({ children }) {
  const [allBooks, setAllBooks] = useState([]);
  const [pagination, setPagination] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBooks = async (page = 1, limit = 24) => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAllBooks(page, limit);

      setAllBooks(res.data || []);
      setPagination(res.pagination || {});
    } catch (err) {
      console.error("❌ Fetch error:", err.message);
      setError("Failed to load books");
    } finally {
      setLoading(false);
    }
  };

  const refreshBooks = () => {
    fetchBooks(1, 24);
  };

  return (
    <BookContext.Provider
      value={{
        allBooks,
        pagination,
        loading,
        error,
        fetchBooks,
        refreshBooks,
      }}
    >
      {children}
    </BookContext.Provider>
  );
}

export function useBooks() {
  return useContext(BookContext);
}