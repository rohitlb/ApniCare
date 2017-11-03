var mongoose = require('mongoose');


var User = new mongoose.Schema({
    Name : {type:String},
    email : {tupe : String},
    Number : {type : String},
    Password : {type:String}
});

module.exports = mongoose.model('user',User);