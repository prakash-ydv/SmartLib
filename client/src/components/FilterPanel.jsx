import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Filter, RotateCcw, ChevronDown, BookOpen,
  CheckCircle, TrendingUp, X, Search, ChevronUp
} from "lucide-react";

// ============================================================
// 📦 DEPARTMENT DATA — Grouped by faculty
// Add / remove entries here as departments change
// ============================================================
export const DEPARTMENT_GROUPS = [
  {
    group: "Engineering (B.Tech)",
    emoji: "🧑‍💻",
    color: "blue",
    departments: [
      { value: "CSE",        label: "Computer Science Engineering" },
      { value: "CSE-AI",     label: "CSE – AI & ML" },
      { value: "CSE-DS",     label: "CSE – Data Science" },
      { value: "CSE-CYB",    label: "CSE – Cyber Security" },
      { value: "CSE-CC",     label: "CSE – Cloud Computing" },
      { value: "CSE-IOT",    label: "CSE – IoT" },
      { value: "CSE-BC",     label: "CSE – Blockchain" },
      { value: "CSE-BD",     label: "CSE – Big Data" },
      { value: "CSE-FS",     label: "CSE – Full Stack Dev" },
      { value: "CSE-AR",     label: "CSE – AR/VR" },
      { value: "IT",         label: "Information Technology" },
      { value: "ECE",        label: "Electronics & Communication" },
      { value: "EE",         label: "Electrical Engineering" },
      { value: "ME",         label: "Mechanical Engineering" },
      { value: "CE",         label: "Civil Engineering" },
    ],
  },
  {
    group: "M.Tech (Postgraduate)",
    emoji: "🎓",
    color: "violet",
    departments: [
      { value: "MTECH-CSE",  label: "M.Tech – Computer Science" },
      { value: "MTECH-AI",   label: "M.Tech – Artificial Intelligence" },
      { value: "MTECH-DS",   label: "M.Tech – Data Science" },
      { value: "MTECH-SE",   label: "M.Tech – Structural Engineering" },
      { value: "MTECH-TE",   label: "M.Tech – Thermal Engineering" },
      { value: "MTECH-PS",   label: "M.Tech – Power Systems" },
      { value: "MTECH-DC",   label: "M.Tech – Digital Communication" },
    ],
  },
  {
    group: "Computer Applications",
    emoji: "💻",
    color: "cyan",
    departments: [
      { value: "BCA",        label: "BCA" },
      { value: "BCA-AI",     label: "BCA – AI / Data Science" },
      { value: "MCA",        label: "MCA" },
      { value: "MCA-AI",     label: "MCA – AI / Cloud / Data Science" },
    ],
  },
  {
    group: "Management",
    emoji: "💼",
    color: "amber",
    departments: [
      { value: "BBA",        label: "BBA" },
      { value: "BBA-DM",     label: "BBA – Digital Marketing" },
      { value: "BBA-FIN",    label: "BBA – Finance" },
      { value: "BBA-HR",     label: "BBA – HR" },
      { value: "MBA",        label: "MBA" },
      { value: "MBA-MKT",    label: "MBA – Marketing" },
      { value: "MBA-FIN",    label: "MBA – Finance" },
      { value: "MBA-HR",     label: "MBA – HR" },
      { value: "MBA-IB",     label: "MBA – International Business" },
      { value: "MBA-IT",     label: "MBA – IT / Business Analytics" },
    ],
  },
  {
    group: "Science",
    emoji: "🔬",
    color: "emerald",
    departments: [
      { value: "BSC-PCM",    label: "B.Sc – Physics/Chemistry/Maths" },
      { value: "BSC-CS",     label: "B.Sc – Computer Science" },
      { value: "BSC-BT",     label: "B.Sc – Biotechnology" },
      { value: "BSC-MB",     label: "B.Sc – Microbiology" },
      { value: "BSC-IT",     label: "B.Sc – Information Technology" },
      { value: "MSC-PHY",    label: "M.Sc – Physics" },
      { value: "MSC-CHEM",   label: "M.Sc – Chemistry" },
      { value: "MSC-MATH",   label: "M.Sc – Mathematics" },
      { value: "MSC-CS",     label: "M.Sc – Computer Science" },
      { value: "MSC-BT",     label: "M.Sc – Biotechnology/Microbiology" },
    ],
  },
  {
    group: "Medical / Ayurveda / Paramedical",
    emoji: "⚕️",
    color: "red",
    departments: [
      { value: "BAMS",       label: "BAMS – Ayurvedic Medicine" },
      { value: "BPT",        label: "BPT – Physiotherapy" },
      { value: "BMLT",       label: "BMLT – Medical Lab Technology" },
      { value: "DMLT",       label: "DMLT – Diploma Lab Technology" },
      { value: "PARA",       label: "Paramedical Diploma" },
    ],
  },
  {
    group: "Pharmacy",
    emoji: "💊",
    color: "pink",
    departments: [
      { value: "DPHARM",     label: "D.Pharm" },
      { value: "BPHARM",     label: "B.Pharm" },
      { value: "BPHARM-LE",  label: "B.Pharm (Lateral Entry)" },
      { value: "MPHARM",     label: "M.Pharm" },
    ],
  },
  {
    group: "Law",
    emoji: "⚖️",
    color: "slate",
    departments: [
      { value: "BALLB",      label: "BA LLB (Integrated)" },
      { value: "LLB",        label: "LLB" },
      { value: "LLM",        label: "LLM" },
    ],
  },
  {
    group: "Education",
    emoji: "🎓",
    color: "teal",
    departments: [
      { value: "BED",        label: "B.Ed" },
      { value: "MED",        label: "M.Ed" },
    ],
  },
  {
    group: "Arts / Humanities",
    emoji: "🎨",
    color: "orange",
    departments: [
      { value: "BA",         label: "BA" },
      { value: "BA-POLY",    label: "BA – Pol. Sci / Sociology / History" },
      { value: "MA-ENG",     label: "MA – English" },
      { value: "MA-PS",      label: "MA – Political Science" },
      { value: "MA-SOC",     label: "MA – Sociology / History / Economics" },
    ],
  },
  {
    group: "Diploma",
    emoji: "🧾",
    color: "gray",
    departments: [
      { value: "DIP-ME",     label: "Diploma – Mechanical" },
      { value: "DIP-CE",     label: "Diploma – Civil" },
      { value: "DIP-EE",     label: "Diploma – Electrical" },
      { value: "DIP-CS",     label: "Diploma – Computer Science" },
      { value: "DIP-CA",     label: "Diploma – Computer Applications" },
      { value: "DIP-VOC",    label: "Vocational Courses" },
    ],
  },
  {
    group: "PhD Programs",
    emoji: "🔬",
    color: "purple",
    departments: [
      { value: "PHD-CSE",    label: "PhD – Computer Science" },
      { value: "PHD-ME",     label: "PhD – Mechanical" },
      { value: "PHD-CE",     label: "PhD – Civil" },
      { value: "PHD-EE",     label: "PhD – Electrical" },
      { value: "PHD-MGT",    label: "PhD – Management" },
      { value: "PHD-PHARM",  label: "PhD – Pharmacy" },
      { value: "PHD-SCI",    label: "PhD – Science" },
      { value: "PHD-HUM",    label: "PhD – Humanities" },
    ],
  },
];

// Flat list for search
const ALL_DEPARTMENTS = DEPARTMENT_GROUPS.flatMap((g) =>
  g.departments.map((d) => ({ ...d, group: g.group, emoji: g.emoji }))
);

const AVAILABILITY = [
  { value: "all",         label: "All Books" },
  { value: "available",   label: "Available Now" },
  { value: "unavailable", label: "Currently Issued" },
];

// ============================================================
// 🎨 COLOR MAP — group accent colors
// ============================================================
const COLOR_MAP = {
  blue:   { tab: "bg-blue-100 text-blue-700 border-blue-300",   dot: "bg-blue-500" },
  violet: { tab: "bg-violet-100 text-violet-700 border-violet-300", dot: "bg-violet-500" },
  cyan:   { tab: "bg-cyan-100 text-cyan-700 border-cyan-300",   dot: "bg-cyan-500" },
  amber:  { tab: "bg-amber-100 text-amber-700 border-amber-300", dot: "bg-amber-500" },
  emerald:{ tab: "bg-emerald-100 text-emerald-700 border-emerald-300", dot: "bg-emerald-500" },
  red:    { tab: "bg-red-100 text-red-700 border-red-300",       dot: "bg-red-500" },
  pink:   { tab: "bg-pink-100 text-pink-700 border-pink-300",    dot: "bg-pink-500" },
  slate:  { tab: "bg-slate-100 text-slate-700 border-slate-300", dot: "bg-slate-500" },
  teal:   { tab: "bg-teal-100 text-teal-700 border-teal-300",    dot: "bg-teal-500" },
  orange: { tab: "bg-orange-100 text-orange-700 border-orange-300", dot: "bg-orange-500" },
  gray:   { tab: "bg-gray-100 text-gray-700 border-gray-300",    dot: "bg-gray-500" },
  purple: { tab: "bg-purple-100 text-purple-700 border-purple-300", dot: "bg-purple-500" },
};

// ============================================================
// 🔍 DEPARTMENT PICKER — Desktop: grouped dropdown with search
//                        Mobile: bottom sheet with tabs
// ============================================================
const DepartmentPicker = ({ value, onChange }) => {
  const [open, setOpen]           = useState(false);
  const [search, setSearch]       = useState("");
  const [activeGroup, setActiveGroup] = useState(0);
  const [isMobile, setIsMobile]   = useState(false);
  const pickerRef                  = useRef(null);
  const searchRef                  = useRef(null);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  // Close on outside click (desktop)
  useEffect(() => {
    if (!open || isMobile) return;
    const handler = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open, isMobile]);

  // Lock body scroll on mobile sheet
  useEffect(() => {
    if (isMobile) document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open, isMobile]);

  // Focus search on open
  useEffect(() => {
    if (open && searchRef.current) {
      setTimeout(() => searchRef.current?.focus(), 100);
    }
  }, [open]);

  const selectedLabel =
    value === "all"
      ? "All Departments"
      : ALL_DEPARTMENTS.find((d) => d.value === value)?.label || "All Departments";

  // Search results
  const searchResults = search.trim()
    ? ALL_DEPARTMENTS.filter(
        (d) =>
          d.label.toLowerCase().includes(search.toLowerCase()) ||
          d.group.toLowerCase().includes(search.toLowerCase())
      )
    : null;

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
    setSearch("");
  };

  // ── Trigger button (shared) ─────────────────────────────
  const TriggerBtn = (
    <button
      type="button"
      onClick={() => setOpen((v) => !v)}
      className={`w-full min-h-[44px] flex items-center justify-between gap-2 px-4 py-3 text-sm bg-white border-2 rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${
        value !== "all"
          ? "border-indigo-500 text-indigo-700 bg-indigo-50"
          : "border-gray-200 text-gray-700 hover:border-indigo-300"
      }`}
      aria-haspopup="listbox"
      aria-expanded={open}
    >
      <span className="truncate text-left">{selectedLabel}</span>
      <ChevronDown
        className={`h-4 w-4 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        aria-hidden="true"
      />
    </button>
  );

  // ── Search box (shared) ────────────────────────────────
  const SearchBox = (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
      <input
        ref={searchRef}
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search department…"
        className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
        aria-label="Search departments"
      />
    </div>
  );

  // ── Search results list ────────────────────────────────
  const SearchResults = searchResults && (
    <div className="mt-1">
      {searchResults.length === 0 ? (
        <p className="text-center py-6 text-sm text-gray-400">No departments found</p>
      ) : (
        <ul role="listbox">
          {searchResults.map((d) => (
            <li key={d.value}>
              <button
                type="button"
                onClick={() => handleSelect(d.value)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  value === d.value
                    ? "bg-indigo-600 text-white font-semibold"
                    : "text-gray-700 hover:bg-indigo-50"
                }`}
                role="option"
                aria-selected={value === d.value}
              >
                <span className="text-xs text-gray-400 block">{d.emoji} {d.group}</span>
                {d.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  // ══════════════════════════════════════════════════════
  // DESKTOP — inline dropdown with grouped list + search
  // ══════════════════════════════════════════════════════
  if (!isMobile) {
    return (
      <div className="relative" ref={pickerRef}>
        {TriggerBtn}

        {open && (
          <div className="absolute z-40 top-full left-0 right-0 mt-1 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
            style={{ maxHeight: "420px" }}
          >
            {/* Search */}
            <div className="p-3 border-b border-gray-100">{SearchBox}</div>

            <div className="overflow-y-auto" style={{ maxHeight: "360px" }}>
              {/* All option */}
              <div className="px-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleSelect("all")}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    value === "all"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Departments
                </button>
              </div>

              {/* Search results OR grouped list */}
              <div className="px-3 pb-3">
                {searchResults ? (
                  SearchResults
                ) : (
                  DEPARTMENT_GROUPS.map((grp) => {
                    const colors = COLOR_MAP[grp.color] || COLOR_MAP.gray;
                    return (
                      <div key={grp.group} className="mt-3">
                        {/* Group header */}
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 px-1">
                          {grp.emoji} {grp.group}
                        </p>
                        <ul role="listbox">
                          {grp.departments.map((d) => (
                            <li key={d.value}>
                              <button
                                type="button"
                                onClick={() => handleSelect(d.value)}
                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${
                                  value === d.value
                                    ? "bg-indigo-600 text-white font-semibold"
                                    : "text-gray-700 hover:bg-indigo-50"
                                }`}
                                role="option"
                                aria-selected={value === d.value}
                              >
                                <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${
                                  value === d.value ? "bg-white" : colors.dot
                                }`} />
                                {d.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ══════════════════════════════════════════════════════
  // MOBILE — bottom sheet with category tabs
  // ══════════════════════════════════════════════════════
  return (
    <>
      {TriggerBtn}

      {open && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => { setOpen(false); setSearch(""); }}
            aria-hidden="true"
          />

          {/* Sheet */}
          <div
            className="fixed bottom-0 left-0 right-0 z-50 bg-white rounded-t-3xl shadow-2xl"
            style={{ maxHeight: "85svh" }}
            role="dialog"
            aria-modal="true"
            aria-label="Select department"
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-900">Select Department</h3>
              <button
                onClick={() => { setOpen(false); setSearch(""); }}
                className="p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            {/* Search */}
            <div className="px-4 py-3">{SearchBox}</div>

            {/* All option */}
            <div className="px-4 pb-2">
              <button
                type="button"
                onClick={() => handleSelect("all")}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors border ${
                  value === "all"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                All Departments
              </button>
            </div>

            {/* Content */}
            <div className="flex overflow-hidden" style={{ height: "calc(85svh - 220px)" }}>
              {searchResults ? (
                // Search mode — full width list
                <div className="flex-1 overflow-y-auto px-4 pb-8">
                  {SearchResults}
                </div>
              ) : (
                <>
                  {/* Category tabs — left column */}
                  <div className="w-28 shrink-0 overflow-y-auto border-r border-gray-100 py-2">
                    {DEPARTMENT_GROUPS.map((grp, i) => {
                      const colors = COLOR_MAP[grp.color] || COLOR_MAP.gray;
                      const isActive = activeGroup === i;
                      return (
                        <button
                          key={grp.group}
                          type="button"
                          onClick={() => setActiveGroup(i)}
                          className={`w-full text-left px-3 py-3 text-xs font-semibold transition-colors border-l-2 leading-tight ${
                            isActive
                              ? `border-indigo-500 bg-indigo-50 text-indigo-700`
                              : "border-transparent text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          <span className="block text-base mb-0.5">{grp.emoji}</span>
                          {grp.group.split(" ")[0]}
                        </button>
                      );
                    })}
                  </div>

                  {/* Department list — right column */}
                  <div className="flex-1 overflow-y-auto py-2 px-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">
                      {DEPARTMENT_GROUPS[activeGroup].emoji}{" "}
                      {DEPARTMENT_GROUPS[activeGroup].group}
                    </p>
                    <ul role="listbox">
                      {DEPARTMENT_GROUPS[activeGroup].departments.map((d) => (
                        <li key={d.value}>
                          <button
                            type="button"
                            onClick={() => handleSelect(d.value)}
                            className={`w-full text-left px-3 py-3 rounded-xl text-sm transition-colors mb-1 ${
                              value === d.value
                                ? "bg-indigo-600 text-white font-semibold"
                                : "text-gray-700 hover:bg-indigo-50 active:bg-indigo-100"
                            }`}
                            role="option"
                            aria-selected={value === d.value}
                          >
                            {d.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

// ============================================================
// 🎛️ FILTER PANEL — Main component
// ============================================================
const FilterPanel = ({ filters, setFilters, stats, onReset }) => {
  const [showFilters, setShowFilters] = useState(false);
  const [isMobile, setIsMobile]       = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      // Desktop: open by default
      if (!mobile) setShowFilters(true);
    };
    check();
    window.addEventListener("resize", check, { passive: true });
    return () => window.removeEventListener("resize", check);
  }, []);

  const activeFiltersCount = Object.entries(filters).filter(
    ([k, v]) => v !== "all" && k !== "year" && k !== "genre"
  ).length;

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  // Selected department label
  const selectedDeptLabel =
    filters.branch === "all"
      ? null
      : ALL_DEPARTMENTS.find((d) => d.value === filters.branch)?.label;

  const selectedAvailLabel =
    filters.availability === "all"
      ? null
      : AVAILABILITY.find((a) => a.value === filters.availability)?.label;

  return (
    <div className="space-y-3">

      {/* ── Top bar ─────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200">

        {/* Mobile toggle */}
        {isMobile && (
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl font-semibold text-sm text-gray-700 hover:bg-indigo-50 hover:border-indigo-300 transition-all min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-expanded={showFilters}
          >
            <Filter className="h-4 w-4 text-indigo-600" aria-hidden="true" />
            Filters
            {activeFiltersCount > 0 && (
              <span className="px-1.5 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                {activeFiltersCount}
              </span>
            )}
            {showFilters
              ? <ChevronUp className="h-3.5 w-3.5 text-gray-400" />
              : <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            }
          </button>
        )}

        {/* Desktop label */}
        {!isMobile && (
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <Filter className="h-4 w-4 text-indigo-600" />
            Filter Books
          </div>
        )}

        {/* Stats — desktop */}
        <div className="hidden md:flex items-center gap-5 text-sm font-medium">
          <div className="flex items-center gap-1.5 text-gray-500">
            <BookOpen className="h-4 w-4 text-indigo-500" />
            <span>Total: <strong className="text-gray-900">{stats.total.toLocaleString()}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
            <span>Available: <strong className="text-gray-900">{stats.available.toLocaleString()}</strong></span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <TrendingUp className="h-4 w-4 text-purple-500" />
            <span>Showing: <strong className="text-gray-900">{stats.showing.toLocaleString()}</strong></span>
          </div>
        </div>

        {/* Reset — visible when filters active */}
        {activeFiltersCount > 0 && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-xl transition-colors min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            aria-label={`Reset ${activeFiltersCount} active filter${activeFiltersCount > 1 ? "s" : ""}`}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Reset</span>
            <span className="sm:hidden">{activeFiltersCount}</span>
          </button>
        )}
      </div>

      {/* ── Active filter chips ──────────────────────────── */}
      {activeFiltersCount > 0 && (
        <div
          className="flex flex-wrap gap-2 px-1"
          aria-label="Active filters"
        >
          {selectedDeptLabel && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
              Dept: {selectedDeptLabel}
              <button
                onClick={() => handleFilterChange("branch", "all")}
                className="hover:text-indigo-900 focus-visible:outline-none"
                aria-label="Remove department filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {selectedAvailLabel && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
              {selectedAvailLabel}
              <button
                onClick={() => handleFilterChange("availability", "all")}
                className="hover:text-emerald-900 focus-visible:outline-none"
                aria-label="Remove availability filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* ── Filter controls ──────────────────────────────── */}
      {showFilters && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* Department picker */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <span className="w-1 h-3.5 bg-indigo-500 rounded-full" aria-hidden="true" />
                Department
              </label>
              <DepartmentPicker
                value={filters.branch}
                onChange={(val) => handleFilterChange("branch", val)}
              />
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <label
                htmlFor="availability-filter"
                className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest"
              >
                <span className="w-1 h-3.5 bg-emerald-500 rounded-full" aria-hidden="true" />
                Availability
              </label>
              <div className="flex gap-2 flex-wrap">
                {AVAILABILITY.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => handleFilterChange("availability", opt.value)}
                    className={`flex-1 min-w-[100px] min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                      filters.availability === opt.value
                        ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                        : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                    }`}
                    aria-pressed={filters.availability === opt.value}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Mobile stats ─────────────────────────────────── */}
      <div className="md:hidden grid grid-cols-3 gap-2">
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 text-center">
          <BookOpen className="h-4 w-4 text-indigo-500 mx-auto mb-1" aria-hidden="true" />
          <p className="text-[10px] text-gray-500 font-medium">Total</p>
          <p className="text-base font-bold text-gray-900">{stats.total.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 text-center">
          <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto mb-1" aria-hidden="true" />
          <p className="text-[10px] text-gray-500 font-medium">Available</p>
          <p className="text-base font-bold text-gray-900">{stats.available.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 text-center">
          <TrendingUp className="h-4 w-4 text-purple-500 mx-auto mb-1" aria-hidden="true" />
          <p className="text-[10px] text-gray-500 font-medium">Results</p>
          <p className="text-base font-bold text-gray-900">{stats.showing.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default FilterPanel;