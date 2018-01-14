var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Needhelp = new Schema({
    number : {type : String},
    subject : {type : String},
    contact_message : {type : String}
});

module.exports = mongoose.model('needhelp',Needhelp);


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