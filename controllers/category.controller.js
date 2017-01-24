var Category = require('./../models/category.model');

function create(req, res, next) {
    var category = new Category();
    category.categoryName = req.body.categoryName;
    category.description = req.body.description;
    category.save()
        .then(function (category) {
            res.send(category);
        })
        .catch(function (err) {
            res.send(err);
        })
}

/*
Populate products when get category
 */
function getAll(req, res, next) {
    Category.find().populate('products').exec()
        .then(function (category) {
            return res.send(category);
        })
        .catch(function (err) {
            return next(err);
        })
}

function getById(req, res, next) {
    Category.getCategoryById(req.params.categoryId)
        .then(function (category) {
            return res.send(category);
        })
        .catch(function (err) {
            return next(err);
        })
}

/**
 *
 * @param req
 * @param res Get all unique category name
 * @param next
 */
function getUniqueCategory(req, res, next) {
    Category.find().distinct('categoryName')
        .then(function (categories) {
            console.log("Inside get");
            return res.send(categories);
        })
        .catch(function (err) {
            console.log("Inside Err");
            return next(err);
        })
}

module.exports = { create, getAll, getById, getUniqueCategory };