var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Molecule = new Schema({
    //about molecule
    molecule_name : {type : String, trim:true},
    drug_categories : {type : String, trim:true},
    description : {type : String, trim:true},
    // pharmacokinetics
    absorption : {type : String, trim:true},
    distribution : {type :String, trim:true},
    metabolism : {type : String, trim:true},
    excretion : {type : String, trim:true},
    //adverse reactions/side effects
    side_effect : {type : String, trim:true},
    precaution : {type : String, trim:true},
    other_drug_interaction : {subhead : [{type : String, trim:true}],info : [{type:String, trim:true}]},
    other_interaction : {subhead : [{type : String, trim:true}],info : [{type : String, trim:true}]},
    // like food_interaction, etc : [{type : String, trim:true}],
    dosage : {subhead : [{type : String, trim:true}],info : [{type : String, trim:true}]},
    // dosage can be oral,intravenous ,  liver disorder , hepatic , COPD
    food : {type : String, trim:true},
    //list of contra indications
    contraindications : {subhead : [{type : String, trim:true}],info : [{type : String, trim:true}]},
    source : {type : String, trim:true},
    submitted_by : {type : String, trim:true}

});

module.exports = mongoose.model('molecule',Molecule);