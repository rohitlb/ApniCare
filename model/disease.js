var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Disease = new Schema({
    disease_name : {type : String},
    symptoms : {type:String}, //a
    risk_factor : {type : String},
    cause : {type : String},
    diagnosis : {subhead : [{type : String}],info : [{type : String}]},
    // organ which are mainly affected
    organs : {subhead : [{type : String}],info : [{type:String}]},
    treatment : {type : String},
    outlook : {type : String},
    prevention : {type : String},
    source : {type : String},
    submitted_by : {type : String}
});

module.exports = mongoose.model('disease',Disease);