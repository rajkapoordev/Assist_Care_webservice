var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var Promise    = require('bluebird');
var jwt = require("jsonwebtoken");
var config = require('./config/config');
var mongoose   = require('mongoose');
const apiRouter = require("./routes/index.route");

var app = express();

// connect to our database
mongoose.connect('mongodb://localhost/sampleDB', function () {
    //Drop database
    //mongoose.connection.db.dropDatabase();
});

//Bluebird to mongoose
mongoose.Promise = Promise;

var router = express.Router();

// middleware to use for api requests and verify token by using jsonwebtoken.
app.use('/api', function(req, res, next) {
    console.log("Inside the function");
    let token = req.headers['x-access-token'];
   // console.log(token);
    if (token) {
        jwt.verify(token, config.jwtSecretKey, function (err, decoded) {
            if (err) {
                res.send({ success: false, message: "Failed to authenticate token.", error: err });
            }
            //console.log(decoded.userId);
            res.locals.session = decoded.userId;
            next();
        })
    }else {
        res.status(403).send({ success: false, message: "Authenticate token required."});
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//all route assign here
app.use('/',apiRouter);

//Test an api is successfully running or not
router.get('/', function(req, res) {
    res.json({ message: 'hello from api test!' });
});

//Listening port
var port = process.env.PORT || 3000; //set the port

app.listen(port);