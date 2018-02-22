var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var SymptomSearch = new Schema({
    name: {type: String, trim:true}
});

module.exports = mongoose.model('symptomsearch',SymptomSearch);