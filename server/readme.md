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
        enum: ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "MBA", "MCA", "BBA", "BCA", "B.COM", "B.SC", "B.PHARM", "B.ARCH", "B.DES", "B.ED", "B.LLB", "B.PT", "B.HM", "B.MS", "B.AS", "B.FA", "B.FT"]
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
    copies : {
        type : [String]
    }

```

## Update Book Data

```
PATCH /update/book/{bookId}

body
{
  "title": "Clean Architecture",
  "edition": "2nd",
  ...
}
```

## Update Book View Count

```
PATCH /update/book/views/{bookId}
```

## Search Book By views

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
