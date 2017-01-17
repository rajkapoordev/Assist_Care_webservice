var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const _ = require("lodash");

const Book = new Schema({
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
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
    return this.findById(bookId).populate('owner').exec()
        .then(function (book) {
            if (book) {
                return book;
            }
            const err = "Book not found";
            return Promise.reject(err);
        });
};

module.exports = mongoose.model("Book", Book);