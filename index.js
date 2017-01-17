var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var Promise    = require('bluebird');
var expressJWT = require("express-jwt");
var config = require('./config/config');

var app = express();

var port = process.env.PORT || 3000; //set the port

var mongoose   = require('mongoose');

mongoose.connect('mongodb://localhost/sampleDB'); // connect to our database

mongoose.Promise = Promise;

var router = express.Router();

//app.use('/auth', expressJWT({ secret: "dfgdfgfdgjffjfghjghjghh"}));
app.use('/api', function(req, res, next){
    console.log("Inside the function");
   // const authorization = req.header('authorization');
   // res.locals.session = JSON.parse(new Buffer((authorization.split(' ')[1]).split('.')[1], 'base64').toString()); // eslint-disable-line no-param-reassign
   next();
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// middleware to use for all requests
router.use(function(req, res, next) {
    console.log('call..');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'hello from api test!' });
});

const apiRouter = require("./routes/index.route");
app.use('/',apiRouter);

app.listen(port);