var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const _ = require("lodash");

const Book = new Schema({
    name: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
});

Book.method({});

Book.statics.get = function (bookId){
    return this.findById(bookId)
        .then(function (book) {
            if (book) {
                return book;
            }
            const err = "Book not found";
            return Promise.reject(err);
        });
};

module.exports = mongoose.model("Book", Book);