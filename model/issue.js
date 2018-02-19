var mongoose = require('mongoose');

var Issue = new mongoose.Schema({
    issues : [{
        issueIn : {type : String},
        issueType : {type : String},
        issueInfo : {type : String},
        issueFrom : {type : String},
        status : {type : String}
    }]
});

module.exports = mongoose.model('issue',Issue);