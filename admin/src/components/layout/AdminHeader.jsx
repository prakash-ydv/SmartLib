// ============================================================
// 🏛️ ADMIN HEADER — IES SMARTLIB
// File location: src/components/layout/AdminHeader.jsx
// Logo location: src/assets/logo.png
// ============================================================

import React, { useState, useRef, useEffect } from "react";
import {
  Menu, X, Download, Plus, LogOut,
  Settings, BookOpen, ChevronDown, FileDown,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { adminLogout } from "../../api/axios";

// ✅ Logo import — src/components/layout/ → ../../assets/logo.png
import logo from "../../assets/logo.png";

// Departments for export dropdown
import { DEPARTMENTS } from "../../api/axios";

// ============================================================
// 📤 EXPORT MODAL
// ============================================================
const ExportModal = ({ isOpen, onClose, onExport }) => {
  const [selected, setSelected] = useState("all");
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div role="dialog" aria-modal="true" aria-labelledby="export-title"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between bg-[#0f172a]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <FileDown className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 id="export-title" className="text-base font-bold text-white">Export Catalog</h2>
              <p className="text-xs text-white/50">Download as CSV</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors" aria-label="Close">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div>
            <label htmlFor="export-dept" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">
              Select Department
            </label>
            <div className="relative">
              <select id="export-dept" value={selected} onChange={(e) => setSelected(e.target.value)}
                className="w-full min-h-[44px] pl-4 pr-10 py-3 text-sm font-medium text-gray-800 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-[#0f172a] focus:outline-none appearance-none cursor-pointer">
                <option value="all">All Departments (Full Export)</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-xl border border-blue-100">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
            <p className="text-xs text-blue-700 leading-relaxed">
              {selected === "all" ? "All books from every department will be exported." : `Only books from "${selected}" will be exported.`}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button onClick={() => { onExport(selected); onClose(); }}
            className="flex-1 py-3 rounded-xl text-sm font-bold text-white bg-[#0f172a] hover:bg-[#1e293b] flex items-center justify-center gap-2 transition-colors active:scale-95">
            <Download className="h-4 w-4" />Export CSV
          </button>
        </div>
      </div>
    </>
  );
};

// ============================================================
// 🗑️ DELETE CONFIRM MODAL — named export
// Usage in AdminDashboard:
// import AdminHeader, { DeleteConfirmModal } from "../components/layout/AdminHeader";
// ============================================================
export const DeleteConfirmModal = ({ isOpen, onConfirm, onCancel, bookTitle }) => {
  if (!isOpen) return null;
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onCancel} aria-hidden="true" />
      <div role="dialog" aria-modal="true"
        className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="h-7 w-7 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-1">Delete Book?</h2>
          {bookTitle && <p className="text-sm text-gray-500 mb-1">"{bookTitle}"</p>}
          <p className="text-xs text-gray-400 mb-6">This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={onConfirm} className="flex-1 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-sm font-bold active:scale-95">Delete</button>
          </div>
        </div>
      </div>
    </>
  );
};

// ============================================================
// 🏛️ MAIN ADMIN HEADER
// ============================================================
const AdminHeader = ({ onAddBook, onExportCSV, totalBooks = 0 }) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen]   = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [logoError, setLogoError]             = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
    await adminLogout();
    navigate("/login", { replace: true });
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40" style={{ background: "#0f172a" }}>
        {/* Accent line */}
        <div className="h-[3px] w-full" style={{ background: "linear-gradient(90deg,#3b82f6,#6366f1,#8b5cf6)" }} aria-hidden="true" />

        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <div className="flex items-center gap-3 shrink-0">
              {!logoError ? (
                <img src={logo} alt="IES University" className="h-10 w-10 object-contain rounded-lg"
                  onError={() => setLogoError(true)} />
              ) : (
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              )}
              <div className="leading-none">
                <p className="text-[15px] font-bold text-white tracking-tight">IES University</p>
                <p className="text-[11px] font-medium text-blue-300 tracking-wide">SmartLib · Admin Portal</p>
              </div>
            </div>

            {/* Desktop actions */}
            <div className="hidden md:flex items-center gap-2">
              {/* Book count chip */}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mr-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-white/60 font-medium">{totalBooks.toLocaleString()} books</span>
              </div>

              {/* Export */}
              <button onClick={() => setExportModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white text-sm font-semibold transition-all active:scale-95">
                <Download className="h-4 w-4" />Export
              </button>

              {/* Add Book */}
              <button onClick={onAddBook}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-lg transition-all active:scale-95">
                <Plus className="h-4 w-4" />Add Book
              </button>

              <div className="h-6 w-px bg-white/10 mx-1" />

              {/* Profile dropdown */}
              <div className="relative" ref={profileRef}>
                <button onClick={() => setProfileMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 transition-colors"
                  aria-expanded={profileMenuOpen}>
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">AU</div>
                  <span className="text-sm font-medium text-white/80 hidden lg:block">Admin</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-white/40 transition-transform duration-200 ${profileMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50">
                    <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900">Admin User</p>
                      <p className="text-xs text-gray-400">Administrator</p>
                    </div>
                    <div className="py-1">
                      <button onClick={() => { setProfileMenuOpen(false); navigate("/settings"); }}
                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2.5">
                        <Settings className="h-4 w-4 text-gray-400" />Settings
                      </button>
                      <button onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5">
                        <LogOut className="h-4 w-4" />Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen((v) => !v)}
              className="md:hidden p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}>
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile bottom sheet */}
      {mobileMenuOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
          <div role="dialog" aria-modal="true" className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">AU</div>
              <div>
                <p className="text-sm font-bold text-gray-900">Admin User</p>
                <p className="text-xs text-gray-400">IES SmartLib Portal</p>
              </div>
            </div>
            <div className="px-4 py-3 space-y-2">
              <button onClick={() => { onAddBook(); setMobileMenuOpen(false); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-indigo-600 text-white rounded-2xl font-semibold text-sm">
                <Plus className="h-5 w-5" />Add New Book
              </button>
              <button onClick={() => { setMobileMenuOpen(false); setExportModalOpen(true); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 text-gray-700 rounded-2xl font-semibold text-sm border border-gray-200">
                <Download className="h-5 w-5 text-gray-500" />Export Catalog
              </button>
              <button onClick={() => { setMobileMenuOpen(false); navigate("/settings"); }}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-gray-50 text-gray-700 rounded-2xl font-semibold text-sm border border-gray-200">
                <Settings className="h-5 w-5 text-gray-500" />Settings
              </button>
            </div>
            <div className="px-4 pb-8 pt-1">
              <button onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 bg-red-50 text-red-600 rounded-2xl font-semibold text-sm border border-red-100">
                <LogOut className="h-5 w-5" />Logout
              </button>
            </div>
          </div>
        </>
      )}

      {/* Export Modal */}
      <ExportModal isOpen={exportModalOpen} onClose={() => setExportModalOpen(false)} onExport={(dept) => { if (typeof onExportCSV === "function") onExportCSV(dept); }} />
    </>
  );
};

export default AdminHeader;