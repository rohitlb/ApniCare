var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var AdminDiseaseData = new Schema({
    disease_name : {type:String, trim:true , required : true},
    symptoms : {type:String, trim:true,required : true},
    risk_factor : {type : String, trim:true,required : true},
    cause : {type : String, trim:true,required : true},
    diagnosis : {subhead : [{type : String, trim:true}],info : [{type : String, trim:true}]},
    // organ which are mainly affected
    organs : {subhead : [{type : String, trim:true}],info : [{type:String, trim:true}]},
    treatment : {type : String, trim:true,required : true},
    outlook : {type : String, trim:true,required : true},
    prevention : {type : String, trim:true,required : true},
    source : {type : String, trim:true,required : true},
    submitted_by : {type : String, trim:true,required : true}
});

module.exports = mongoose.model('diseasedata',AdminDiseaseData);