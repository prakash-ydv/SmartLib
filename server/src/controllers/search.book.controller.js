import Book from "../models/book.model.js";

const getPagination = (req) => {
  const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit, 10) || 10, 50);
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

const escapeRegex = (value = "") =>
  value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const buildBookQuery = (query = {}) => {
  const filter = {};
  const searchTerm = String(query.q || query.search || query.title || "").trim();
  const department = String(query.department || query.branch || "").trim();
  const availability = String(query.availability || "").trim().toLowerCase();

  if (searchTerm) {
    const safeSearch = escapeRegex(searchTerm);
    filter.$or = [
      { title: { $regex: safeSearch, $options: "i" } },
      { author: { $regex: safeSearch, $options: "i" } },
      { isbn: { $regex: safeSearch, $options: "i" } },
      { publisher: { $regex: safeSearch, $options: "i" } },
      { department: { $regex: safeSearch, $options: "i" } },
    ];
  }

  if (department && department.toLowerCase() !== "all") {
    filter.department = department.toUpperCase();
  }

  if (availability === "available") {
    filter.isAvailable = true;
  }

  if (availability === "unavailable") {
    filter.isAvailable = false;
  }

  return filter;
};

async function searchBookByTitle(req, res) {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        status: "failed",
        message: "Title is required",
      });
    }

    const books = await Book.find(buildBookQuery({ title })).limit(20).lean();

    return res.status(200).json({
      status: "success",
      count: books.length,
      data: books,
    });
  } catch (error) {
    console.error("searchBookByTitle:", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
}

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
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      },
      data: books,
    });
  } catch (error) {
    console.error("searchByViews:", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
}

async function searchByPage(req, res) {
  try {
    const { page, limit, skip } = getPagination(req);
    const filter = buildBookQuery(req.query);

    const [books, total] = await Promise.all([
      Book.find(filter).skip(skip).limit(limit).lean(),
      Book.countDocuments(filter),
    ]);

    return res.status(200).json({
      status: "success",
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      },
      data: books,
    });
  } catch (error) {
    console.error("searchByPage:", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
}

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
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      },
      data: books,
    });
  } catch (error) {
    console.error("searchUnAvailbleBooks:", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
}

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
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit,
      },
      data: books,
    });
  } catch (error) {
    console.error("searchBooksWithoutImage:", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error",
    });
  }
}

export {
  searchBookByTitle,
  searchByViews,
  searchByPage,
  searchUnAvailbleBooks,
  searchBooksWithoutImage,
};
