// ─── FACULTIES ────────────────────────────────────────────────────────────────
export const FACULTIES = [
  { value: "Engineering & Technology",  label: "Engineering & Technology",  emoji: "⚙️"  },
  { value: "Computer Applications",     label: "Computer Applications",     emoji: "💻"  },
  { value: "Management & Commerce",     label: "Management & Commerce",     emoji: "📊"  },
  { value: "Science",                   label: "Science",                   emoji: "🔬"  },
  { value: "Agriculture",               label: "Agriculture",               emoji: "🌾"  },
  { value: "Pharmacy",                  label: "Pharmacy",                  emoji: "💊"  },
  { value: "Medical & Allied Health",   label: "Medical & Allied Health",   emoji: "🏥"  },
  { value: "Law",                       label: "Law",                       emoji: "⚖️"  },
  { value: "Architecture & Planning",   label: "Architecture & Planning",   emoji: "🏛️"  },
  { value: "Arts & Humanities",         label: "Arts & Humanities",         emoji: "🎨"  },
  { value: "Competitive Exams",         label: "Competitive Exams",         emoji: "🏆"  },
  { value: "Research & Reference",      label: "Research & Reference",      emoji: "📚"  },
  { value: "Non-Academic",              label: "Non-Academic",              emoji: "🌟"  },
];

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────
export const DEPARTMENTS = [
  // Engineering & Technology
  { value: "CSE",              label: "Computer Science",         faculty: "Engineering & Technology" },
  { value: "IT",               label: "Information Technology",   faculty: "Engineering & Technology" },
  { value: "AI/ML",            label: "AI / Machine Learning",    faculty: "Engineering & Technology" },
  { value: "Data Science",     label: "Data Science",             faculty: "Engineering & Technology" },
  { value: "Cyber Security",   label: "Cyber Security",           faculty: "Engineering & Technology" },
  { value: "IoT",              label: "Internet of Things",       faculty: "Engineering & Technology" },
  { value: "EC",               label: "Electronics & Comm.",      faculty: "Engineering & Technology" },
  { value: "EX",               label: "Electronics",              faculty: "Engineering & Technology" },
  { value: "Mechanical",       label: "Mechanical Engineering",   faculty: "Engineering & Technology" },
  { value: "Civil",            label: "Civil Engineering",        faculty: "Engineering & Technology" },
  { value: "Electrical",       label: "Electrical Engineering",   faculty: "Engineering & Technology" },
  { value: "Chemical",         label: "Chemical Engineering",     faculty: "Engineering & Technology" },
  { value: "Automobile",       label: "Automobile Engineering",   faculty: "Engineering & Technology" },
  { value: "Robotics",         label: "Robotics",                 faculty: "Engineering & Technology" },

  // Computer Applications
  { value: "BCA",              label: "BCA",                      faculty: "Computer Applications" },
  { value: "MCA",              label: "MCA",                      faculty: "Computer Applications" },
  { value: "Integrated MCA",   label: "Integrated MCA",           faculty: "Computer Applications" },
  { value: "PGDCA",            label: "PGDCA",                    faculty: "Computer Applications" },

  // Management & Commerce
  { value: "BBA",              label: "BBA",                      faculty: "Management & Commerce" },
  { value: "MBA",              label: "MBA",                      faculty: "Management & Commerce" },
  { value: "B.Com",            label: "B.Com",                    faculty: "Management & Commerce" },
  { value: "M.Com",            label: "M.Com",                    faculty: "Management & Commerce" },
  { value: "Finance",          label: "Finance",                  faculty: "Management & Commerce" },
  { value: "HR",               label: "Human Resources",          faculty: "Management & Commerce" },
  { value: "Marketing",        label: "Marketing",                faculty: "Management & Commerce" },

  // Science
  { value: "B.Sc",             label: "B.Sc",                     faculty: "Science" },
  { value: "M.Sc",             label: "M.Sc",                     faculty: "Science" },

  // Agriculture
  { value: "Agriculture",      label: "Agriculture",              faculty: "Agriculture" },

  // Pharmacy
  { value: "B.Pharm",          label: "B.Pharm",                  faculty: "Pharmacy" },
  { value: "M.Pharm",          label: "M.Pharm",                  faculty: "Pharmacy" },
  { value: "D.Pharma",         label: "D.Pharma",                 faculty: "Pharmacy" },

  // Medical & Allied Health
  { value: "Nursing",          label: "Nursing",                  faculty: "Medical & Allied Health" },
  { value: "Physiotherapy",    label: "Physiotherapy",            faculty: "Medical & Allied Health" },
  { value: "Lab Technology",   label: "Lab Technology",           faculty: "Medical & Allied Health" },
  { value: "Radiology",        label: "Radiology",                faculty: "Medical & Allied Health" },
  { value: "Public Health",    label: "Public Health",            faculty: "Medical & Allied Health" },

  // Law
  { value: "LLB",              label: "LLB",                      faculty: "Law" },
  { value: "LLM",              label: "LLM",                      faculty: "Law" },

  // Architecture & Planning
  { value: "B.Arch",           label: "B.Arch",                   faculty: "Architecture & Planning" },

  // Arts & Humanities
  { value: "BA",               label: "BA",                       faculty: "Arts & Humanities" },
  { value: "MA",               label: "MA",                       faculty: "Arts & Humanities" },

  // Competitive Exams
  { value: "GATE",             label: "GATE",                     faculty: "Competitive Exams" },
  { value: "Placement",        label: "Placement Prep",           faculty: "Competitive Exams" },
  { value: "Aptitude & Reasoning", label: "Aptitude & Reasoning", faculty: "Competitive Exams" },

  // Research & Reference
  { value: "Thesis",           label: "Thesis",                   faculty: "Research & Reference" },
  { value: "Journal",          label: "Journal",                  faculty: "Research & Reference" },
  { value: "Reference",        label: "Reference Books",          faculty: "Research & Reference" },

  // Non-Academic
  { value: "Fiction",          label: "Fiction / Novels",         faculty: "Non-Academic" },
  { value: "General Knowledge",label: "General Knowledge",        faculty: "Non-Academic" },
  { value: "Magazine",         label: "Magazine",                 faculty: "Non-Academic" },
  { value: "Sports & Hobby",   label: "Sports & Hobby",           faculty: "Non-Academic" },
];

// ─── FACULTY → DEPARTMENTS MAP ────────────────────────────────────────────────
export const FACULTY_DEPARTMENTS = {
  "Engineering & Technology":  ["CSE","IT","AI/ML","Data Science","Cyber Security","IoT","EC","EX","Mechanical","Civil","Electrical","Chemical","Automobile","Robotics"],
  "Computer Applications":     ["BCA","MCA","Integrated MCA","PGDCA"],
  "Management & Commerce":     ["BBA","MBA","B.Com","M.Com","Finance","HR","Marketing"],
  "Science":                   [],
  "Agriculture":               [],
  "Pharmacy":                  ["B.Pharm","M.Pharm","D.Pharma"],
  "Medical & Allied Health":   ["Nursing","Physiotherapy","Lab Technology","Radiology","Public Health"],
  "Law":                       [],
  "Architecture & Planning":   [],
  "Arts & Humanities":         [],
  "Competitive Exams":         ["GATE","Placement","Aptitude & Reasoning"],
  "Research & Reference":      ["Thesis","Journal","Reference"],
  "Non-Academic":              ["Fiction","General Knowledge","Magazine","Sports & Hobby"],
};

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const getBookId = (book) => book?._id || book?.id || "";

export const getCopyCount = (book) => {
  if (Array.isArray(book?.copies)) return book.copies.length;
  if (typeof book?.copies === "number") return book.copies;
  return 0;
};

export const isBookAvailable = (book) => {
  if (typeof book?.isAvailable === "boolean") return book.isAvailable;
  return getCopyCount(book) > 0;
};

export const getFacultyLabel = (value) =>
  FACULTIES.find((f) => f.value === value)?.label || value;

export const getDepartmentLabel = (value) =>
  DEPARTMENTS.find((d) => d.value === value)?.label || value;

export const getFacultyEmoji = (value) =>
  FACULTIES.find((f) => f.value === value)?.emoji || "📁";

export const formatCount = (value = 0) => Number(value || 0).toLocaleString();

export const getLiveCatalogStats = ({ totalItems = 0, pageBooks = [] } = {}) => {
  const visibleBooks = Array.isArray(pageBooks) ? pageBooks : [];
  return {
    total:           Number(totalItems || visibleBooks.length || 0),
    showing:         visibleBooks.length,
    availableOnPage: visibleBooks.filter(isBookAvailable).length,
    faculties:       FACULTIES.length,
    departments:     DEPARTMENTS.length,
  };
};