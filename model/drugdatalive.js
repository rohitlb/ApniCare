var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminDrugData = new Schema({
    company_name : {type : String},
    brand_name : {type: String},
    categories : { type : String },
    primarily_used_for : [{type : String}],
    types : {type : String},
    dosage_form : {type : String},
    strength : {type : String},
    strength_unit : {type : String},
    potent_substance : {
        name : [{type : String}],
        molecule_strength : [{type : String}]
    },
    packaging : {type : String},
    price : {type : String},
    prescription : {type : String},
    ticket : {type : String},
    dose_taken : {type : String},
    dose_timing : {type : String},
    warnings : {type : String},
    submitted_by : {type : String}
});

module.exports = mongoose.model('drugdata',AdminDrugData);