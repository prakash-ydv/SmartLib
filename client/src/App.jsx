import "./index.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { BookProvider } from "./context/BookContext";
import Header from "./components/Header";
import Footer from "./components/Footer";

const HomePage = lazy(() => import("./pages/HomePage"));
const BookDetails = lazy(() => import("./pages/BookDetailPage"));

const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen px-4">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4" />
    <p className="text-gray-600 text-lg text-center">Loading SmartLib...</p>
  </div>
);

const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="text-center">
      <h1 className="text-7xl sm:text-9xl font-bold text-gray-300 mb-4">404</h1>
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
        Page Not Found
      </h2>
      <p className="text-base sm:text-xl text-gray-600 mb-8">
        The page you are looking for does not exist.
      </p>
      <a
        href="/"
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md min-h-[44px]"
      >
        Go Home
      </a>
    </div>
  </div>
);

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BookProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Header />
          <main className="flex-grow">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/book/:id" element={<BookDetails />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </BookProvider>
  );
}

export default App;
