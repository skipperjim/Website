var express = require('express');
var http = require('http');
var https = require('https');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var bcrypt = require('bcrypt-nodejs');
var ENV = process.env.NODE_ENV || 'development';
// mongoose config
require('./database');
// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://localhost:27017/guffaw.co", {
    native_parser: true
});
// Authentication
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// Session
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);

var routes = require('./routes/index');
var canvas = require('./routes/canvas');
var game = require('./routes/game');
var three = require('./routes/three');
var pixi = require('./routes/pixi');
var p2 = require('./routes/p2');
var phaser = require('./routes/phaser');
var impactjs = require('./routes/impactjs');
var dexter = require('./routes/dexter');
var admin = require('./routes/admin');
var users = require('./routes/users');
var form = require('./routes/form');
var chat = require('./routes/chat');

var fs = require('fs');
// SSL Variables
//var privateKey = fs.readFileSync('private/server.key', 'utf8');
//var certificate = fs.readFileSync('private/server.crt', 'utf8');
/*var credentials = {
    key: privateKey,
    cert: certificate,
    pass: "9"
};*/
var app = express();
var httpServer = http.createServer(app).listen(80);
//var httpsServer = https.createServer(credentials, app).listen(443);
var io = require('socket.io').listen(app.listen(3700));
console.log("Listening on ports 80, 443, 3700");

io.sockets.on('connection', function (socket) {
    console.log(session.user);
    socket.emit('message', {
        message: 'Welcome to the chatroom'
    });
    socket.on('send', function (data) {
        io.sockets.emit('message', data);
    });
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'keyboard evee nunu',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// Make bcrypt available to our router
app.use(function (req, res, next) {
    req.crypto = bcrypt;
    next();
});
// Make our db accessible to our router
app.use(function (req, res, next) {
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/canvas', canvas);
app.use('/game', game);
app.use('/three', three);
app.use('/phaser', phaser);
app.use('/pixi', pixi);
app.use('/p2', p2);
app.use('/impactjs', impactjs);
app.use('/dexter', dexter);
app.use('/admin', admin);
app.use('/users', users);
app.use('/form', form);
app.use('/create', form);
app.use('/chat', chat);

// Database Models
//
// passport config
var Account = require('./models/account');
passport.use(new LocalStrategy(Account.authenticate()));
passport.serializeUser(Account.serializeUser());
passport.deserializeUser(Account.deserializeUser());

app.get('*', function (req, res, next) {
    // put user into res.locals for easy access from templates
    res.locals.user = req.user || null;
    //res.locals.loggedIn = (req.user) ? true : false;
    next();
});

/////////////////////////////////////////////
/// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
/// error handlers ///
// development error handler
// will print stacktrace
process.env.NODE_ENV === 'development'
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;