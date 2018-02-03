var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminFeedback = new Schema({
    feedbackFrom : {type : String , trim : true},
    feedbackUsefulness : {type : String, trim : true},
    feedbackInfo : {type : String , trim : true},
    feedbackTicket : {type : String , trim : true},
    feedbackCategory : {type : String , trim : true},
    feedbackResponse : [{type : String , trim : true}]
});

module.exports = mongoose.model('feedback',AdminFeedback);