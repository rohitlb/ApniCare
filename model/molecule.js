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
<<<<<<< HEAD
    drug_interaction : {type : String},
    food_interaction : {type : String},
    oral : {type : String},
    intravenous : {type : String},
    food : {type : String},
    //list of contra indications
    contradictions : [{
        subhead1 : {type : String},
        subhead2 : {type : String}
    }],
    source : {type:String}
=======
    other_drug_interaction : [{subhead : {type : String},info : {type:String}}],
    other_interaction :[ {subhead : {type : String},info : {type : String}}],
    // like food_interaction, etc : [{type : String}],
    dosage : [ {subhead : {type : String},info : {type : String}}],
    // dosage can be oral,intravenous ,  liver disorder , hepatic , COPD

    //food : {type : String},
    //list of contra indications
    contraindications : [ {subhead : {type : String},info : {type : String}}],
    source : {type : String}
>>>>>>> 9022056d40e57b71c0f9bea8650d4c4d25e57796
});

module.exports = mongoose.model('molecule',Molecule);