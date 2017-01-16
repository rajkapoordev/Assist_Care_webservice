const User = require("../models/user.model");
const jwt = require('jsonwebtoken');
const config = require('../config/config');

function create(req, res, next) {
    var user = new User();
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;
    user.emailId = req.body.emailId;
    user.password = req.body.password;
    user.save()
        .then(function (user) {
            /**
             * If user successfully register then create a token for authentication
             */
            console.log("inside  create", user);
            var token = jwt.sign(user._id, "abc123123", {
                expiresIn: '24h'
            });
            return res.json({ message: "User registered.", token: token });
        })
        .catch(function (err) {
            return res.send(err);
        })
}

function getAllUser(req, res) {
    User.find()
        .then(function (users) {
            return res.json(users);
        })
        .catch(function (e) {
            return res.send(e);
        })
}

module.exports = {create, getAllUser};