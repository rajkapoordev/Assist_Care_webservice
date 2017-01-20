const express = require("express");
const router = express.Router();
const bookRoute = require("./book.route");
const userRoute = require("./user.route");
const authorRoute = require("./author.route");
const authcontl = require('../controllers/authenatication.controller');

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

//To change password
router.post('/api/changepwd', authcontl.changePassword);

module.exports = router;