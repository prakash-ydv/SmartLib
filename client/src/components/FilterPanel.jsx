import { BookOpen, CheckCircle, Filter, RotateCcw, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { DEPARTMENTS, getDepartmentLabel } from "../utils/bookDisplay";

const AVAILABILITY = [
  { value: "all", label: "All Books" },
  { value: "available", label: "Available Now" },
  { value: "unavailable", label: "Currently Issued" },
];

const FilterPanel = ({ filters, setFilters, stats, onReset }) => {
  const [departmentSearch, setDepartmentSearch] = useState("");
  const activeFiltersCount = Object.values(filters).filter(
    (value) => value && value !== "all",
  ).length;

  const filteredDepartments = useMemo(() => {
    const search = departmentSearch.trim().toLowerCase();
    if (!search) return DEPARTMENTS;

    return DEPARTMENTS.filter(
      (department) =>
        department.label.toLowerCase().includes(search) ||
        department.value.toLowerCase().includes(search),
    );
  }, [departmentSearch]);

  const updateFilter = (key, value) => {
    setFilters({ ...filters, [key]: value });
  };

  return (
    <section className="space-y-3" aria-label="Catalog filters">
      <div className="flex flex-col gap-3 bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-200 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
            <Filter className="h-4 w-4 text-indigo-600" />
            Filter Books
            {activeFiltersCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-600 px-1.5 text-[11px] font-bold text-white">
                {activeFiltersCount}
              </span>
            )}
          </div>

          {activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-xl transition-colors min-h-[36px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reset
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-2 md:flex md:items-center md:gap-5 text-sm font-medium">
          <div className="text-center md:flex md:items-center md:gap-1.5 md:text-left text-gray-500">
            <BookOpen className="h-4 w-4 text-indigo-500 mx-auto md:mx-0" />
            <span className="block text-[10px] md:text-sm">
              Total: <strong className="text-gray-900">{stats.total.toLocaleString()}</strong>
            </span>
          </div>
          <div className="text-center md:flex md:items-center md:gap-1.5 md:text-left text-gray-500">
            <CheckCircle className="h-4 w-4 text-emerald-500 mx-auto md:mx-0" />
            <span className="block text-[10px] md:text-sm">
              Available: <strong className="text-gray-900">{(stats.availableOnPage || 0).toLocaleString()}</strong>
            </span>
          </div>
          <div className="text-center md:text-left text-gray-500">
            <span className="block text-[10px] md:text-sm">
              Showing: <strong className="text-gray-900">{stats.showing.toLocaleString()}</strong>
            </span>
          </div>
        </div>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 px-1" aria-label="Active filters">
          {filters.branch !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-200">
              Dept: {getDepartmentLabel(filters.branch)}
              <button
                onClick={() => updateFilter("branch", "all")}
                className="hover:text-indigo-900 focus-visible:outline-none"
                aria-label="Remove department filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {filters.availability !== "all" && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
              {AVAILABILITY.find((item) => item.value === filters.availability)?.label}
              <button
                onClick={() => updateFilter("availability", "all")}
                className="hover:text-emerald-900 focus-visible:outline-none"
                aria-label="Remove availability filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 md:p-5">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)] gap-5">
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <span className="w-1 h-3.5 bg-indigo-500 rounded-full" />
              Department
            </label>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="search"
                value={departmentSearch}
                onChange={(event) => setDepartmentSearch(event.target.value)}
                placeholder="Search department"
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 max-h-64 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => updateFilter("branch", "all")}
                className={`min-h-[42px] rounded-xl border px-3 py-2 text-sm font-semibold transition-colors ${
                  filters.branch === "all"
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                }`}
              >
                All Departments
              </button>

              {filteredDepartments.map((department) => (
                <button
                  type="button"
                  key={department.value}
                  onClick={() => updateFilter("branch", department.value)}
                  className={`min-h-[42px] rounded-xl border px-3 py-2 text-left text-sm font-semibold transition-colors ${
                    filters.branch === department.value
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-gray-700 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50"
                  }`}
                >
                  <span className="block truncate">{department.label}</span>
                  <span className="block text-[10px] opacity-70">{department.value}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest">
              <span className="w-1 h-3.5 bg-emerald-500 rounded-full" />
              Availability
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-2">
              {AVAILABILITY.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateFilter("availability", option.value)}
                  className={`min-h-[44px] px-3 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                    filters.availability === option.value
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm"
                      : "bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FilterPanel;
