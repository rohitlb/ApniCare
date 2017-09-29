var mongoose = require('mongoose');

var DrugIndex = new mongoose.Schema({
    Company : [{
                company_name : {type:String},
                brand : [{
                            brand_name : {type:String},
                            salt : {type:String},
                            strength : {type:String},
                            packaging : {type:String},
                            price : {type:String}
                        }]
              }]
});

module.exports = mongoose.model('DrugIndex',DrugIndex);
