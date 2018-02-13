var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AdminDrugData = new Schema({
    company_name : {type : String, trim:true},
    brand_name : {type: String, trim:true},
    categories : { type : String, trim:true },
    primarily_used_for : [{type : String, trim:true}],
    types : {type : String, trim:true},
    dosage_form : {type : String, trim:true},
    strength : {type : String, trim:true},
    potent_substance : {
        name : [{type : String, trim:true}],
        molecule_strength : [{type : String, trim:true}]
    },
    packaging : {type : String, trim:true},
    price : {type : String, trim:true},
    prescription : {type : String, trim:true},
    ticket : {type : String, trim:true},
    dose_taken : {type : String, trim:true},
    dose_timing : {type : String, trim:true},
    warnings : {type : String, trim:true},
    submitted_by : {type : String, trim:true},
    issue_status : {type : String}
});

module.exports = mongoose.model('drugdata',AdminDrugData);