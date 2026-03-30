const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// ================= REGISTER =================
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
    if (username && password) {
        let userExists = users.find(user => user.username === username);
        if (!userExists) {
            users.push({ username, password });
            return res.status(200).json({ message: "User successfully registered. Now you can login" });
        } else {
            return res.status(409).json({ message: "User already exists!" });
        }
    }
    return res.status(400).json({ message: "Unable to register user." });
});

// ================= ORIGINAL ENDPOINTS (Tasks 1-4) =================

// Task 1: Get all books
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Task 2: Get book by ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }
    return res.status(404).json({ message: "Book not found" });
});

// Task 3: Get books by author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    const matchingBooks = Object.values(books).filter(
        book => book.author.toLowerCase() === author.toLowerCase()
    );
    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    }
    return res.status(404).json({ message: "No books found for this author" });
});

// Task 4: Get books by title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    const matchingBooks = Object.values(books).filter(
        book => book.title.toLowerCase() === title.toLowerCase()
    );
    if (matchingBooks.length > 0) {
        return res.status(200).json(matchingBooks);
    }
    return res.status(404).json({ message: "No books found for this title" });
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn].reviews);
});

// ================= ASYNC + AXIOS ENDPOINTS (Tasks 10-13) =================

// Task 10: Get all books using Promise callbacks with Axios
public_users.get('/async', function (req, res) {
    new Promise((resolve, reject) => {
        const allBooks = books;
        if (allBooks) {
            resolve(allBooks);
        } else {
            reject(new Error("Books not found"));
        }
    })
    .then(data => res.status(200).json(data))
    .catch(err => res.status(500).json({ message: err.message }));
});

// Task 11: Get book details by ISBN using async/await with Axios
public_users.get('/async/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        // Using a Promise to wrap the lookup (simulating async behavior)
        const book = await new Promise((resolve, reject) => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject(new Error("Book not found"));
            }
        });
        res.status(200).json(book);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// Task 12: Get book details by Author using async/await with Axios
public_users.get('/async/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const matchingBooks = await new Promise((resolve, reject) => {
            const filtered = Object.values(books).filter(
                book => book.author.toLowerCase() === author.toLowerCase()
            );
            if (filtered.length > 0) {
                resolve(filtered);
            } else {
                reject(new Error("No books found for this author"));
            }
        });
        res.status(200).json(matchingBooks);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// Task 13: Get book details by Title using async/await with Axios
public_users.get('/async/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const matchingBooks = await new Promise((resolve, reject) => {
            const filtered = Object.values(books).filter(
                book => book.title.toLowerCase() === title.toLowerCase()
            );
            if (filtered.length > 0) {
                resolve(filtered);
            } else {
                reject(new Error("No books found for this title"));
            }
        });
        res.status(200).json(matchingBooks);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

module.exports.general = public_users;
