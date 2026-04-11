import Book from "../models/book.model.js";

// ✅ Common pagination helper (industry standard)
const getPagination = (req) => {
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 10, 50); // 🔥 max 50
  const skip = (page - 1) * limit;

  return { page, limit, skip };
};

// 🔍 Search by title (optimized + safe)
async function searchBookByTitle(req, res) {
  try {
    const { title } = req.query;

    if (!title) {
      return res.status(400).json({
        status: "failed",
        message: "Title is required"
      });
    }

    const books = await Book.find({
      title: { $regex: title, $options: "i" }
    })
      .limit(20) // 🔥 limit search results
      .lean();

    return res.status(200).json({
      status: "success",
      count: books.length,
      data: books
    });

  } catch (error) {
    console.error("❌ searchBookByTitle:", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error"
    });
  }
}

// 🔥 Search by views (optimized)
async function searchByViews(req, res) {
  try {
    const { page, limit, skip } = getPagination(req);

    const [books, total] = await Promise.all([
      Book.find()
        .sort({ views: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Book.countDocuments()
    ]);

    return res.status(200).json({
      status: "success",
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit
      },
      data: books
    });

  } catch (error) {
    console.error("❌ searchByViews:", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error"
    });
  }
}

// 📚 Get all books (MAIN FIX - optimized + safe)
async function searchByPage(req, res) {
  try {
    const { page, limit, skip } = getPagination(req);

    const [books, total] = await Promise.all([
      Book.find()
        .skip(skip)
        .limit(limit)
        .lean(), // 🔥 performance boost
      Book.countDocuments()
    ]);

    return res.status(200).json({
      status: "success",
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit
      },
      data: books
    });

  } catch (error) {
    console.error("❌ searchByPage:", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error"
    });
  }
}

// ❌ Unavailable books
async function searchUnAvailbleBooks(req, res) {
  try {
    const { page, limit, skip } = getPagination(req);

    const [books, total] = await Promise.all([
      Book.find({ isAvailable: false })
        .skip(skip)
        .limit(limit)
        .lean(),
      Book.countDocuments({ isAvailable: false })
    ]);

    return res.status(200).json({
      status: "success",
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit
      },
      data: books
    });

  } catch (error) {
    console.error("❌ searchUnAvailbleBooks:", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error"
    });
  }
}

// 🖼️ Books without image
async function searchBooksWithoutImage(req, res) {
  try {
    const { page, limit, skip } = getPagination(req);

    const [books, total] = await Promise.all([
      Book.find({ image: null })
        .skip(skip)
        .limit(limit)
        .lean(),
      Book.countDocuments({ image: null })
    ]);

    return res.status(200).json({
      status: "success",
      pagination: {
        totalItems: total,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        pageSize: limit
      },
      data: books
    });

  } catch (error) {
    console.error("❌ searchBooksWithoutImage:", error);
    return res.status(500).json({
      status: "failed",
      message: "Server Error"
    });
  }
}

export {
  searchBookByTitle,
  searchByViews,
  searchByPage,
  searchUnAvailbleBooks,
  searchBooksWithoutImage
};