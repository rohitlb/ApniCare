var mongoose = require('mongoose');

var Pharma = new mongoose.Schema({
    //general information
    doctor_image : {type : String, trim : true},
    name : {type:String, trim : true},
    email : {type : String, trim : true},
    number : {type : String, trim : true},
    password : {type:String, trim : true},

    //his/her occupation
    occupation : {type : String, trim : true},
    //personal details
    title : {type : String, trim : true},
    gender : {type : String, trim : true},
    city : {type : String, trim : true},
    year_of_experience : {type :String, trim : true},
    About_you : {type : String, trim : true},
    //educations
    qualification : {type :String, trim : true},
    college : {type : String, trim : true},
    completion_year : {type : String, trim : true},
    batch_to: {type:String, trim : true},
    batch_from : {type:String, trim : true},
    specialization : {type : String, trim : true},
    //registration and document
    council_registration_number : {type : String, trim : true},
    council_name : {type : String, trim : true},
    council_registration_year : {type : String, trim : true},
    document : [{name : {type : String, trim : true},path : {type : String, trim : true}}],
    certificate : [{name : {type : String, trim: true},path : {type : String, trim : true}}],
    //yet left
    //yet left
    registered_at : {type: Date, required: true, default: Date.now },
    status : {type : String , trim : true}
});

module.exports = mongoose.model('pharma',Pharma);
