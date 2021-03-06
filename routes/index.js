var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var router = express.Router();
var sess;

/* GET home page. */
router.get('/', function (req, res, next) {
    console.log(req.url);
    res.render('index', {
        title: 'Guffaw Homepage',
        user: req.user
    });
});

router.get('/register', function (req, res) {
    res.render('register', {});
});

router.post('/register', function (req, res) {
    Account.register(new Account({
        role: "User",
        username: req.body.username
    }), req.body.password, function (err, account) {
        if (err) {
            return res.render("register", {
                info: "Sorry. That username already exists. Try another one."
            });
        }

        passport.authenticate('local')(req, res, function () {
            res.redirect('/');
        });
    });
});

router.get('/login', function (req, res) {
    res.render('login', {
        user: req.user
    });
});

router.post('/login', passport.authenticate('local'), function (req, res) {
    var sess = req.session;
    sess.User = req.user;
    res.redirect('/');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.get('/ping', function (req, res) {
    res.status(200).send("pong!");
});

module.exports = router;