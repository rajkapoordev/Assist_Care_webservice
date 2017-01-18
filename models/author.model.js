var mongoose = require("mongoose");
var Schema = mongoose.Schema;

const Author = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
});

Author.statics.get = function (authorId){
    return this.findById(authorId)
        .then(function (author) {
            if (author) {
                return author;
            }
            const err = "Author not found";
            return Promise.reject(err);
        });
};

Author.statics.getByAuthorId = function (authorId){
    return this.findOne({ _id: authorId })
        .then(function (authorId) {
            if (author) {
                return author;
            }
            const err = { message: "No such author exists!" };
            return Promise.reject(err);
        });
};

module.exports = mongoose.model("Author", Author);