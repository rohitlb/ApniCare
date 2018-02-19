var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Search = new Schema({
        name: {type: String, trim:true}
});

module.exports = mongoose.model('search',Search);