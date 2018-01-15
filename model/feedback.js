var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Feedback = new Schema({
    number : {type : String},
    about : {type : String},
    usefulness : {type : String},
    suggestion : {type : String}
});

module.exports = mongoose.model('feedback',Feedback);