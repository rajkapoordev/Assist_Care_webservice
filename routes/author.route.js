const express = require("express");
const router = express.Router();
const authorCtrl = require("../controllers/author.controller");
const Joi = require("joi");
const validate = require("express-validation");

const authorValidation = {
    createAuthor: {
        body: {
            fullName: Joi.string().required(),
            emailId: Joi.string().required(),
        }
    }
};

router.route('/')

    .post(validate(authorValidation.createAuthor),authorCtrl.create)

    .get(authorCtrl.getAll);

router.route('/:authorId')

    .get(authorCtrl.getById)

    .delete(authorCtrl.remove);

module.exports = router;