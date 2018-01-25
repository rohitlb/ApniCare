var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var Search = new Schema({
        name: {type: String}
});

module.exports = mongoose.model('search',Search);