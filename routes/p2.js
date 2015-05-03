var express = require('express');
var router = express.Router();

/* GET admin panel view. */
router.get('/', function (req, res, next) {
    res.render('p2', {
        title: 'p2.js Game',
        user: req.user
    });
});

module.exports = router;