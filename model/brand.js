var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Brand = new Schema({
    brand_name : {type: String , trim : true},
    categories : { type : String , trim : true},
    primarily_used_for : [{type : String , trim : true}],
    types : {type : String , trim : true},
    dosage_id : [{type : Schema.Types.ObjectId , ref : 'dosage'}],
    company_id : [{type : Schema.Types.ObjectId , ref : 'company'}],
});

module.exports = mongoose.model('brand',Brand);