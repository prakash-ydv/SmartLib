import Book, { FACULTIES, FACULTY_DEPARTMENTS } from "../models/book.model.js";

// ─── PAGINATION ───────────────────────────────────────────────────────────────
const getPagination = (req) => {
  const page  = Math.max(parseInt(req.query.page,  10) || 1,  1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const skip  = (page - 1) * limit;
  return { page, limit, skip };
};

// ─── ESCAPE REGEX ─────────────────────────────────────────────────────────────
const escapeRegex = (value = "") => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ─── BUILD QUERY ──────────────────────────────────────────────────────────────
// Ye function query params se MongoDB filter banata hai
const buildBookQuery = (query = {}) => {
  const filter = {};

  const searchTerm   = String(query.q || query.search || query.title || "").trim();
  const faculty      = String(query.faculty || "").trim();
  const department   = String(query.department || "").trim();
  const availability = String(query.availability || "").trim().toLowerCase();
  const language     = String(query.language || "").trim();

  // ── Search ────────────────────────────────────────────────────────
  // MongoDB $text search use karo agar search term hai
  // Yeh title, author, description, searchableText sab mein dhundhta hai
  if (searchTerm) {
    if (searchTerm.length >= 3) {
      // Full-text search (indexes use karta hai - fast)
      filter.$text = { $search: searchTerm };
    } else {
      // Short terms ke liye regex (2 chars ya kam)
      const safe = escapeRegex(searchTerm);
      filter.$or = [
        { title:       { $regex: safe, $options: "i" } },
        { author:      { $regex: safe, $options: "i" } },
        { isbn:        { $regex: safe, $options: "i" } },
      ];
    }
  }

  // ── Faculty Filter ────────────────────────────────────────────────
  if (faculty && faculty.toLowerCase() !== "all" && FACULTIES.includes(faculty)) {
    filter.faculty = faculty;
  }

  // ── Department Filter ─────────────────────────────────────────────
  // departments array mein se match karo
  if (department && department.toLowerCase() !== "all") {
    filter.departments = { $in: [department] };
  }

  // ── Availability Filter ───────────────────────────────────────────
  if (availability === "available")   filter.isAvailable = true;
  if (availability === "unavailable") filter.isAvailable = false;

  // ── Language Filter ───────────────────────────────────────────────
  if (language && language.toLowerCase() !== "all") {
    filter.language = language;
  }

  return filter;
};

// ─── BUILD SORT ───────────────────────────────────────────────────────────────
const buildSort = (query = {}, hasTextSearch = false) => {
  const sortBy = String(query.sort || "").trim().toLowerCase();

  // Text search ke time relevance score se sort karo
  if (hasTextSearch) {
    return { score: { $meta: "textScore" }, views: -1 };
  }

  switch (sortBy) {
    case "views":      return { views: -1 };
    case "title_asc":  return { title: 1 };
    case "title_desc": return { title: -1 };
    case "newest":     return { createdAt: -1 };
    case "oldest":     return { createdAt: 1 };
    default:           return { views: -1 }; // default: popular first
  }
};

// ─── SEARCH BY PAGE (MAIN API) ────────────────────────────────────────────────
// GET /search/all-books?q=data&faculty=Engineering&department=CSE&availability=available
async function searchByPage(req, res) {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter = buildBookQuery(req.query);
    const hasTextSearch = !!filter.$text;
    const sort = buildSort(req.query, hasTextSearch);

    // Text search ke liye score bhi select karo
    const selectFields = hasTextSearch
      ? { score: { $meta: "textScore" } }
      : {};

    const [books, total] = await Promise.all([
      Book.find(filter, selectFields)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .lean(),
      Book.countDocuments(filter),
    ]);

    return res.status(200).json({
      status: "success",
      pagination: {
        totalItems:  total,
        currentPage: page,
        totalPages:  Math.ceil(total / limit),
        pageSize:    limit,
      },
      data: books,
    });
  } catch (error) {
    console.error("searchByPage:", error);
    return res.status(500).json({ status: "failed", message: "Server Error" });
  }
}

// ─── SEARCH BY TITLE ──────────────────────────────────────────────────────────
async function searchBookByTitle(req, res) {
  try {
    const { title } = req.query;
    if (!title) {
      return res.status(400).json({ status: "failed", message: "Title is required" });
    }

    const books = await Book.find(buildBookQuery({ title }))
      .limit(20)
      .lean();

    return res.status(200).json({
      status: "success",
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error("searchBookByTitle:", error);
    return res.status(500).json({ status: "failed", message: "Server Error" });
  }
}

// ─── SEARCH BY VIEWS ──────────────────────────────────────────────────────────
async function searchByViews(req, res) {
  try {
    const { page, limit, skip } = getPagination(req);

    const [books, total] = await Promise.all([
      Book.find().sort({ views: -1 }).skip(skip).limit(limit).lean(),
      Book.countDocuments(),
    ]);

    return res.status(200).json({
      status: "success",
      pagination: {
        totalItems:  total,
        currentPage: page,
        totalPages:  Math.ceil(total / limit),
        pageSize:    limit,
      },
      data: books,
    });
  } catch (error) {
    console.error("searchByViews:", error);
    return res.status(500).json({ status: "failed", message: "Server Error" });
  }
}

// ─── UNAVAILABLE BOOKS ────────────────────────────────────────────────────────
async function searchUnAvailbleBooks(req, res) {
  try {
    const { page, limit, skip } = getPagination(req);

    const [books, total] = await Promise.all([
      Book.find({ isAvailable: false }).skip(skip).limit(limit).lean(),
      Book.countDocuments({ isAvailable: false }),
    ]);

    return res.status(200).json({
      status: "success",
      pagination: {
        totalItems:  total,
        currentPage: page,
        totalPages:  Math.ceil(total / limit),
        pageSize:    limit,
      },
      data: books,
    });
  } catch (error) {
    console.error("searchUnAvailbleBooks:", error);
    return res.status(500).json({ status: "failed", message: "Server Error" });
  }
}

// ─── BOOKS WITHOUT IMAGE ──────────────────────────────────────────────────────
async function searchBooksWithoutImage(req, res) {
  try {
    const { page, limit, skip } = getPagination(req);

    const withoutCoverQuery = {
      $or: [
        { cover_url: { $exists: false } },
        { cover_url: null },
        { cover_url: "" },
      ],
    };

    const [books, total] = await Promise.all([
      Book.find(withoutCoverQuery).skip(skip).limit(limit).lean(),
      Book.countDocuments(withoutCoverQuery),
    ]);

    return res.status(200).json({
      status: "success",
      pagination: {
        totalItems:  total,
        currentPage: page,
        totalPages:  Math.ceil(total / limit),
        pageSize:    limit,
      },
      data: books,
    });
  } catch (error) {
    console.error("searchBooksWithoutImage:", error);
    return res.status(500).json({ status: "failed", message: "Server Error" });
  }
}

// ─── FACULTY + DEPARTMENTS META ───────────────────────────────────────────────
// Frontend ko faculties aur unke departments bhejta hai
async function getFacultyMeta(req, res) {
  try {
    return res.status(200).json({
      status: "success",
      data: {
        faculties: FACULTIES,
        facultyDepartments: FACULTY_DEPARTMENTS,
      },
    });
  } catch (error) {
    console.error("getFacultyMeta:", error);
    return res.status(500).json({ status: "failed", message: "Server Error" });
  }
}

export {
  searchBookByTitle,
  searchByViews,
  searchByPage,
  searchUnAvailbleBooks,
  searchBooksWithoutImage,
  getFacultyMeta,
};