var mongoose = require('mongoose');

var Professional = new mongoose.Schema({
    //general information
    doctor_image : {type : String, trim:true},
    name : {type:String, trim:true},
    email : {type : String, trim:true},
    number : {type : String, trim:true},
    password : {type:String, trim:true}
});

module.exports = mongoose.model('professional',Professional);
