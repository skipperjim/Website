var express = require('express');
var router = express.Router();

/* GET game canvas view. */
router.get('/', function (req, res, next) {
    res.render('game', {
        title: 'Intension: Space game',
        user: req.user
    });
});

router.get('/space', function (req, res) {
    res.render('game', {
        user: req.user
    });
    //res.sendFile('public/index.html');
});

router.get('/space', function (req, res) {
    res.sendFile(__dirname + '/game');
});

module.exports = router;