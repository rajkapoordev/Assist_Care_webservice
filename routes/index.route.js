const express = require("express");
const router = express.Router();
const bookRoute = require("./book.route");
const userRoute = require("./user.route");
const authorRoute = require("./author.route");

//Book routes
router.use('/api/books', bookRoute);

//User routes
router.use('/auth', userRoute);

//author routes
router.use('/api/authors', authorRoute);

//Test the server
router.get('/', function(req, res) {
    res.json({ message: 'hello from api test!' });
});

module.exports = router;