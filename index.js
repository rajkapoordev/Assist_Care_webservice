var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var Promise    = require('bluebird');
var jwt = require("jsonwebtoken");
var config = require('./config/config');

var app = express();

var port = process.env.PORT || 3000; //set the port

var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost/sampleDB'); // connect to our database

mongoose.Promise = Promise;

var router = express.Router();

// middleware to use for api requests and verify token.
app.use('/api', function(req, res, next) {
    console.log("Inside the function");
    let token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.jwtSecretKey, function (err, decoded) {
            if (err) {
                res.send({ success: false, message: "Failed to authenticate token.", error: err });
            }
            console.log(decoded);
            next();
        })
    }else {
        res.status(403).send({ success: false, message: "Authenticate token required."});
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

router.get('/', function(req, res) {
    res.json({ message: 'hello from api test!' });
});

const apiRouter = require("./routes/index.route");
app.use('/',apiRouter);

app.listen(port);