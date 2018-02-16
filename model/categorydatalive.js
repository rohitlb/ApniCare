var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Category = new Schema({
    category : {type : String},
    category_info : {type : String}
});

module.exports = mongoose.model('category',Category);