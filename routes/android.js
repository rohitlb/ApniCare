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
// to save profile pic of user


function appuserrequiresLogin(req, res, next) {
    var rohit = req.body.sid;
    if (rohit) {
        return next();
    } else {
        res.send({status: "logout", message: "You are not logged in!"});
    }
}

///// Routes start from here

router.post('/appuserregister', function (req, res) {
    var d = req.body.number;
    var b = req.body.password;
    var c = req.body.name;

    console.log("number"+d);
    console.log("pswd"+b);
    console.log("name"+c);

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
    //var email = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(req.body.email);
    // if(email === false ){
    //     res.send({status: "failure", message: "please enter a valid email and try again"});
    //     return;
    // }
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
                                    var sid = results._id;
                                    res.send({status: "success",sid : sid,  message: "successfully registered"});
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

router.post('/login',function (req,res) {
    var user = null;
    var doctor = null;
    var pharma = null;
    async.parallel({
        User : function(callback){
            User.find({number: req.body.number}).exec(function (err,result) {
                if(err){
                    console.log(err);
                    res.send({status: "failure", message : "Some error occurred"});
                } else {
                    user = result;
                    if(result != "") {
                        bcrypt.compare(req.body.password,result[0].password,function(err, results) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                if(results) {
                                    callback(null,results);
                                }
                                else{
                                    callback();
                                }
                            }
                        });
                    }
                    else {
                        callback();
                    }
                }
            });
        },
        Doctor : function(callback){
            Doctor.find({number: req.body.number}).exec(function (err,result) {
                if(err){
                    console.log(err);
                } else {
                    doctor = result;
                    if(result != "") {
                        bcrypt.compare(req.body.password,result[0].password,function(err, results) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                if(results) {
                                    callback(null,results);
                                }
                                else{
                                    callback();
                                }
                            }
                        });
                    }
                    else {
                        callback();
                    }
                }
            });
        },
        Pharma : function(callback){
            Pharma.find({number: req.body.number}).exec(function (err,result) {
                if(err){
                    console.log(err);
                } else {
                    pharma = result;
                    if(result != "") {
                        bcrypt.compare(req.body.password,result[0].password,function(err, results) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                if(results) {
                                    callback(null,results);
                                }
                                else{
                                    callback();
                                }
                            }
                        });
                    }
                    else {
                        callback();
                    }
                }
            });
        }
    },function(err,result){
        if(err){
            console.log(err);
        }
        else{
            console.log();
            if(result.User == true){
                var rohit = user[0]._id;
                res.send({status : 'success' , sid :rohit , value : 'user'});
            }
            else{
                res.send({status : 'failure' , message : 'Wrong Credential'});
            }
        }
    });
});

router.get('/logout',appuserrequiresLogin, function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.send({status : 'logout'});
        }
    });
});

//////////////////// FOR ANDROID ////////////////////////////////////////

//***************************************Edit User Profile*****************************************************************
//***************Edit Name and Email **********************************

router.post('/verifypassword',appuserrequiresLogin,function (req,res) {
    var sid = req.body.sid;
    var password = req.body.password;
    User.findOne({_id : sid},function (err,result) {
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
                            res.send({status: "success", message: "Password match"});
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

router.post('/updatenameandemail',appuserrequiresLogin,function (req,res) {
    var sid = req.body.sid;
    var name = req.body.name;
    var email = req.body.email;
    User.find({_id: sid}, function (err, result) {
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
            User.update({_id: sid}, {
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

router.post('/updatepassword',appuserrequiresLogin,function (req,res) {
    var sid = req.body.sid;
    var oldpassword = req.body.oldpassword;
    var newpassword = req.body.newpassword;
    var confpassword = req.body.confpassword;

    User.findOne({_id : sid},function (err,result) {
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
                                        User.update({_id: sid}, {
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

router.post('/userpersonalinfo',appuserrequiresLogin,function (req,res) {
    var sid = req.body.sid;
    var dob = req.body.dob;
    var gender = req.body.gender;
    var blood_group = req.body.blood_group;
    var marital_status = req.body.marital_status;
    var height = req.body.height;
    var weight = req.body.weight;

    User.find({_id: sid}, function (err, result) {
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

            User.update({_id: sid}, {
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

router.post('/useraddress',appuserrequiresLogin,function (req,res) {
    var sid = req.body.sid;
    var addresses = req.body.addresses;
    var landmark = req.body.landmarks;
    var pincode = req.body.pincodes;
    var city = req.body.city;
    var state = req.body.state;
    User.find({_id: sid}, function (err, result) {
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

            User.update({_id: sid}, {
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

router.post('/editconfidential',appuserrequiresLogin,function (req,res) {
    var sid = req.body.sid;
    var aadhaarnumber = req.body.aadhaar_number;
    var income = req.body.income;

    User.find({_id: sid}, function (err, result) {
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

router.post('/useremergency',appuserrequiresLogin,function (req,res) {
    var sid = req.body.sid;
    var rel_name = req.body.rel_name;
    var rel_contact = req.body.rel_contact;
    var relation = req.body.relation;
    User.find({_id: sid}, function (err, result) {
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

            User.update({_id: sid}, {
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

//=================================================APP forgot password==============================================

router.post('/appsendOTP',function (req, res) {
    var number = req.body.number;
    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/.test(number);
    if(num === false){
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }
    async.series({
        Doctors: function (callback) {
            Doctor.find({number: number}, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        Pharmas : function(callback){
            Pharma.find({number : number},function(err,result){
                if(err){
                    console.log(err);
                }
                else{
                    callback(null,result);
                }
            });
        },
        Users : function(callback){
            User.find({number : number},function(err,result){
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
            if(((result.Doctors.length === 0)&&(result.Pharmas.length === 0))&&(result.Users.length === 0)){
                var options = { method: 'GET',
                    url: 'http://2factor.in/API/V1/'+keys.api_key()+'/SMS/'+number+'/AUTOGEN',
                    headers: { 'content-type': 'application/x-www-form-urlencoded' },
                    form: {} };

                request(options, function (error, response, body) {
                    if (error) {
                        throw new Error(error);
                    }
                    else {
                        var temp = JSON.parse(body);
                        var sid = req.session.sid = temp.Details;
                        res.send({status: "success",sid : sid, message: "OTP sent to your number"});
                    }
                });
            }
            else{
                res.send({status: "failure", message: "number Already Exists"});
            }
        }
    });
});


//forgot password
router.post('/appforgotpassword',function (req,res) {
    var number = req.body.number;
    //regex for checking whether entered number is indian
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/.test(number);
    if (num === false) {
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }
    async.parallel({
        User: function (callback) {
            User.find({number: number}, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        Doctor: function (callback) {
            Doctor.find({number: number}, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        Pharma: function (callback) {
            Pharma.find({number: number}, function (err, result) {
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
            if ((result.Doctor != "") || (result.User != "") || (result.Pharma)) {
                var options = {
                    method: 'GET',
                    url: 'http://2factor.in/API/V1/' + keys.api_key() + '/SMS/' + number + '/AUTOGEN',
                    headers: {'content-type': 'application/x-www-form-urlencoded'},
                    form: {}
                };

                request(options, function (error, response, body) {
                    if (error) {
                        throw new Error(error);
                    }
                    else {
                        var temp = JSON.parse(body);
                        var sid = req.session.sid = temp.Details;
                        var number = req.session.updatenumber = number;
                        console.log("update number ="+number);
                        res.send({status: "success",sid : sid , number : number, message: "OTP sent to your number"});
                    }
                });
            }
            else {
                res.send({status: 'success', message: 'Please check your number'});
            }
        }
    });
});

router.post('/appVerifyOTP',function (req, res) {
    var otp = req.body.number;
    var sid = req.body.sid;
    var options = { method: 'GET',
        url: 'http://2factor.in/API/V1/'+keys.api_key()+'/SMS/VERIFY/'+sid+'/'+otp,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {} };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
        var temp = JSON.parse(body);
        res.send({status : 'success' , message: temp.Status });
    });
});

router.post('/appupdateforgotpassword',appuserrequiresLogin,function(req,res){
    var sid = req.body.sid;
    var number = req.body.number;
    var password = req.body.password;
    if(password == null){
        res.send({status : 'success' , message : "Please enter some password"});
        return;
    }
    async.parallel({
        User: function (callback) {
            User.find({number: number}, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        Doctor: function (callback) {
            Doctor.find({number: number}, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        Pharma: function (callback) {
            Pharma.find({number: number}, function (err, result) {
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

            if(result.User != "") {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            User.update({number: number}, {
                                $set: {
                                    password: hash
                                }
                            }, function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    req.session.userID = sid;
                                    res.send({status: 'success', data: result});
                                }
                            });
                        }
                    });
                });
            }
            if(result.Doctor != "") {
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            Doctor.update({number: number}, {
                                $set: {
                                    password: hash
                                }
                            }, function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    req.session.doctorID = result.Doctor[0]._id;
                                    res.send({status: 'success', data: result});
                                }
                            });
                        }
                    });
                });
            }
            if(result.Pharma != ""){
                bcrypt.genSalt(10, function (err, salt) {
                    bcrypt.hash(password, salt, function (err, hash) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            Pharma.update({number: number}, {
                                $set: {
                                    password: hash
                                }
                            }, function (err) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    req.session.pharmaID = result.Pharma[0]._id;
                                    res.send({status: 'success', data: result});
                                }
                            });
                        }
                    });
                });
            }
        }
    });
});

//user profile info for app
router.post('/appprofile',appuserrequiresLogin, function (req, res) {
    var sid = req.body.sid;
    console.log("appprofile session ID = "+sid);
    if (sid) {
        User.find({_id : sid}, '-_id -__v -password -registered_at',function(err,user){
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

router.post('/moleculeslist',function(req,res){
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

router.post('/brandslist',function(req,res){
    var skip = parseInt(req.body.nskip);
    Brand.find({},'-_id brand_name').populate(
        {path : 'dosage_id', select : '-_id dosage_form',populate :
            {path : 'strength_id', select : '-_id strength packaging potent_substance.name price'}
        }).populate(
        {path : 'company_id', select: '-_id company_name'}).sort({brand_name : 1}).skip(skip).limit(10).exec(function (err,brand) {
        if (err) {
            console.log(err);
        }
        else{
            res.send({status : 'brands list' , data : brand});
        }
    });
});

router.post('/categorieslist'/*,appuserrequiresLogin*/,function(req,res){
    var skip = parseInt(req.body.nskip);
    var category =req.body.category;
    CategoryData.find({ category : category }, '-_id -__v').sort({category : 1}).skip(skip).limit(10).exec(function (err, result) {
        if(err){
            console.log(err);
        }
        else{
            res.send({ message : "category info" , data :result });
        }
    });
});

router.post('/diseaseslist'/*,appuserrequiresLogin*/,function(req,res){
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

router.post('/organslist'/*,appuserrequiresLogin*/,function(req,res){
    var skip = parseInt(req.body.nskip);
    OrganSearch.find({}, '-_id name').sort({"updated_at":-1}).sort({"created_at":-1}).skip(skip).limit(10).exec(function (err, result) {
        if (err) {
            console.log(err);
        }
        else{
            res.send({ message : "organs list" , data :result });
        }
    });
});

router.post('/symptomslist'/*,appuserrequiresLogin*/,function(req,res){
    var skip = parseInt(req.body.nskip);
    SymptomSearch.find({},'-_id name').sort({name : 1}).skip(skip).limit(10).exec(function(err,result) {
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

        Strength.find({ $and: [ { 'potent_substance.name' : molecule}, { 'potent_substance.name': { $size: 1 } } ] } ,'-_id potent_substance.name price')
            .populate({path : 'brands_id', select : '-_id __v' ,
                populate : {path : 'dosage_id', select : '-_id -strength_id -__v'}})
            .populate({path : 'brands_id' , select : '-_id brand_name' , populate : {path : 'company_id', select : '-_id -brand_id -__v'}})
            .sort({brand_name: 1}).exec(function (err,brands) {
            if (err) {
                console.log(err);
            }
            else {
                if((brands[0] === undefined) || (brands[0].brands_id[0] === undefined)){
                    res.send({status : 'failure' , message : 'no brands available'});
                }
                else{
                    var data ={};
                    data['strengths'] = [];
                    var drug = {};
                    drug['drugdata'] = [];
                    async.each(brands,function(results,callback){
                        if((data.strengths.indexOf(results.brands_id[0].brand_name) > -1) === false){
                            drug['drugdata'].push({
                                forbrands : results
                            });
                            data['strengths'].push(
                                results.brands_id[0].brand_name
                            );
                        }
                        else{
                            callback();
                        }
                    });
                    res.send({data: drug.drugdata, message: 'molecule brands'});
                }
            }
        });
    }
    if(req.body.page == 'combination') {
        Strength.find({$and: [{'potent_substance.name': molecule}, {'potent_substance.name.1': {$exists: true}}]}, '-_id potent_substance.name price')
            .populate({path : 'brands_id', select : '-_id __v' ,
                populate : {path : 'dosage_id', select : '-_id -strength_id -__v'}})
            .populate({path : 'brands_id' , select : '-_id brand_name' , populate : {path : 'company_id', select : '-_id -brand_id -__v'}})
            .sort({brand_name: 1}).exec(function (err, brands) {
            if (err) {
                console.log(err);
            }
            else {
                if((brands[0] === undefined) || (brands[0].brands_id[0] === undefined)){
                    res.send({status : 'failure' , message : 'no brands available'});
                }
                else{
                    var data ={};
                    data['strengths'] = [];
                    var drug = {};
                    drug['drugdata'] = [];
                    async.each(brands,function(results,callback){
                        if((data.strengths.indexOf(results.brands_id[0].brand_name) > -1) === false){
                            drug['drugdata'].push({
                                forbrands : results
                            });
                            data['strengths'].push(
                                results.brands_id[0].brand_name
                            );
                        }
                        else{
                            callback();
                        }
                    });
                    res.send({data: drug.drugdata, message: 'molecule brands'});
                }
            }
        });
    }
});

// similar disease + organ + symptom FILTERED + TAKES RAW
router.post('/DOSlist',function (req,res) {
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

// same molecules same strengths => output is list of brands + jis brand k liye search kiya wo nai ana chaiye
router.post('/similarbrands',function(req,res){
    var molecule = req.body.molecule;
    var strength = req.body.strength;
    var skip = req.body.nskip;
    Strength.find({ $and: [ { 'potent_substance.name' : molecule},{'potent_substance.molecule_strength' : strength},
        { 'potent_substance.name': { $size: 1 } } ] } ,'-_id potent_substance.name price')
        .populate({path : 'brands_id', select : '-_id __v' ,
            populate : {path : 'dosage_id', select : '-_id -strength_id -__v'}})
        .populate({path : 'brands_id' , select : '-_id brand_name' , populate : {path : 'company_id', select : '-_id -brand_id -__v'}})
        .sort({brand_name: 1}).exec(function (err,brands) {
        if (err) {
            console.log(err);
        }
        else {
            if((brands[0] === undefined) || (brands[0].brands_id[0] === undefined)){
                res.send({status : 'failure' , message : 'no brands available'});
            }
            else{
                var data ={};
                data['strengths'] = [];
                var drug = {};
                drug['drugdata'] = [];
                async.each(brands,function(results,callback){
                    if((data.strengths.indexOf(results.brands_id[0].brand_name) > -1) === false){
                        drug['drugdata'].push({
                            forbrands : results
                        });
                        data['strengths'].push(
                            results.brands_id[0].brand_name
                        );
                    }
                    else{
                        callback();
                    }
                });
                res.send({data: drug.drugdata, message: 'molecule brands'});
            }
        }
    });
});

// have regex , search for molecule_name,categories,brand_name,disease_name,organs,symptoms
router.post('/searchall',function (req,res) {
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
            OrganSearch.find({name : search}, '-_id name').sort({name: 1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        symptoms: function (callback) { // gives symptoms sorted list
            SymptomSearch.find({name: search}, '-_id name').sort({name: 1}).skip(skip).limit(10).exec(function (err, result) {
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

router.post('/similarbrand',function(req,res) {
    var brand = req.body.brand;
    var dosages = {};
    dosages['data'] = [];
    var strengths = {};
    strengths['data'] = [];
    Brand.find({brand_name: brand}, "-_id brand_name").populate({
        path: 'dosage_id', select: "-_id dosage_form"
        , populate: {path: "strength_id", select: "-_id potent_substance.name potent_substance.molecule_strength"}
    })
        .exec(function (err, result) {
            async.each(result, function (brands, callback) {
                async.each(brands.dosage_id, function (dosage, callback) {
                    dosages['data'].push(dosage.dosage_form);
                    // async.each(dosage.strength_id,function(strength,callback){
                    //     strengths['data']
                    // });
                });
            });
            var matchbrand = {};
            matchbrand['matchdata'] = [];
            Brand.find({}, '-_id brand_name').where({dosage_id: {$size: dosages.data.length}})
                .populate({path: "dosage_id", select: "-_id dosage_form"})
                .exec(function (err, brands) {
                    async.each(brands, function (total, callback) {
                        var x = 0;
                        if (total.brand_name != brand) {
                            async.each(total.dosage_id, function (match, callbacks) {
                                if((dosages.data.indexOf(match.dosage_form) > -1) === true) {
                                    x = x + 1;
                                    callbacks();
                                }
                                else{
                                    callbacks();
                                }
                            });
                            if(x === dosages.data.length){
                                matchbrand['matchdata'].push(total.brand_name);
                            }
                        }
                        else {
                            callback();
                        }
                    });
                    console.log(matchbrand.matchdata);
                    async.each(matchbrand.matchdata,function(singlebrand,callback) {
                        Brand.find({brand_name: singlebrand}, "-_id brand_name").populate({
                            path: 'dosage_id',
                            select: "-_id dosage_form"
                            ,
                            populate: {
                                path: "strength_id",
                                select: "-_id potent_substance.name potent_substance.molecule_strength"
                            }
                        }).exec(function (err, Brands) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                async.each(Brands,function(singledosage,callback){
                                    async.each(singledosage.dosage_id,function(strength,callback){
                                        console.log(strength)
                                    });
                                });
                            }
                        });
                    });
                    res.send({status: "success", data: result});
                });
        });
});


module.exports = router;
