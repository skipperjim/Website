var express = require('express');
var router = express.Router();

/* GET admin panel view. */
router.get('/', function (req, res, next) {
    res.render('three', {
        title: 'three.js Game',
        user: req.user
    });
});

module.exports = router;