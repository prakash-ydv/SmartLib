import { useMemo, useState } from "react";
import {
  Filter, RotateCcw, X, ChevronDown, ChevronUp,
  BookOpen, CheckCircle, Search, Layers, GraduationCap
} from "lucide-react";
import { useBooks } from "../context/BookContext";

// ─── FACULTY ICONS + COLORS ───────────────────────────────────────────────────
const FACULTY_CONFIG = {
  "Engineering & Technology":  { emoji: "⚙️",  color: "blue"   },
  "Computer Applications":     { emoji: "💻",  color: "indigo" },
  "Management & Commerce":     { emoji: "📊",  color: "amber"  },
  "Science":                   { emoji: "🔬",  color: "green"  },
  "Agriculture":               { emoji: "🌾",  color: "lime"   },
  "Pharmacy":                  { emoji: "💊",  color: "rose"   },
  "Medical & Allied Health":   { emoji: "🏥",  color: "red"    },
  "Law":                       { emoji: "⚖️",  color: "slate"  },
  "Architecture & Planning":   { emoji: "🏛️",  color: "orange" },
  "Arts & Humanities":         { emoji: "🎨",  color: "purple" },
  "Competitive Exams":         { emoji: "🏆",  color: "yellow" },
  "Research & Reference":      { emoji: "📚",  color: "teal"   },
  "Non-Academic":              { emoji: "🌟",  color: "pink"   },
};

const COLOR_MAP = {
  blue:   { card: "border-blue-200 bg-blue-50 hover:bg-blue-100 hover:border-blue-400",   active: "bg-blue-600 border-blue-600 text-white shadow-blue-200",   chip: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200"   },
  indigo: { card: "border-indigo-200 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400", active: "bg-indigo-600 border-indigo-600 text-white shadow-indigo-200", chip: "bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200" },
  amber:  { card: "border-amber-200 bg-amber-50 hover:bg-amber-100 hover:border-amber-400",   active: "bg-amber-600 border-amber-600 text-white shadow-amber-200",   chip: "bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-200"   },
  green:  { card: "border-green-200 bg-green-50 hover:bg-green-100 hover:border-green-400",   active: "bg-green-600 border-green-600 text-white shadow-green-200",   chip: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200"   },
  lime:   { card: "border-lime-200 bg-lime-50 hover:bg-lime-100 hover:border-lime-400",     active: "bg-lime-600 border-lime-600 text-white shadow-lime-200",     chip: "bg-lime-100 text-lime-700 border-lime-200 hover:bg-lime-200"     },
  rose:   { card: "border-rose-200 bg-rose-50 hover:bg-rose-100 hover:border-rose-400",     active: "bg-rose-600 border-rose-600 text-white shadow-rose-200",     chip: "bg-rose-100 text-rose-700 border-rose-200 hover:bg-rose-200"     },
  red:    { card: "border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-400",       active: "bg-red-600 border-red-600 text-white shadow-red-200",       chip: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200"       },
  slate:  { card: "border-slate-200 bg-slate-50 hover:bg-slate-100 hover:border-slate-400",   active: "bg-slate-600 border-slate-600 text-white shadow-slate-200",   chip: "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200"   },
  orange: { card: "border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-400", active: "bg-orange-600 border-orange-600 text-white shadow-orange-200", chip: "bg-orange-100 text-orange-700 border-orange-200 hover:bg-orange-200" },
  purple: { card: "border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-400", active: "bg-purple-600 border-purple-600 text-white shadow-purple-200", chip: "bg-purple-100 text-purple-700 border-purple-200 hover:bg-purple-200" },
  yellow: { card: "border-yellow-200 bg-yellow-50 hover:bg-yellow-100 hover:border-yellow-400", active: "bg-yellow-500 border-yellow-500 text-white shadow-yellow-200", chip: "bg-yellow-100 text-yellow-700 border-yellow-200 hover:bg-yellow-200" },
  teal:   { card: "border-teal-200 bg-teal-50 hover:bg-teal-100 hover:border-teal-400",     active: "bg-teal-600 border-teal-600 text-white shadow-teal-200",     chip: "bg-teal-100 text-teal-700 border-teal-200 hover:bg-teal-200"     },
  pink:   { card: "border-pink-200 bg-pink-50 hover:bg-pink-100 hover:border-pink-400",     active: "bg-pink-600 border-pink-600 text-white shadow-pink-200",     chip: "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200"     },
};

const AVAILABILITY_OPTIONS = [
  { value: "all",         label: "All Books",         icon: "📖" },
  { value: "available",   label: "Available Now",      icon: "✅" },
  { value: "unavailable", label: "Currently Issued",   icon: "🔴" },
];

// ─── FILTER PANEL ─────────────────────────────────────────────────────────────
const FilterPanel = ({ filters, setFilters, stats, onReset }) => {
  const { facultyMeta, metaLoading } = useBooks();
  const [expanded, setExpanded]       = useState(true);
  const [deptSearch, setDeptSearch]   = useState("");

  const { faculties, facultyDepartments } = facultyMeta;

  // Active filter count
  const activeCount = useMemo(() => {
    let count = 0;
    if (filters.faculty      && filters.faculty      !== "all") count++;
    if (filters.department   && filters.department   !== "all") count++;
    if (filters.availability && filters.availability !== "all") count++;
    return count;
  }, [filters]);

  // Selected faculty ke departments
  const activeDepts = useMemo(() => {
    if (!filters.faculty || filters.faculty === "all") return [];
    const depts = facultyDepartments[filters.faculty] || [];
    if (!deptSearch.trim()) return depts;
    return depts.filter((d) =>
      d.toLowerCase().includes(deptSearch.toLowerCase())
    );
  }, [filters.faculty, facultyDepartments, deptSearch]);

  const hasDepts = activeDepts.length > 0;
  const selectedFacultyConfig = FACULTY_CONFIG[filters.faculty] || {};
  const selectedColor = COLOR_MAP[selectedFacultyConfig.color] || COLOR_MAP.indigo;

  const updateFilter = (key, value) => {
    if (key === "faculty") {
      // Faculty change → department reset
      setFilters({ ...filters, faculty: value, department: "all" });
      setDeptSearch("");
    } else {
      setFilters({ ...filters, [key]: value });
    }
  };

  return (
    <section className="space-y-3" aria-label="Catalog filters">

      {/* ── Top Bar ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200 sm:flex-row sm:items-center sm:justify-between">

        {/* Left: Title + Count */}
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setExpanded((p) => !p)}
            className="flex items-center gap-2 text-sm font-bold text-gray-700 hover:text-indigo-600 transition-colors"
          >
            <Filter className="h-4 w-4 text-indigo-600" />
            Filter Books
            {activeCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[11px] font-bold text-white">
                {activeCount}
              </span>
            )}
            {expanded
              ? <ChevronUp className="h-4 w-4 text-gray-400" />
              : <ChevronDown className="h-4 w-4 text-gray-400" />
            }
          </button>

          {activeCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-xl transition-colors min-h-[36px]"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>

        {/* Right: Stats */}
        <div className="grid grid-cols-3 gap-2 sm:flex sm:items-center sm:gap-5 text-sm font-medium">
          <div className="text-center sm:flex sm:items-center sm:gap-1.5 text-gray-500">
            <BookOpen className="h-4 w-4 text-indigo-500 mx-auto sm:mx-0" />
            <span className="block text-[10px] sm:text-sm">
              Total: <strong className="text-gray-900">{stats.total.toLocaleString()}</strong>
            </span>
          </div>
          <div className="text-center sm:flex sm:items-center sm:gap-1.5 text-gray-500">
            <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto sm:mx-0" />
            <span className="block text-[10px] sm:text-sm">
              Available: <strong className="text-gray-900">{(stats.availableOnPage || 0).toLocaleString()}</strong>
            </span>
          </div>
          <div className="text-center text-gray-500">
            <span className="block text-[10px] sm:text-sm">
              Showing: <strong className="text-gray-900">{stats.showing.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* ── Active Filter Tags ─────────────────────────────────────── */}
      {activeCount > 0 && (
        <div className="flex flex-wrap gap-2 px-1">
          {filters.faculty && filters.faculty !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
              <GraduationCap className="h-3 w-3" />
              {FACULTY_CONFIG[filters.faculty]?.emoji} {filters.faculty}
              <button onClick={() => updateFilter("faculty", "all")} className="hover:text-indigo-900">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.department && filters.department !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full border border-purple-200">
              <Layers className="h-3 w-3" />
              {filters.department}
              <button onClick={() => updateFilter("department", "all")} className="hover:text-purple-900">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
          {filters.availability && filters.availability !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
              {AVAILABILITY_OPTIONS.find((o) => o.value === filters.availability)?.label}
              <button onClick={() => updateFilter("availability", "all")} className="hover:text-emerald-900">
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* ── Main Filter Body ───────────────────────────────────────── */}
      {expanded && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-5 space-y-6 animate-fadeIn">

          {/* ── STEP 1: Faculty ───────────────────────────────────── */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <span className="w-1 h-3.5 bg-indigo-500 rounded-full" />
              <GraduationCap className="h-3.5 w-3.5" />
              Step 1 — Select Faculty
            </label>

            {metaLoading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-xl skeleton" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {/* All Faculty Button */}
                <button
                  type="button"
                  onClick={() => updateFilter("faculty", "all")}
                  className={`min-h-[52px] rounded-xl border-2 px-3 py-2 text-sm font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-0.5 ${
                    !filters.faculty || filters.faculty === "all"
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200"
                      : "bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                  }`}
                >
                  <span className="text-base">📖</span>
                  <span className="text-[11px] leading-tight text-center">All</span>
                </button>

                {faculties.map((faculty) => {
                  const config = FACULTY_CONFIG[faculty] || { emoji: "📁", color: "indigo" };
                  const colors = COLOR_MAP[config.color] || COLOR_MAP.indigo;
                  const isActive = filters.faculty === faculty;

                  return (
                    <button
                      key={faculty}
                      type="button"
                      onClick={() => updateFilter("faculty", faculty)}
                      className={`min-h-[52px] rounded-xl border-2 px-2 py-2 text-sm font-semibold transition-all duration-200 flex flex-col items-center justify-center gap-0.5 shadow-sm ${
                        isActive
                          ? `${colors.active} shadow-lg`
                          : `${colors.card} text-gray-700`
                      }`}
                    >
                      <span className="text-base">{config.emoji}</span>
                      <span className="text-[10px] leading-tight text-center line-clamp-2">{faculty}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── STEP 2: Department (only if faculty has sub-depts) ─── */}
          {filters.faculty && filters.faculty !== "all" && hasDepts && (
            <div className="space-y-3 animate-fadeIn">
              <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
                <span className="w-1 h-3.5 bg-purple-500 rounded-full" />
                <Layers className="h-3.5 w-3.5" />
                Step 2 — Select Department
                <span className="text-[10px] font-normal text-gray-400">(optional)</span>
              </label>

              {/* Department Search */}
              {activeDepts.length > 6 && (
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="search"
                    value={deptSearch}
                    onChange={(e) => setDeptSearch(e.target.value)}
                    placeholder="Search department..."
                    className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  />
                </div>
              )}

              {/* Department Chips */}
              <div className="flex flex-wrap gap-2">
                {/* All Departments */}
                <button
                  type="button"
                  onClick={() => updateFilter("department", "all")}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 min-h-[36px] ${
                    !filters.department || filters.department === "all"
                      ? `${selectedColor.active} shadow-md`
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
                >
                  All
                </button>

                {activeDepts.map((dept) => (
                  <button
                    key={dept}
                    type="button"
                    onClick={() => updateFilter("department", dept)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold border-2 transition-all duration-200 min-h-[36px] ${
                      filters.department === dept
                        ? `${selectedColor.active} shadow-md`
                        : `bg-white border-gray-200 text-gray-700 ${selectedColor.chip}`
                    }`}
                  >
                    {dept}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 3: Availability ──────────────────────────────── */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <span className="w-1 h-3.5 bg-emerald-500 rounded-full" />
              {filters.faculty && filters.faculty !== "all" && hasDepts ? "Step 3" : "Step 2"} — Availability
            </label>

            <div className="flex flex-wrap gap-2">
              {AVAILABILITY_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateFilter("availability", option.value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border-2 transition-all duration-200 min-h-[44px] ${
                    filters.availability === option.value
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-200"
                      : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  <span>{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default FilterPanel;