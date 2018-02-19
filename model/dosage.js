var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Dosage = new Schema({
    dosage_form : {type : String, trim:true,required : true},
    strength_id : [{type : Schema.Types.ObjectId , ref : 'strength'} ]
});

module.exports = mongoose.model('dosage',Dosage);