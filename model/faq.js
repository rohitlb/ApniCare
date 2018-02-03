var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var FAQ = new Schema({
    faqs: {type: String, trim:true}
});

module.exports = mongoose.model('faq',FAQ);