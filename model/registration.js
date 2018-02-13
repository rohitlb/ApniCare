var mongoose = require('mongoose');


var User = new mongoose.Schema({
    //general information
    name : {type:String, trim:true},
    email : {type:String, trim:true},
    number : {type:String, trim:true},
    password : {type:String, trim:true},
    path: {type:String, trim:true },
    dob : {type:String, trim:true },
    gender : {type:String, trim:true },
    blood_group : {type:String, trim:true },
    marital_status : {type:String, trim:true },
    height : {type:String, trim:true },
    weight : {type:String, trim:true },
    address : {
        addresses : {type:String, trim:true },
        landmarks : {type:String, trim:true },
        pin_code : {type:String, trim:true },
        city : {type:String, trim:true },
        state : {type:String, trim:true }
    },
    aadhaar_number : {type:String, trim:true },
    income : {type:String, trim:true },
    relative_name : {type:String, trim:true },
    relative_contact : {type:String, trim:true },
    relation : {type:String, trim:true },
    registered_at    : { type: Date, required: true, default: Date.now },
    status : {type : String}
});

module.exports = mongoose.model('user',User);