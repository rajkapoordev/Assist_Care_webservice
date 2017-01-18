var mongoose = require("mongoose");
var Schema = mongoose.Schema;
const _ = require("lodash");
const passwordHash = require('password-hash');

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
    books: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
    }]
});

/**
 * call before register the user
 */
User.pre('save',function (next) {
        this.password = passwordHash.generate(this.password);
        return next();
});

/**
 * @param emaiId
 * @returns {Promise}
 */
User.statics.getByEmailId = function (emailId){
    return this.findOne({ emailId: emailId })
        .then(function (user) {
            if (user) {
                return user;
            }
            const err = { message: "No such user exists!" };
            return Promise.reject(err);
        });
};
User.statics.getByUserId = function (userId){
    return this.findOne({ _id: userId })
        .then(function (user) {
            if (user) {
                return user;
            }
            const err = { message: "No such user exists!" };
            return Promise.reject(err);
        });
};

User.methods = {
    safeModel : function () {
        return _.omit(this.toObject(), ['password', '__v']);
    }
}

module.exports = mongoose.model("User", User);