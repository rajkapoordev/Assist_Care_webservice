const Author = require("../models/author.model");

/**
 *
 * @param { fullname, emailId}
 * @param res
 *
 */
function create(req, res, next) {
    var author = new Author();
    author.fullName = req.body.fullName;
    author.emailId = req.body.emailId;
    author.createdBy = res.locals.session;
    if (req.body.profile)
        author.profile = req.body.profile;
    author.save()
        .then(function () {
            return res.json({message: "Author added."});
        })
        .catch(function (err) {
            //return res.send(err);
            return next(err);
        })
}

function getAll(req, res, next) {
    Author.find().sort({ createdOn: -1 })
        .then(function (author) {
            return res.json(author);
        })
        .catch(function (err) {
            return res.send(err);
        })
}

function getById(req, res, next) {
    Author.get(req.params.authorId)
        .then(function (author) {
            return res.json(author);
        }).catch(function (err) {
        return res.send(err);
    })
}

function remove(req, res) {
    Author.remove({_id: req.params.authorId})
        .then(function (author) {
            return res.json({message: "author successfully deleted."});
        })
        .catch(function (err){
            return res.send(err);
        })
}

module.exports = { create, getAll, getById, remove };