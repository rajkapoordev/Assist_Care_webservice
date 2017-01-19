var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var boom = require("boom");

const Author = new Schema({
    fullName: {
        type: String,
        required: true,
        trim: true,
    },
    emailId: {
        type: String,
        required: true,
        trim: true,
    },
    profile: {
        type: String,
    },
    gender: {
        type: String,
        enum: ['Female', 'Male'],
    },
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }],
    createdOn: {
        type: Date,
        default: Date.now,
    },
    createdBy: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

//Static method to find author by id
Author.statics.getByAuthorId = function (authorId){
    return this.findOne({ _id: authorId })
        .then(function (author) {
            if (author) {
                return author;
            }
            const err = boom.notFound("No such author exists!");
            return Promise.reject(err);
        });
};

module.exports = mongoose.model("Author", Author);