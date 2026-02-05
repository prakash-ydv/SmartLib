// ============================================
// 🚀 MAIN APP COMPONENT - OPTIMIZED
// ============================================

import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";

// ============================================
// 📦 CONTEXT PROVIDER
// ============================================
import { BookProvider } from "./context/BookContext";

// ============================================
// 📄 COMPONENT IMPORTS
// ============================================
import Header from "./components/Header";
import Footer from "./components/Footer";

// Lazy load pages for better performance
const HomePage = lazy(() => import("./pages/HomePage"));
const BookDetails = lazy(() => import("./components/BookDetails"));
const LibraryAdmin = lazy(() => import("./pages/Adminpanel"));

// ============================================
// 🎨 LOADING COMPONENT
// ============================================
const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
  </div>
);

// ============================================
// 🚫 404 NOT FOUND
// ============================================
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen px-4">
    <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
    <p className="text-xl text-gray-600 mb-8">Page not found</p>
    <a href="/" className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
      Go Home
    </a>
  </div>
);

// ============================================
// 📜 SCROLL TO TOP COMPONENT
// ============================================
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

// ============================================
// 🎨 MAIN APP
// ============================================
function App() {
  return (
    <BookProvider>
      <BrowserRouter>
        <ScrollToTop />
        
        {/* Flex layout for sticky footer */}
        <div className="flex flex-col min-h-screen bg-gray-50">
          
          {/* Header - Always visible */}
          <Header />

          {/* Main Content - Grows to push footer down */}
          <main className="flex-grow">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Home Page */}
                <Route path="/" element={<HomePage />} />

                {/* Book Details Page */}
                <Route path="/book/:id" element={<BookDetails />} />

                {/* Admin Panel */}
                <Route path="/admin" element={<LibraryAdmin />} />

                {/* 404 - Catch all routes */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>

          {/* Footer - Sticky at bottom */}
          <Footer />
        </div>
      </BrowserRouter>
    </BookProvider>
  );
}

export default App;