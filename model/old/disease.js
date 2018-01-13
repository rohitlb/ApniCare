var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Disease = new Schema({
    disease_name : {type : String},
    symptoms : {type:String},
    risk_factor : {type : String},
    cause : {type : String},
    subhead1: [{name : {type: String}}],
    subhead2: [{name : {type: String}}],
    treatment : {type : String},
    outlook : {type : String},
    prevention : {type : String},
    source : {type : String}
});

module.exports = mongoose.model('disease',Disease);
