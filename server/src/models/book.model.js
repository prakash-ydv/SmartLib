import mongoose from "mongoose";

// ─── FACULTIES ────────────────────────────────────────────────────────────────
export const FACULTIES = [
  "Engineering & Technology",
  "Computer Applications",
  "Management & Commerce",
  "Science",
  "Agriculture",
  "Pharmacy",
  "Medical & Allied Health",
  "Law",
  "Architecture & Planning",
  "Arts & Humanities",
  "Competitive Exams",
  "Research & Reference",
  "Non-Academic",
];

// ─── DEPARTMENTS ──────────────────────────────────────────────────────────────
export const DEPARTMENTS = [
  // Engineering & Technology
  "CSE", "IT", "AI/ML", "Data Science", "Cyber Security",
  "IoT", "EC", "EX", "Mechanical", "Civil",
  "Electrical", "Chemical", "Automobile", "Robotics",

  // Computer Applications
  "BCA", "MCA", "Integrated MCA", "PGDCA",

  // Management & Commerce
  "BBA", "MBA", "B.Com", "M.Com", "Finance", "HR", "Marketing",

  // Science
  "B.Sc", "M.Sc",

  // Agriculture
  "Agriculture",

  // Pharmacy
  "B.Pharm", "M.Pharm", "D.Pharma",

  // Medical & Allied Health
  "Nursing", "Physiotherapy", "Lab Technology", "Radiology", "Public Health",

  // Law
  "LLB", "LLM",

  // Architecture & Planning
  "B.Arch",

  // Arts & Humanities
  "BA", "MA",

  // Competitive Exams
  "GATE", "Placement", "Aptitude & Reasoning",

  // Research & Reference
  "Thesis", "Journal", "Reference",

  // Non-Academic
  "Fiction", "General Knowledge", "Magazine", "Sports & Hobby",
];

// ─── FACULTY → DEPARTMENTS MAP ────────────────────────────────────────────────
// Frontend pe faculty select karne ke baad konse departments dikhenge
export const FACULTY_DEPARTMENTS = {
  "Engineering & Technology": [
    "CSE", "IT", "AI/ML", "Data Science", "Cyber Security",
    "IoT", "EC", "EX", "Mechanical", "Civil",
    "Electrical", "Chemical", "Automobile", "Robotics",
  ],
  "Computer Applications": ["BCA", "MCA", "Integrated MCA", "PGDCA"],
  "Management & Commerce": ["BBA", "MBA", "B.Com", "M.Com", "Finance", "HR", "Marketing"],
  "Science": [],
  "Agriculture": [],
  "Pharmacy": ["B.Pharm", "M.Pharm", "D.Pharma"],
  "Medical & Allied Health": ["Nursing", "Physiotherapy", "Lab Technology", "Radiology", "Public Health"],
  "Law": [],
  "Architecture & Planning": [],
  "Arts & Humanities": [],
  "Competitive Exams": ["GATE", "Placement", "Aptitude & Reasoning"],
  "Research & Reference": ["Thesis", "Journal", "Reference"],
  "Non-Academic": ["Fiction", "General Knowledge", "Magazine", "Sports & Hobby"],
};

// ─── SCHEMA ───────────────────────────────────────────────────────────────────
const bookSchema = new mongoose.Schema(
  {
    // ── Basic Info ──────────────────────────────────────────────────
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      unique: true,
    },

    author: {
      type: String,
      trim: true,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    isbn: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    publisher: {
      type: String,
      trim: true,
      default: "",
    },

    edition: {
      type: String,
      trim: true,
      default: "",
    },

    cover_url: {
      type: String,
      default: "",
    },

    language: {
      type: String,
      enum: ["English", "Hindi", "English & Hindi", "Other"],
      default: "English",
    },

    // ── Classification ──────────────────────────────────────────────
    faculty: {
      type: String,
      required: [true, "Faculty is required"],
      enum: FACULTIES,
    },

    // Ek book multiple departments mein ho sakti hai
    // e.g. "Data Structure" → ["CSE", "IT", "BCA", "MCA"]
    departments: {
      type: [String],
      default: [],
    },

    subjects: {
      type: [String],
      default: [],
    },

    tags: {
      type: [String],
      default: [],
    },

    // ── Search Field ────────────────────────────────────────────────
    // Auto-generate hoti hai - manually mat likhna
    searchableText: {
      type: String,
      default: "",
      select: false,
    },

    // ── Physical Copies ─────────────────────────────────────────────
    copies: {
      type: [String],
      default: [],
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },

    // ── Analytics ──────────────────────────────────────────────────
    views: {
      type: Number,
      default: 0,
    },

    // ── Admin ──────────────────────────────────────────────────────
    batchID: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// ─── INDEXES ──────────────────────────────────────────────────────────────────
bookSchema.index(
  {
    title: "text",
    author: "text",
    description: "text",
    searchableText: "text",
  },
  {
    weights: {
      title: 10,
      author: 8,
      searchableText: 5,
      description: 2,
    },
    name: "book_text_index",
  }
);

bookSchema.index({ faculty: 1 });
bookSchema.index({ departments: 1 });
bookSchema.index({ isAvailable: 1 });
bookSchema.index({ views: -1 });
bookSchema.index({ faculty: 1, isAvailable: 1 });
bookSchema.index({ faculty: 1, departments: 1, isAvailable: 1 });

// ─── HELPER ───────────────────────────────────────────────────────────────────
function _buildSearchableText(doc) {
  const parts = [
    doc.title || "",
    doc.author || "",
    doc.faculty || "",
    ...(Array.isArray(doc.departments) ? doc.departments : []),
    ...(Array.isArray(doc.subjects) ? doc.subjects : []),
    ...(Array.isArray(doc.tags) ? doc.tags : []),
  ];

  return parts
    .join(" ")
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── HOOKS ────────────────────────────────────────────────────────────────────
bookSchema.pre("save", function (next) {
  this.searchableText = _buildSearchableText(this);
  next();
});

bookSchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update?.$set) {
    update.$set.searchableText = _buildSearchableText(update.$set);
  }
  next();
});

// ─── MODEL ────────────────────────────────────────────────────────────────────
const Book = mongoose.model("Book", bookSchema);

export default Book;