/**
 * ─── SMARTLIB MIGRATION SCRIPT ────────────────────────────────────────────────
 *
 * Purane books ko naye schema mein convert karta hai.
 *
 * Chalane ka tarika (server folder mein):
 *   node src/utils/migrate.books.js
 *
 * Kya karta hai:
 *   1. Purana `department` → naya `faculty` + `departments[]`
 *   2. `searchableText` auto-generate
 *   3. Default `language`, `subjects`, `tags` set karta hai
 *   4. Koi data delete nahi hota
 * ─────────────────────────────────────────────────────────────────────────────
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import Book from "../models/book.model.js";

dotenv.config();

// ─── OLD DEPT → NEW FACULTY + DEPARTMENTS ─────────────────────────────────────
const DEPARTMENT_MAP = {
  // Engineering & Technology
  CSE:          { faculty: "Engineering & Technology", departments: ["CSE"] },
  IT:           { faculty: "Engineering & Technology", departments: ["IT"] },
  ECE:          { faculty: "Engineering & Technology", departments: ["EC"] },
  EEE:          { faculty: "Engineering & Technology", departments: ["Electrical"] },
  MECH:         { faculty: "Engineering & Technology", departments: ["Mechanical"] },
  CIVIL:        { faculty: "Engineering & Technology", departments: ["Civil"] },

  // Computer Applications
  BCA:          { faculty: "Computer Applications", departments: ["BCA"] },
  MCA:          { faculty: "Computer Applications", departments: ["MCA"] },

  // Management & Commerce
  MBA:          { faculty: "Management & Commerce", departments: ["MBA"] },
  BBA:          { faculty: "Management & Commerce", departments: ["BBA"] },
  "B.COM":      { faculty: "Management & Commerce", departments: ["B.Com"] },
  "B.DES":      { faculty: "Management & Commerce", departments: ["Marketing"] },

  // Science
  "B.SC":       { faculty: "Science", departments: ["B.Sc"] },
  "B.MS":       { faculty: "Science", departments: ["M.Sc"] },
  "B.AS":       { faculty: "Science", departments: ["B.Sc"] },

  // Agriculture
  AGRICULTURE:  { faculty: "Agriculture", departments: ["Agriculture"] },

  // Pharmacy
  "B.PHARM":    { faculty: "Pharmacy", departments: ["B.Pharm"] },
  "D.Pharma":   { faculty: "Pharmacy", departments: ["D.Pharma"] },

  // Medical & Allied Health
  "B.PT":       { faculty: "Medical & Allied Health", departments: ["Physiotherapy"] },
  "B.HM":       { faculty: "Medical & Allied Health", departments: ["Public Health"] },
  AYURVEDA:     { faculty: "Medical & Allied Health", departments: ["Public Health"] },

  // Law
  LAW:          { faculty: "Law", departments: ["LLB"] },
  "B.LLB":      { faculty: "Law", departments: ["LLB"] },

  // Architecture
  "B.ARCH":     { faculty: "Architecture & Planning", departments: ["B.Arch"] },

  // Arts & Humanities
  "B.ED":       { faculty: "Arts & Humanities", departments: ["BA"] },
  "B.FA":       { faculty: "Arts & Humanities", departments: ["BA"] },
  "B.FT":       { faculty: "Arts & Humanities", departments: ["BA"] },
};

// ─── HELPER ───────────────────────────────────────────────────────────────────
function buildSearchableText(book) {
  const parts = [
    book.title || "",
    book.author || "",
    book.faculty || "",
    ...(book.departments || []),
    ...(book.subjects || []),
    ...(book.tags || []),
  ];
  return parts.join(" ").toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ").trim();
}

// ─── MAIN ─────────────────────────────────────────────────────────────────────
async function migrate() {
  console.log("\n" + "═".repeat(55));
  console.log("  📚 SMARTLIB — MIGRATION SCRIPT");
  console.log("═".repeat(55));

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }

  // Sirf wo books lo jinmein faculty nahi hai (purane)
  const books = await Book.find({ faculty: { $exists: false } }).lean();
  console.log(`\n📖 Purane books (migration needed): ${books.length}`);

  if (books.length === 0) {
    console.log("✅ Sab books already migrated hain!\n");
    await mongoose.disconnect();
    return;
  }

  let updated = 0;
  let failed = 0;
  const unmapped = new Set();

  for (const book of books) {
    try {
      const oldDept = (book.department || "").toString().trim().toUpperCase();
      const mapped = DEPARTMENT_MAP[oldDept];

      let faculty, departments;

      if (mapped) {
        faculty = mapped.faculty;
        departments = mapped.departments;
      } else {
        unmapped.add(oldDept || "EMPTY");
        faculty = "Non-Academic";
        departments = [];
      }

      const updateData = {
        faculty,
        departments,
        subjects: [],
        tags: [],
        language: "English",
      };

      updateData.searchableText = buildSearchableText({ ...book, ...updateData });

      await Book.updateOne({ _id: book._id }, { $set: updateData });
      updated++;

      if (updated % 100 === 0) {
        console.log(`   ⏳ ${updated}/${books.length} migrated...`);
      }
    } catch (err) {
      failed++;
      console.error(`   ❌ "${book.title}": ${err.message}`);
    }
  }

  // ── Report ───────────────────────────────────────────────────────
  console.log("\n" + "─".repeat(55));
  console.log("📊 MIGRATION REPORT");
  console.log("─".repeat(55));
  console.log(`✅ Updated : ${updated}`);
  console.log(`❌ Failed  : ${failed}`);

  if (unmapped.size > 0) {
    console.log("\n⚠️  UNMAPPED DEPARTMENTS (manually fix karo):");
    unmapped.forEach((d) => console.log(`   • "${d}"`));
    console.log("\n   In books ko 'Non-Academic' diya gaya hai temporarily.");
    console.log("   DEPARTMENT_MAP mein add karo aur script dobara chalao.");
  } else {
    console.log("\n🎉 Sab departments successfully mapped!");
  }

  console.log("─".repeat(55));
  console.log("✅ Migration complete!\n");

  await mongoose.disconnect();
}

migrate().catch((err) => {
  console.error("💥 Migration crashed:", err);
  process.exit(1);
});