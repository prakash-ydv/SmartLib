/* eslint-disable react-refresh/only-export-components */
import { createContext, useState } from "react";

export const AddBookContext = createContext();

export function AddBookProvider({ children }) {
  const [isAddBookFormOpen, setIsAddBookFormOpen] = useState(false);

  function toggleAddBookForm() {
    setIsAddBookFormOpen((prev) => !prev);
  }

  return (
    <AddBookContext.Provider value={{ toggleAddBookForm, isAddBookFormOpen }}>
      {children}
    </AddBookContext.Provider>
  );
}
