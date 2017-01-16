var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const _ = require("lodash");

const User = new Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    createdOn: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("User", User);