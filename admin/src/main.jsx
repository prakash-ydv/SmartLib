import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

import { AuthProvider } from "./context/Authcontext";
import { BookProvider } from "./context/BookContext";
import { AddBookProvider } from "./context/AddBookContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <BookProvider>
          <AddBookProvider>
            <App />
          </AddBookProvider>
        </BookProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
