const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');


// public_users.post("/register", (req,res) => {

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

// Get the book list available in the shop

// Using async-await
public_users.get('/async', async (req, res) => {
    try {
        // Simulate API call
        const response = await new Promise((resolve) => {
            resolve({ data: books });
        });
        res.status(200).json(response.data);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Get book details based on ISBN

//async 
  public_users.get('/async/isbn/:isbn', async (req, res) => {
    try {
        const isbn = req.params.isbn;
        const response = await new Promise((resolve, reject) => {
            if (books[isbn]) resolve({ data: books[isbn] });
            else reject(new Error("Book not found"));
        });
        res.status(200).json(response.data);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});
  
// Get book details based on author

public_users.get('/async/author/:author', async (req, res) => {
    try {
        const author = req.params.author.toLowerCase();
        const response = await new Promise((resolve, reject) => {
            const result = Object.values(books).filter(
                book => book.author.toLowerCase() === author
            );
            result.length ? resolve({ data: result }) : reject(new Error("No books found for this author"));
        });
        res.status(200).json(response.data);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

// Get all books based on title

public_users.get('/async/title/:title', async (req, res) => {
    try {
        const title = req.params.title.toLowerCase();
        const response = await new Promise((resolve, reject) => {
            const result = Object.values(books).filter(
                book => book.title.toLowerCase() === title
            );
            result.length ? resolve({ data: result }) : reject(new Error("No books found with this title"));
        });
        res.status(200).json(response.data);
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

//  Get book review

public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    return res.status(200).json(books[isbn].reviews);
  });
module.exports.general = public_users;
