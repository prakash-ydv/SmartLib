# SmartLib

## Book Schema

```

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
    },
    author: {
        type: String
    },
    department: {
        type: String,
        required: true,
        enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "MBA", "MCA", "BBA", "BCA", "B.COM", "B.SC", "B.PHARM", "B.ARCH", "B.DES", "B.ED", "B.LLB", "B.PT", "B.HM", "B.MS", "B.AS", "B.FA", "B.FT","AGRICULTURE"]
    },
    isbn: {
        type: String,
        unique: true
    },
    publisher: {
        type: String,
    },

    edition: {
        type: String,
    },
    cover_url: {
        type: String,
    },
    views : {
        type : Number,
        default : 0
    },
    copies : {
        type : [String]
    }

```
# Add Book

### Add a single book

```
POST /add/one

body
{
  "title": "Clean Architecture",
  "department": "CSE",
  "author": "Robert C. Martin",
  "isbn": "1234567890",
  "publisher": "Addison-Wesley",
  "edition": "2nd",
  "cover_url": "http://x.com",
  "copies": ["copy1", "copy2"]
}
```

### Add multiple books from excel

```
POST /add/bulk/excel

body
{
  "file": "file.xlsx"
}
```

# Update Book

### patch data of a single book
```
PATCH /update/book/{bookId}

body
{
  "title": "Clean Architecture",
  "edition": "2nd",
  ...
}
```

### Update Book View Count

```
PATCH /update/book/views/{bookId}
```

# Search Book

### Search all books with pagination

```
GET /search/all-books?page=1&limit=10
```

### Search book by title
```
GET /search/book?title=book
```

### Search book by max views
```
GET /search/search-by-views?page=1&limit=10

RESPONSE

{
    "status": "success",
    "pagination": {
        "totalItems": 4,
        "currentPage": 1,
        "totalPages": 4,
        "pageSize": 1
    },
    "data": [
        {
            "_id": "697b43388180d6ae6e2bf0fb",
            "title": "BookB",
            "description": null,
            "author": null,
            "department": "CSE",
            "isbn": "abcd",
            "publisher": null,
            "edition": null,
            "cover_url": "http://x.com",
            "copies": null,
            "__v": 0,
            "isAvailable": true,
            "views": 7,
            "createdAt": "2026-02-01T14:34:01.917Z"
        }
    ]
}
```

# Delete Book

### Delete a single book
DELETE /delete/book/{bookId}
```


## Upload Image

```
POST /upload/image

body
{
  "file": "file.jpg",
  "bookId": "bookId"
}   