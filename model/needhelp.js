var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Needhelp = new Schema({
    subject : {type : String, trim:true},
    contact_message : {type : String, trim:true}
});

module.exports = mongoose.model('needhelp',Needhelp);
