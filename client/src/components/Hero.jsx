// ============================================================
// 🎨 HERO COMPONENT — IES UNIVERSITY SMARTLIB
// Full-screen image slider · Embedded search · Stats
// Mobile-first · Production-ready · Zero external deps
// ============================================================

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, Users, TrendingUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

// ──────────────────────────────────────────────────────────────
// 📸 SLIDE DATA
// Replace src values with your actual college/library images.
// Place images in: /src/assets/hero/
// Recommended size: 1920×1080px, JPG compressed <300KB each
// ──────────────────────────────────────────────────────────────
import slide1 from "../assets/hero/slide1.jpg";
import slide2 from "../assets/hero/slide2.jpg";
import slide3 from "../assets/hero/slide3.jpg";
import slide4 from "../assets/hero/slide4.jpg";

const SLIDES = [
  {
    src: slide1,
    alt: "IES University Library — Main Reading Hall",
    headline: "Discover Your Next Great Read",
    sub: "Browse 50,000+ books across 104 departments — instantly.",
  },
  {
    src: slide2,
    alt: "IES University Campus",
    headline: "Knowledge at Your Fingertips",
    sub: "Scan. Search. Reserve. Your campus library, reimagined.",
  },
  {
    src: slide3,
    alt: "IES University Digital Library",
    headline: "One Scan. Every Book.",
    sub: "QR-based access brings the entire catalog to your phone.",
  },
  {
    src: slide4,
    alt: "IES University Students",
    headline: "Built for Every Student",
    sub: "Smart filters, real-time availability, 104 departments covered.",
  },
];

const AUTOPLAY_INTERVAL = 5000; // 5 seconds

// ──────────────────────────────────────────────────────────────
// 📊 STATS DATA
// ──────────────────────────────────────────────────────────────
const STATS = [
  {
    icon: BookOpen,
    value: "50,000+",
    label: "Books Available",
    color: "from-blue-400 to-cyan-400",
  },
  {
    icon: Users,
    value: "5,000+",
    label: "Active Readers",
    color: "from-violet-400 to-purple-400",
  },
  {
    icon: TrendingUp,
    value: "104",
    label: "Departments",
    color: "from-emerald-400 to-green-400",
  },
];

// ============================================================
// 🎨 HERO COMPONENT
// ============================================================
const Hero = ({ onSearch }) => {
  const navigate = useNavigate();

  // ── Slider state ─────────────────────────────────────────
  const [current, setCurrent] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayRef = useRef(null);
  const totalSlides = SLIDES.length;

  // ── Search state ─────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState("");
  const searchInputRef = useRef(null);

  // ──────────────────────────────────────────────────────────
  // 🔄 SLIDER LOGIC
  // ──────────────────────────────────────────────────────────
  const goToSlide = useCallback(
    (index) => {
      if (isTransitioning) return;
      setIsTransitioning(true);
      setCurrent((index + totalSlides) % totalSlides);
      setTimeout(() => setIsTransitioning(false), 700);
    },
    [isTransitioning, totalSlides]
  );

  const nextSlide = useCallback(() => goToSlide(current + 1), [current, goToSlide]);
  const prevSlide = useCallback(() => goToSlide(current - 1), [current, goToSlide]);

  // Auto-play
  useEffect(() => {
    if (isPaused) return;
    autoplayRef.current = setInterval(nextSlide, AUTOPLAY_INTERVAL);
    return () => clearInterval(autoplayRef.current);
  }, [nextSlide, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowLeft") prevSlide();
      if (e.key === "ArrowRight") nextSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlide, prevSlide]);

  // ──────────────────────────────────────────────────────────
  // 🔍 SEARCH LOGIC
  // ──────────────────────────────────────────────────────────
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const term = searchTerm.trim();
    if (!term) return;

    // Option A: Pass to parent (HomePage) to filter catalog
    if (onSearch) {
      onSearch(term);
      // Smooth scroll to catalog
      setTimeout(() => {
        const catalog = document.querySelector(".books-grid");
        if (catalog) {
          const top =
            catalog.getBoundingClientRect().top + window.pageYOffset - 100;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 100);
      return;
    }

    // Option B: Navigate with query param (if no onSearch prop)
    navigate(`/?search=${encodeURIComponent(term)}`);
  };

  const handleScrollDown = () => {
    const catalog = document.querySelector(".books-grid") ||
                    document.querySelector("#catalog");
    if (catalog) {
      const top = catalog.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  // ──────────────────────────────────────────────────────────
  // 🎨 RENDER
  // ──────────────────────────────────────────────────────────
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100svh", minHeight: "580px", maxHeight: "860px" }}
      aria-label="Hero section"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* ════════════════════════════════════════════════════
          IMAGE SLIDER — Background layer
      ════════════════════════════════════════════════════ */}
      <div className="absolute inset-0" aria-hidden="true">
        {SLIDES.map((slide, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-700 ease-in-out"
            style={{ opacity: i === current ? 1 : 0 }}
          >
            <img
              src={slide.src}
              alt={slide.alt}
              className="w-full h-full object-cover object-center"
              loading={i === 0 ? "eager" : "lazy"}
              decoding="async"
            />
            {/* Dark gradient overlay — ensures text is always readable */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(10,15,30,0.55) 0%, rgba(10,15,30,0.70) 50%, rgba(10,15,30,0.85) 100%)",
              }}
            />
          </div>
        ))}
      </div>

      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E")`,
          opacity: 0.4,
        }}
        aria-hidden="true"
      />

      {/* ════════════════════════════════════════════════════
          CONTENT — Foreground layer
      ════════════════════════════════════════════════════ */}
      <div className="relative h-full flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">

        {/* ── IES Badge ─────────────────────────────────── */}
        <div className="mb-6 md:mb-8 animate-fadeIn">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/20 bg-white/10 backdrop-blur-sm text-white/90 text-xs md:text-sm font-semibold tracking-wide">
            <span
              className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"
              aria-hidden="true"
            />
            IES University · Digital Library System
          </span>
        </div>

        {/* ── Headline — changes per slide ──────────────── */}
        <div className="text-center mb-6 md:mb-8 max-w-3xl mx-auto">
          <h1
            key={current}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-3 md:mb-4 animate-fadeIn"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.4)" }}
          >
            {SLIDES[current].headline}
          </h1>
          <p
            key={`sub-${current}`}
            className="text-sm sm:text-base md:text-lg text-white/75 max-w-xl mx-auto leading-relaxed animate-fadeIn"
          >
            {SLIDES[current].sub}
          </p>
        </div>

        {/* ════════════════════════════════════════════════
            HERO SEARCH BAR — Primary entry point
        ════════════════════════════════════════════════ */}
        <form
          onSubmit={handleSearchSubmit}
          className="w-full max-w-2xl mx-auto mb-8 md:mb-10 animate-fadeIn"
          role="search"
          aria-label="Search library catalog"
        >
          <div className="relative flex items-center">
            {/* Search icon */}
            <div
              className="absolute left-4 md:left-5 text-gray-400 pointer-events-none"
              aria-hidden="true"
            >
              <Search className="h-5 w-5 md:h-6 md:w-6" />
            </div>

            {/* Input */}
            <input
              ref={searchInputRef}
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, author, ISBN, or department…"
              className="w-full pl-12 md:pl-14 pr-28 md:pr-36 py-4 md:py-5 rounded-2xl bg-white/95 backdrop-blur-md text-gray-900 placeholder-gray-400 text-sm md:text-base font-medium shadow-2xl border border-white/30 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 transition-all duration-200"
              aria-label="Search books"
              autoComplete="off"
              spellCheck="false"
            />

            {/* Submit button */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-4 md:px-6 py-2.5 md:py-3 bg-[#0f172a] hover:bg-blue-700 text-white text-sm md:text-base font-semibold rounded-xl transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
              aria-label="Submit search"
            >
              Search
            </button>
          </div>

          {/* Search hint chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3 justify-center" aria-label="Quick search suggestions">
            <span className="text-white/40 text-xs">Try:</span>
            {["Data Structures", "R.S. Aggarwal", "Computer Science", "MBA"].map(
              (hint) => (
                <button
                  key={hint}
                  type="button"
                  onClick={() => {
                    setSearchTerm(hint);
                    searchInputRef.current?.focus();
                  }}
                  className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-white/70 text-xs font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
                >
                  {hint}
                </button>
              )
            )}
          </div>
        </form>

        {/* ════════════════════════════════════════════════
            STATS ROW
        ════════════════════════════════════════════════ */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mb-8 animate-fadeIn"
          aria-label="Library statistics"
        >
          {STATS.map((stat, i) => (
            <div
              key={i}
              className="flex items-center gap-2 md:gap-3 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15"
            >
              <div
                className={`w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center shrink-0`}
                aria-hidden="true"
              >
                <stat.icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" />
              </div>
              <div className="text-left">
                <p className="text-sm md:text-base font-bold text-white leading-none">
                  {stat.value}
                </p>
                <p className="text-[10px] md:text-xs text-white/55 font-medium mt-0.5">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* ════════════════════════════════════════════════
            SCROLL DOWN INDICATOR
        ════════════════════════════════════════════════ */}
        <button
          onClick={handleScrollDown}
          className="flex flex-col items-center gap-1.5 text-white/50 hover:text-white/80 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 rounded-lg p-2 group"
          aria-label="Scroll to catalog"
        >
          <span className="text-[10px] md:text-xs font-medium tracking-widest uppercase">
            Browse Catalog
          </span>
          <ChevronDown
            className="h-5 w-5 animate-bounce group-hover:animate-none"
            aria-hidden="true"
          />
        </button>
      </div>

      {/* ════════════════════════════════════════════════════
          SLIDER CONTROLS
      ════════════════════════════════════════════════════ */}

      {/* Prev / Next arrows — desktop only */}
      <button
        onClick={prevSlide}
        className="hidden md:flex absolute left-4 lg:left-6 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </button>

      <button
        onClick={nextSlide}
        className="hidden md:flex absolute right-4 lg:right-6 top-1/2 -translate-y-1/2 w-10 h-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 border border-white/20 text-white transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Slide dots — bottom center */}
      <div
        className="absolute bottom-5 md:bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2"
        role="tablist"
        aria-label="Slide indicators"
      >
        {SLIDES.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goToSlide(i)}
            className={`transition-all duration-300 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
              i === current
                ? "w-6 h-2 bg-white"
                : "w-2 h-2 bg-white/35 hover:bg-white/60"
            }`}
          />
        ))}
      </div>

      {/* Progress bar — slide timer indicator */}
      <div
        className="absolute bottom-0 left-0 h-[3px] bg-white/20 w-full"
        aria-hidden="true"
      >
        <div
          key={current}
          className="h-full bg-blue-400"
          style={{
            animation: isPaused
              ? "none"
              : `progressBar ${AUTOPLAY_INTERVAL}ms linear forwards`,
          }}
        />
      </div>

      {/* Progress bar animation */}
      <style>{`
        @keyframes progressBar {
          from { width: 0%; }
          to   { width: 100%; }
        }
      `}</style>
    </section>
  );
};

export default Hero;