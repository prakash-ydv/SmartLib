export const DEPARTMENTS = [
  { value: "CSE", label: "Computer Science Engineering" },
  { value: "IT", label: "Information Technology" },
  { value: "ECE", label: "Electronics and Communication" },
  { value: "EEE", label: "Electrical and Electronics" },
  { value: "MECH", label: "Mechanical Engineering" },
  { value: "CIVIL", label: "Civil Engineering" },
  { value: "MBA", label: "MBA" },
  { value: "MCA", label: "MCA" },
  { value: "BBA", label: "BBA" },
  { value: "BCA", label: "BCA" },
  { value: "B.COM", label: "B.Com" },
  { value: "B.SC", label: "B.Sc" },
  { value: "B.PHARM", label: "B.Pharm" },
  { value: "B.ARCH", label: "B.Arch" },
  { value: "B.DES", label: "B.Des" },
  { value: "B.ED", label: "B.Ed" },
  { value: "B.LLB", label: "B.LLB" },
  { value: "B.PT", label: "B.PT" },
  { value: "B.HM", label: "B.HM" },
  { value: "B.MS", label: "B.MS" },
  { value: "B.AS", label: "B.AS" },
  { value: "B.FA", label: "B.FA" },
  { value: "B.FT", label: "B.FT" },
  { value: "AGRICULTURE", label: "Agriculture" },
  { value: "D.Pharma", label: "D.Pharma" },
  { value: "LAW", label: "Law" },
  { value: "AYURVEDA", label: "Ayurveda" },
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

export const getDepartmentLabel = (value) =>
  DEPARTMENTS.find((department) => department.value === value)?.label || value;

export const formatCount = (value = 0) => Number(value || 0).toLocaleString();

export const getLiveCatalogStats = ({ totalItems = 0, pageBooks = [] } = {}) => {
  const visibleBooks = Array.isArray(pageBooks) ? pageBooks : [];

  return {
    total: Number(totalItems || visibleBooks.length || 0),
    showing: visibleBooks.length,
    availableOnPage: visibleBooks.filter(isBookAvailable).length,
    departments: DEPARTMENTS.length,
  };
};
