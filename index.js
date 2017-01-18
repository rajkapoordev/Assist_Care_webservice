var express    = require('express');
var bodyParser = require('body-parser');
var morgan     = require('morgan');
var Promise    = require('bluebird');
var path = require('path');
var jwt = require("jsonwebtoken");
var config = require('./config/config');
var mongoose   = require('mongoose');
const apiRouter = require("./routes/index.route");
var app = express();
var server = require("http").Server(app);

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
    let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1ODdmMjk5ZDMyZjhhNDEwZjg0NjI5OGEiLCJpYXQiOjE0ODQ3Mjg3MzMsImV4cCI6MjI0MjExMTEzM30.nhPbnJOUeGU_wSwmawCMxNFtqOURlenagKMqdhPvQnk";
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

app.use('/',router);

//Listening port
app.set('port',process.env.PORT || config.webPort);
app.use(express.static(path.join(__dirname,'public')));

server.listen(app.get('port'),function(){
    console.log('Server listing at port ' + server.address().port);
});

app.get('/test', function (req, res) {
    res.sendFile(__dirname + "/testFileUpload.html");
});

module.exports = app;