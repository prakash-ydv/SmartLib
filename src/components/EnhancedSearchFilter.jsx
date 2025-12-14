import React, { useState, useMemo } from 'react';
import { Search, Filter, X, RotateCcw, BookOpen, TrendingUp, CheckCircle, ChevronDown } from 'lucide-react';

/**
 * Professional University Library Search & Filter Component
 * Supports 100+ courses, multiple departments, and advanced filtering
 */

// University Course Categories (Scalable Structure)
const DEPARTMENTS = [
  { 
    id: 'engineering',
    name: 'Engineering & Technology',
    courses: [
      { value: 'cs', label: 'Computer Science & Engineering' },
      { value: 'it', label: 'Information Technology' },
      { value: 'ece', label: 'Electronics & Communication Engineering' },
      { value: 'ee', label: 'Electrical Engineering' },
      { value: 'mech', label: 'Mechanical Engineering' },
      { value: 'civil', label: 'Civil Engineering' },
      { value: 'chem', label: 'Chemical Engineering' },
      { value: 'aero', label: 'Aerospace Engineering' },
      { value: 'auto', label: 'Automobile Engineering' },
      { value: 'biotech', label: 'Biotechnology' },
      { value: 'biomed', label: 'Biomedical Engineering' },
      { value: 'mineral', label: 'Mining Engineering' },
      { value: 'petroleum', label: 'Petroleum Engineering' },
      { value: 'textile', label: 'Textile Engineering' },
    ]
  },
  {
    id: 'science',
    name: 'Pure Sciences',
    courses: [
      { value: 'physics', label: 'Physics' },
      { value: 'chemistry', label: 'Chemistry' },
      { value: 'mathematics', label: 'Mathematics' },
      { value: 'biology', label: 'Biology' },
      { value: 'statistics', label: 'Statistics' },
      { value: 'environmental', label: 'Environmental Science' },
    ]
  },
  {
    id: 'medical',
    name: 'Medical & Health Sciences',
    courses: [
      { value: 'mbbs', label: 'MBBS' },
      { value: 'bds', label: 'BDS (Dental)' },
      { value: 'pharmacy', label: 'Pharmacy' },
      { value: 'nursing', label: 'Nursing' },
      { value: 'physiotherapy', label: 'Physiotherapy' },
      { value: 'ayurveda', label: 'Ayurveda' },
    ]
  },
  {
    id: 'management',
    name: 'Management & Commerce',
    courses: [
      { value: 'mba', label: 'MBA' },
      { value: 'bba', label: 'BBA' },
      { value: 'bcom', label: 'B.Com' },
      { value: 'mcom', label: 'M.Com' },
      { value: 'finance', label: 'Finance' },
      { value: 'accounting', label: 'Accounting' },
      { value: 'economics', label: 'Economics' },
    ]
  },
  {
    id: 'arts',
    name: 'Arts & Humanities',
    courses: [
      { value: 'english', label: 'English Literature' },
      { value: 'hindi', label: 'Hindi Literature' },
      { value: 'history', label: 'History' },
      { value: 'philosophy', label: 'Philosophy' },
      { value: 'psychology', label: 'Psychology' },
      { value: 'sociology', label: 'Sociology' },
      { value: 'political', label: 'Political Science' },
      { value: 'journalism', label: 'Journalism & Mass Communication' },
    ]
  },
  {
    id: 'law',
    name: 'Law & Legal Studies',
    courses: [
      { value: 'llb', label: 'LLB' },
      { value: 'llm', label: 'LLM' },
      { value: 'bballb', label: 'BA LLB' },
    ]
  },
  {
    id: 'design',
    name: 'Design & Architecture',
    courses: [
      { value: 'architecture', label: 'Architecture' },
      { value: 'fashion', label: 'Fashion Design' },
      { value: 'interior', label: 'Interior Design' },
      { value: 'graphic', label: 'Graphic Design' },
    ]
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Allied Sciences',
    courses: [
      { value: 'agri', label: 'Agriculture' },
      { value: 'horticulture', label: 'Horticulture' },
      { value: 'forestry', label: 'Forestry' },
      { value: 'veterinary', label: 'Veterinary Science' },
    ]
  },
  {
    id: 'general',
    name: 'General & Reference',
    courses: [
      { value: 'general', label: 'General Books' },
      { value: 'competitive', label: 'Competitive Exams' },
      { value: 'research', label: 'Research Publications' },
    ]
  }
];

// Subject/Genre Categories
const SUBJECTS = [
  { category: 'Core Engineering', items: [
    'Data Structures & Algorithms',
    'Database Management Systems',
    'Operating Systems',
    'Computer Networks',
    'Software Engineering',
    'Artificial Intelligence',
    'Machine Learning',
    'Cloud Computing',
    'Cybersecurity',
    'Digital Electronics',
    'Microprocessors',
    'Signal Processing',
    'Control Systems',
    'Thermodynamics',
    'Fluid Mechanics',
    'Structural Engineering',
  ]},
  { category: 'Core Sciences', items: [
    'Quantum Mechanics',
    'Organic Chemistry',
    'Inorganic Chemistry',
    'Calculus',
    'Linear Algebra',
    'Differential Equations',
    'Molecular Biology',
    'Genetics',
  ]},
  { category: 'Management', items: [
    'Financial Management',
    'Marketing Management',
    'Human Resource Management',
    'Operations Management',
    'Business Analytics',
    'Entrepreneurship',
  ]},
  { category: 'Literature', items: [
    'Fiction',
    'Non-Fiction',
    'Poetry',
    'Drama',
    'Biography',
    'Autobiography',
  ]},
  { category: 'General', items: [
    'Reference Books',
    'Competitive Exams',
    'Research Methodology',
    'Technical Writing',
    'Soft Skills',
  ]}
];

const EnhancedSearchFilter = ({ 
  searchTerm, 
  setSearchTerm, 
  filters, 
  setFilters, 
  stats, 
  onReset 
}) => {
  const [showFilters, setShowFilters] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Flatten all courses for dropdown
  const allCourses = useMemo(() => {
    const courses = [{ value: 'all', label: 'All Courses & Departments' }];
    DEPARTMENTS.forEach(dept => {
      courses.push({ 
        value: dept.id, 
        label: `── ${dept.name} ──`,
        isHeader: true 
      });
      courses.push(...dept.courses);
    });
    return courses;
  }, []);

  // Flatten all subjects for dropdown
  const allSubjects = useMemo(() => {
    const subjects = [{ value: 'all', label: 'All Subjects' }];
    SUBJECTS.forEach(category => {
      subjects.push({ 
        value: category.category, 
        label: `── ${category.category} ──`,
        isHeader: true 
      });
      category.items.forEach(item => {
        subjects.push({ value: item.toLowerCase().replace(/\s+/g, '-'), label: item });
      });
    });
    return subjects;
  }, []);

  const activeFiltersCount = Object.values(filters).filter(v => v !== 'all').length;

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
      
      {/* Search Bar Section */}
      <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-gray-50 to-slate-50">
        <div className="relative">
          <div className="flex items-center gap-3 bg-white rounded-xl shadow-lg border-2 border-gray-300 focus-within:border-indigo-600 focus-within:ring-4 focus-within:ring-indigo-100 transition-all duration-200">
            <Search className="h-5 w-5 text-gray-500 ml-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search by title, author, ISBN, publisher, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-2 py-4 text-base text-gray-800 placeholder-gray-400 outline-none font-medium"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors mr-2"
                aria-label="Clear search"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Filter Toggle & Stats Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2.5 bg-white rounded-lg shadow-md hover:shadow-lg transition-all border-2 border-gray-300 hover:border-indigo-500 font-semibold text-gray-700"
          >
            <Filter className="h-4 w-4 text-indigo-600" />
            <span>{showFilters ? 'Hide' : 'Show'} Filters</span>
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 bg-indigo-600 text-white text-xs font-bold rounded-full min-w-[20px] text-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {/* Quick Stats Preview */}
          <div className="flex items-center gap-4 text-sm font-semibold">
            <div className="flex items-center gap-2 text-gray-600">
              <BookOpen className="h-4 w-4 text-indigo-600" />
              <span className="hidden sm:inline">Total:</span>
              <span className="text-gray-900">{stats.total.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="hidden sm:inline">Available:</span>
              <span className="text-gray-900">{stats.available.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="hidden sm:inline">Results:</span>
              <span className="text-gray-900">{stats.showing.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Section */}
      {showFilters && (
        <div className="p-4 sm:p-6 lg:p-8 border-t-2 border-gray-200 bg-gray-50">
          
          {/* Primary Filters - Always Visible */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            
            {/* Course/Department Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wide">
                <div className="w-1 h-4 bg-indigo-600 rounded-full"></div>
                Course / Department
              </label>
              <div className="relative">
                <select
                  value={filters.branch}
                  onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-white border-2 border-gray-300 rounded-lg focus:border-indigo-600 focus:ring-2 focus:ring-indigo-200 outline-none transition-all cursor-pointer font-medium text-gray-800 appearance-none pr-10"
                >
                  {allCourses.map((course, idx) => (
                    <option 
                      key={idx} 
                      value={course.value}
                      disabled={course.isHeader}
                      className={course.isHeader ? 'font-bold text-gray-600 bg-gray-100' : ''}
                    >
                      {course.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Academic Year Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wide">
                <div className="w-1 h-4 bg-purple-600 rounded-full"></div>
                Academic Level
              </label>
              <div className="relative">
                <select
                  value={filters.year}
                  onChange={(e) => setFilters({ ...filters, year: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-white border-2 border-gray-300 rounded-lg focus:border-purple-600 focus:ring-2 focus:ring-purple-200 outline-none transition-all cursor-pointer font-medium text-gray-800 appearance-none pr-10"
                >
                  <option value="all">All Years & Levels</option>
                  <option value="1">1st Year / Semester 1-2</option>
                  <option value="2">2nd Year / Semester 3-4</option>
                  <option value="3">3rd Year / Semester 5-6</option>
                  <option value="4">4th Year / Semester 7-8</option>
                  <option value="pg">Post-Graduation (PG)</option>
                  <option value="phd">PhD / Research</option>
                  <option value="reference">Reference & General</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Subject/Genre Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wide">
                <div className="w-1 h-4 bg-green-600 rounded-full"></div>
                Subject / Genre
              </label>
              <div className="relative">
                <select
                  value={filters.genre}
                  onChange={(e) => setFilters({ ...filters, genre: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-white border-2 border-gray-300 rounded-lg focus:border-green-600 focus:ring-2 focus:ring-green-200 outline-none transition-all cursor-pointer font-medium text-gray-800 appearance-none pr-10"
                >
                  {allSubjects.map((subject, idx) => (
                    <option 
                      key={idx} 
                      value={subject.value}
                      disabled={subject.isHeader}
                      className={subject.isHeader ? 'font-bold text-gray-600 bg-gray-100' : ''}
                    >
                      {subject.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Availability Filter */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-800 uppercase tracking-wide">
                <div className="w-1 h-4 bg-orange-600 rounded-full"></div>
                Availability
              </label>
              <div className="relative">
                <select
                  value={filters.availability}
                  onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                  className="w-full px-4 py-3 text-sm bg-white border-2 border-gray-300 rounded-lg focus:border-orange-600 focus:ring-2 focus:ring-orange-200 outline-none transition-all cursor-pointer font-medium text-gray-800 appearance-none pr-10"
                >
                  <option value="all">All Books</option>
                  <option value="available">Available Now</option>
                  <option value="unavailable">Currently Issued</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-indigo-700 hover:text-indigo-900 hover:bg-indigo-50 rounded-lg transition-all"
          >
            <ChevronDown className={`h-4 w-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            {showAdvanced ? 'Hide' : 'Show'} Advanced Filters
          </button>

          {/* Advanced Filters - Collapsible */}
          {showAdvanced && (
            <div className="mt-4 p-4 bg-white rounded-lg border-2 border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Publication Year Range */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Publication Year</label>
                  <select className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none">
                    <option value="all">All Years</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                    <option value="2021">2021</option>
                    <option value="2020-2019">2020-2019</option>
                    <option value="2018-2015">2018-2015</option>
                    <option value="older">Before 2015</option>
                  </select>
                </div>

                {/* Language */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Language</label>
                  <select className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none">
                    <option value="all">All Languages</option>
                    <option value="english">English</option>
                    <option value="hindi">Hindi</option>
                    <option value="regional">Regional Languages</option>
                  </select>
                </div>

                {/* Book Type */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">Book Type</label>
                  <select className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none">
                    <option value="all">All Types</option>
                    <option value="textbook">Textbook</option>
                    <option value="reference">Reference</option>
                    <option value="journal">Journal</option>
                    <option value="magazine">Magazine</option>
                    <option value="ebook">E-Book</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Reset Button */}
          {activeFiltersCount > 0 && (
            <button
              onClick={onReset}
              className="mt-4 flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-red-300 hover:border-red-500 hover:bg-red-50 text-red-600 hover:text-red-700 font-bold rounded-lg transition-all shadow-sm hover:shadow-md"
            >
              <RotateCcw className="h-4 w-4" />
              Reset All Filters ({activeFiltersCount})
            </button>
          )}
        </div>
      )}

      {/* Detailed Stats Section */}
      <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 to-gray-100 border-t-2 border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Total Books */}
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:border-indigo-400 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-3">
              <BookOpen className="h-8 w-8 text-indigo-600 group-hover:scale-110 transition-transform" />
              <div className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-full">
                TOTAL
              </div>
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Total Books in Library</p>
            <p className="text-3xl font-bold text-gray-900">{stats.total.toLocaleString()}</p>
          </div>

          {/* Available Books */}
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:border-green-400 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-3">
              <CheckCircle className="h-8 w-8 text-green-600 group-hover:scale-110 transition-transform" />
              <div className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">
                AVAILABLE
              </div>
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Available for Issue</p>
            <p className="text-3xl font-bold text-gray-900">{stats.available.toLocaleString()}</p>
          </div>

          {/* Search Results */}
          <div className="bg-white rounded-xl p-5 shadow-md border border-gray-200 hover:border-purple-400 hover:shadow-lg transition-all group">
            <div className="flex items-center justify-between mb-3">
              <TrendingUp className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
              <div className="px-3 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded-full">
                RESULTS
              </div>
            </div>
            <p className="text-sm text-gray-600 font-semibold mb-1">Showing Results</p>
            <p className="text-3xl font-bold text-gray-900">{stats.showing.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSearchFilter;