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

/**
 *
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

User.methods = {
    safeModel : function () {
        return _.omit(this.toObject(), ['password', '__v']);
    }
}

module.exports = mongoose.model("User", User);