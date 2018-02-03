var mongoose = require('mongoose');


var Medicines = new mongoose.Schema({
    Company: [{
        Company_name: {type: String, trim:true},
        Brands: [{
            Brand_name: {type: String, trim:true},
            Salts: [{
                Salt_name: {type: String, trim:true},
                Strength: {type: String, trim:true}
            }],
            Dosage_form: {type: String, trim:true},
            Price: {type: String, trim:true}
        }]
    }]
});


module.exports=mongoose.model('medicines',Medicines);