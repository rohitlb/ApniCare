var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Strength = new Schema({
    strength : {type : String,trim:true },
    //strength_unit : {type : String, trim:true},
    potent_substance : {
        name : [{type : String, trim:true}],
        molecule_strength : [{type : String, trim:true}]
    },
    packaging : {type : String, trim:true},
    price : {type : String, trim:true},
    prescription : {type : String, trim:true},
    dose_taken : {type : String, trim:true},
    dose_timing : {type : String, trim:true},
    warnings : {type : String, trim:true},
    submitted_by : {type : String, trim:true},
    brands_id : [{type : Schema.Types.ObjectId , ref : 'brand'}]
});

module.exports = mongoose.model('strength',Strength);