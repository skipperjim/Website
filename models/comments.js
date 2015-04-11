var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Comment = new Schema({
    title: String,
});

mongoose.model('comments', Comment);

module.exports = mongoose.model('comments', Comment);