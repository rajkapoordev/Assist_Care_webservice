const Book = require("../models/book.model");

function create(req, res, next) {
    var book = new Book();
    book.name = req.body.name;
    book.author = req.body.author;
    book.save()
        .then(function () {
            return res.json({message: "Book created."});
        })
        .catch(function (err) {
            return res.send(err);
        })
}

function getAll(req, res, next) {
    Book.find()
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