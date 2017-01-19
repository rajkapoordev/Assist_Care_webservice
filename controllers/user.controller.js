const User = require("../models/user.model");
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const passwordHash = require('password-hash');

/**
 *
 * @param { firstName, lastname, emailId, password }
 * @param res
 * #if email already exists return
 * #else
 * # convert password in hash and save then create token and send to user.
 */
function create(req, res, next) {
    console.log("inside controller.");
    User.findOne({ emailId: req.body.emailId })
        .then(function (userFound) {
        if (userFound) {
                return Promise.reject({ message: "Email Id already exists, please  use another." });
            }else {
                var user = new User();
                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
                user.emailId = req.body.emailId;
                //user.password = passwordHash.generate(req.body.password);
                user.password = req.body.password;
                return user.save()
            }
    }).then(function (savedUser) {
        console.log(savedUser);
        var token = jwt.sign({ userId: savedUser._id }, config.jwtSecretKey, {
            expiresIn: config.jwtExpiresIn
        });
        return res.json({ message: "User successfully registered.", token: token });
    }).catch(function (err) {
        return next(err);
    })
}

// Get all users
function getAllUser(req, res, next) {
    User.find({}, { firstName: 1, lastName: 1, emailId: 1, books: 1 })
        .populate('books').sort({ createdOn: -1 }).exec()
        .then(function (users) {
            return res.json(users);
        })
        .catch(function (err) {
            return next(err);
        })
}

/**
 *
 * @param req { username, password }
 * @param res { login status fail or login
 * #if login successfull create token and send it
 * }
 */
function userLogin(req, res, next) {
    User.getByEmailId(req.body.emailId)
        .then(function (user) {
            if(passwordHash.verify(req.body.password, user.password)) {
                console.log("valid password");
                var token = jwt.sign({ userId: user._id }, config.jwtSecretKey, {
                    expiresIn: config.jwtExpiresIn
                });
                return res.json({ message: "User successfully login.", token: token, user: user.safeModel() });
            }else {
                console.log("Invalid password");
                const err = {
                    message: "Invalid password, please try again.",
                };
                return Promise.reject(err);
            }
    }).catch(function (err) {
        return next(err);
    });
}

/**
 *
 * @param req UserId
 * @param res message or error
 */
function remove(req, res, next) {
    User.getByUserId(req.param.userId)
        .then(function (user) {
            User.remove({ _id: user._id })
        })
        .then(function () {
            return res.json({message: "successfully deleted."});
        })
        .catch(function (err){
            return next(err);
        })
}

module.exports = {create, getAllUser, userLogin, remove};