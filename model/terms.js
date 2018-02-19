var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Term = new Schema({
    terms : {type: String,trim: true}
});

module.exports = mongoose.model('term',Term);