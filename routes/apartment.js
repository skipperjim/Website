var express = require('express');
var router = express.Router();

/* GET admin panel view. */
router.get('/', function (req, res, next) {
    res.render('apartment', {
        title: 'ImpactJs Game',
        user: req.user
    });
});

module.exports = router;