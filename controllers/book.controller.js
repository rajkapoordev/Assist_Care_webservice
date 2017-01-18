const Book = require("../models/book.model");
const User = require("../models/user.model");
const Author = require("../models/author.model");
const mongoose = require("mongoose");

// when create a book also push to user collection
function create(req, res, next) {
    var book = new Book();
    book.name = req.body.name;
    book.author = mongoose.Types.ObjectId(req.body.author);
    book.owner = res.locals.session;
    book.createdBy = res.locals.session;
    book.save()
        .then(function (book) {
            //console.log(book);
            User.getByUserId(res.locals.session)
                .then(function (user) {
                    //console.log(user);
                    user.books.push(book);
                    user.save();
                    console.log(book);
                    Author.get(mongoose.Types.ObjectId(req.body.author)).then(function (author) {
                        //console.log(book);
                        author.books.push(book);
                        author.save();
                        return res.json({message: "Book created."});
                    })
                })
        })
        .catch(function (err) {
            return res.send(err);
        })
}

//Here populate the book details with by whome added and book author details as well
function getAll(req, res, next) {
    Book.find({}).populate('owner').populate('author')
        .exec()
        .then(function (books) {
            return res.json(books);
        })
        .catch(function (e) {
            return res.send(e);
        })
}

function getById(req, res, next) {
    Book.get(req.params.bookId)
        .then(function (book) {
            return res.json(book);
        }).catch(function (e) {
        return res.send(e);
    })
}

function update(req, res, next) {
    Book.findById(req.params.bookId)
        .then(function (book) {
            book.name = req.body.name;
            book.author = req.body.author;
            book.save()
                .then(function () {
                    return res.json({message: "Book update."});
                })
                .catch(function (e) {
                    return res.send(e);
                })
        })
        .catch(function (e) {
            return res.send(e);
        })
}

function remove(req, res, next) {
    Book.remove({_id: req.params.bookId})
        .then(function (book) {
            return res.json({message: "successfully deleted."});
        })
        .catch(function (e){
            return res.send(e);
        })
}

module.exports = { create, getAll, update, getById, remove };