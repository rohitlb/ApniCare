var mongoose = require('mongoose');

var Doctor = new mongoose.Schema({
    //general information
    doctor_image : {type : String},
    name : {type:String},
    email : {type : String},
    number : {type : String},
    password : {type:String},
    //his/her occupation
    occupation : {type : String},
    //personal details
    title : {type : String},
    gender : {type : String},
    city : {type : String},
    year_of_experience : {type :String},
    About_you : {type : String},
    //educations
    qualification : {type :String},
    college : {type : String},
    completion_year : {type : String},
    specialization : {type : String},
    //registration and document
    council_registration_number : {type : String},
    council_name : {type : String},
    council_registration_year : {type : String},
    document : [{type : String}],
    certificate : [{type : String}]
});

module.exports = mongoose.model('Doctor',Doctor);
