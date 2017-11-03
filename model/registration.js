var mongoose = require('mongoose');


var User = new mongoose.Schema({
    Name : {type:String},
    email : {tupe : String},
    Number : {type : String},
    Password : {type:String},
    //profile : [{type : Schema.Types.ObjectId , ref : 'userprofile'} ]
});

module.exports = mongoose.model('user',User);