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
    User.findOne({ emailId: req.body.emailId })
        .then(function (userFound) {
        if (userFound) {
                return Promise.reject({ message: "Email Id already exists, please  use another." });
            }else {
                var user = new User();
                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
                user.emailId = req.body.emailId;
                user.password = passwordHash.generate(req.body.password);
                return user.save()
            }
    }).then(function (savedUser) {
        var token = jwt.sign({ userId: savedUser._id }, config.jwtSecretKey, {
            expiresIn: config.jwtExpiresIn
        });
        return res.json({ message: "User successfully registered.", token: token });
    }).catch(function (err) {
        return res.send(err);
    })
}

function getAllUser(req, res) {
    User.find({}, {firstName: 1, lastName: 1, emailId: 1})
        .then(function (users) {
            return res.json(users);
        })
        .catch(function (err) {
            return res.send(err);
        })
}

/**
 *
 * @param req { username, password }
 * @param res { login status fail or login
 * #if login successfull create token and send it
 * }
 */
function userLogin(req, res) {
    User.getByEmailId(req.body.emailId).then(function (user) {
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
            return res.json(err);
        }
    }).catch(function (err) {
        return res.send(err);
    });
}

function remove(req, res) {
    User.remove({_id: req.params.userId})
        .then(function () {
            return res.json({message: "successfully deleted."});
        })
        .catch(function (err){
            return res.send(err);
        })
}

module.exports = {create, getAllUser, userLogin, remove};