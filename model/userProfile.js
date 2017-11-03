var mongoose = require('mongoose');


var Userprofile = new mongoose.Schema({
    dob : {type:String},
    gender : {type : String},
    blood_group : {type:String},
    marital_status : {type : String},
    height : {type : String},
    weight : {type : String},
    address : [{type : String}],
    aadhaar_number : {type : String},
    income : {type : String},
    contact : {type : String},
    relation : {type : String}
});

module.exports = mongoose.model('userprofile',Userprofile);