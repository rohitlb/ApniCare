var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Disease = new Schema({
    disease_name : {type : String},
    symptoms : {type:String}, //a
    risk_factor : {type : String},
    cause : {type : String},
    diagnosis : [ {subhead1 : {type : String},subhead2 : {type : String}}], // make subhead1 -> subhead          and         subhead2 -> information
    // organ which are mainly affected
    organs : [{subhead7 : {type : String},info7 : {type:String}}],
    treatment : {type : String},
    outlook : {type : String},
    prevention : {type : String},
    source : {type : String}
});

module.exports = mongoose.model('disease',Disease);