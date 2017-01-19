var express    = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var config = require('./config');
const apiRouter = require("./../routes/index.route");
var jwt = require("jsonwebtoken");
var expressValidation = require("express-validation");

//Here configure the express
var app = express();
var server = require("http").Server(app);

// middleware to use for api requests and verify token by using jsonwebtoken.
app.use('/api', function(req, res, next) {
    console.log("Inside the function");
    let token = req.headers['x-access-token'];
    if (token) {
        jwt.verify(token, config.jwtSecretKey, function (err, decoded) {
            if (err) {
                res.send({ success: false, message: "Failed to authenticate token.", error: err });
            }else {
                //console.log(decoded.userId);
                res.locals.session = decoded.userId;
                next();
            }
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

//Listening port
app.set('port',process.env.PORT || config.webPort);
app.use(express.static(path.join(__dirname,'./../public')));

server.listen(app.get('port'),function(){
    console.log('Server listing at port ' + server.address().port);
});

app.get('/test', function (req, res) {
    res.sendFile(__dirname + "/testFileUpload.html");
});

module.exports = app;