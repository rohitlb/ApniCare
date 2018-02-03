var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var NeedhelpWL = new Schema({
    name : {type : String, trim:true},
    email : {type : String, trim:true},
    number : {type : String, trim:true},
    subject : {type : String, trim:true},
    contact_message : {type : String, trim:true}

});

module.exports = mongoose.model('needhelpWL',NeedhelpWL);


// there are 2 type
//
// 1 without registration
// * need name, number, mail id...
//     *about like= molecule data or any other kind of suggestion
// usefullnes
// suggestion

// 2 with registration
// * need name, number, mail id... from database // joining would decrease complexity and redundancy
//     *about like= molecule data or any other kind of suggestion
// usefullnes
// suggestion