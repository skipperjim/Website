var express = require('express');
var router = express.Router();
var sess;

/* GET admin panel view. */
router.get('/', function (req, res, next) {
    console.log("LOAD ADMIN PAGE");
    sess = req.session;
    console.log(sess.User);
    //Session set when user Request our app via URL
    if (sess.User && sess.User["role"] === "Admin") {
        res.render('admin', {
            title: 'Admin Panel',
            user: req.user
        });
    } else {
        res.render('authfailed');
    }
});

router.post('/login', function (req, res) {
    console.log(req.body);
    var db = req.db;
    console.log("admin/login POST!!");
    if (req.body.username === "sgray" && req.body.password === "baseball") {
        console.log("CREDENTIALS MATCH!");
        res.send({
            msg: ''
        });
    }
    res.render('/');
});
router.get('/login/:username/:password', function (req, res) {
    console.log(req.body);
    var db = req.db;
    console.log("admin/login POST!!");
    console.log(next);
    if (req.body.username === "skipperjim" && req.body.password === "baseball") {
        console.log("CREDENTIALS MATCH!");
        res.send({
            msg: ''
        });
    }
});
router.doLogin = function (req, res, next) {
    console.log("doLogin called");
};
router.post('/logout', function (req, res) {
    console.log("POST logout");
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("LOGOUT ELSE");
            res.redirect('/');
        }
    });
});

router.get('/logout', function (req, res) {
    console.log("GET logout");
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            console.log("LOGOUT ELSE");
            console.log(req.session.User);
            res.redirect('/');
        }
    });
});
// GET userlist.
router.get('/userlist', function (req, res) {
    var db = req.db;
    db.collection('accounts').find().toArray(function (err, items) {
        res.json(items);
    });
});
// POST to adduser.
router.post('/adduser', function (req, res) {
    var encrypt = req.crypto;
    var hashedpass = encrypt.hashSync(req.body.password);
    req.body.password = hashedpass;
    var db = req.db;
    db.collection('userlist').insert(req.body, function (err, result) {
        res.send(
            (err === null) ? {
                msg: ''
            } : {
                msg: err
            }
        );
    });
});
// DELETE to deleteuser.
router.delete('/deleteuser/:id', function (req, res) {
    var db = req.db;
    var userToDelete = req.params.id;
    db.collection('userlist').removeById(userToDelete, function (err, result) {
        res.send((result === 1) ? {
            msg: ''
        } : {
            msg: 'error: ' + err
        });
    });
});

module.exports = router;