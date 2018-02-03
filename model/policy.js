var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Policy = new Schema({
    policy: {type: String, trim:true}
});

module.exports = mongoose.model('policy',Policy);