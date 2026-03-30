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

// ================= ORIGINAL ENDPOINTS =================
// Get all books (synchronous)
public_users.get('/', function (req, res) {
    return res.status(200).json(books);
});

// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    return res.status(200).json(books[isbn].reviews);
});

// ================= ASYNC + AXIOS ENDPOINTS =================

// Helper function to simulate server call using Axios
const axiosGetLocal = async (path) => {
    const url = `http://localhost:5000${path}`;
    const response = await axios.get(url);
    return response.data;
};

// Task 10: Get all books using Axios + async/await
public_users.get('/async', async (req, res) => {
    try {
        const data = await axiosGetLocal('/');
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Task 11: Get book details by ISBN
public_users.get('/async/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const data = await axiosGetLocal(`/isbn/${isbn}`);
        res.status(200).json(data);
    } catch (err) {
        res.status(404).json({ message: err.response?.data?.message || err.message });
    }
});

// Task 12: Get book details by author
public_users.get('/async/author/:author', async (req, res) => {
    try {
        const author = req.params.author;
        const data = await axiosGetLocal(`/author/${author}`);
        res.status(200).json(data);
    } catch (err) {
        res.status(404).json({ message: err.response?.data?.message || err.message });
    }
});

// Task 13: Get book details by title
public_users.get('/async/title/:title', async (req, res) => {
    try {
        const title = req.params.title;
        const data = await axiosGetLocal(`/title/${title}`);
        res.status(200).json(data);
    } catch (err) {
        res.status(404).json({ message: err.response?.data?.message || err.message });
    }
});

module.exports.general = public_users;
