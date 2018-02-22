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
var OrganSearch = require('../model/organsearch');
var SymptomSearch = require('../model/symptomsearch');


/////Data having Issue
var Issue = require('../model/issue');

function requiresLogin(req, res, next) {
    if (req.session && ((req.session.userID) ||(req.session.doctorID) || (req.session.pharmaID))) {
        return next();
    } else {
        //var err = new Error('You must be logged in to view this page.');
        res.render('/');
    }
}

function userrequiresLogin(req, res, next) {
    if (req.session && req.session.userID) {
        return next();
    } else {
        res.redirect('/');
    }
}

//*************************************User Register*************************************************************


//render profile page of user
router.get('/profile',userrequiresLogin, function (req, res) {
    if (req.session.userID) {
        User.find({_id : req.session.userID},function(err,user){
            if(err){
                console.log(err);
            }
            else{
                var page = "profile";
                res.render('profile', {
                    page: page,
                    user : user[0].name
                });
                res.end();
            }
        });
    }
});

router.post('/userregister', function (req, res) {

    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/.test(req.body.number);
    if (num === false) {
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }
    // regex for checking whether password is numeric or not (pass iff pwd is numeric)
    var password = /[0-9]{4}/.test(req.body.password);
    if (password === false) {
        res.send({status: "failure", message: "please enter a numeric password and try again"});
        return;
    }
    var email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(req.body.email);
    if(email === false ){
        res.send({status: "failure", message: "please enter a valid email and try again"});
        return;
    }
    User.findOne({number: req.body.number}).exec(function (err, result) {
        if (err) {
            console.log(err);
            res.end();
        } else {
            if (result) {
                res.send({status: "failure", message: "user Already Exists"});
                res.end();
            } else {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(req.body.password, salt, function (err, hash) {
                        if(err){
                            console.log(err);
                        }
                        else {
                            var user = new User({
                                name: req.body.name,
                                email: req.body.email,
                                number: req.body.number,
                                password: hash
                            });
                            user.save(function (err, results) {
                                if (err) {
                                    console.log(err);
                                    res.end();
                                } else {
                                    req.session.userID = results._id;
                                    res.send({status: "success",  message: "successfully registered"});
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

//***************************************frontend*******************************************

//*******************************frontend changes***********************************************
router.get('/profile/userprofile',function (req,res) {
    var page= 'userprofile';
    if(req.query.page=='profilePage' || req.query.page=='My_Profile' || req.query.page=='My_Activity' || req.query.page=='Refer_Friends' ||
        req.query.page=='Contact_Us' ||req.query.page=='Logout' || req.query.page=='Confidential_Information' ||
        req.query.page=='Emergency_Contact_Details' ||req.query.page=='Address')
        page= req.query.page;

    User.findOne({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result !== ""){
                res.render('profile',
                    {
                        page:page,
                        data : result
                    });
            }
            else{
                res.send({status : "failed", message : "User not found"});
            }
        }
    });
});

router.get('/ApniCare/About',function (req,res) {
    var page= 'AboutUs';
    if(req.query.page=='AboutUs' || req.query.page=='Contact' || req.query.page=='NeedHelp' || req.query.page=='FeedBack')
        page= req.query.page;
    res.render('index',
        {
            page:page
        });
});
//for basic info like disease,drug and molecule Information*******************************************************
router.get('/ApniCare/information',function (req,res) {
    var page= 'ApniCare';
    if(req.session.userId){
        page= 'index';
    }
    var brand = req.query.brand;
    if(req.query.page=='Molecule_Information') {
        page = req.query.page;
        Molecule.find({}, '-_id molecule_name').exec(function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('index',
                    {
                        page: page,
                        data: result
                    });
            }
        });
    }
    if(req.query.page=='Disease_Information') {
        page = req.query.page;
        Disease.find({}, '-_id disease_name').exec(function (err, result) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('index',
                    {
                        page: page,
                        data: result
                    });
            }
        });
    }
    if (req.query.page=='Drug_Information') {
        page = req.query.page;
        Brand.find({}, '-_id brand_name').sort({brand_name: 1}).exec(function (err, brand) {
            if (err) {
                console.log(err);
            }
            else {
                if (brand != "") {
                    res.render('index',
                        {
                            page: page,
                            data: brand
                        });
                }
                else {
                    res.send({details: "failure", message: "No brand exist"});
                }
            }
        });
    }
});

router.get('/ApniCare/information/Molecules',function (req,res) {
    var molecule = req.query.molecule;
    var datas = {};
    datas['output'] = [];
    Molecule.find({molecule_name: molecule}).sort({molecule_name: 1}).exec(function (err, molecule) {
        if (err) {
            console.log(err);
        }
        else {
            if (molecule != "") {
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
                        console.log(results);
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
                        res.render('index',
                            {
                                page: 'molecule_name',
                                data: datas.output[0]
                            });
                    }
                });
            }
            else {
                res.send({details: "failure", message: "No such molecule exist"});
            }
        }
    });
});

router.get('/ApniCare/information/Diseases',function (req,res) {
    var disease = req.query.disease;
    var datas = {};
    datas['output'] = [];
    Disease.find({disease_name: disease}).sort({disease_name: 1}).exec(function (err, disease) {
        if (err) {
            console.log(err);
        }
        else {
            if (disease != "") {
                async.parallel({
                    Doctor: function (callback) {
                        Doctor.find({_id: disease[0].submitted_by}, function (doc_err, doctor_result) {
                            if (doc_err) {
                                console.log(doc_err);
                            }
                            else {
                                callback(null, doctor_result);
                            }
                        });
                    },
                    Pharma: function (callback) {
                        Pharma.find({_id: disease[0].submitted_by}, function (pha_err, pharma_result) {
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
                                disease: disease,
                                names: results.Doctor[0].name,
                                titles: results.Doctor[0].title
                            });
                        }
                        if (results.Pharma[0] !== undefined) {
                            datas['output'].push({
                                disease: disease,
                                names: results.Pharma[0].name,
                                titles: results.Pharma[0].title
                            });
                        }
                        console.log(datas.output[0]);
                        res.render('index',
                            {
                                page: 'disease_name',
                                data: datas.output[0]
                            });
                    }
                });
            }
            else {
                res.send({details: "failure", message: "No such disease exist"});
            }
        }
    });
});

router.get('/ApniCare/information/Drug',function (req,res) {
    var brand = req.query.brand;
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
                res.render('index',
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
});

//*****************************************USER LOGIN*******************************************************************
//login with filter and session

//===================================for WEB============================
router.post('/searchspecificweb',function(req,res){
    console.log('reaches');
    var value = req.body.search;
    async.parallel({
        Brands : function(callback){
            Brand.find({brand_name : value},'-_id brand_name categories types primarily_used_for').populate(
                {path : 'dosage_id', select : '-_id dosage_form',populate :
                    {path : 'strength_id', select : '-_id strength strengths packaging prescription dose_taken warnings price dose_timing potent_substance.name potent_substance.molecule_strength'}
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
            Disease.find({disease_name : value},'-_id',function(err,result){
                if(err){
                    console.log(err);
                }
                else{
                    callback(null,result);
                }
            });
        },
        Categories : function(callback){
            Brand.find({categories : value},'-_id brand_name').populate(
                {path : 'dosage_id', select : '-_id dosage_form',populate :
                    {path : 'strength_id', select : '-_id strength packaging'}
                }).sort({brand_name : 1}).exec(function (err,brand) {
                if (err) {
                    console.log(err);
                }
                else {
                    if(brand != ""){
                        callback(null,value);
                    }
                    else{
                        callback(null,brand);
                    }
                }
            });
        },
        Organs: function (callback) {  // gives organs sorted list
            Disease.find({'organs.subhead' : value}, '-_id disease_name').sort({"disease_name": 1}).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    if(result != ""){
                        callback(null,value);
                    }
                    else{
                        callback(null, result);
                    }
                }
            });
        },
        Symptoms : function(callback){
            Disease.find({symptoms : value},'-_id disease_name').sort({"disease_name": 1}).exec(function(err,result){
                if(err){
                    console.log(err);
                }
                else{
                    if(result != ""){
                        callback(null,value);
                    }
                    else{
                        callback(null,result);
                    }
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
            res.send({status : 'success' , data : result});
        }
    });
});

router.post('/searchweb', function(req, res) {
    var raw = req.body.term;
    var spaceRemoved = (!isNaN(raw)) ? raw.replace(/\s/g, '') : raw;
    var search = new RegExp('^'+spaceRemoved,'i' );
    async.parallel({
        Brands : function(callback){
            Brand.find({brand_name: search},'-_id brand_name', { 'brand_name': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20).exec(function(err,result) {
                if(err) {
                    console.log(result);
                }
                else{
                    callback(null,result);
                }
            });
        },
        Categories: function (callback) { // gives categories sorted list
            Brand.find({categories: search}, '-_id categories').sort({"updated_at":-1}).sort({"created_at":-1}).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        Diseases : function(callback){
            Disease.find({disease_name: search},'-_id disease_name ', { 'disease_name': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20).exec(function(err,result) {
                if(err) {
                    console.log(result);
                }
                else{
                    callback(null,result);
                }
            });
        },
        Organs: function (callback) {  // gives organs sorted list
            OrganSearch.find({name : search}, '-_id name').sort({"updated_at":-1}).sort({"created_at":-1}).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        Symptoms: function (callback) {  // gives organs sorted list
            SymptomSearch.find({name : search}, '-_id name').sort({"updated_at":-1}).sort({"created_at":-1}).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        Molecules : function(callback){
            Molecule.find({molecule_name: search},'-_id molecule_name', { 'molecule_name': 1,'symptoms' : 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20).exec(function(err,result) {
                if(err) {
                    console.log(result);
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
            console.log(result);
            res.send(result, {
                'Content-Type': 'application/json'
            }, 200);
        }
    });
});

router.get('/searchsymptons',function(req,res){
    var value = JSON.parse(req.query.symptoms);
    Disease.find({symptoms : value},'-_id disease_name').sort({"disease_name": 1}).exec(function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render('index',{page : 'Disease_Information' , data : result});
        }
    });
});

router.get('/searchorgans',function(req,res){
    var value = JSON.parse(req.query.organs);
    Disease.find({'organs.subhead' : value}, '-_id disease_name').sort({"disease_name": 1}).exec(function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('index', {page: 'Disease_Information', data: result});
        }
    });
});

router.get('/searchcategories',function(req,res){
    var value = JSON.parse(req.query.categories);
    Brand.find({categories : value},'-_id brand_name').populate(
        {path : 'dosage_id', select : '-_id dosage_form',populate :
            {path : 'strength_id', select : '-_id strength packaging'}
        }).sort({brand_name : 1}).exec(function (err,brand) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('index',{page : 'Drug_Information' , data : brand});
        }
    });
    //res.render('index',{page : 'Drug_Information' , data : value});
});

//***************************************Edit User Profile*****************************************************************
//***************Edit Name and Email **********************************

router.get('/verifypassword',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('verifypassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

router.post('/verifypassword',userrequiresLogin,function (req,res) {
    var password = req.body.password;
    User.findOne({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result) {
                bcrypt.compare(password, result.password, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if(results) {
                            //next();
                            //res.send({status: "success", message: "Password match"})
                            res.render('updatenameandemail',{status: "success", message: "Password match"});
                        }
                        else{
                            res.send({status: "failure", message: "Wrong credentials"});
                        }
                    }
                });
            }
            else{
                res.send({status: "failure", message: "Incorrect password"});
            }
        }
    });
});

router.get('/updatenameandemail',userrequiresLogin,function (req,res) {
    if(req.session.userID){
        res.render('updatenameandemail');
    }
    res.send({status : "failure", message : "Please login first"});
});

router.post('/updatenameandemail',userrequiresLogin,function (req,res) {
    var name = req.body.name;
    var email = req.body.email;
    User.find({_id: req.session.userID}, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            if (name === "") {
                name = result[0].name;
            }
            if (email === "") {
                email = result[0].email;
            }
            User.update({_id: req.session.userID}, {
                $set: {
                    name: name,
                    email: email
                }
            }, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    res.send({status: "success", message: "Successfully Updated"});
                }
            });
        }
    });
});

//*******************Edit Password**************************************

router.get('/updatepassword',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('updatepassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

router.post('/updatepassword',userrequiresLogin,function (req,res) {
    var oldpassword = req.body.oldpassword;
    var newpassword = req.body.newpassword;
    var confpassword = req.body.confpassword;

    User.findOne({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result){
                bcrypt.compare(oldpassword,result.password,function(err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if (results) {
                            if (newpassword === confpassword) {
                                bcrypt.genSalt(10, function (err, salt) {
                                    bcrypt.hash(newpassword, salt, function (err, hash) {

                                        User.update({_id: req.session.userID}, {
                                            $set: {password: hash}
                                        }, function (err1, result1) {
                                            if (err1) {
                                                console.log(err1);
                                            }
                                            else {
                                                res.send({status: "success", message: "Password Successfully Updated"});
                                            }
                                        });
                                    });
                                });
                            }
                            else {
                                res.send({status: "failure", message: "Both password not match"});
                            }
                        }
                        else{
                            res.send({status: "failure", message: "Wrong credentials"});
                        }
                    }
                });
            }
            else{
                res.send({status: "failure", message: "Please enter correct old password"});
            }
        }
    });
});

//****************Edit Personal Information********************************

router.get('/verifydetailspassword',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('verifydetailspassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

router.post('/verifydetailspassword',userrequiresLogin,function (req,res) {
    var password = req.body.password;
    User.findOne({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result) {
                bcrypt.compare(password, result.password, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if(results) {
                            //res.send({status: "success", message: "Password match"})
                            res.render('updateusersdetails',{status: "success", message: "Password match"});
                        }
                        else{
                            res.send({status: "failure", message: "Wrong credentials"});
                        }
                    }
                });
            }
            else{
                res.send({status: "failure", message: "Incorrect password"});
            }
        }
    });
});

router.post('/userpersonalinfo',userrequiresLogin,function (req,res) {
    var dob = req.body.dob;
    var gender = req.body.gender;
    var blood_group = req.body.blood_group;
    var marital_status = req.body.marital_status;
    var height = req.body.height;
    var weight = req.body.weight;

    User.find({_id: req.session.userID}, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(result[0]._id);
            if (dob === "") {
                dob = result[0].dob;
            }
            if (gender === "") {
                gender = result[0].gender;
            }
            if (blood_group === "") {
                blood_group = result[0].blood_group;
            }
            if (marital_status === "") {
                marital_status = result[0].marital_status;
            }
            if (height === "") {
                height = result[0].height;
            }
            if (weight === "") {
                weight = result[0].weight;
            }

            User.update({_id: req.session.userID}, {
                $set: {
                    dob: dob,
                    gender: gender,
                    blood_group: blood_group,
                    marital_status: marital_status,
                    height: height,
                    weight: weight
                }
            }, function (err, results) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(results);
                    res.send({status: "success", message: "Details Updated"});
                }
            });
        }
    });
});

//*****************Edit address*********************************************

router.post('/addresspassword',userrequiresLogin,function (req,res) {
    var password = req.body.password;
    User.findOne({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result) {
                bcrypt.compare(password, result.password, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if(results) {
                            //res.send({status: "success", message: "Password match"})
                            res.render('editaddress',{status: "success", message: "Password match"});
                        }
                        else{
                            res.send({status: "failure", message: "Wrong credentials"});
                        }
                    }
                });
            }
            else{
                res.send({status: "failure", message: "Incorrect password"});
            }
        }
    });
});

router.get('/editaddress',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('editaddress');
    }
    res.send({status : "failure", message : "Please login first"});
});

router.post('/useraddress',userrequiresLogin,function (req,res) {
    var addresses = req.body.addresses;
    var landmark = req.body.landmarks;
    var pincode = req.body.pincodes;
    var city = req.body.city;
    var state = req.body.state;
    console.log(addresses + landmark);
    User.find({_id: req.session.userID}, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            if (addresses === "") {
                addresses = result[0].address.address;
            }
            if (landmark === "") {
                landmark = result[0].address.landmarks;
            }
            if (pincode === "") {
                pincode = result[0].address.pin_code;
            }
            if (city === "") {
                city = result[0].address.city;
            }
            if (state === "") {
                state = result[0].address.state;
            }

            User.update({_id: req.session.userID}, {
                $set: {
                    address: {
                        addresses: addresses,
                        landmarks: landmark,
                        pin_code: pincode,
                        city: city,
                        state: state
                    }
                }
            }, function (err1, result1) {
                if (err1) {
                    console.log(err1);
                }
                else {
                    res.send({status: "success", message: "Address successfully updated"});
                }
            });

        }
    });
});

//********************Edit Confidential *************************************

router.get('/confidentialpassword',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('confidentialpassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

router.post('/confidentialpassword',userrequiresLogin,function (req,res) {
    var password = req.body.password;
    User.findOne({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result) {
                bcrypt.compare(password, result.password, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if(results) {
                            //res.send({status: "success", message: "Password match"})
                            res.render('editconfidential',{status: "success", message: "Password match"});
                        }
                        else{
                            res.send({status: "failure", message: "Wrong credentials"});
                        }
                    }
                });
            }
            else{
                res.send({status: "failure", message: "Incorrect password"});
            }
        }
    });
});

router.get('/editconfidential',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('editconfidential');
    }
    res.send({status : "failure", message : "Please login first"});
});

router.post('/editconfidential',userrequiresLogin,function (req,res) {
    var aadhaarnumber = req.body.aadhaar_number;
    var income = req.body.income;

    User.find({_id: req.session.userID}, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            if (aadhaarnumber === "") {
                aadhaarnumber = result[0].aadhaar_number;
            }
            if (income === "") {
                income = result[0].income;
            }

            User.update({_id: req.session.userID}, {
                $set: {
                    aadhaar_number: aadhaarnumber,
                    income: income
                }
            }, function (err1, result1) {
                if (err1) {
                    console.log(err1);
                }
                else {
                    res.send({status: "success", message: "confidential updated"});
                }
            });
        }
    });
});

//***********************Edit Emergency **************************************

router.get('/emergencypassword',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('emergencypassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

router.post('/emergencypassword',userrequiresLogin,function (req,res) {
    var password = req.body.password;
    User.findOne({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result) {
                bcrypt.compare(password, result.password, function (err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if(results) {
                            //res.send({status: "success", message: "Password match"})
                            res.render('editemergency',{status: "success", message: "Password match"});
                        }
                        else{
                            res.send({status: "failure", message: "Wrong credentials"});
                        }
                    }
                });
            }
            else{
                res.send({status: "failure", message: "Incorrect password"});
            }
        }
    });
});

router.get('/editemergency',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('editemergency');
    }
    res.send({status : "failure", message : "Please login first"});
});

router.post('/useremergency',userrequiresLogin,function (req,res) {
    var rel_name = req.body.rel_name;
    var rel_contact = req.body.rel_contact;
    var relation = req.body.relation;
    User.find({_id: req.session.userID}, function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            if (rel_name === "") {
                rel_name = result[0].relative_name;
            }
            if (rel_contact === "") {
                rel_name = result[0].relative_contact;
            }
            if (relation === "") {
                relation = result[0].relation;
            }

            User.update({_id: req.session.userID}, {
                $set: {
                    relative_name: rel_name,
                    relative_contact: rel_contact,
                    relation: relation
                }
            }, function (err1, result1) {
                if (err1) {
                    console.log(err1)
                }
                else {
                    res.send({status: "success", message: "Emergency Contact Updates"});
                }
            });

        }
    });
});



//======================= save profile pic ====================================
//using cloudinary

router.get('/upload', function(res,res){
    res.render('rohitimage') ;
});


cloudinary.config({
    cloud_name: 'dgxhqin7e',
    api_key:    '825578459372821',
    api_secret: 'wk9ez8EkyiKVeGzGWD0rlUS1l0U'
});

router.post('/upload', fileParser, function(req, res){
    console.log("app");

    var imageFile = req.files.image;

    cloudinary.uploader.upload(imageFile.path, function(result){
        if (result.url) {

            //url should be stored in the database .. it is the path for profile pic of user
            console.log(result.url);
            res.send({image_src : result.url});
            //res.render('upload', {url: result.url});
        } else {
            //if error
            console.log('Error uploading to cloudinary: ',result);
            res.send('did not get url');
        }
    });
});






module.exports = router;
