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
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Author'
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

// Pre save the book
Book.pre('save', function(next) {
    console.log("call pre save book");
    return next();
});

Book.method({});

//get book by book Id
Book.statics.get = function (bookId) {
    return this.findById(bookId).populate('owner').exec()
        .then(function (book) {
            if (book) {
                return book;
            }
            const err = { message: "Book not found" };
            return Promise.reject(err);
        });
};

module.exports = mongoose.model("Book", Book);