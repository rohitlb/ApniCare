var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Term = new Schema({
    terms : {type: String}
});

module.exports = mongoose.model('term',Term);