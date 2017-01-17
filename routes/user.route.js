const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");
const Joi = require("joi");
const validate = require("express-validation");
//apply validation on request body
const userValidation = {
    registerUser: {
        body: {
            firstName: Joi.string().required(),
            lastName: Joi.string().required(),
            emailId: Joi.string().email().required(),
            password: Joi.string().required(),
        }
    }
};

router.route('/registeruser')

    .post(validate(userValidation.registerUser),userCtrl.create)

    .get(userCtrl.getAllUser);

module.exports = router;