// ============================================
// 📄 PAGINATION COMPONENT — IES SMARTLIB
// Mobile-First | Dark Navy | Accessible
// ============================================

import React from "react";
import {
  ChevronLeft, ChevronRight,
  ChevronsLeft, ChevronsRight,
} from "lucide-react";

// ── Page number generator ─────────────────────────────────────
const getPageNumbers = (currentPage, totalPages) => {
  const pages = [];

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
    return pages;
  }

  if (currentPage <= 3) {
    pages.push(1, 2, 3, 4, "...", totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
  }

  return pages;
};

// ── Nav button ────────────────────────────────────────────────
const NavBtn = ({ onClick, disabled, label, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    aria-label={label}
    className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-xl border-2 border-gray-200 text-gray-500 hover:border-[#0f172a] hover:bg-[#0f172a] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a] focus-visible:ring-offset-1 active:scale-95"
  >
    {children}
  </button>
);

// ============================================================
// 📄 PAGINATION COMPONENT
// ============================================================
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
}) => {
  const startItem  = (currentPage - 1) * itemsPerPage + 1;
  const endItem    = Math.min(currentPage * itemsPerPage, totalItems);
  const pageNumbers = getPageNumbers(currentPage, totalPages);

  if (totalPages <= 1) return null;

  return (
    <nav
      aria-label="Pagination"
      className="mt-8 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
    >
      {/* Top accent line */}
      <div
        className="h-[3px]"
        style={{ background: "linear-gradient(90deg,#0f172a 0%,#4f46e5 50%,#7c3aed 100%)" }}
        aria-hidden="true"
      />

      <div className="px-4 md:px-6 py-4 md:py-5">

        {/* ════════════════════════════════════════
            MOBILE LAYOUT
        ════════════════════════════════════════ */}
        <div className="flex flex-col gap-4 md:hidden">

          {/* Count info */}
          <div className="flex items-center justify-center gap-1.5 text-xs text-gray-500 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
            <span>Showing</span>
            <span className="font-bold text-[#0f172a]">{startItem}–{endItem}</span>
            <span>of</span>
            <span className="font-bold text-[#0f172a]">{totalItems.toLocaleString()} books</span>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            {/* First + Prev */}
            <div className="flex gap-2">
              <NavBtn onClick={() => onPageChange(1)} disabled={currentPage === 1} label="First page">
                <ChevronsLeft className="h-4 w-4" />
              </NavBtn>
              <NavBtn onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} label="Previous page">
                <ChevronLeft className="h-4 w-4" />
              </NavBtn>
            </div>

            {/* Current / Total */}
            <div
              className="px-6 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "linear-gradient(135deg,#0f172a,#1e293b)" }}
              aria-live="polite"
              aria-atomic="true"
            >
              {currentPage}
              <span className="text-white/40 mx-1.5">/</span>
              {totalPages}
            </div>

            {/* Next + Last */}
            <div className="flex gap-2">
              <NavBtn onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} label="Next page">
                <ChevronRight className="h-4 w-4" />
              </NavBtn>
              <NavBtn onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} label="Last page">
                <ChevronsRight className="h-4 w-4" />
              </NavBtn>
            </div>
          </div>

          {/* Per page */}
          <div className="flex items-center justify-center gap-3 bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
            <label htmlFor="ipp-mobile" className="text-xs font-semibold text-gray-600">
              Per page:
            </label>
            <select
              id="ipp-mobile"
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="min-h-[40px] px-3 py-1.5 bg-white border-2 border-gray-200 rounded-lg text-sm font-bold text-[#0f172a] focus:border-[#0f172a] focus:outline-none transition-all cursor-pointer"
            >
              {[12, 24, 48, 96].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ════════════════════════════════════════
            DESKTOP LAYOUT
        ════════════════════════════════════════ */}
        <div className="hidden md:flex items-center justify-between gap-4">

          {/* Left — info + per page */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm text-gray-500 bg-gray-50 px-4 py-2.5 rounded-xl border border-gray-100">
              <span>Showing</span>
              <span className="font-bold text-[#0f172a]">{startItem}–{endItem}</span>
              <span>of</span>
              <span className="font-bold text-[#0f172a]">{totalItems.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-2 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-100">
              <label htmlFor="ipp-desktop" className="text-sm font-semibold text-gray-600 whitespace-nowrap">
                Per page:
              </label>
              <select
                id="ipp-desktop"
                value={itemsPerPage}
                onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
                className="px-3 py-1.5 bg-white border-2 border-gray-200 rounded-lg text-sm font-bold text-[#0f172a] focus:border-[#0f172a] focus:outline-none transition-all cursor-pointer"
              >
                {[12, 24, 48, 96].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Right — page controls */}
          <div className="flex items-center gap-1.5">

            <NavBtn onClick={() => onPageChange(1)} disabled={currentPage === 1} label="First page">
              <ChevronsLeft className="h-4 w-4" />
            </NavBtn>

            <NavBtn onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} label="Previous page">
              <ChevronLeft className="h-4 w-4" />
            </NavBtn>

            {/* Page numbers */}
            <div className="flex items-center gap-1 mx-1" role="list">
              {pageNumbers.map((page, idx) =>
                page === "..." ? (
                  <span
                    key={`ellipsis-${idx}`}
                    className="px-2 text-gray-300 font-bold text-sm select-none"
                    aria-hidden="true"
                  >
                    ···
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? "page" : undefined}
                    className={`min-w-[40px] h-10 px-3 rounded-xl text-sm font-bold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f172a] focus-visible:ring-offset-1 active:scale-95 ${
                      currentPage === page
                        ? "text-white shadow-md scale-105"
                        : "border-2 border-gray-200 text-gray-600 hover:border-[#0f172a] hover:bg-[#0f172a] hover:text-white"
                    }`}
                    style={
                      currentPage === page
                        ? { background: "linear-gradient(135deg,#0f172a,#1e293b)" }
                        : {}
                    }
                  >
                    {page}
                  </button>
                )
              )}
            </div>

            <NavBtn onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} label="Next page">
              <ChevronRight className="h-4 w-4" />
            </NavBtn>

            <NavBtn onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} label="Last page">
              <ChevronsRight className="h-4 w-4" />
            </NavBtn>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Pagination;