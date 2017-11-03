var mongoose = require('mongoose');


var User = new mongoose.Schema({
    Name : {type:String},
    email : {type : String},
    Number : {type : String},
    Password : {type:String},
    dob : {type:String},
    gender : {type : String},
    blood_group : {type:String},
    marital_status : {type : String},
    height : {type : String},
    weight : {type : String},
    address : [{type : String}],
    aadhaar_number : {type : String},
    income : {type : String},
    relative_name : {type : String },
    relative_contact : {type : String},
    relation : {type : String}
});

module.exports = mongoose.model('user',User);