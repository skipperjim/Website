var express = require('express');
var router = express.Router();
var sess;

/* GET admin panel view. */
router.get('/', function (req, res, next) {
    console.log("LOAD ADMIN PAGE");
    sess = req.session;
    //Session set when user Request our app via URL
    if (sess.username) {
        res.render('admin', {
            title: 'Admin Panel'
        });
    } else {
        res.render('login');
    }
});

/* GET admin panel view. */
router.get('/panel', function (req, res, next) {
    console.log("LOAD ADMIN PANEL");
    res.render('admin', {
        title: 'Admin Panel'
    });
});

router.post('/login', function (req, res) {
    var db = req.db;
    console.log("admin/login POST!");
    doLogin();
    res.send(
        (err === null) ? {
            msg: ''
        } : {
            msg: err
        }
    );
});
router.doLogin = function (req, res, next) {
    console.log("doLogin called");
};

router.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });

});
// GET userlist.
router.get('/userlist', function (req, res) {
    var db = req.db;
    db.collection('userlist').find().toArray(function (err, items) {
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

/*
 * DELETE to deleteuser.
 */
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