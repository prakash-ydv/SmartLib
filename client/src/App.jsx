// ============================================
// 🚀 MAIN APP COMPONENT
// ============================================
// Location: client/src/App.jsx
// Purpose: Main app with routing and context
// ============================================

import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// ============================================
// 📦 CONTEXT PROVIDER
// ============================================
import { BookProvider } from "./context/BookContext";

// ============================================
// 📄 COMPONENT IMPORTS
// ============================================
import Header from "./components/Header";
import Footer from "./components/Footer";
import LibraryAdmin from "./pages/Adminpanel";
import HomePage from "./pages/HomePage";
import BookDetails from "./components/BookDetails";

// ============================================
// 🎨 MAIN APP
// ============================================
function App() {
  return (
    // ✅ Wrap everything with BookProvider
    // This makes book data available to all components
    <BookProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-50">
          
          {/* Header - Always visible */}
          <Header />

          {/* Routes - Different pages */}
          <Routes>
            {/* Home Page - Book list */}
            <Route path="/" element={<HomePage />} />

            {/* Book Details Page - Single book view */}
            <Route path="/book/:id" element={<BookDetails />} />

            {/* Admin Panel - Management */}
            <Route path="/admin" element={<LibraryAdmin />} />
          </Routes>

          {/* Footer - Always visible */}
          <Footer />
        </div>
      </BrowserRouter>
    </BookProvider>
  );
}

export default App;