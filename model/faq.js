var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var FAQ = new Schema({
    faqs: {type: String}
});

module.exports = mongoose.model('faq',FAQ);