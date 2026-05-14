export const DEPARTMENTS = [
  "CSE",
  "IT",
  "ECE",
  "EEE",
  "MECH",
  "CIVIL",
  "MBA",
  "MCA",
  "BBA",
  "BCA",
  "B.COM",
  "B.SC",
  "B.PHARM",
  "B.ARCH",
  "B.DES",
  "B.ED",
  "B.LLB",
  "B.PT",
  "B.HM",
  "B.MS",
  "B.AS",
  "B.FA",
  "B.FT",
  "AGRICULTURE",
  "D.Pharma",
  "LAW",
  "AYURVEDA",
];

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

export const sanitizeCsvValue = (value) =>
  String(value ?? "").replace(/"/g, '""');
