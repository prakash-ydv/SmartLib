import React, { createContext, useState } from 'react';

export const BookContext = createContext();

export const BookProvider = ({ children }) => {
    const [books, setBooks] = useState([]);

    const addBook = (book) => {
        setBooks([...books, book]);
    };

    const removeBook = (id) => {
        setBooks(books.filter(book => book.id !== id));
    };

    const value = {
        books,
        addBook,
        removeBook,
    };

    return (
        <BookContext.Provider value={value}>
            {children}
        </BookContext.Provider>
    );
};