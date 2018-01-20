var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminFeedback = new Schema({
    feedbackFrom : {type : String},
    feedbackUsefulness : {type : String},
    feedbackInfo : {type : String},
    feedbackTicket : {type : String},
    feedbackCategory : {type : String},
    feedbackResponse : [{type : String}]
});

module.exports = mongoose.model('feedback',AdminFeedback);