// admin/src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Default Admin Dashboard */}
        <Route path="/" element={<AdminDashboard />} />

        {/* Test / Demo Route */}
        <Route path="/h" element={<h1>Hii</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
