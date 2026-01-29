const allBooks = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    thumbnail: "gatsby.jpg",
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    thumbnail: "mockingbird.jpg",
  },
  { id: 3, title: "1984", author: "George Orwell", thumbnail: "1984.jpg" },
  {
    id: 4,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    thumbnail: "pride.jpg",
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    thumbnail: "catcher.jpg",
  },
  {
    id: 6,
    title: "Wuthering Heights",
    author: "Emily Brontë",
    thumbnail: "wuthering.jpg",
  },
  {
    id: 7,
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    thumbnail: "jane.jpg",
  },
  {
    id: 8,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    thumbnail: "hobbit.jpg",
  },
  {
    id: 9,
    title: "Brave New World",
    author: "Aldous Huxley",
    thumbnail: "brave.jpg",
  },
  {
    id: 10,
    title: "The Lord of the Rings",
    author: "J.R.R. Tolkien",
    thumbnail: "lotr.jpg",
  },
];

async function getAllBooks(req, res) {
  try {
    const books = allBooks;

    if (books) {
      res.status(500).json({
        status: "success",
        data: books,
      });
    } else {
      res.status(404).json({
        status: "failed",
        message: "books not found",
      });
    }
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAllBooks,
};
