var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var OrganSearch = new Schema({
        name: {type: String, trim:true}
});

module.exports = mongoose.model('organsearch',OrganSearch);