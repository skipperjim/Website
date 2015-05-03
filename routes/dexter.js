var express = require('express');
var router = express.Router();

/* GET admin panel view. */
router.get('/', function (req, res, next) {
    res.render('dexter', {
        title: 'Dexter\'s Gallery',
        user: req.user
    });
});

module.exports = router;