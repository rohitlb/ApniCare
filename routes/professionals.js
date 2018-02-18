// require dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var request = require('request');
var mongoose = require('mongoose');
var promise = require('bluebird');
var session = require('express-session');
var fileParser = require('connect-multiparty')();
var cloudinary = require('cloudinary');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcryptjs');
var mongoDBStore = require('connect-mongodb-session')(session);
mongoose.Promise = promise;
var logger = require('morgan');
var async = require('async');
var router = express.Router();
var keys = require('../private/keys');

// req model for feedback and need help
var Feedback = require('../model/adminfeedback');
var Needhelp = require('../model/needhelp');
var NeedhelpWL = require('../model/needhelpWL');

var User  = require('../model/registration');
var Doctor = require('../model/doctorregistration');
var Pharma = require('../model/pharma');
//require for medicine index
var Company = require('../model/company');
var Brand = require('../model/brand');
var Dosage = require('../model/dosage');
var Strength = require('../model/strength');
//require for disease
var Disease = require('../model/disease');
//require molecule
var Molecule = require('../model/molecule');
var Search = require('../model/search');
// to save profile pic of user
///Some Policies///
var Terms = require('../model/terms');
var FAQ = require('../model/faq');
var Policy = require('../model/policy');
var Licence = require('../model/open_source_licence');
//AdminPanel
var DrugData = require('../model/drugdatalive');
var DiseaseData = require('../model/diseasedatalive');
var MoleculeData = require('../model/moleculedatalive');
var CategoryData = require('../model/categorydatalive');
/////Data having Issue
var Issue = require('../model/issue');


function healthrequiresLogin(req, res, next) {
    if (req.session && ((req.session.doctorID) || (req.session.pharmaID))) {
        return next();
    } else {
        //var err = new Error('You must be logged in to view this page.');
        res.send({status : "logout" , message : "Please Login First"});
        // res.redirect('/');
    }
}


function userrequiresLogin(req, res, next) {
    if (req.session && req.session.userID) {
        return next();
    } else {
        //var err = new Error('You must be logged in to view this page.');
        res.send({status : "logout" , message : "Please Login First"});
        //res.redirect('/');
    }
}


//*********************************************HEALTH_CARE REGISTER*************************************************

//user profile info for app
router.get('/appprofile',userrequiresLogin, function (req, res) {
    if (req.session.userID) {
        User.find({_id : req.session.userID},function(err,user){
            if(err){
                console.log(err);
            }
            else{
                res.send({status: "logged in", profileinfo: user});
                res.end();
            }
        });
    }
});


router.post('/doctorregister', function (req, res) {
    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/.test(req.body.number);
    if (num === false) {
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }
    // regex for checking whether password is numeric or not (pass iff pwd is numeric)
    var a = /[0-9]{4}/.test(req.body.password);
    if (a === false) {
        res.send({status: "failure", message: "please enter a numeric password and try again"});
        return;
    }
    var email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(req.body.email);
    if(email === false ){
        res.send({status: "failure", message: "please enter a valid email and try again"});
        return;
    }
    Doctor.findOne({number: req.body.number}).exec(function (err, result) {
        if (err) {
            console.log(err);
            res.end();
        } else {
            if (result) {
                res.send({status: "failure", message: "Doctor Already Exists"});
                res.end();
            } else {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        if(err){
                            console.log(err);
                        }
                        else {
                            var doctor = new Doctor({
                                name: req.body.name,
                                email: req.body.email,
                                number: req.body.number,
                                password: hash,
                                title : 'Dr.'
                            });
                            doctor.save(function (err, results) {
                                if (err) {
                                    console.log(err);
                                    res.end();
                                } else {
                                    req.session.doctorID = results._id;
                                    res.send({status: "success", message: "successfully registered"});
                                    res.end();
                                }
                            });
                        }
                    });
                });
            }
        }
    });
});

router.post('/pharmaregister', function (req, res) {
    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/.test(req.body.number);
    if (num === false) {
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }
    // regex for checking whether password is numeric or not (pass iff pwd is numeric)
    var a = /[0-9]{4}/.test(req.body.password);
    if (a === false) {
        res.send({status: "failure", message: "please enter a numeric password and try again"});
        return;
    }
    var email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(req.body.email);
    if(email === false ){
        res.send({status: "failure", message: "please enter a valid email and try again"});
        return;
    }
    Pharma.findOne({number: req.body.number}).exec(function (err, result) {
        if (err) {
            console.log(err);
            res.end();
        } else {
            if (result) {
                res.send({status: "failure", message: "Pharma Already Exists"});
                res.end();
            } else {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        if(err){
                            console.log(err);
                        }
                        else {
                            var pharma = new Pharma({
                                name: req.body.name,
                                email: req.body.email,
                                number: req.body.number,
                                password: hash,
                                title : 'DRx.'
                            });
                            pharma.save(function (err, results) {
                                if (err) {
                                    console.log(err);
                                    res.end();
                                } else {
                                    req.session.pharmaID = results._id;
                                    res.send({status: "success", message: "successfully registered"});
                                    res.end();
                                }
                            });
                        }
                    });
                });
            }
        }
    });
});

router.post('/moleculeslist'/*,healthrequiresLogin*/,function(req,res){
    var skip = parseInt(req.body.nskip);
    Molecule.find({},'-_id molecule_name').sort({molecule_name: 1}).skip(skip).limit(10).exec(function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.send({ message : "molecules list" , data :result });
        }
    });
});

router.post('/brandslist'/*,healthrequiresLogin*/,function(req,res){
    var skip = parseInt(req.body.nskip);
    Brand.find({},'-_id brand_name').populate(
        {path : 'dosage_id', select : '-_id dosage_form',populate :
            {path : 'strength_id', select : '-_id strength packaging potent_substance.name price'}
        }).populate(
        {path : 'company_id', select: '-_id company_name'}).sort({company_name : 1}).skip(skip).limit(10).exec(function (err,brand) {
        if (err) {
            console.log(err);
        }
        else{
            res.send({status : 'brands list' , data : brand});
        }
    });
});

router.post('/categorieslist'/*,healthrequiresLogin*/,function(req,res){
    var skip = parseInt(req.body.nskip);
    Brand.find({}, '-_id categories').sort({categories : 1}).skip(skip).limit(10).exec(function (err, result) {
        if(err){
            console.log(err);
        }
        else{
            res.send({ message : "categories list" , data :result });
        }
    });
});

router.post('/diseaseslist'/*,healthrequiresLogin*/,function(req,res){
    var skip = parseInt(req.body.nskip);
    Disease.find({},'-_id disease_name').sort({disease_name : 1}).skip(skip).limit(10).exec(function(err,disease){
        if(err){
            console.log(err);
        }
        else{
            res.send({status : 'diseases list' , data : disease});
        }
    });
});

router.post('/organslist'/*,healthrequiresLogin*/,function(req,res){
    var skip = parseInt(req.body.nskip);
    Search.find({}, '-_id name').sort({"updated_at":-1}).sort({"created_at":-1}).skip(skip).limit(10).exec(function (err, result) {
        if (err) {
            console.log(err);
        }
        else{
            res.send({ message : "organs list" , data :result });
        }
    });
});

router.post('/symptomslist'/*,healthrequiresLogin*/,function(req,res){
    var skip = parseInt(req.body.nskip);
    Disease.find({},'-_id symptoms').sort({symptoms : 1}).skip(skip).limit(10).exec(function(err,result) {
        if (err) {
            console.log(err);
        }
        else {
            res.send({message: "symptoms list", data: result});
        }
    });
});

router.post('/searchspecific',function(req,res){
    var value = req.body.search;
    async.parallel({
        Brands : function(callback){
            Brand.find({brand_name : value},'-_id brand_name categories types primarily_used_for').populate(
                {path : 'dosage_id', select : '-_id dosage_form',populate :
                    {path : 'strength_id', select : '-_id strength packaging prescription dose_taken warnings price dose_timing potent_substance.name potent_substance.molecule_strength'}
                }).populate(
                {path : 'company_id', select: '-_id company_name'}).exec(function (err,result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null,result);
                }
            });
        },
        Diseases : function(callback){
            Disease.find({disease_name : value},'-_id -__v',function(err,result){
                if(err){
                    console.log(err);
                }
                else{
                    callback(null,result);
                }
            });
        },
        Categories : function(callback){
            Brand.find({categories : value},'-_id brand_name',function(err,result){
                if(err){
                    console.log(err);
                }
                else{
                    callback(null,result);
                }
            });
        },
        Organs: function (callback) {  // gives organs sorted list
            Disease.find({'organs.subhead' : value}, '-_id disease_name').sort({"disease_name": 1}).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        Symptoms : function(callback){
            Disease.find({symptoms : value},'-_id disease_name').sort({"disease_name": 1}).exec(function(err,result){
                if(err){
                    console.log(err);
                }
                else{
                    callback(null,result);
                }
            });
        },
        Molecules : function(callback){
            Molecule.find({molecule_name : value},'-_id',function(err,result){
                if(err){
                    console.log(err);
                }
                else{
                    callback(null,result);
                }
            });
        }
    },function(err,result){
        if(err){
            console.log(err);
        }
        else{
            req.session.search = result;
            res.send({status : 'searchspecific' , data : result});
        }
    });
});


// search molecule , brand, category and takes raw name for it
router.post('/search_mbc',function (req,res) {
    console.log("search_mbc");
    var raw = req.body.search;
    var skip = parseInt(req.body.nskip);
    var spaceRemoved = raw.replace(/\s/g, '');
    var search = new RegExp('^'+spaceRemoved,'i' );
    async.parallel({
        molecules:  function (callback) { // gives molecule_name sorted list
            Molecule.find({molecule_name: search}, '-_id molecule_name').sort({molecule_name: 1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        categories:  function (callback) { // gives categories sorted list
            Brand.find({categories: search}, '-_id categories').sort({categories: 1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        brands: function (callback) { // gives categories sorted list
            Brand.find({brand_name: search}, '-_id brand_name').sort({brand_name: 1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null,  result);
                }
            });
        }
    },function (err,results) {
        if(err){
            console.log(err);
        }
        else {
            res.send({"search_mbc" : results});

            console.log({"search_mbc" : results});
        }
    });
});

// take brand name and gives all information of any brand
router.post('/brandinfo', function(req,res){
    console.log("bandinfo");
    var brand = req.body.brand;
    Brand.find({brand_name : brand},'-_id brand_name categories types primarily_used_for').populate(
        {path : 'dosage_id', select : '-_id dosage_form',populate :
            {path : 'strength_id', select : '-_id strength strengths packaging prescription dose_taken warnings price dose_timing potent_substance.name potent_substance.molecule_strength'}
        }).populate(
        {path : 'company_id', select: '-_id company_name'}).exec(function (err,result) {
        if (err) {
            console.log(err);
        }
        else {
            res.send({ message : "brandinfo" , data :result });
        }
    });
});

// takes raw name of disease organ symptoms , and gives list for it
router.post('/search_dos',function (req,res) {
    console.log("search_dos");
    var raw = req.body.search;
    var skip = parseInt(req.body.nskip);
    console.log(raw);
    console.log(typeof raw);
    var spaceRemoved = raw.replace(/\s/g, '');
    var search = new RegExp('^'+spaceRemoved,'i' );
    async.parallel({
        diseases: function (callback) { // gives disease_name sorted list
            Disease.find({disease_name: search}, '-_id disease_name').sort({disease_name: 1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        organs: function (callback) { // gives organs sorted list
            Disease.find({organs: {$elemMatch: {subhead: search}}}, '-_id organs').sort({organs: 1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        symptoms: function (callback) { // gives symptoms sorted list
            Disease.find({symptoms: search}, '-_id symptoms').sort({symptoms: 1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        }
    },function (err,results) {
        if(err){
            console.log(err);
        }
        else {
            res.send({"search_dos" : results});

            console.log({"search_dos" : results});
        }
    });
});

// takes name of disease organ symptoms , and gives info about it
router.post('/dos_info',function (req,res){
    console.log("dos_info");
    var search = req.body.search;
    Disease.find({disease_name: search}).exec(function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});

// takes filter[molecule_name,categories,brand_name,disease_name,organs,symptoms] name and search for them
router.post('/filtersearch', function (req,res) {
    console.log("filter");

    var filt = req.body.filter;
    var raw = req.body.search;
    var skip = parseInt(req.body.nskip);
    var spaceRemoved = raw.replace(/\s/g, '');
    var search = new RegExp(spaceRemoved, 'i');
    switch (filt){
        case "molecule_name"   :
            Molecule.find({molecule_name : search},'-_id molecule_name').sort({molecule_name : 1}).skip(skip).limit(10).exec(function (err,result) {
                if(err){
                    console.log(err);
                }
                else{
                    res.send({"molecules" : result});
                }
            });
            break;

        case "categories"   :
            Brand.find({categories : search},'-_id categories').sort({categories : 1}).skip(skip).limit(10).exec(function (err,result) {
                if(err){
                    console.log(err);
                }
                else{
                    res.send({"categories" :result});
                }
            });
            break;

        case "brand_name"  :
            Brand.find({brand_name : search},'-_id brand_name').sort({brand_name : 1}).skip(skip).limit(10).exec(function (err,result) {
                if(err){
                    console.log(err);
                }
                else{
                    res.send({"brand":result});
                }
            });
            break;

        case "disease_name"   :
            Disease.find({disease_name : search},'-_id disease_name').sort({disease_name : 1}).skip(skip).limit(10).exec(function (err,result) {
                if(err){
                    console.log(err);
                }
                else{
                    res.send({"diseases":result});
                }
            });
            break;

        case "organs"  :
            Disease.find({organs: {$elemMatch: {subhead: search}}},'-_id organs').sort({organs : 1}).skip(skip).limit(10).exec(function (err,result) {
                if(err){
                    console.log(err);
                }
                else{
                    res.send({"organs":result});
                }
            });
            break;

        case "symptoms"  :
            Disease.find({symptoms : search},'-_id symptoms').sort({symptoms : 1}).skip(skip).limit(10).exec(function (err,result) {
                if(err){
                    console.log(err);
                }
                else{
                    res.send({"symptoms":result});
                }
            });
            break;
        default : res.send({result : "don't even dare to mess up with my code"});
    }
});

// takes brand name and give info of it
router.post('/readmore', function(req,res){
    console.log("readmore");
    var brand = req.body.brand;
    Brand.find({brand_name : brand},'-_id brand_name categories types primarily_used_for').populate(
        {path : 'dosage_id', select : '-_id dosage_form',populate :
            {path : 'strength_id', select : '-_id strength strengths packaging prescription dose_taken warnings price dose_timing potent_substance.name potent_substance.molecule_strength'}
        }).populate(
        {path : 'company_id', select: '-_id company_name'}).sort({brand_name : 1}).exec(function (err,brand) {
        if (err) {
            console.log(err);
        }
        else{
            res.send({ message : "read more" , data :brand });
        }
    });
});

// similar barnds + info + combination
// router.post('/formolecule',healthrequiresLogin,function (req,res) {
//     concole.log("page"+req.body.page );
//     var molecule = req.body.molecule;
//     var skip = parseInt(req.body.nskip);
//     if(req.body.page == 'info'){
//         Molecule.find({molecule_name: molecule},'-_id -__v', function (err, info) {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 res.send({message: 'molecule information', data: info});
//             }
//         });
//     }
//     if(req.body.page == 'brands'){
//         Strength.find({'potent_substance.name' : molecule},'-_id -__v -potent_substance._id '
//         ).populate({path: 'brands_id', select : '-_id', populate: {path: 'dosage_id', select : '-_id -__v'}}).populate(
//             {path : 'brands_id' , select : '-_id  -__v ',populate : {path : 'company_id', select : '-_id  -__v '}}).sort({brand_name: 1}).skip(skip).limit(10).exec(function (err,brands) {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 var brand = {};
//                 brand['data'] = [];
//                 async.each(brands, function (result, callback) {
//                     if (result.potent_substance.molecule_strength.length === 1) {
//                         brand['data'].push({
//                             results: result
//                         });
//                         callback();
//                     }
//                     else {
//                         callback();
//                     }
//                 }, function (err) {
//                     if (err) {
//                         console.log(err);
//                     }
//                     else {
//                         //res.send(brand);
//                         res.send({message : 'molecule brand', data: brand.data});
//                     }
//                 });
//             }
//         });
//
//     }
//     if(req.body.page == 'combination'){
//         Strength.find({'potent_substance.name' : molecule},'-_id -__v -potent_substance._id'
//         ).populate({path: 'brands_id', populate: {path: 'dosage_id', populate : {path : 'strength_id'}}
//         }).populate({path : 'brands_id', select : '-_id -__v',populate : {path : 'company_id'}}).sort({brand_name: 1}).skip(skip).limit(10).exec(function (err,brands) {
//             if (err) {
//                 console.log(err);
//             }
//             else {
//                 res.send({message : 'molecule combination',data : brands});
//             }
//         });
//     }
// });

router.post('/formolecule',function (req,res){
    var molecule = req.body.molecule;
    var skip = parseInt(req.body.nskip);

    if(req.body.page == 'info'){
        Molecule.find({molecule_name: molecule},'-_id -__v', function (err, info) {
            if (err) {
                console.log(err);
            }
            else {
                res.send({message: 'molecule information', data: info});
            }
        });
    }
    if(req.body.page == 'brands'){
        Brand.find({},'-_id brand_name').populate({path : 'dosage_id', select : '-_id dosage_form' ,
            populate : {path : 'strength_id', select : '_id price potent_substance.name'
                , match : {$and : [{'potent_substance.name' : {$size : 1}},{'potent_substance.name' : molecule}]}}})
            .populate({path : 'company_id', select : '-_id  -__v '})
            .sort({brand_name: 1}).exec(function (err,brands) {
            if (err) {
                console.log(err);
            }
            else {
                res.send({data : brands , message : 'molecule brands'});
            }
        });
    }
    if(req.body.page == 'combination'){
        Brand.find({},'-_id brand_name').populate({path : 'dosage_id', select : '-_id dosage_form' ,
            populate : {path : 'strength_id', select : '_id price potent_substance.name'
                , match : {$and : [{'potent_substance.name' : {$size : 1}},{'potent_substance.name' : molecule}]}}})
            .populate({path : 'company_id', select : '-_id  -__v '})
            .sort({brand_name: 1}).exec(function (err,brands) {
            if (err) {
                console.log(err);
            }
            else {
                res.send({data : brands , message : 'molecule combination'});
            }
        });
    }
});

// similar disease + organ + symptom FILTERED + TAKES RAW
router.post('/DOSlist',healthrequiresLogin,function (req,res) {
    var raw = req.body.search;
    var skip = parseInt(req.body.nskip);
    var spaceRemoved = raw.replace(/\s/g, '');
    var search = new RegExp('^'+spaceRemoved,'i' );
    if(req.body.page == 'disease'){ // gives disease_name sorted list
        Disease.find({disease_name: search}, '-_id disease_name').sort({disease_name: 1}).skip(skip).limit(10).exec(function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                res.send({ message : "search disease" , data :result });
            }
        });
    }
    if(req.body.page == 'organ'){ // gives organs sorted list
        Disease.find({organs: {$elemMatch: {subhead: search}}}, '-_id organs').sort({organs: 1}).skip(skip).limit(10).exec(function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                res.send({ message : "search organ" , data :result });
            }
        });
    }
    if(req.body.page == 'symptom'){ // gives symptoms sorted list
        Disease.find({symptoms: search}, '-_id symptoms').sort({symptoms: 1}).skip(skip).limit(10).exec(function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                res.send({ message : "search symptom" , data :result });
            }
        });
    }
});

// same molecule same strength => output is list of brands
router.post('/similarbrands',healthrequiresLogin,function(req,res){
    var molecule = req.body.molecule;
    var strength = req.body.strength;
    var skip = req.body.nskip;
    Strength.find({'potent_substance.name' : molecule , 'potent_substance.molecule_strength' : strength},'-_id -__v -potent_substance._id '
    ).populate({path: 'brands_id', select : '-_id', populate: {path: 'dosage_id', select : '-_id -__v'}}).populate(
        {path : 'brands_id' , select : '-_id  -__v ',populate : {path : 'company_id', select : '-_id  -__v '}}).sort({brand_name: 1}).skip(skip).limit(10).exec(function (err,brands) {
        if (err) {
            console.log(err);
        }
        else {
            var brand = {};
            brand['data'] = [];
            async.each(brands, function (result, callback) {
                if (result.potent_substance.molecule_strength.length === 1) {
                    brand['data'].push({
                        results: result
                    });
                    callback();
                }
                else {
                    callback();
                }
            }, function (err) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send({message : 'similar brands', data: brand.data});
                }
            });
        }
    });
});

// have regex , search for molecule_name,categories,brand_name,disease_name,organs,symptoms
router.post('/searchall',function (req,res) {
    console.log('reaches');
    var raw = req.body.search;
    var spaceRemoved = (!isNaN(raw)) ? raw.replace(/\s/g, '') : raw;
    var skip = parseInt(req.body.nskip);
    var search = new RegExp('^' + spaceRemoved, 'i');
    async.parallel({
        molecules: function (callback) { // gives molecule_name sorted list
            Molecule.find({molecule_name: search}, '-_id molecule_name').sort({molecule_name: 1}).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('1');
                    callback(null, result);
                }
            });
        },
        categories: function (callback) { // gives categories sorted list
            Brand.find({categories: search}, '-_id categories').sort({categories: 1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        brands: function (callback) {  // gives brand_name sorted list
            Brand.find({brand_name: search}, '-_id brand_name').sort({brand_name: 1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        diseases: function (callback) { // gives disease_name sorted list
            Disease.find({disease_name: search}, '-_id disease_name').sort({disease_name: 1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        organs: function (callback) {  // gives organs sorted list
            Search.find({name : search}, '-_id name').sort({"updated_at":-1}).sort({"created_at":-1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        symptoms: function (callback) { // gives symptoms sorted list
            Disease.find({symptoms: search}, '-_id symptoms').sort({symptoms: 1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        }
    }, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('reaches here');
            res.send({ message : "search all" , data :result });
        }
    });
});

//doc update password
router.post('/doctorupdatepassword',healthrequiresLogin,function (req,res) {
    var password = req.body.password;
    Doctor.update({_id : req.session.doctorID},{
        $set : {password : password}
    },function (err,result1) {
        if (err) {
            console.log(err);
        }
        else {
            res.send({status: "success", message: "new password update"});
            res.end();
        }
    });
});

//////////////////////////////////Drug index start from here////////////////////////////////////////////////////////////

router.get('/findcompany',function (req,res) {
    Company.find().exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            var data = {};
            data['result'] = [];
            for (var i=0; i<result.length; i++) {
                data['result'][i] = {
                    company : result[i].company_name,
                    brand : result[i].brand_id
                };
            }
            res.render('findcompany', {data: data});
        }
    });
});

router.get('/go_to_brand',function (req,res) {
    var company = req.query.company;  // take value of brand from front end

    //find all company
    Company.find({company_name : company}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            //create an object of data
            var data = {};
            data['brands'] = [];

            // strt loop to store every brand inside a company
            async.each(result[0].brand_id, function (brand,callback) {
                //find brand by individual id get from collection company
                Brand.findById(brand,function(err,result){
                    if(err){
                        callback("there is an error");
                    }

                    if(!data['brands']) {data['brands'] = [];} // to check if it is the first time you are inserting inside data['brand'], in which case it needs to be initialized.
                    // store the all brand in data object
                    data['brands'].push({
                        brand: result.brand_name,
                        dosage: result.dosage_id
                    });
                    callback();
                });
            },function (err) {
                if(err){
                    console.log(err);
                }
                res.render('showbrand', {data : data});
            });
        }
    });
});

router.get('/go_to_dosage',function (req,res) {
    var brand = req.query.brand;
    Brand.find({brand_name : brand}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            var data = {};
            data['dosage'] = [];

            async.each(result[0].dosage_id, function (dosage,callback) {

                Dosage.findById(dosage,function(err,result){
                    if(err){
                        callback("there is an error");
                    }

                    if(!data['dosage']) {data['dosage'] = [];} // to check if it is the first time you are inserting inside data['brand'], in which case it needs to be initialized.
                    data['dosage'].push({
                        dosage: result.dosage_form,
                        strength: result.strength_id
                    });
                    callback();
                });
            },function (err) {
                if(err){
                    console.log(err);
                }
                res.render('showdosage', {data : data});
            });
        }
    });

});

router.get('/go_to_strength',function (req,res) {
    var dosage = req.query.dosage;
    Dosage.find({dosage_form : dosage}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            var data = {};
            data['strength'] = [];

            async.each(result[0].strength_id, function (strength,callback) {

                Strength.findById(strength,function(err,result){
                    if(err){
                        callback("there is an error");
                    }
                    if(!data['strength']) {data['strength'] = [];} // to check if it is the first time you are inserting inside data['brand'], in which case it needs to be initialized.
                    data['strength'].push({
                        ingredients: result.active_ingredients[0].name
                    });
                    callback();
                });
            },function (err) {
                if(err){
                    console.log(err);
                }
                res.render('showingredients', {data : data});
            });
        }
    });
});

// ************************************About Molecule ***************************************************

// search molecule
router.get('/search_molecule',function (req,res) {
    var ingredients = req.query.ingredients;
    Molecule.find({molecule_name: ingredients}).exec(function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('moleculedetails', {data: result});
        }
    });
});


//////////////////// try for free /////////////////////////////////////////

/////////////////////////medicine shows ////////////////////////////////////////////////////////////////////////////////

////////////by Brands////////////////////////////

router.get('/findbrands',function (req,res) {
    var brand = req.query.brand;
    Brand.find({},'-_id brand_name types categories').populate(
        {path : 'dosage_id', select : '-_id dosage_form',populate :
            {path : 'strength_id', select : '-_id strength packaging potent_substance.name'}
        }).populate({path : 'company_id', select: '-_id company_name'}).sort({brand_name : 1}).exec(function (err,brand) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(brand[0]);
            //res.render('./health_care_provider/r_partial/drugdata', {data: brand})
        }
    });
});

router.get('/findcategory',function (req,res) {
    Brand.find().exec(function (err,result) {
        res.render('category',{data : result});
    });
});

router.get('/searchdisease',function (req,res) {
    res.render('searchdisease');
});

router.post('/searchdisease',function (req,res) {
    var disease = req.body.disease;
    Brand.find({primarily_used_for : disease}).populate({path : 'dosage_id',populate : {path : 'strength_id'}}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        res.render('diseasebrands',{data : result})
    });
});

/////////my molecule//////////////////////////////

router.get('/searchmolecule',function (req,res) {
    Molecule.find().exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            //res.send(result);
            res.render('molecules',{data : result});
        }
    });
});


///////////////////////////////////////Doctor  Profile Insert //////////////////////////////////////////////////////////

router.get('/health_care_provider',healthrequiresLogin,function(req,res) {
    var page = 'home';
    //console.log(req.query.page);
    var brand = req.query.brand;
    var disease = req.query.disease;
    var molecule = req.query.molecule;

    if(req.query.page == 'profile') {
        Doctor.find({_id : req.session.doctorID},function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                if(result != ""){
                    if(result[0].occupation == 'student') {
                        page = 'profile_student_doctor';
                        res.render('home_profile_doctor',
                            {
                                page: page,
                                data: result
                            });
                    }
                    else{
                        page = 'profile_doctor';
                        res.render('home_profile_doctor',
                            {
                                page: page,
                                data: result
                            });
                    }
                }
                else{
                    Pharma.find({_id : req.session.pharmaID},function (errs,results) {
                        if(errs){
                            console.log(errs);
                        }
                        else{
                            if(results != ""){
                                if(results[0].occupation == 'student'){
                                    page = 'profile_student_pharmacist';
                                    res.render('home_profile_doctor',
                                        {
                                            page: page,
                                            data: results

                                        });
                                }
                                else{
                                    page = 'profile_pharmacist';
                                    res.render('home_profile_doctor',
                                        {
                                            page: page,
                                            data: results

                                        });
                                }
                            }
                            else {
                                page = 'profile';
                                if(req.session.doctorID) {
                                    res.render('home_profile_doctor',
                                        {
                                            page: page,
                                            data: result

                                        });
                                }
                                else{
                                    res.render('home_profile_doctor',
                                        {
                                            page: page,
                                            data: results

                                        });
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    if(req.query.page == 'profile_student_doctor') {
        Doctor.find({_id : req.session.doctorID},function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                res.render('home_profile_doctor',
                    {
                        page: 'profile_student_doctor',
                        data: result
                    });
            }
        });
    }

    if(req.query.page == 'profile_student_pharmacist') {
        Pharma.find({_id : req.session.pharmaID},function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                res.render('home_profile_doctor',
                    {
                        page: 'profile_student_pharmacist',
                        data: result
                    });
            }
        });
    }

    if(req.query.page == 'home') {
        async.parallel({
            Doctor: function (callback) {
                Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        callback(null, result);
                    }
                });
            },
            Pharma: function (callback) {
                Pharma.find({_id: req.session.pharmaID}, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        callback(null, result);
                    }
                });
            }
        }, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                if (result.Doctor == null) {
                    res.render('home_profile_doctor',
                        {
                            page: page,
                            data: result.Pharma[0]

                        });
                }
                if (result.Pharma[0] == undefined) {
                    res.render('home_profile_doctor',
                        {
                            page: page,
                            data: result.Doctor

                        });
                }
            }
        });
    }

    if(req.query.page == 'profile_doctor') {

        Doctor.find({_id : req.session.doctorID},function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                res.render('home_profile_doctor',
                    {
                        page: 'profile_doctor',
                        data: result
                    });
            }
        });
    }

    if(req.query.page == 'profile_pharmacist') {
        Pharma.find({_id: req.session.pharmaID}, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('home_profile_doctor',
                    {
                        page: 'profile_pharmacist',
                        data: result
                    });
            }
        });
    }

    if(req.query.page == 'pharma_registered') {
        Pharma.findOne({_id: req.session.pharmaID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'pharma_registered')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }

    if(req.query.page == 'doctor_registered') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'doctor_registered')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }

    if(req.query.brand) {
        Brand.find({brand_name : brand},'-_id brand_name categories types primarily_used_for').populate(
            {path : 'dosage_id', select : '-_id dosage_form',populate :
                {path : 'strength_id', select : '-_id strength strengths packaging prescription dose_taken warnings price dose_timing potent_substance.name potent_substance.molecule_strength'}
            }).populate(
            {path : 'company_id', select: '-_id company_name'}).sort({brand_name : 1}).exec(function (err,brands) {
            if (err) {
                console.log(err);
            }
            else {
                if(brands != "") {
                    var brand = {};
                    brand['rates'] = [];
                    async.each(brands,function(fortablet,callback){
                        async.each(fortablet.dosage_id,function(tabletrate,callbacks){
                            if(tabletrate.dosage_form == 'Tablet'){
                                async.each(tabletrate.strength_id,function(strengths,callbackagain){
                                    var x = strengths.price;
                                    var y = strengths.packaging;
                                    var rate = x/y;
                                    brand['rates'].push({
                                        rateper : rate
                                    })
                                });
                            }
                            else{
                                callbacks();
                            }
                        });
                    });
                    var datas = {};
                    datas['all'] = [];
                    datas['all'].push({
                        brands : brands,
                        rating : brand.rates
                    });
                    page = req.query.page;
                    res.render('home_profile_doctor',
                        {
                            page: 'drug_data_view',
                            data: datas.all[0]
                        });
                    console.log(datas.all[0]);
                }
                else{
                    res.send({details : "failure", message : "No brand exist"});
                }
            }
        });
    }

    if(req.query.page == 'drug_data_view'){
        if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'drug_data_view' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help') {
            page = req.query.page;
        }
        res.render('home_profile_doctor',
            {
                page: page,
                data: brand
            });
    }

    if(req.query.page == 'disease_data_view'){
        page = req.query.page;
        res.render('home_profile_doctor',
            {
                page: page,
                data: disease
            });
    }

    if(req.query.molecule) {
        var datas = {};
        datas['output'] = [];
        Molecule.find({molecule_name : molecule}).sort({molecule_name:1}).exec(function (err,molecule) {
            //console.log(result);
            if (err) {
                console.log(err);
            }
            else {
                if(molecule != "") {
                    async.parallel({
                        Doctor: function (callback) {
                            Doctor.find({_id: molecule[0].submitted_by}, function (doc_err, doctor_result) {
                                if (doc_err) {
                                    console.log(doc_err);
                                }
                                else {
                                    callback(null, doctor_result);
                                }
                            });
                        },
                        Pharma: function (callback) {
                            Pharma.find({_id: molecule[0].submitted_by}, function (pha_err, pharma_result) {
                                if (pha_err) {
                                    console.log(pha_err);
                                }
                                else {
                                    callback(null, pharma_result);
                                }
                            });
                        }
                    }, function (errs, results) {
                        if (errs) {
                            console.log(errs);
                        }
                        else {
                            if (results.Doctor[0] !== undefined) {
                                datas['output'].push({
                                    molecule: molecule,
                                    names: results.Doctor[0].name,
                                    titles: results.Doctor[0].title
                                });
                            }
                            if (results.Pharma[0] !== undefined) {
                                datas['output'].push({
                                    molecule: molecule,
                                    names: results.Pharma[0].name,
                                    titles: results.Pharma[0].title
                                });
                            }
                            console.log(datas.output[0]);
                            res.render('home_profile_doctor',
                                {
                                    page: 'molecule_data_view',
                                    data: datas.output[0]
                                });
                        }
                    });
                }
                else{
                    res.send({details : "failure", message : "No such molecule exist"});
                }
            }
        });
    }

    if(req.query.disease) {
        var datas = {};
        datas['output'] = [];
        Disease.find({disease_name : disease}).sort({disease_name:1}).exec(function (err,disease) {
            if (err) {
                console.log(err);
            }
            else {
                if(disease != "") {
                    async.parallel({
                        Doctor : function(callback){
                            Doctor.find({_id : disease[0].submitted_by},function(doc_err,doctor_result){
                                if(doc_err){
                                    console.log(doc_err);
                                }
                                else{
                                    callback(null,doctor_result);
                                }
                            });
                        },
                        Pharma : function(callback){
                            Pharma.find({_id : disease[0].submitted_by},function(pha_err,pharma_result){
                                if(pha_err){
                                    console.log(pha_err);
                                }
                                else{
                                    callback(null,pharma_result);
                                }
                            });
                        }
                    },function(errs,results){
                        if(errs){
                            console.log(errs);
                        }
                        else {
                            console.log(results);
                            if (results.Doctor[0] !== undefined) {
                                datas['output'].push({
                                    disease: disease,
                                    names: results.Doctor[0].name,
                                    titles : results.Doctor[0].title
                                });
                            }
                            if (results.Pharma[0] !== undefined){
                                datas['output'].push({
                                    disease: disease,
                                    names: results.Pharma[0].name,
                                    titles : results.Pharma[0].title
                                });
                            }
                            res.render('home_profile_doctor',
                                {
                                    page: 'disease_data_view',
                                    data: datas.output[0]
                                });
                        }
                    });
                }
                else{
                    res.send({details : "failure", message : "No such disease exist"});
                }
            }
        });
    }

    if(req.query.page == 'drug_data') {

        Brand.find({},'-_id brand_name').sort({brand_name : 1}).exec(function (err,brand) {
            if (err) {
                console.log(err);
            }
            else {
                if(brand != "") {
                    if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help') {
                        page = req.query.page;
                    }
                    res.render('home_profile_doctor',
                        {
                            page: page,
                            data: brand
                        });
                }
                else{
                    res.send({details : "failure", message : "No brand exist"});
                }
            }
        });
    }

    if(req.query.page == 'disease_data') {

        //console.log('Hey there');
        Disease.find().sort({disease_name : 1}).exec(function (err,disease) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('home_profile_doctor',
                    {
                        page: "disease_data",
                        data: disease

                    });
            }
        });
    }

    if(req.query.page == 'drug_data_form') {

        var brand = req.body.brand;
        console.log(brand);
        Brand.find({brand_name: brand}, function (err, brand) {
            if (err) {
                console.log(err);
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: brand

                    });
            }
        });
    }

    if(req.query.page == 'disease_data_form') {
        var disease = req.body.disease;
        console.log(disease);
        Disease.find({disease_name: disease}, function (err, disease) {
            if (err) {
                console.log(err);
            }
            else {
                page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: disease
                    });
            }
        });
    }

    if(req.query.page == 'molecule_data_form') {

        Brand.find().populate({path : 'dosage_id',populate : {path : 'strength_id'}}).populate({path : 'company_id'}).exec(function (err,brand) {
            if (err) {
                console.log(err);
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_pharmacist' ||  req.query.page == 'profile_student_doctor' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help') {
                    page = req.query.page;
                }
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: brand

                    });
            }
        });
    }

    if(req.query.page == 'molecule_data') {

        Molecule.find({},'-_id -__v').populate({path : 'dosage_id', select : '-_id -__v',populate : {
            path : 'strength_id', select : '-_id -__v'}}).populate({path : 'company_id'}
        ).sort({molecule_name:1}).exec(function (err,molecule) {
            if (err) {
                console.log(err);
            }
            else {
                page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: molecule

                    });
            }
        });
    }

    if(req.query.page == 'feedback_contributions'){
        page = req.query.page;
        if(req.session.doctorID){
            var person_id = req.session.doctorID;
        }
        if(req.session.pharmaID){
            var person_id = req.session.pharmaID;
        }
        Feedback.find({feedbackFrom : person_id},'-_id -__v -feedbackFrom ',function(err,result){
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result
                    });
            }
        });
    }

    if(req.query.page == 'notifications') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'notifications' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result
                    });
            }
        });
    }

    if(req.query.page == 'need_help') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' ||  req.query.page == 'profile_student_doctor'  || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }

    if(req.query.page == 'image') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'image' ||  req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist'  || req.query.page == 'profile_doctor' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }

    if((!req.query.page) && (!req.query.brand) && (!req.query.molecule) && (!req.query.disease)) {

        async.parallel({
            Doctor : function(callback){
                Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        callback(null,result);
                    }
                });
            },
            Pharma : function(callback){
                Pharma.find({_id : req.session.pharmaID},function(err,result){
                    if(err){
                        console.log(err);
                    }
                    else{
                        callback(null,result);
                    }
                });
            }
        },function(err,result){
            if(err){
                console.log(err);
            }
            else{
                if(result.Doctor == null){
                    res.render('home_profile_doctor',
                        {
                            page: page,
                            data: result.Pharma[0]

                        });
                }
                if(result.Pharma[0] == undefined){
                    res.render('home_profile_doctor',
                        {
                            page: page,
                            data: result.Doctor

                        });
                }
            }
        });
    }

});

router.post('/health_care_provider',healthrequiresLogin,function(req,res) {
    var page = 'home';
    //console.log(req.query.page);
    var brand = req.query.brand;
    var disease = req.query.disease;
    var molecule = req.query.molecule;

    if(req.query.page == 'profile') {
        Doctor.find({_id : req.session.doctorID},function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                if(result != ""){
                    if(result[0].occupation == 'student') {
                        page = 'profile_student_doctor';
                        res.render('home_profile_doctor',
                            {
                                page: page,
                                data: result
                            });
                    }
                    else{
                        page = 'profile_doctor';
                        res.render('home_profile_doctor',
                            {
                                page: page,
                                data: result
                            });
                    }
                }
                else{
                    Pharma.find({_id : req.session.pharmaID},function (errs,results) {
                        if(errs){
                            console.log(errs);
                        }
                        else{
                            if(results != ""){
                                if(results[0].occupation == 'student'){
                                    page = 'profile_student_pharmacist';
                                    res.render('home_profile_doctor',
                                        {
                                            page: page,
                                            data: results

                                        });
                                }
                                else{
                                    page = 'profile_pharmacist';
                                    res.render('home_profile_doctor',
                                        {
                                            page: page,
                                            data: results

                                        });
                                }
                            }
                            else {
                                page = 'profile';
                                if(req.session.doctorID) {
                                    res.render('home_profile_doctor',
                                        {
                                            page: page,
                                            data: result

                                        });
                                }
                                else{
                                    res.render('home_profile_doctor',
                                        {
                                            page: page,
                                            data: results

                                        });
                                }
                            }
                        }
                    });
                }
            }
        });
    }

    if(req.query.page == 'profile_student_doctor') {
        Doctor.find({_id : req.session.doctorID},function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                res.render('home_profile_doctor',
                    {
                        page: 'profile_student_doctor',
                        data: result
                    });
            }
        });
    }

    if(req.query.page == 'profile_student_pharmacist') {
        Pharma.find({_id : req.session.pharmaID},function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                res.render('home_profile_doctor',
                    {
                        page: 'profile_student_pharmacist',
                        data: result
                    });
            }
        });
    }

    if(req.query.page == 'home') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if(result != "") {
                    res.render('home_profile_doctor',
                        {
                            page: 'home',
                            data: result
                        });
                }
                else{
                    Pharma.findOne({_id: req.session.pharmaID}, function (err, results) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            if(results != "") {
                                res.render('home_profile_doctor',
                                    {
                                        page: 'home',
                                        data: results
                                    });
                            }
                            else{
                                res.send({status : "failure", message : "please fill your details first"});
                            }
                        }
                    });
                }
            }
        });
    }

    if(req.query.page == 'profile_doctor') {

        Doctor.find({_id : req.session.doctorID},function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                res.render('home_profile_doctor',
                    {
                        page: 'profile_doctor',
                        data: result
                    });
            }
        });
    }

    if(req.query.page == 'profile_pharmacist') {
        Pharma.find({_id: req.session.pharmaID}, function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('home_profile_doctor',
                    {
                        page: 'profile_pharmacist',
                        data: result
                    });
            }
        });
    }

    if(req.query.page == 'pharma_registered') {
        Pharma.findOne({_id: req.session.pharmaID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'pharma_registered')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }

    if(req.query.page == 'doctor_registered') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'doctor_registered')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }

    if(req.query.page == 'feedback_contributions'){
        page = req.query.page;
        if(req.session.doctorID){
            var person_id = req.session.doctorID;
        }
        if(req.session.pharmaID){
            var person_id = req.session.pharmaID;
        }
        Feedback.find({feedbackFrom : person_id},'-_id -__v -feedbackFrom ',function(err,result){
            if(err){
                console.log(err);
            }
            else{
                console.log(result);
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result
                    });
            }
        });
    }

    if(req.query.brand) {
        Brand.find({brand_name : brand},'-_id brand_name categories types primarily_used_for').populate(
            {path : 'dosage_id', select : '-_id dosage_form',populate :
                {path : 'strength_id', select : '-_id strength strengths packaging prescription dose_taken warnings price dose_timing potent_substance.name potent_substance.molecule_strength'}
            }).populate(
            {path : 'company_id', select: '-_id company_name'}).sort({brand_name : 1}).exec(function (err,brand) {
            if (err) {
                console.log(err);
            }
            else {
                if(brand != "") {
                    if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help') {
                        page = req.query.page;
                    }
                    res.render('home_profile_doctor',
                        {
                            page: 'drug_data_view',
                            data: brand
                        });
                }
                else{
                    res.send({details : "failure", message : "No brand exist"});
                }
            }
        });
    }

    if(req.query.page == 'drug_data_view'){
        if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'drug_data_view' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help') {
            page = req.query.page;
        }
        res.render('home_profile_doctor',
            {
                page: page,
                data: brand
            });
    }

    if(req.query.page == 'disease_data_view'){
        page = req.query.page;
        res.render('home_profile_doctor',
            {
                page: page,
                data: disease
            });
    }

    if(req.query.page == 'drug_data') {

        Brand.find({},'-_id brand_name').sort({brand_name : 1}).exec(function (err,brand) {
            if (err) {
                console.log(err);
            }
            else {
                if(brand != "") {
                    if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help') {
                        page = req.query.page;
                    }
                    res.render('home_profile_doctor',
                        {
                            page: page,
                            data: brand
                        });
                }
                else{
                    res.send({details : "failure", message : "No brand exist"});
                }
            }
        });
    }

    if(req.query.page == 'disease_data') {

        //console.log('Hey there');
        Disease.find().sort({disease_name : 1}).exec(function (err,disease) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('home_profile_doctor',
                    {
                        page: "disease_data",
                        data: disease

                    });
            }
        });
    }

    if(req.query.page == 'drug_data_form') {

        var brand = req.body.brand;
        console.log(brand);
        Brand.find({brand_name: brand}, function (err, brand) {
            if (err) {
                console.log(err);
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: brand

                    });
            }
        });
    }

    if(req.query.page == 'disease_data_form') {
        var disease = req.body.disease;
        console.log(disease);
        Disease.find({disease_name: disease}, function (err, disease) {
            if (err) {
                console.log(err);
            }
            else {
                page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: disease
                    });
            }
        });
    }

    if(req.query.page == 'molecule_data_form') {

        Brand.find().populate({path : 'dosage_id',populate : {path : 'strength_id'}}).populate({path : 'company_id'}).exec(function (err,brand) {
            if (err) {
                console.log(err);
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_pharmacist' ||  req.query.page == 'profile_student_doctor' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help') {
                    page = req.query.page;
                }
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: brand

                    });
            }
        });
    }

    if(req.query.page == 'molecule_data') {

        Molecule.find({},'-_id -__v').populate({path : 'dosage_id', select : '-_id -__v',populate : {
            path : 'strength_id', select : '-_id -__v'}}).populate({path : 'company_id'}
        ).sort({molecule_name:1}).exec(function (err,molecule) {
            if (err) {
                console.log(err);
            }
            else {
                page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: molecule

                    });
            }
        });
    }

    if(req.query.page == 'notifications') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'notifications' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result
                    });
            }
        });
    }

    if(req.query.page == 'need_help') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' ||  req.query.page == 'profile_student_doctor'  || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }

    if(req.query.page == 'image') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'image' ||  req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist'  || req.query.page == 'profile_doctor' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }
});

//////////////////// DRUG DATA VIEW//////////////////////////////

//////////////////////////////////////Doctor  Profile Insert ///////////////////////////////////////////////////////////

router.get('/doctor',function (req,res) {
    res.redirect('/health_care_provider?page=profile_doctor');
});

router.post('/profession',healthrequiresLogin,function (req,res) {
    var profession = req.body.profession;
    console.log(profession);
    console.log(req.session.doctorID);
    Doctor.update({_id : req.session.doctorID},{
        $set : {
            occupation : profession
        }
    },function (err,result) {
        if(err)
        {
            console.log(err);
        }
        else {
            console.log(result);
            res.send({details : "success", message : "Profession added"});
        }
    });
});

router.post('/basic',healthrequiresLogin,function(req,res) {
    var name = req.body.name;
    var title = req.body.title;
    var gender = req.body.gender;
    var city = req.body.city;
    var experience = req.body.experience;
    var about = req.body.about;
    var email = req.body.email;
    var email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(req.body.email);
    if(email === false ){
        res.send({status: "failure", message: "please enter a valid email and try again"});
        return;
    }


    Doctor.update({_id: req.session.doctorID}, {
        $set: {
            name : name,
            title : title,
            gender: gender,
            city: city,
            year_of_experience: experience,
            About_you : about,
            email:req.body.email
        }
    }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.send({status: 'success', message: 'Basic detailsa added'});
        }
    });
});

router.post('/education',healthrequiresLogin,function(req,res){
    var qualification = req.body.qualification;
    var college = req.body.college;
    var completion = req.body.completion;
    var batch_from =  req.body.batch_from;
    var batch_to =  req.body.batch_to;
    var specialization = req.body.specialization;

    Doctor.update({_id : req.session.doctorID},{
        $set : {
            qualification : qualification,
            college : college,
            completion_year : completion,
            batch_to : batch_to,
            batch_from : batch_from,
            specialization : specialization

        }
    },function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send({status : 'success' , message : 'Education details added'});
        }
    });
});

router.post('/certificate',healthrequiresLogin,function(req,res) {
    var council_number = req.body.council_number;
    var council_name = req.body.council_name;
    var council_year = req.body.council_year;
    Doctor.update({_id: req.session.doctorID}, {
        $set: {
            council_registration_number : council_number,
            council_name : council_name,
            council_registration_year : council_year
        }
    },function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.send({status : 'success' , message : 'Certification added'});
        }
    });
});

////////////////pharma insert////////////////////////////////////////////

router.post('/pharma_profession',healthrequiresLogin,function (req,res) {
    var profession = req.body.profession;
    Pharma.update({_id : req.session.pharmaID},{
        $set : {
            occupation: profession
        }
    },function (err) {
        if(err)
        {
            console.log(err);
        }
        else {
            res.send({details : "success", message : "Profession added"});
        }
    });
});

router.post('/pharma_basic',healthrequiresLogin,function(req,res) {
    var name = req.body.name;
    var title = req.body.title;
    var gender = req.body.gender;
    var city = req.body.city;
    var experience = req.body.experience;
    var about = req.body.about;
    var email = req.body.email;
    var email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(req.body.email);
    if(email === false ){
        res.send({status: "failure", message: "please enter a valid email and try again"});
        return;
    }

    console.log("email="+email);

    Pharma.update({_id: req.session.pharmaID}, {
        $set: {
            name : name,
            title : title,
            gender: gender,
            city: city,
            year_of_experience: experience,
            About_you : about,
            email:req.body.email
        }
    }, function (err) {
        if (err) {
            console.log(err);
        }
        else {
            res.send({status: 'success', message: 'Basic detailsa added'});
        }
    });
});

router.post('/pharma_education',healthrequiresLogin,function(req,res){
    var qualification = req.body.qualification;
    var college = req.body.college;
    var completion = req.body.completion;
    var batch_from =  req.body.batch_from;
    var batch_to =  req.body.batch_to;
    var specialization = req.body.specialization;

    Pharma.update({_id : req.session.pharmaID},{
        $set : {
            qualification : qualification,
            college : college,
            completion_year : completion,
            batch_to : batch_to,
            batch_from : batch_from,
            specialization : specialization

        }
    },function(err){
        if(err){
            console.log(err);
        }
        else{
            res.send({status : 'success' , message : 'Education details added'});
        }
    });
});

router.post('/pharma_certificate',healthrequiresLogin,function(req,res) {
    var council_number = req.body.council_number;
    var council_name = req.body.council_name;
    var council_year = req.body.council_year;
    Pharma.update({_id: req.session.pharmaID}, {
        $set: {
            council_registration_number : council_number,
            council_name : council_name,
            council_registration_year : council_year
        }
    },function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.send({status : 'success' , message : 'Certification added'});
        }
    });
});

router.post('/healthcarelogin',healthrequiresLogin,function(req,res) {
    var number = req.body.number;
    var password = req.body.password;

    async.parallel({
            doctor: function (callback) {
                Doctor.find({number: number, password: password}, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        callback(null, result);
                    }
                })
            },
            pharma: function (callback) {
                Pharma.find({number: number, password: password}, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        callback(null, result);
                    }
                })
            }
        },
        function (err,result) {
            if(err){
                console.log(err);
            }
            else{
                if(result.doctor== "" && result.pharma =="") {
                    res.send({status : "failure", message : "enter correct details"});
                }
                else{
                    if(result.doctor != ""){
                        req.session.doctorID = result.doctor[0]._id;
                        res.redirect('/health_care_provider');
                    }
                    if(result.pharma != "") {
                        req.session.pharmaID = result.pharma[0]._id;
                        res.redirect('/health_care_provider');
                    }
                };
            }
        })
});

router.post('/drugData',healthrequiresLogin,function(req,res){
    var company_name = req.body.company_name;
    var brand_name = (req.body.brand_name).replace(/\b\w/g, function(l){ return l.toUpperCase() });
    var categories = req.body.categories;
    var primarily_used_for = req.body.primarily_used_for;
    var types = req.body.types;
    var dosage_form = req.body.dosage_form;
    var strength = req.body.strength1;
    var potent_name = req.body.subhead111;
    var potent_strength = req.body.subhead222;
    var packaging = req.body.packaging;
    var price = req.body.price;
    var prescription = req.body.prescription;
    var dose_taken = req.body.dose_taken;
    var dose_timing = req.body.dose_timing;
    var warnings = req.body.warnings;
    var ticket = req.body.ticket;
    if((brand_name != null)&&(company_name != null)&&(potent_name != null)&&(dosage_form != null)) {
        if (req.session.doctorID) {
            var name = req.session.doctorID;
        }
        if (req.session.pharmaID) {
            var name = req.session.pharmaID;
        }
        DrugData.find({company_name : company_name , brand_name : brand_name , dosage_form : dosage_form , strength : strength},function(errs,results){
            if(results != ""){
                res.send({status : 'failure' , message : 'Drug Already Exist'});
            }
            else{
                Company.find({company_name : company_name},function(err,result){
                    if(result != ""){
                        Brand.find({_id : result[0].brand_id , brand_name : brand_name},function(err1,result1){
                            if(result1 != ""){
                                Dosage.find({_id : result1[0].dosage_id , dosage_form : dosage_form},function(err2,result2){
                                    if(result2 != ""){
                                        Strength.find({_id : result2[0].strength_id , strength : strength},function(err3,result3){
                                            if(result3[0] === undefined){
                                                var drugData = new DrugData({
                                                    company_name: company_name,
                                                    brand_name: brand_name,
                                                    categories: categories,
                                                    primarily_used_for: primarily_used_for,
                                                    types: types,
                                                    dosage_form: dosage_form,
                                                    strength: strength,
                                                    potent_substance: {
                                                        name: potent_name,
                                                        molecule_strength: potent_strength
                                                    },
                                                    packaging: packaging,
                                                    price: price,
                                                    prescription: prescription,
                                                    dose_taken: dose_taken,
                                                    dose_timing: dose_timing,
                                                    warnings: warnings,
                                                    submitted_by: name,
                                                    ticket: ticket
                                                });
                                                drugData.save(function (err) {
                                                    if (err) {
                                                        console.log(err);
                                                    }
                                                    else {
                                                        res.send({status:'success', message:'New medicine added'});
                                                    }
                                                });
                                            }
                                            else{
                                                res.send({status : 'failure' , message : 'Drug Already Exist'});
                                            }
                                        });
                                    }
                                    else{
                                        var drugData = new DrugData({
                                            company_name: company_name,
                                            brand_name: brand_name,
                                            categories: categories,
                                            primarily_used_for: primarily_used_for,
                                            types: types,
                                            dosage_form: dosage_form,
                                            strength: strength,
                                            potent_substance: {
                                                name: potent_name,
                                                molecule_strength: potent_strength
                                            },
                                            packaging: packaging,
                                            price: price,
                                            prescription: prescription,
                                            dose_taken: dose_taken,
                                            dose_timing: dose_timing,
                                            warnings: warnings,
                                            submitted_by: name,
                                            ticket: ticket
                                        });
                                        drugData.save(function (err) {
                                            if (err) {
                                                console.log(err);
                                            }
                                            else {
                                                res.send({status:'success', message:'New medicine added'});
                                            }
                                        });
                                    }
                                });
                            }
                            else{
                                var drugData = new DrugData({
                                    company_name: company_name,
                                    brand_name: brand_name,
                                    categories: categories,
                                    primarily_used_for: primarily_used_for,
                                    types: types,
                                    dosage_form: dosage_form,
                                    strength: strength,
                                    potent_substance: {
                                        name: potent_name,
                                        molecule_strength: potent_strength
                                    },
                                    packaging: packaging,
                                    price: price,
                                    prescription: prescription,
                                    dose_taken: dose_taken,
                                    dose_timing: dose_timing,
                                    warnings: warnings,
                                    submitted_by: name,
                                    ticket: ticket
                                });
                                drugData.save(function (err) {
                                    if (err) {
                                        console.log(err);
                                    }
                                    else {
                                        res.send({status:'success', message:'New medicine added'});
                                    }
                                });
                            }
                        });
                    }
                    else{
                        var drugData = new DrugData({
                            company_name: company_name,
                            brand_name: brand_name,
                            categories: categories,
                            primarily_used_for: primarily_used_for,
                            types: types,
                            dosage_form: dosage_form,
                            strength: strength,
                            potent_substance: {
                                name: potent_name,
                                molecule_strength: potent_strength
                            },
                            packaging: packaging,
                            price: price,
                            prescription: prescription,
                            dose_taken: dose_taken,
                            dose_timing: dose_timing,
                            warnings: warnings,
                            submitted_by: name,
                            ticket: ticket
                        });
                        drugData.save(function (err) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                res.send({status:'success', message:'New medicine added'});
                            }
                        });
                    }
                });
            }
        });
    }
    else{
        res.send({status : 'failure' , message : 'Field Can\'t be empty'})
    }
});

router.post('/diseaseData',healthrequiresLogin,function(req,res) {
    var disease_name = req.body.disease_name;
    var symptoms = req.body.symptoms;
    var risk_factor = req.body.risk_factor;
    var cause = req.body.cause;
    //for diagnosis
    var diagnosis_subhead = req.body.subhead1; // heading
    var diagnosis_info = req.body.subhead2; // information about heading
    // for organs
    var organ_subhead = req.body.subhead;
    var organ_info = req.body.info;
    var treatment = req.body.treatment;
    var outlook = req.body.outlook;
    var prevention = req.body.prevention;
    var source = req.body.source;
    if (req.session.doctorID) {
        var name = req.session.doctorID;
    }
    if (req.session.pharmaID) {
        var name = req.session.pharmaID;
    }

    async.series({
        diseasedatas :  function (callback) {
            DiseaseData.find({disease_name: disease_name}, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        diseases :  function (callback) {
            Disease.find({disease_name: disease_name}, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        }
    }, function (err, results) {
        if (err) {
            console.log(err);
        }
        else {
            if ((results.diseasedatas != "")||(results.diseases != "")) {
                res.send({status: 'failure', message: 'Disease already exist'});
            }
            else {
                var diseaseData = new DiseaseData({
                    disease_name: disease_name,
                    symptoms: symptoms,
                    risk_factor: risk_factor,
                    cause: cause,
                    diagnosis: {
                        subhead: diagnosis_subhead,
                        info: diagnosis_info
                    },
                    organs: {
                        subhead: organ_subhead,
                        info: organ_info
                    },
                    treatment: treatment,
                    outlook: outlook,
                    prevention: prevention,
                    source: source,
                    submitted_by: name
                });
                diseaseData.save(function (errs, resul) {
                    if (errs) {
                        console.log(errs);
                    }
                    else {
                        res.send({status: 'success', message: 'Disease save successfully'});
                    }
                });
            }
        }
    });
});

router.post('/moleculeData',healthrequiresLogin,function(req,res) {
    var molecule_name = req.body.molecule_name;
    var drug_categories = req.body.drug_categories;
    var description = req.body.description;
    var absorption = req.body.absorption;
    var distribution = req.body.distribution;
    var metabolism = req.body.metabolism;
    var excretion = req.body.excretion;
    var side_effect = req.body.side_effect;
    var precaution = req.body.precaution;
    var food = req.body.food;
    var drug_subhead = req.body.subhead5;
    var drug_info = req.body.info5;
    var other_subhead = req.body.subhead4;
    var other_info = req.body.info4;
    var dosage_subhead = req.body.subhead3;
    var dosage_info = req.body.info3;
    var contraindications_subhead = req.body.subhead2_dosage;
    var contraindications_info = req.body.info2;
    var source = req.body.source;
    if(req.session.doctorID){
        var name = req.session.doctorID;
    }
    if(req.session.pharmaID){
        var name = req.session.pharmaID;
    }

    async.series({
        moleculedatas :  function (callback) {
            MoleculeData.find({molecule_name: molecule_name}, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        molecules :  function (callback) {
            Molecule.find({molecule_name: molecule_name}, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        }
    }, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            if((result.moleculedatas != "")||(result.molecules != "")){
                res.send({status : 'failure' , message: 'Molecule already exist'});
            }
            else {
                var moleculeData = new MoleculeData({
                    molecule_name: molecule_name,
                    drug_categories: drug_categories,
                    description: description,
                    absorption: absorption,
                    distribution: distribution,
                    metabolism: metabolism,
                    excretion: excretion,
                    side_effect: side_effect,
                    precaution: precaution,
                    food: food,
                    other_drug_interaction: {
                        subhead: drug_subhead,
                        info: drug_info
                    },
                    other_interaction: {
                        subhead: other_subhead,
                        info: other_info
                    },
                    dosage: {
                        subhead: dosage_subhead,
                        info: dosage_info
                    },
                    contraindications: {
                        subhead: contraindications_subhead,
                        info: contraindications_info
                    },
                    source: source,
                    submitted_by : name
                });
                moleculeData.save(function(errs) {
                    if (errs) {
                        console.log(errs);
                    }
                    else {
                        res.send({status : 'success' , message: 'Molecule save successfully'});
                    }
                });
            }
        }
    });
});

////////////For search during submitting//////////////

router.post('/brandsdata',function(req,res){
    var value = req.body.term;
    var spaceRemoved = value.replace(/\s/g, '');
    var search = new RegExp('^'+spaceRemoved,'i' );
    Brand.find({brand_name : search},'-_id brand_name',function(err,result) {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result, {
                'Content-Type': 'application/json'
            }, 200);
        }
    });
});

router.get('/companiesdata',function(req,res){
    var company = req.body.term;
    Company.find({company_name : company},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.send(result, {
                'Content-Type': 'application/json'
            }, 200);
        }
    });
});

router.get('/moleculesdata',function(req,res){
    var molecule = req.body.terms;
    Molecule.find({molecule_name : molecule},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.send(result, {
                'Content-Type': 'application/json'
            }, 200);
        }
    })
});

router.get('/categoriesdata',function(req,res){
    var value = req.body.term;
    Brand.find({categories : value},'-_id categories',function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.send(result, {
                'Content-Type': 'application/json'
            }, 200);
        }
    });
});

router.get('/diseasesdata',function(req,res){
    var disease = req.body.term;
    Disease.find({disease_name : disease},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.send(result, {
                'Content-Type': 'application/json'
            }, 200);
        }
    })
});



module.exports = router;

