var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Needhelp = new Schema({
    number : {type : String},
    subject : {type : String},
    contact_message : {type : String}
});

module.exports = mongoose.model('needhelp',Needhelp);