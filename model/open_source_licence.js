var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Licence = new Schema({
    licence: {type: String}
});

module.exports = mongoose.model('licence',Licence);