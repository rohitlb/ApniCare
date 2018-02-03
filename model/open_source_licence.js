var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Licence = new Schema({
    licence: {type: String, trim:true}
});

module.exports = mongoose.model('licence',Licence);