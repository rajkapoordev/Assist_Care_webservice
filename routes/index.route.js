const express = require("express");
const router = express.Router();
const bookRoute = require("./book.route");
const userRoute = require("./user.route");

//Book routes
router.use('/api/books', bookRoute);
//User routes
router.use('/api', userRoute);

module.exports = router;