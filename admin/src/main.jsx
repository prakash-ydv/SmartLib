import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BookProvider } from "./context/BookContext.jsx";
import { AddBookProvider } from "./context/AddBookContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BookProvider>
      <AddBookProvider>
        <App />
      </AddBookProvider>
    </BookProvider>
  </StrictMode>
);
