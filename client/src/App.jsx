// // src/App.jsx
// import "./index.css";
// import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
// import { Suspense, lazy, useEffect } from "react";
// import { BookProvider } from "./context/BookContext";

// // Components
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import CampusAccessGate from "./components/CampusAccessGate";

// // Lazy loaded pages
// const HomePage = lazy(() => import("./pages/HomePage"));
// const BookDetails = lazy(() => import("./pages/BookDetailPage"));
// const LibraryAdmin = lazy(() => import("./pages/Adminpanel"));

// // Loading Component
// const LoadingSpinner = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen">
//     <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
//     <p className="text-gray-600 text-lg">Loading...</p>
//   </div>
// );

// // 404 Page
// const NotFound = () => (
//   <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-50 to-gray-100">
//     <div className="text-center">
//       <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
//       <h2 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h2>
//       <p className="text-xl text-gray-600 mb-8">
//         The page you're looking for doesn't exist.
//       </p>
//       <a 
//         href="/" 
//         className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
//       >
//         <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
//         </svg>
//         Go Home
//       </a>
//     </div>
//   </div>
// );

// // Scroll to Top
// function ScrollToTop() {
//   const { pathname } = useLocation();
//   useEffect(() => {
//     window.scrollTo({ top: 0, behavior: 'smooth' });
//   }, [pathname]);
//   return null;
// }

// // Protected Route
// const ProtectedRoute = ({ children }) => (
//   <CampusAccessGate>{children}</CampusAccessGate>
// );

// // Main App
// function App() {
//   return (
//     <BookProvider>
//       <BrowserRouter>
//         <ScrollToTop />
//         <div className="flex flex-col min-h-screen bg-gray-50">
//           <Header />
//           <main className="flex-grow">
//             <Suspense fallback={<LoadingSpinner />}>
//               <Routes>
//                 <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
//                 <Route path="/book/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
//                 <Route path="/admin" element={<LibraryAdmin />} />
//                 <Route path="*" element={<NotFound />} />
//               </Routes>
//             </Suspense>
//           </main>
//           <Footer />
//         </div>
//       </BrowserRouter>
//     </BookProvider>
//   );
// }

// export default App;


// src/App.jsx
import "./index.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { BookProvider } from "./context/BookContext";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";

// ❌ CampusAccessGate removed

// Lazy loaded pages
const HomePage = lazy(() => import("./pages/HomePage"));
const BookDetails = lazy(() => import("./pages/BookDetailPage"));
const LibraryAdmin = lazy(() => import("./pages/Adminpanel"));

// Loading Component
const LoadingSpinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mb-4"></div>
    <p className="text-gray-600 text-lg">Loading...</p>
  </div>
);

// 404 Page
const NotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-screen px-4 bg-gradient-to-br from-gray-50 to-gray-100">
    <div className="text-center">
      <h1 className="text-9xl font-bold text-gray-300 mb-4">404</h1>
      <h2 className="text-3xl font-bold text-gray-800 mb-2">Page Not Found</h2>
      <p className="text-xl text-gray-600 mb-8">
        The page you're looking for doesn't exist.
      </p>
      <a 
        href="/" 
        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
      >
        Go Home
      </a>
    </div>
  </div>
);

// Scroll to Top
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// ✅ Direct access (no protection)
const ProtectedRoute = ({ children }) => children;

// Main App
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
                <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
                <Route path="/book/:id" element={<ProtectedRoute><BookDetails /></ProtectedRoute>} />
                <Route path="/admin" element={<LibraryAdmin />} />
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
