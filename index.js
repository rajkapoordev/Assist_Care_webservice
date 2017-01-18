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
var expressValidation = require("express-validation");

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

//Here handle an error when next with error
app.use(function (err, req, res, next) {
    console.log("inside next err call");
    if (err instanceof expressValidation.ValidationError) {
        console.log(err);
        const errorMessage = err.errors.map(error => error.messages.join('. ')).join(' and ');
        return res.status(err.status).json({
            error: errorMessage
        });
    }else {
        res.send(err);
    }
})


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