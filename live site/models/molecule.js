var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Molecule = new Schema({
    //about molecule
    molecule_name : {type : String},
    drug_categories : {type : String},
    description : {type : String},
    // pharmacokinetics
    absorption : {type : String},
    distribution : {type :String},
    metabolism : {type : String},
    excretion : {type : String},
    //adverse reactions/side effects
    side_effect : {type : String},
    precaution : {type : String},
    other_drug_interaction : [{subhead5 : {type : String}, info5 : {type:String}}],
    other_interaction :[ {subhead4 : {type : String}, info4 : {type : String}}],
    // like food_interaction, etc : [{type : String}],
    dosage : [ {subhead3 : {type : String}, info3 : {type : String}}],
    // dosage can be oral,intravenous ,  liver disorder , hepatic , COPD

    food : {type : String},
    //list of contra indications
    contraindications : [ {subhead2 : {type : String}, info2 : {type : String}}],
    source : {type : String}
});

module.exports = mongoose.model('molecule',Molecule); //