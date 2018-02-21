var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Disease = new Schema({
    disease_name : {type : String , trim : true},
    symptoms : [{type:String, trim:true}],
    risk_factor : {type:String, trim:true},
    cause : {type:String, trim:true},
    diagnosis : {subhead : [{type:String, trim:true }],info : [{type:String, trim:true }]},
    // organ which are mainly affected
    organs : {subhead : [{type:String, trim:true }],info : [{type:String, trim:true }]},
    treatment : {type:String, trim:true},
    outlook : {type:String, trim:true},
    prevention : {type:String, trim:true},
    source : {type:String, trim:true },
    submitted_by : {type:String, trim:true }
});

module.exports = mongoose.model('disease',Disease);