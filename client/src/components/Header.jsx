import React, { useState, useEffect, useRef } from "react";
import { QrCode, Menu, X, BookOpen } from "lucide-react";
import logo from "../assets/logo.png";

// ============================================================
// 🏛️ IES UNIVERSITY SMARTLIB — PRODUCTION HEADER
// Mobile-first | Institutional | Dark Navy Base
// ============================================================

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [qrTooltipOpen, setQrTooltipOpen] = useState(false);
  const qrRef = useRef(null);

  // ── Scroll detection ──────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ── Close mobile menu on resize ──────────────────────────
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false);
    };
    window.addEventListener("resize", handleResize, { passive: true });
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ── Close QR tooltip on outside click ────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (qrRef.current && !qrRef.current.contains(e.target)) {
        setQrTooltipOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ── Lock body scroll when mobile menu open ───────────────
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-out ${
          scrolled
            ? "bg-white/98 backdrop-blur-xl shadow-[0_2px_24px_rgba(0,0,0,0.08)] border-b border-gray-100"
            : "bg-[#0f172a]"
        }`}
        style={{ willChange: "background-color, box-shadow" }}
      >
        {/* ── Top accent line (always visible on dark, hidden on white) ── */}
        <div
          className={`h-[3px] w-full transition-opacity duration-300 ${
            scrolled ? "opacity-0" : "opacity-100"
          }`}
          style={{
            background:
              "linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-5 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-[72px]">
            {/* ══════════════════════════════════════════
                LOGO SECTION
            ══════════════════════════════════════════ */}
            <a
              href="/"
              className="flex items-center gap-4 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-xl"
              aria-label="IES University SmartLib — Home"
            >
              {/* Logo block */}
              <div className="relative shrink-0">
                <img
                  src={logo}
                  alt="IES University"
                  className="h-15 w-16 md:h-16 md:w-16 object-contain rounded-xl shadow-sm transition-all duration-300 group-hover:scale-105"
                  onError={(e) => {
                    e.target.style.display = "none";
                    e.target.nextSibling.style.display = "flex";
                  }}
                />

                {/* Fallback icon */}
                <div
                  className="hidden h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-xl bg-blue-600"
                  aria-hidden="true"
                >
                  <BookOpen className="h-7 w-7 text-white" />
                </div>

                {/* Online indicator */}
                <span
                  className="absolute top-0 right-0 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-white animate-pulse"
                  aria-label="System online"
                />
              </div>

              {/* Branding text */}
              <div className="leading-tight">
                <p
                  className={`text-lg md:text-xl font-bold tracking-tight transition-colors duration-300 ${
                    scrolled ? "text-gray-900" : "text-white"
                  }`}
                >
                  IES University
                </p>

                <p
                  className={`text-xs md:text-sm font-medium tracking-wide transition-colors duration-300 ${
                    scrolled ? "text-blue-600" : "text-blue-300"
                  }`}
                >
                  SmartLib — Digital Catalog
                </p>
              </div>
            </a>
            {/* ══════════════════════════════════════════
                DESKTOP RIGHT SECTION
            ══════════════════════════════════════════ */}
            <div className="hidden md:flex items-center gap-3">
              {/* Book count chip */}
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
                  scrolled
                    ? "bg-gray-100 text-gray-600"
                    : "bg-white/10 text-white/80"
                }`}
              >
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0"
                  aria-hidden="true"
                />
                30,000+ copies
              </div>

              {/* QR Code button */}
              <div className="relative" ref={qrRef}>
                <button
                  onClick={() => setQrTooltipOpen((v) => !v)}
                  aria-expanded={qrTooltipOpen}
                  aria-haspopup="dialog"
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                    scrolled
                      ? "border-indigo-200 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 active:scale-95"
                      : "border-white/20 bg-white/10 text-white hover:bg-white/20 active:scale-95"
                  }`}
                >
                  <QrCode className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>Scan to Access</span>
                </button>

                {/* QR Tooltip / Popover */}
                {qrTooltipOpen && (
                  <div
                    role="dialog"
                    aria-label="QR Code access information"
                    className="absolute right-0 top-full mt-2 w-64 rounded-2xl bg-white shadow-2xl border border-gray-100 p-4 animate-in slide-in-from-top z-50"
                  >
                    {/* QR placeholder — replace with actual QR image */}
                    <div className="flex items-center justify-center w-full h-32 bg-gray-50 rounded-xl mb-3 border border-gray-200">
                      <div className="text-center">
                        <QrCode className="h-12 w-12 text-indigo-400 mx-auto mb-1" />
                        <p className="text-[10px] text-gray-400 font-medium">
                          QR Code Here
                        </p>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-800 mb-1">
                      Outside campus?
                    </p>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Scan this QR code from outside the library to access the
                      digital catalog.
                    </p>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <p className="text-[10px] text-gray-400 font-medium">
                        Geolocation secured · Campus only
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* ══════════════════════════════════════════
                MOBILE HAMBURGER
            ══════════════════════════════════════════ */}
            <button
              onClick={() => setMobileMenuOpen((v) => !v)}
              className={`md:hidden p-2 rounded-xl transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                scrolled
                  ? "text-gray-700 hover:bg-gray-100"
                  : "text-white hover:bg-white/10"
              }`}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Menu className="h-5 w-5" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* ── Scroll progress line ─────────────────────────────── */}
        <div
          className={`h-[2px] transition-opacity duration-300 ${
            scrolled ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background:
              "linear-gradient(90deg, #3b82f6 0%, #6366f1 50%, #8b5cf6 100%)",
          }}
        />
      </header>

      {/* ══════════════════════════════════════════════════════
          MOBILE MENU — Full screen overlay
      ══════════════════════════════════════════════════════ */}
      {mobileMenuOpen && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
          className="fixed inset-0 z-40 bg-[#0f172a] flex flex-col"
          style={{
            paddingTop: "calc(64px + 3px)",
          }} /* header height + accent line */
        >
          {/* Background texture */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
            aria-hidden="true"
          />

          <div className="relative flex flex-col h-full px-5 pt-8 pb-10">
            {/* Institution name — large */}
            <div className="mb-10">
              <p className="text-xs font-semibold tracking-widest text-blue-400 uppercase mb-2">
                IES University
              </p>
              <h2 className="text-3xl font-bold text-white leading-tight">
                SmartLib
              </h2>
              <p className="text-sm text-white/40 mt-1">
                Digital Library Catalog
              </p>
            </div>

            {/* QR section — prominent in mobile */}
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30">
                  <QrCode
                    className="h-6 w-6 text-indigo-300"
                    aria-hidden="true"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white mb-1">
                    Scan to Access Outside
                  </p>
                  <p className="text-xs text-white/50 leading-relaxed">
                    Use QR code from outside the library building to browse the
                    catalog remotely.
                  </p>
                </div>
              </div>
            </div>

            {/* Stats chips */}
            <div className="flex gap-3 flex-wrap mb-auto">
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-emerald-400"
                  aria-hidden="true"
                />
                <span className="text-xs text-white/60 font-medium">
                  30,000+ copies
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-blue-400"
                  aria-hidden="true"
                />
                <span className="text-xs text-white/60 font-medium">
                  104 departments
                </span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10">
                <span
                  className="h-1.5 w-1.5 rounded-full bg-purple-400"
                  aria-hidden="true"
                />
                <span className="text-xs text-white/60 font-medium">
                  Campus secured
                </span>
              </div>
            </div>

            {/* Close button at bottom */}
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-full mt-8 py-3.5 rounded-xl bg-white/10 text-white text-sm font-semibold hover:bg-white/15 active:scale-98 transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
