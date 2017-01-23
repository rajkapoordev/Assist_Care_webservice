var Product = require('./../models/product.model');
var mongoose = require('mongoose');

function create(req, res, next) {
    var product = new Product();
    product.productName = req.body.productName;
    product.price = req.body.price;
    product.quantity = req.body.quantity;
    product.category = mongoose.Types.ObjectId(req.body.category);
    product.save()
        .then(function (product) {
            res.send(product);
        })
        .catch(function (err) {
            res.send(err);
        })
}

function getAll(req, res, next) {
    Product.find()
        .then(function (product) {
            return res.send(product);
        })
        .catch(function (err) {
            return next(err);
        })
}
/**
 *
 * @param req minimum & maximum price
 * @param res products
 * @param next error
 */
function getByPriceRange(req, res, next) {
    Product.find().where('price').lt(req.params.maxPrice).gt(req.params.minPrice)
        .then(function (product) {
            return res.send(product);
        })
        .catch(function (err) {
            return next(err);
        })
}


module.exports = { create, getAll, getByPriceRange};