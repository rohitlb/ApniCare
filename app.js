// require dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var request = require('request');
var mongoose = require('mongoose');
var multer = require('multer');
var promise = require('bluebird');
var sleep = require('thread-sleep');
var session = require('express-session');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcryptjs');
var mongoDBStore = require('connect-mongodb-session')(session);
mongoose.Promise = promise;
var async = require('async');
var keys = require('./private/keys');


// req models


// req model for feedback and need help
var Feedback = require('./model/adminfeedback');
var Needhelp = require('./model/needhelp');
var NeedhelpWL = require('./model/needhelpWL');


var User  = require('./model/registration');
var Doctor = require('./model/doctorregistration');
var Pharma = require('./model/pharma');
var Professional = require('./model/professional');
//require for medicine index
var Company = require('./model/company');
var Brand = require('./model/brand');
var Dosage = require('./model/dosage');
var Strength = require('./model/strength');
//require for disease
var Disease = require('./model/disease');
//require molecule
var Molecule = require('./model/molecule');
var Search = require('./model/search');
// to save profile pic of user
var routes = require('./model/imagefile');

//declare the app
var app = express();

var store = new mongoDBStore({
    uri : 'mongodb://localhost/Care',
    collection : 'mySessions'
});

store.on('error',function (error) {
    assert.ifError(error);
    assert.ok(false);
});

// to hide X-Powered-By for Security,Save Bandwidth in ExpressJS(node.js)
app.disable('x-powered-by');

//configure the app
app.set('port',9000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// adding favicon of Apnicare
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//set all middleware
app.use(bodyParser.json());
//exteended false means it won't be accepting nested objects (accept only single)
// here security for session to be added like.... session validate
app.use(bodyParser.urlencoded({extended : false}));
app.use(expressValidator());
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());

// for imagefile in model
app.use(routes);
// if saveUninitialized : false than it will store session till the instance is in existence
// secret is hashing secret
// secret should be that much complex that one couldnt guess it easily
app.use(session({
    secret : 'keyboard cat',
    cookie : {maxAge : 1000* 60 * 60 * 24 * 7},
    store : store,
    resave : false,
    saveUninitialized : true
}));

app.get('/admin',function (req,res) {
    var page = 'home';
    if(page == 'home')
    {
        res.render('./admin/home_admin',
            {
                page: page
            });
    }
    //res.render('./admin/home_admin');
});

// have thread-sleep (tested) . run "npm update --save" for adding modules
app.get('/test',function (req,res) {
    var start = Date.now();
    // set time
    var hit = sleep(10000);
    var end = Date.now();
// testing time been set
    console.log(hit + ' ~= ' + (end - start) + ' ~= 5000');
    //render where you want
    res.render('');
    res.end();

});
//*************************************Feedback and needhelp*******************************************************************

app.post('/feedback' , function (req,res) {
    var usefulness = req.body.usefulness;
    var suggestion = req.body.suggestion;
    var feedbackFrom = req.body.about;
    var ticket = req.body.token;
    console.log(usefulness);
    console.log(suggestion);
    console.log(feedbackFrom);
    console.log(ticket);

    if(req.session.userID){
        name = req.session.userID;
    }
    if(req.session.doctorID){
        name = req.session.doctorID;
    }
    if(req.session.pharmaID){
        name = req.session.pharmaID;
    }
    var feedback = new Feedback({
        feedbackUsefulness : usefulness,
        feedbackInfo : suggestion,
        feedbackFrom : name,
        feedbackCategory : feedbackFrom,
        feedbackTicket : ticket
    });

    feedback.save(function (err, result) {
        if (err) {
            console.log(err);
            res.send({status: "failure", message: "some error"});
        } else {
            res.send({status: "success", message: "thnx for feedback"});
        }
    });
});

app.post('/needhelp' , function (req,res) {
    console.log("pranjal");
    var subject = req.body.subject;
    var contact_message = req.body.contact_message;
    console.log(subject);
    console.log(contact_message);



    var needhelp = new Needhelp({
        //here user ID should be adde/d
        subject : subject,
        contact_message : contact_message
    });

    needhelp.save(function (err, result) {
        if (err) {
            console.log(err);
            res.send({status: "failure", message: "some error"});
        } else {
            res.send({status: "success", message: "We will Contact you soon"});
        }
    });
});

app.post('/needhelpWL' , function (req,res) {
    var name = req.body.name;
    var email = req.body.email;
    var number = req.body.number;
    var subject = req.body.subject;
    var contact_message = req.body.contact_message;
    var needhelpWL = new NeedhelpWL({
        name : name,
        email : email,
        number : number,
        subject : subject,
        contact_message : contact_message
    });

    needhelpWL.save(function (err, result) {
        if (err) {
            console.log(err);
            res.send({status: "failure", message: "some error"});
        } else {
            res.send({status: "success", message: "We will Contact you soon"});
        }
    });
});

//*************************************OTP*******************************************************************

//user
app.post('/sendOTP',function (req, res) {

    var number = req.body.number;
    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
    if(num === false){
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }

    User.findOne({number : number},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if (result) {
                res.send({status: "failure", message: "number Already Exists"});
                res.end();

            }
            else{
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
                        req.session.sid = temp.Details;
                        res.send({status: "success", message: "OTP sent to your number"});
                    }
                });
            }
        }
    });
});

//doctor
app.post('/DoctorsendOTP',function (req, res) {
    var number = req.body.number;
    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
    if(num === false){
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }

    Doctor.findOne({number : number},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if (result) {
                res.send({status: "failure", message: "number Already Exists"});
                res.end();

            }
            else{
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
                        req.session.sid = temp.Details;
                        res.send({status: "success", message: "OTP sent to your number"});
                    }
                });
            }
        }
    });
});

app.post('/VerifyOTP',function (req, res) {
    var otp = req.body.number;
    var options = { method: 'GET',
        url: 'http://2factor.in/API/V1/'+keys.api_key()+'/SMS/VERIFY/'+req.session.sid+'/'+otp,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {} };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var temp = JSON.parse(body);
        res.send({message: temp.Status })
        });
});

app.get('/home',function (req,res) {
    //if (req.session.userID) {
        res.render('index');
        res.end();
    //}
});

app.get('/', function (req, res) {
    if (req.session.userID) {
        res.render('index');
        res.end();
    }
});

//////////////// Molecule data ///////////////////

//User registration
app.post('/register', function (req, res) {
    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(req.body.number);
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

//render profile page of user
app.get('/profile', function (req, res) {
    if (req.session.userID) {
        res.render('profile');
    }
});

app.get('/profiles',function (req,res) {
    if(req.session.userID) {
        res.render('profiles');
    }
});

//user profile update
app.post('/profiles',function (req,res) {
    var dob = req.body.dob;
    var gender = req.body.gender;
    var blood_group = req.body.blood_group;
    var marital_status = req.body.marital_status;
    var height = req.body.height;
    var weight = req.body.height;

    var addresses = req.body.address;
    var landmark = req.body.landmarks;
    var pincode = req.body.pincode;
    var city = req.body.city;
    var state = req.body.state;


    var aadhaar_number = req.body.aadhaar_number;
    var income = req.body.income;
    var rel_name = req.body.relative_name;
    var rel_contact = req.body.relative_contact;
    var relation = req.body.relation;


    User.update({_id : req.session.userID}, {
        $set : {
            dob: dob,
            gender: gender,
            blood_group: blood_group,
            marital_status: marital_status,
            height: height,
            weight: weight,
            address: {
                address : addresses,
                landmark : landmark,
                pin_code : pincode,
                city : city,
                state : state
            },
            aadhaar_number: aadhaar_number,
            income: income,
            relative_name : rel_name,
            relative_contact: rel_contact,
            relation: relation
        }
    },function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            res.send("successfully updated");
        }
    });
});

//***************************************frontend**************************************8888

//*******************************frontend changes***********************************************
app.get('/profile/userprofile',function (req,res) {
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
            console.log(result);
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

//for basic info like disease,drug and molecule Information*******************************************************
app.get('/ApniCare/information',function (req,res) {
    var page= 'ApniCare';
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
    if (req.query.page=='Drug_Information'){
        page = req.query.page;
        Brand.find({},'-_id brand_name categories types primarily_used_for').populate(
            {path : 'dosage_id', select : '-_id dosage_form',populate :
                {path : 'strength_id', select : '-_id strength packaging prescription dose_taken warnings price dose_timing potent_substance.name'}
            }).populate(
            {path : 'company_id', select: '-_id company_name'}).sort({brand_name : 1}).exec(function (err,brand) {
            if (err) {
                console.log(err);
            }
            else {
                if(brand != "") {
                    res.render('index',
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

});

app.get('/ApniCare/information/Molecules',function (req,res) {
    var molecule = req.query.molecule;
    var disease = req.query.disease;
    var brand = req.query.brand;
    Molecule.find({molecule_name : molecule},'-_id -__v').exec(function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('index',
                {
                    page:'molecule_name',
                    data : result
                });
        }
    });
});

app.get('/ApniCare/information/Diseases',function (req,res) {
    var disease = req.query.disease;
    Disease.find({disease_name : disease},'-_id -__v').exec(function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('index',
                {
                    page:'disease_name',
                    data : result
                });
        }
    });
});

app.get('/ApniCare/information/Drug',function (req,res) {
    var brand = req.query.brand;
     Brand.find({brand_name : brand},'-_id brand_name categories types primarily_used_for').populate(
            {path : 'dosage_id', select : '-_id dosage_form',populate :
                {path : 'strength_id', select : '-_id strength packaging prescription dose_taken warnings price dose_timing potent_substance.name'}
            }).populate(
            {path : 'company_id', select: '-_id company_name'}).exec(function (err,brand) {
            if (err) {
                console.log(err);
            }
            else {
                res.render('index',
                    {
                        page: 'drug_data_view',
                        data: brand
                    });
            }

        });
});

//*****************************************search Middleware*******************************************************************

app.get('/rohitsearching',function (req,res) {
    res.render('rohitsearching');
});

app.get('/searching',function (req,res) {
    res.render('searching');
});

// it takes name and give all info or list
app.post('/searchspecific',function(req,res){
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
            Disease.find({disease_name : value},'-_id __v',function(err,result){
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
            Molecule.find({molecule_name : value},'-_id __v',function(err,result){
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
            console.log(result);
            res.send({status : 'success' , data : result});
        }
    });
});

//===================================for WEB============================

app.post('/searchweb', function(req, res) {
    var raw = req.body.term;
    var spaceRemoved = raw.replace(/\s/g, '');
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
            Search.find({name : search}, '-_id name').sort({"updated_at":-1}).sort({"created_at":-1}).exec(function (err, result) {
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

app.get('/searchbrands',function(req,res){
    var value = req.query.brands;
    res.render('send',{data : value});
});

app.get('/searchdiseases',function(req,res){
    var value = req.query.diseases;
    console.log(value);
    res.render('send',{data : value});
});

app.get('/searchmolecules',function(req,res){
    var value = req.query.molecules;
    console.log(value);
    res.render('send',{data : value});
});

app.get('/searchsymptons',function(req,res){
    var value = req.query.symptoms;
    console.log(value);
    Disease.find({symptoms : value},'-_id disease_name',function(err,symptom){
        if(err){
            console.log(err);
        }
        else{
            res.render('send',{data : symptom});
        }
    });
});

app.get('/searchorgans',function(req,res){
    var value = req.query.organs;
    console.log(value);
    Disease.find({'organs.subhead' : value},'-_id disease_name',function(err,disease) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('send', {data: disease});
        }
    });
});

app.get('/searchcategories',function(req,res){
    var value = req.query.categories;

    console.log(typeof value);
    console.log(value[0]);
    res.send(value);
});

////////////For search during submitting//////////////

app.get('/forbrands',function(req,res){
    var value = req.query.term;
    Brand.find({brand_name : value},'-_id brand_name',function(err,result) {
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

app.get('/forcategories',function(req,res){
    var value = req.query.term;
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

app.get('/forcompanies',function(req,res){
    var value = req.query.term;
    Company.find({company_name : value},'-_id company_name',function(err,result){
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

app.get('/formolecules',function(req,res){
    var value = req.query.term;
    Molecule.find({molecule_name : value},'-_id molecule_name',function(err,result){
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

//===================================for APP============================

// similar barnds + info + combination
app.post('/formolecule',function (req,res) {
    console.log("app");
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
        Strength.find({potent_substance : {$elemMatch : {name : molecule}}},'-_id -__v -potent_substance._id '
        ).populate({path: 'brands_id', select : '-_id', populate: {path: 'dosage_id', select : '-_id -__v'}}).populate(
            {path : 'brands_id' , select : '-_id  -__v ',populate : {path : 'company_id', select : '-_id  -__v '}}).sort({brand_name: 1}).skip(skip).limit(10).exec(function (err,brands) {
            if (err) {
                console.log(err);
            }
            else {
                var brand = {};
                brand['data'] = [];
                async.each(brands, function (result, callback) {
                    if (result.potent_substance.length === 1) {
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
                        //res.send(brand);
                        res.send({message : 'molecule brand', data: brand.data});
                    }
                });
            }
        });

    }
    if(req.body.page == 'combination'){
        Strength.find({potent_substance : {$elemMatch : {name : molecule}}},'-_id -__v -potent_substance._id'
        ).populate({path: 'brands_id', populate: {path: 'dosage_id', populate : {path : 'strength_id'}}
        }).populate({path : 'brands_id', select : '-_id -__v',populate : {path : 'company_id'}}).sort({brand_name: 1}).skip(skip).limit(10).exec(function (err,brands) {
            if (err) {
                console.log(err);
            }
            else {
                res.send({message : 'molecule combination',data : brands});
            }
        });
    }
});

app.post('/similarbrands',function(req,res){
    var molecule = req.body.molecule;
    var strength = req.body.strength;
    Strength.find({potent_substance : {$elemMatch : {name : molecule, molecule_strength : strength}}},'-_id -__v -potent_substance._id'
    ).populate({path: 'brands_id', select : '-_id', populate: {path: 'dosage_id', select : '-_id -__v'}}).populate(
        {path : 'brands_id' , select : '-_id -__v',populate : {path : 'company_id', select : '-_id  -__v '}}).sort({brand_name: 1}).skip(skip).limit(10).exec(function (err,brands) {
        if (err) {
            console.log(err);
        }
        else {
            var brand = {};
            brand['data'] = [];
            async.each(brands, function (result, callback) {
                if (result.potent_substance.length === 1) {
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
                    //res.send(brand);
                    res.send({message : 'molecule brand', data: brand.data});
                }
            });
        }
    });
});

app.post('/searchall',function (req,res) {
    var raw = req.body.search;
    var spaceRemoved = raw.replace(/\s/g, '');
    var skip = parseInt(req.body.nskip);

    var search = new RegExp('^' + spaceRemoved, 'i');
    async.parallel({
        molecules: function (callback) { // gives molecule_name sorted list
            Molecule.find({molecule_name: search}, '-_id molecule_name').sort({molecule_name: 1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
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
            Disease.find({disease_name: search}, 'disease_name').sort({disease_name: 1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        organs: function (callback) {  // gives organs sorted list
            Disease.find({'organs.subhead': search}, '-_id organs.subhead').sort({organs: 1}).skip(skip).limit(10).exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(result);
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
            console.log(result);
            res.send(result, {
                'Content-Type': 'application/json'
            }, 200);
        }
    });
});

app.post('/search_mbc',function (req,res) {
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

app.post('/search_dos',function (req,res) {
    console.log("search_dos");

    var raw = req.body.search;
    var skip = parseInt(req.body.nskip);
    console.log(raw);
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

app.post('/filtersearch', function (req,res) {
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

//*****************************************USER LOGIN*******************************************************************
//login with filter and session

app.post('/login',function (req,res) {

    User.findOne({number: req.body.number}).exec(function (err,result) {
        if(err){
            console.log(err);
            res.send({status: "failure", message : "Some error occurred"});
            res.end();
        } else {
            if(result) {
                bcrypt.compare(req.body.password,result.password,function(err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if(results) {
                            req.session.userID = result._id;
                            req.session.dpname = req.body.number;
                            if (req.session.userID) {
                                res.send({
                                    status: "success",
                                    message: "successfully login",
                                    number: req.session.userID
                                });
                                res.end();
                            }
                        }
                        else{
                            res.send({status: "failure", message: "Wrong credentials"});
                        }
                    }
                });
            }
            else {
                res.send({status: "failure", message: "Can't login"});
                res.end();
            }
        }
    });
});

//Doctor login
app.post('/doctorlogin',function (req,res) {
    Doctor.findOne({number: req.body.number}).exec(function (err,result) {
        if(err){
            console.log(err);
            res.send({status: "failure", message : "Some error occurred"});
            res.end();
        } else {
            if(result) {

                bcrypt.compare(req.body.password,result.password,function(err, results) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        if(results) {
                            req.session.doctorID = result._id;
                            req.session.dpname = req.body.number;
                            if (req.session.userID) {
                                res.send({
                                    status: "success",
                                    message: "successfully login",
                                    number: req.session.doctorID
                                });
                                res.end();
                            }
                        }
                        else{
                            res.send({status : "failure", message : "password incorrect"});
                        }

                    }
                });
            }
            else {
                res.send({status: "failure", message: "Can't login"});
                res.end();
            }
        }
    });
});

//logout the user
app.get('/logout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('index');
        }
    });
});

//***************************************Edit User Profile*****************************************************************

//***************Edit Name and Email **********************************

app.get('/verifypassword',function (req,res) {
    if(req.session.userID) {
        res.render('verifypassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/verifypassword',function (req,res) {

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

app.get('/updatenameandemail',function (req,res) {
    if(req.session.userID){
        res.render('updatenameandemail');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/updatenameandemail',function (req,res) {
    var name = req.body.name;
    var email = req.body.email;
    User.find({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else {
            if (result[0]._id === req.session.userID) {
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
            else {
                res.send({status: "failure", message: "Details Cannot update"});
            }
        }
    });
});

//*******************Edit Password**************************************

app.get('/updatepassword',function (req,res) {
    if(req.session.userID) {
        res.render('updatepassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/updatepassword',function (req,res) {
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

app.get('/verifydetailspassword',function (req,res) {
    if(req.session.userID) {
        res.render('verifydetailspassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/verifydetailspassword',function (req,res) {
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

app.get('/updateusersdetails',function (req,res) {
    if(req.session.userID) {
        res.render('updateusersdetails');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/updateusersdetails',function (req,res) {
    var dob = req.body.dob;
    var gender = req.body.gender;
    var blood_group = req.body.blood_group;
    var marital_status = req.body.marital_status;
    var height = req.body.height;
    var weight = req.body.weight;

    User.find({_id : req.session.userID},function (err,result) {
        if (err) {
            console.log(err);
        }
        else {

            if (result[0]._id === req.session.userID) {
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
                }, function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log(result);
                        res.send({status: "success", message: "Details Updated"});
                    }
                });
            }
            else {
                res.send({status: "failure", message: "Wrong credentials"});
            }
        }
    });
});

//*****************Edit address*********************************************

app.get('/addresspassword',function (req,res) {
    if(req.session.userID) {
        res.render('addresspassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/addresspassword',function (req,res) {
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

app.get('/editaddress',function (req,res) {
    if(req.session.userID) {
        res.render('editaddress');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/editaddress',function (req,res) {
    var addresses = req.body.address;
    var landmark = req.body.landmark;
    var pincode = req.body.pincode;
    var city = req.body.city;
    var state = req.body.state;

    User.find({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else {
            if (result[0]._id === req.session.userID) {
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
            else {
                res.send({status: "failure", message: "Wrong credentials"});
            }
        }
    });
});


//********************Edit Confidential *************************************

app.get('/confidentialpassword',function (req,res) {
    if(req.session.userID) {
        res.render('confidentialpassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/confidentialpassword',function (req,res) {
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

app.get('/editconfidential',function (req,res) {
    if(req.session.userID) {
        res.render('editconfidential');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/editconfidential',function (req,res) {
    var aadhaarnumber = req.body.aadhaar_number;
    var income = req.body.income;
    
    User.find({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else {

            if (result[0]._id === req.session.userID) {
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
            else {
                res.send({status: "failure", message: "Wrong credentials"});
            }
        }
    });
});

//***********************Edit Emergency **************************************

app.get('/emergencypassword',function (req,res) {
    if(req.session.userID) {
        res.render('emergencypassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/emergencypassword',function (req,res) {
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

app.get('/editemergency',function (req,res) {
    if(req.session.userID) {
        res.render('editemergency');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/editemergency',function (req,res) {
    var rel_name = req.body.relative_name;
    var rel_contact = req.body.relative_contact;
    var relation = req.body.relation;

    User.find({_id : req.session.userID},function (err,result) {
        if(err){
            console.log(err);
        }
        else {
            if (result[0]._id === req.session.userID) {
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
            else {
                res.send({status: "failure", message: "Wrong credentials"});
            }
        }
    });
});

//////////////////////////////////////////Not Now///////////////////////////////////////////////////////////////////////
////////////////////////////////////////Insert Doctor///////////////////////////////////////////////////////////////////

//Doctor registration
app.post('/doctorregister', function (req, res) {
    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(req.body.number);
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
    Doctor.findOne({number: req.body.number}).exec(function (err, result) {
        if (err) {
            console.log(err);
            res.end();
        } else {
            if (result) {
                res.send({status: "failure", message: "user Already Exists"});
                res.end();

            } else {
                var doctor = new Doctor({
                    name: req.body.name,
                    number: req.body.number,
                    password: req.body.password
                });
                doctor.save(function (err, results) {
                    if (err) {
                        console.log(err);
                        res.end();
                    } else {
                        res.send({status: "success", message: "successfully registered"});
                        res.end();
                    }
                });
            }
        }
    });
});

//forgot password
app.post('/checkforgotpassword',function (req,res) {
    var number = req.body.number;
    //regex for checking whether entered number is indian
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
    if(num === false){
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }

    User.findOne({number : number}, function (err,result) {
        if (err) {
            console.log(err);
        } else {
            if (result) {
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
                        req.session.sid = temp.Details;
                        res.send({status: "success", message: "OTP sent to your number"});

                    }
                });

            }
            else {
                res.send({status: "failure", message: "this number is not registered"});
            }
        }
    });
});

//forgot password for doctor
app.post('/doctorcheckforgotpassword',function (req,res) {
    var number = req.body.number;
    //regex for checking whether entered number is indian
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
    if(num === false){
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }

    Doctor.findOne({number : number}, function (err,result) {
        if (err) {
            console.log(err);
        } else {

            if (result) {
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
                        req.session.sid = temp.Details;
                        res.send({status: "success", message: "OTP sent to your number"});
                    }
                });
            }
            else {
                res.send({status: "failure", message: "this number is not registered"});
            }
        }
    });
});

//doc update password
app.post('/doctorupdatepassword',function (req,res) {
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

app.get('/medicine',function (req,res) {
    res.render('medicine');
});

app.post('/medicines',function(req,res) {
    var brand_name = req.body.brand_name;
    var company_name = req.body.company_name;
    var categories = req.body.categories;
    var strengths = req.body.strength1;
    //var strength_unit = req.body.strength2;
    var potent_name=  req.body.subhead111;
    var potent_strength = req.body.subhead222;
    var dosage_form = req.body.dosage_form;
    var packaging = req.body.packaging;
    var price = req.body.price;
    var prescription = req.body.prescription;
    var dose_taken = req.body.dose_taken;
    var dose_timing = req.body.dose_timing;
    var types = req.body.types;
    var primarily_used_for = req.body.primarily_used_for;
    var warnings = req.body.warnings;
    var companyresult = null;
    var brandresult = null;

    async.waterfall([
            function (callback) {
                Company.findOne({company_name: company_name}, function (err, result) {
                    if (err) {
                        console.log(err);
                        throw new Error(err);
                    }
                    else {
                        callback(null, result);
                    }
                });
            },
            function (result, callback) {
                if (result) {
                    companyresult = result._id;
                    Brand.findOne({brand_name: brand_name}, function (err, result1) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        else {
                            callback(null, result1);
                        }
                    });
                }
                else {
                    Brand.findOne({brand_name: brand_name}, function (err1, result1) {
                        if (err1) {
                            console.log(err1);
                            throw new Error(err1);
                        }
                        else {
                            if (result1) {
                                res.send("other company cannot have same brand");
                            }
                            else {
                                var STRength = new Strength({
                                    strength: strengths,
                                    //strength_unit : strength_unit,
                                    potent_substance: {
                                        name: potent_name,
                                        molecule_strength: potent_strength
                                    },
                                    packaging: packaging,
                                    price: price,
                                    dose_taken: dose_taken,
                                    dose_timing: dose_timing,
                                    warnings: warnings,
                                    prescription: prescription
                                });
                                STRength.save(function (err2, result2) {
                                    if (err2) {
                                        console.log(err2);
                                        throw new Error(err2);
                                    }
                                    else {
                                        var dosage = new Dosage({
                                            dosage_form: dosage_form,
                                            strength_id: result2._id
                                        });
                                        dosage.save(function (err3, result3) {
                                            if (err3) {
                                                console.log(err3);
                                                throw new Error(err3);
                                            }
                                            else {
                                                var brand = new Brand({
                                                    brand_name: brand_name,
                                                    categories: categories,
                                                    types: types,
                                                    primarily_used_for: primarily_used_for,
                                                    dosage_id: result3._id
                                                });
                                                brand.save(function (err4, result4) {
                                                    if (err4) {
                                                        console.log(err4);
                                                        throw new Error(err4);
                                                    }
                                                    else {
                                                        var company = new Company({
                                                            company_name: company_name,
                                                            brand_id: result4._id
                                                        });
                                                        company.save(function (err5, result5) {
                                                            if (err5) {
                                                                console.log(err5);
                                                                throw new Error(err5);
                                                            }
                                                            else {
                                                                Brand.update({brand_name: brand_name}, {
                                                                    $set: {
                                                                        company_id: result5._id
                                                                    }
                                                                }, function (err6) {
                                                                    if (err6) {
                                                                        console.log(err6);
                                                                    }
                                                                    else {
                                                                        Strength.update({_id: result2._id}, {
                                                                            $push: {
                                                                                brands_id: result4._id
                                                                            }
                                                                        }, function (err7, result7) {
                                                                            if (err7) {
                                                                                console.log(err7);
                                                                            }
                                                                            else {
                                                                                res.send("New medicine added");
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                        });
                                    }
                                });
                            }
                        }
                    });
                }
            },
            function (result, callback) {
                if (result) {
                    brandresult = result._id;
                    Dosage.findOne({dosage_form: dosage_form}, function (err, result1) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        else {
                            callback(null, result1);
                        }
                    });
                }
                else {
                    var strength = new Strength({
                        strengths: strengths,
                        //strength_unit : strength_unit,
                        potent_substance: {
                            name: potent_name,
                            molecule_strength: potent_strength
                        },
                        packaging: packaging,
                        price: price,
                        dose_taken: dose_taken,
                        dose_timing: dose_timing,
                        warnings: warnings,
                        prescription: prescription
                    });
                    strength.save(function (err, result) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            var dosage = new Dosage({
                                dosage_form: dosage_form,
                                strength_id: result._id
                            });
                            dosage.save(function (err1, result1) {
                                if (err1) {
                                    console.log(err1);
                                }
                                else {
                                    var brand = new Brand({
                                        brand_name: brand_name,
                                        categories: categories,
                                        types: types,
                                        primarily_used_for: primarily_used_for,
                                        dosage_id: result1._id
                                    });
                                    brand.save(function (err2, result2) {
                                        if (err2) {
                                            console.log(err2);
                                        }
                                        else {
                                            Company.update({company_name: company_name}, {
                                                $push: {brand_id: result2._id}
                                            }).exec(function (err3) {
                                                if (err3) {
                                                    console.log(err3);
                                                }
                                                else {
                                                    Brand.update({brand_name: brand_name}, {
                                                        $push: {
                                                            company_id: companyresult
                                                        }
                                                    }, function (err6) {
                                                        if (err6) {
                                                            console.log(err6);
                                                        }
                                                        else {
                                                            Strength.update({_id: result._id}, {
                                                                $push: {
                                                                    brands_id: result2._id
                                                                }
                                                            }, function (err7) {
                                                                if (err7) {
                                                                    console.log(err);
                                                                }
                                                                else {
                                                                    res.send("Brand added successfully  with dosage and strength");
                                                                }
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            },
            function (result, callback) {
                if (result) {
                    Strength.findOne({strength: strengths}, function (err, result1) {
                        if (err) {
                            console.log(err);
                            throw new Error(err);
                        }
                        else {
                            callback(null, result1);
                        }
                    });
                }
                else {
                    var sTrength = new Strength({
                        strengths: strengths,
                        //strength_unit : strength_unit,
                        potent_substance: {
                            name: potent_name,
                            molecule_strength: potent_strength
                        },
                        brands_id: brandresult,
                        packaging: packaging,
                        price: price,
                        dose_taken: dose_taken,
                        dose_timing: dose_timing,
                        warnings: warnings,
                        prescription: prescription
                    });
                    sTrength.save(function (err, result1) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            var dosage = new Dosage({
                                dosage_form: dosage_form,
                                strength_id: result1._id
                            });
                            dosage.save(function (err1, result2) {
                                if (err1) {
                                    console.log(err1);
                                }
                                else {
                                    Brand.update({brand_name: brand_name}, {
                                        $push: {
                                            dosage_id: result2._id
                                        }
                                    }).exec(function (err2) {
                                        if (err2) {
                                            console.log(err2);
                                        }
                                        else {
                                            res.send("Dosage added successfully with strength");
                                        }
                                    });
                                }
                            });
                        }
                    });
                }
            },
            function (result1) {
                if (result1) {
                    res.send("Medicines already exists");
                }
                else {
                    var strength = new Strength({
                        strengths: strengths,
                        //strength_unit : strength_unit,
                        potent_substance: {
                            name: potent_name,
                            molecule_strength: potent_strength
                        },
                        brands_id: brandresult,
                        packaging: packaging,
                        price: price,
                        dose_taken: dose_taken,
                        dose_timing: dose_timing,
                        warnings: warnings,
                        prescription: prescription
                    });
                    strength.save(function (err, result1) {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            Dosage.update({dosage_form: dosage_form}, {
                                $push: {strength_id: result1._id}
                            }).exec(function (err2) {
                                if (err2) {
                                    console.log(err2);
                                }
                                else {
                                    res.send("strength added successfully");
                                }
                            });
                        }
                    });
                }
            }
        ],
        function (err) {
            if (err) {
                console.log(err);
            }
            else {
                res.send("done");
            }
        });
});

app.get('/findcompany',function (req,res) {
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

app.get('/go_to_brand',function (req,res) {
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

app.get('/go_to_dosage',function (req,res) {
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

app.get('/go_to_strength',function (req,res) {
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

app.get('/findbrand',function (req,res) {
    var brand = req.query.brand;
    Brand.find({categories : brand}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            var data = {};
            data['result'] = [];
            for (var i=0; i<result.length; i++) {
                data['result'][i] = {brand : result[i].brand_name};
            }
            res.send(data);
            //res.render('findbrand', {data: result});
        }
    });
});

app.get('/findingredients',function (req,res) {
    Strength.find().exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            var data = {};
            data['result'] = [];
            for (var i=0; i<result.length; i++) {
                for (var j = 0; j < result[i].active_ingredients.length; j++) {
                    data['result'][i] = {ingredients: result[i].active_ingredients[j].name};
                }
            }
            res.render('findingredients', {data: data});
        }
    });
});

app.get('/disease',function (req,res) {
    res.render('disease');
});

app.post('/diseases',function (req,res) {
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

    Disease.find({disease_name : disease_name},function (err,result) {
        if (err) {
            console.log(err);
        }
        else {
            if (result != "") {
                res.send({message : "Disease already exists"});
            }
            else {
                var disease = new Disease({
                    disease_name: disease_name,
                    symptoms: symptoms,
                    risk_factor: risk_factor,
                    cause: cause,
                    diagnosis: {
                        subhead : diagnosis_subhead,
                        info : diagnosis_info
                    },
                    organs: {
                        subhead : organ_subhead,
                        info : organ_info
                    },
                    treatment: treatment,
                    outlook: outlook,
                    prevention: prevention,
                    source : source
                });
                disease.save(function (err,result1) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        async.each(result1.organs.subhead,function(organ,callback){
                            var search = new Search({
                                name : organ
                            });
                            search.save(function(errs){
                                callback()
                            });
                        },function(errs,update){
                            res.send({message : "Disease saved successfully"});
                        });
                    }
                });
            }
        }
    });
});

// ************************************About Molecule ***************************************************


// molecule details
app.get('/molecule',function (req,res) {
    res.render('molecule');
});

app.post('/molecules',function (req,res) {
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
    var contradiction_subhead = req.body.subhead2_dosage;
    var contradiction_info = req.body.info2;
    var source = req.body.source;

    Molecule.find({molecule_name : molecule_name},function(error,results){
        if(error){
            console.log(error);
        }
        else{
            if(results != ""){
                res.send({message : 'molecule already exist'});
            }
            else{
                var molecule = new Molecule({
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
                    contradictions: {
                        subhead: contradiction_subhead,
                        info: contradiction_info
                    },
                    source: source
                });
                molecule.save(function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.send("Molecules details added");
                    }
                });
            }
        }
    });
});

// search molecule
app.get('/search_molecule',function (req,res) {
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

//======================= save profile pic ====================

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        // image name is set as number+orignal image name
        cb(null, req.session.dpname + file.originalname);
        //req.session.dpindbname = req.session.dpname + file.originalname;
    }
});

var upload = multer({
    storage: storage
});

app.get('/uploadimage', function (req,res) {
    res.render('rohitimage');
});

app.post('/uploadimage', upload.any(), function(req, res) {
    var path = req.files[0].path;
    //var imageName = req.session.dpindbname ;
    console.log(req.session.userID);
    User.update({_id : req.session.userID},{
        $set : {
            path : path
        }
    },function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
            //res.redirect('/health_care_provider?page=image');
            res.send({status: "success", message: "Image successfully registered"});
        }
    });
    routes.addImage(User, function(err) {
    });
});


//app.get('/health_care_provider?page=profile_doctor',function(req,res){

//});

//////////////////// try for free /////////////////////////////////////////
app.get('/userregister',function (req,res) {
    res.render('userregister');
});

app.post('/userregister', function (req, res) {
    var dob = req.body.dob;
    var gender = req.body.gender;
    var blood_group = req.body.blood_group;
    var marital_status = req.body.marital_status;
    var height = req.body.height;
    var weight = req.body.height;
    var addresses = req.body.address;
    var landmark = req.body.landmarks;
    var pincode = req.body.pincode;
    var city = req.body.city;
    var state = req.body.state;
    var aadhaar_number = req.body.aadhaar_number;
    var income = req.body.income;
    var rel_name = req.body.relative_name;
    var rel_contact = req.body.relative_contact;
    var relation = req.body.relation;
    bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(req.body.password, salt, function (err, hash) {
            if (err) {
                console.log(err);
            }
            else {
                var user = new User({
                    name: req.body.name,
                    email: req.body.email,
                    number: req.body.number,
                    password: hash,
                    dob: dob,
                    gender: gender,
                    blood_group: blood_group,
                    marital_status: marital_status,
                    height: height,
                    weight: weight,
                    address: {
                        address: addresses,
                        landmarks: landmark,
                        pin_code: pincode,
                        city: city,
                        state: state
                    },
                    aadhaar_number: aadhaar_number,
                    income: income,
                    relative_name: rel_name,
                    relative_contact: rel_contact,
                    relation: relation
                });
                user.save(function (err, results) {
                    if (err) {
                        console.log(err);
                        res.end();
                    } else {
                        res.send({status: "success", message: "successfully registered"});
                        res.end();
                    }
                });
            }
        });
    });
});

/////////////////////////medicine shows ////////////////////////////////////////////////////////////////////////////////

////////////by Brands////////////////////////////

app.get('/findbrands',function (req,res) {
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

app.get('/findcategory',function (req,res) {
    Brand.find().exec(function (err,result) {
        res.render('category',{data : result});
    });
});

app.get('/searchdisease',function (req,res) {
    res.render('searchdisease');
});

app.post('/searchdisease',function (req,res) {
    var disease = req.body.disease;
    Brand.find({primarily_used_for : disease}).populate({path : 'dosage_id',populate : {path : 'strength_id'}}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        res.render('diseasebrands',{data : result})
    });
});

/////////my molecule//////////////////////////////

app.get('/searchmolecule',function (req,res) {
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

////////////////////////////////////////// register as a doctor and user ///////////////////////////////////////////////

app.get('/doctorasuser',function (req,res) {
    res.render('doctoruser');
});

app.get('/pharmaasuser',function (req,res) {
    res.render('pharmauser');
});


///////////////////////////////////////Doctor  Profile Insert //////////////////////////////////////////////////////////


app.get('/health_care_provider',function(req,res) {
    var page = 'home';
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

    if(req.query.molecule) {

        Molecule.find({molecule_name : molecule}).sort({molecule_name:1}).exec(function (err,result) {
            if (err) {
                console.log(err);
            }
            else {
                if(molecule != "") {
                    res.render('home_profile_doctor',
                        {
                            page: 'molecule_data_view',
                            data: result
                        });
                }
                else{
                    res.send({details : "failure", message : "No such molecule exist"});
                }
            }
        })
    }

    if(req.query.disease) {

        Disease.find({disease_name : disease}).sort({disease_name:1}).exec(function (err,disease) {
            if (err) {
                console.log(err);
            }
            else {
                if(disease != "") {
                    res.render('home_profile_doctor',
                        {
                            page: 'disease_data_view',
                            data: disease
                        });
                }
                else{
                    res.send({details : "failure", message : "No such disease exist"});
                }
            }
        });
    }

    if(req.query.page == 'drug_data') {

        Brand.find({},'-_id brand_name types categories').populate(
            {path : 'dosage_id', select : '-_id dosage_form',populate :
                {path : 'strength_id', select : '-_id strength strengths packaging potent_substance.name potent_substance.molecule_strength'}
            }).populate({path : 'company_id', select: '-_id company_name'}).sort({brand_name : 1}).exec(function (err,brand) {
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

    if((!req.query.page) && (!req.query.brand) && (!req.query.molecule) && (!req.query.disease)) {

        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help') {
                    page = req.query.page;
                }
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }
});

app.post('/health_care_provider',function(req,res) {
    var page = 'home';
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

    if(req.query.molecule) {

        Molecule.find({molecule_name : molecule}).sort({molecule_name:1}).exec(function (err,result) {
            if (err) {
                console.log(err);
            }
            else {
                if(molecule != "") {
                    res.render('home_profile_doctor',
                        {
                            page: 'molecule_data_view',
                            data: result
                        });
                }
                else{
                    res.send({details : "failure", message : "No such molecule exist"});
                }
            }
        })
    }

    if(req.query.disease) {

        Disease.find({disease_name : disease}).sort({disease_name:1}).exec(function (err,disease) {
            if (err) {
                console.log(err);
            }
            else {
                if(disease != "") {
                    res.render('home_profile_doctor',
                        {
                            page: 'disease_data_view',
                            data: disease
                        });
                }
                else{
                    res.send({details : "failure", message : "No such disease exist"});
                }
            }
        });
    }

    if(req.query.page == 'drug_data') {

        Brand.find({},'-_id brand_name types categories').populate(
            {path : 'dosage_id', select : '-_id dosage_form',populate :
                {path : 'strength_id', select : '-_id strength strengths packaging potent_substance.name potent_substance.molecule_strength'}
            }).populate({path : 'company_id', select: '-_id company_name'}).sort({brand_name : 1}).exec(function (err,brand) {
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

    if((!req.query.page) && (!req.query.brand) && (!req.query.molecule) && (!req.query.disease)) {

        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help') {
                    page = req.query.page;
                }
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

// app.get('/drug_data_view',function (req,res) {
//    var brand = req.query.brand;
//
//     Brand.find({brand_name : brand},'-_id brand_name categories').populate(
//         {path : 'dosage_id', select : '-_id dosage_form',populate :
//             {path : 'strength_id', select : '-_id strength packaging potent_substance.name'}
//         }).populate(
//         {path : 'company_id', select: '-_id company_name'}).sort({brand_name : 1}).exec(function (err,brand) {
//         if (err) {
//             console.log(err);
//         }
//         else {
//             if(brand != "") {
//                 if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help') {
//                     page = req.query.page;
//                 }
//                 res.render('drug_data_view',{});
//             }
//             else{
//                 res.send({details : "failure", message : "No brand exist"});
//             }
//         }
//     });
//
// });

app.get('/testing',function(req,res) {
    res.render('imgtesting');
    res.end();
});

//////////////////////////////////////Doctor  Profile Insert ///////////////////////////////////////////////////////////
app.post('/professionals',function (req,res) {
    var name = req.body.name;
    var email = req.body.email;
    var number = req.body.number;
    var password = req.body.password;
    User.find({number : number},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result != ""){
                res.send({status : "failure", message : "User already exist"});
            }
            else{
                Doctor.find({number : number},function (err1,result1) {
                    if(err){
                        console.log(err);
                    }
                    else{
                        if(result1 != ""){
                            res.send({status : "failure", message : "Doctor already exist"});
                        }
                        else{
                            Pharma.find({number : number},function (err2,result2) {
                                if(err2){
                                    console.log(err2);
                                }
                                else{
                                    if(result2 != ""){
                                        res.send({status : "failure", message : "Doctor already exist"});
                                    }
                                    else{
                                        var professional = new Professional({
                                            name : name,
                                            email : email,
                                            number : number,
                                            password : password
                                        });
                                        professional.save(function (err3,result3) {
                                            if(err3){
                                                console.log(err3);
                                            }
                                            else{
                                                req.session.proID = result3._id;
                                                res.send({status : "success", message : "health_care registered"});
                                            }
                                        });
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
});

app.get('/doctor',function (req,res) {
    res.redirect('/health_care_provider?page=profile_doctor');
});

app.post('/doctor',function (req,res) {
    Professional.find({_id : req.session.proID}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else {
            if(result != "") {
                Doctor.find({number: result[0].number}, function (errs, results) {
                    if (errs) {
                        console.log(errs);
                    }
                    else {
                        if (results != "") {
                            res.redirect('/health_care_provider?page=profile_doctor');
                        }
                        else {
                            var doctor = new Doctor({
                                name: result[0].name,
                                email: result[0].email,
                                number: result[0].number,
                                password: result[0].password
                            });
                            doctor.save(function (err, results) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    req.session.doctorID = results._id;
                                    res.redirect('/health_care_provider?page=profile_doctor');
                                }
                            });
                        }
                    }
                });
            }
            else{
                res.send({details : "failure", message : "You already registered as Pharmacist"});
            }
        }
    });
});

app.post('/pharma',function (req,res) {
    Professional.find({_id : req.session.proID}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else {
            if(result != "") {
                Pharma.find({number: result[0].number}, function (errs, results) {
                    if (errs) {
                        console.log(errs);
                    }
                    else {
                        if (results != "") {
                            res.redirect('/health_care_provider?page=profile_pharmacist');
                        }
                        else {
                            var pharma = new Pharma({
                                name: result[0].name,
                                email: result[0].email,
                                number: result[0].number,
                                password: result[0].password
                            });
                            pharma.save(function (err, results) {
                                if (err) {
                                    console.log(err);
                                }
                                else {
                                    req.session.pharmaID = results._id;
                                    res.redirect('/health_care_provider?page=profile_pharmacist');
                                }
                            });
                        }
                    }
                });
            }
            else {
                res.send({details : "failure" , message : "You already registered as Doctor"});
            }
        }
    });
});

app.get('/doctorlogedin',function (req,res) {
    res.render('doctorlogedin');
});

app.post('/doctorlogedin',function (req,res) {
    var number = req.body.number;
    var password=req.body.password;

    Professional.find({number : number , password : password},function (err,result) {
        if (err) {
            console.log(err);
        }
        else {
            if (result != "") {
                req.session.doctorID = result[0]._id;
                if(req.session.doctorID) {
                    res.redirect('/health_care_provider');
                }
                else {
                    res.send({status: "failure", message: "some problem"});
                }
            }
            else {
                res.send({status: "failure", message: "can not loged in"});
            }
        }
    });
});

app.post('/profession',function (req,res) {
   var profession = req.body.profession;
           Doctor.update({_id : req.session.doctorID},{
               $set : {
                   occupation: profession
               }
           },function (err,result) {
               if(err)
               {
                   console.log(err);
               }
               else {
                   res.send({details : "success", message : "Profession added"});
           }
       });
});

app.post('/basic',function (req,res) {
    var title = req.body.title;
    var name = req.body.name;
    var email = req.body.email;
    var gender = req.body.gender;
    var city = req.body.city;
    var experience = req.body.experience;
    var about = req.body.about;

    Doctor.update({_id : req.session.doctorID},{
        $set : {
            title: title,
            name: name,
            email : email,
            gender : gender,
            city : city,
            year_of_experience : experience,
            About_you : about
        }
    },function (err) {
        if (err) {
            console.log(err);
        }
        else {
            Professional.remove({_id : req.session.proID},function (errs,results) {
                if(errs){
                    console.log(errs);
                }
                else{
                    Doctor.find({_id : req.session.doctorID},function (err1,result1) {
                        if(err1){
                            console.log(err);
                        }
                        else{
                            Pharma.remove({number : result1[0].number},function (err2) {
                                if(err2){
                                    console.log(err2);
                                }
                                else{
                                    res.send({status: "success", message: "Basic Details successfully updates"});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/education',function (req,res) {

    var qualification = req.body.qualification;
    var college = req.body.college;
    var completion = req.body.completion;
    var batch_to = req.body.batch_to;
    var batch_from = req.body.batch_from;
    var specialization = req.body.specialization;

    Doctor.update({_id : req.session.doctorID},{
        $set : {
            qualification : qualification,
            college : college,
            completion_year : completion,
            batch_from :batch_from,
            batch_to : batch_to,
            specialization : specialization
        }
    },function (err,result) {
        if(err){
            console.log(err);
        }
        else {
            Professional.remove({_id: req.session.proID}, function (errs, results) {
                if (errs) {
                    console.log(errs);
                }
                else {
                    Doctor.find({_id : req.session.doctorID},function (err1,result1) {
                        if(err1){
                            console.log(err);
                        }
                        else{
                            Pharma.remove({number : result1[0].number},function (err2) {
                                if(err2){
                                    console.log(err2);
                                }
                                else{
                                    res.send({status: "success", message: "Education successfully updates"});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/certificate',function (req,res) {
    //console.log('hi');
    var council_number = req.body.council_number;
    var council_name = req.body.council_name;
    var council_year = req.body.council_year;
    // var path = req.files[0].path;
    // var imageName = req.session.dpindbname ;
    // var path1 = req.files[0].path;
    // var imageName1 = req.session.dpindbname ;

    Doctor.update({_id : req.session.doctorID},{
        $set : {
            council_registration_number : council_number,
            council_name : council_name,
            council_registration_year : council_year
            // document : path,
            // certificate : path1
        }
    },function (err) {
        if (err) {
            console.log(err);
        }
        else {
            Professional.remove({_id: req.session.proID}, function (errs) {
                if (errs) {
                    console.log(errs);
                }
                else {
                    Doctor.find({_id : req.session.doctorID},function (err1,result1) {
                        if(err1){
                            console.log(err);
                        }
                        else{
                            Pharma.remove({number : result1[0].number},function (err2) {
                                if(err2){
                                    console.log(err2);
                                }
                                else{
                                    res.send({status: "success", message: "Document Details successfully updates"});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

////////////////pharma insert////////////////////////////////////////////

app.post('/pharma_profession',function (req,res) {
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

app.post('/pharma_basic',function (req,res) {
    var title = req.body.title;
    var name = req.body.name;
    var email = req.body.email;
    var gender = req.body.gender;
    var city = req.body.city;
    var experience = req.body.experience;
    var about = req.body.about;

    Pharma.update({_id : req.session.pharmaID},{
        $set : {
            title: title,
            name: name,
            email: email,
            gender : gender,
            city : city,
            year_of_experience : experience,
            About_you : about
        }
    },function (err) {
        if (err) {
            console.log(err);
        }
        else {
            Professional.remove({_id: req.session.proID}, function (errs, results) {
                if (errs) {
                    console.log(errs);
                }
                else {
                    Pharma.find({_id : req.session.pharmaID},function (err1,result1) {
                        if(err1){
                            console.log(err);
                        }
                        else{
                            Doctor.remove({number : result1[0].number},function (err2) {
                                if(err2){
                                    console.log(err2);
                                }
                                else{
                                    res.send({status: "success", message: "Basic Details successfully updates"});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/pharma_education',function (req,res) {

    var qualification = req.body.qualification;
    var college = req.body.college;
    var completion = req.body.completion;
    var batch_to = req.body.batch_to;
    var batch_from = req.body.batch_from;
    var specialization = req.body.specialization;

    Pharma.update({_id : req.session.pharmaID},{
        $set : {
            qualification : qualification,
            college : college,
            completion_year : completion,
            batch_from :batch_from,
            batch_to : batch_to,
            specialization : specialization
        }
    },function (err) {
        if (err) {
            console.log(err);
        }
        else {
            Professional.remove({_id: req.session.proID}, function (errs, results) {
                if (errs) {
                    console.log(errs);
                }
                else {
                    Pharma.find({_id : req.session.pharmaID},function (err1,result1) {
                        if(err1){
                            console.log(err);
                        }
                        else{
                            Doctor.remove({number : result1[0].number},function (err2) {
                                if(err2){
                                    console.log(err2);
                                }
                                else{
                                    res.send({status: "success", message: "Education successfully updates"});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/pharma_certificate',function (req,res) {
    var council_number = req.body.council_number;
    var council_name = req.body.council_name;
    var council_year = req.body.council_year;
    // var path = req.files[0].path;
    // var imageName = req.session.dpindbname ;
    // var path1 = req.files[0].path;
    // var imageName1 = req.session.dpindbname ;


    Pharma.update({_id : req.session.pharmaID},{
        $set : {
            council_registration_number : council_number,
            council_name : council_name,
            council_registration_year : council_year
            // document : path,
            // certificate : path1
        }
    },function (err,result) {
        if (err) {
            console.log(err);
        }
        else {
            Professional.remove({_id: req.session.proID}, function (errs) {
                if (errs) {
                    console.log(errs);
                }
                else {
                    Pharma.find({_id : req.session.pharmaID},function (err1,result1) {
                        if(err1){
                            console.log(err);
                        }
                        else{
                            Doctor.remove({number : result1[0].number},function (err2) {
                                if(err2){
                                    console.log(err2);
                                }
                                else{
                                    res.send({status: "success", message: "Document Details successfully updates"});
                                }
                            });
                        }
                    });
                }
            });
        }
    });
});

app.post('/doctorregistration',function(req,res){
    var name= req.body.name;
    var number = req.body.number;
    var email = req.body.email;
    var password = req.body.password;
    var doctor = new Doctor({
        name : name,
        number : number,
        email: email,
        password : password
    });
    doctor.save(function(err,result){
        if(err){
            console.log(err);
        }
        else {
            req.session.doctorID = result._id;
            //res.send({status : 'success', message : 'successfully registered'});
            res.redirect('/health_care_provider?page=profile');
        }
    })
});

app.post('/pharmaregistration',function(req,res){
    var name= req.body.name;
    var number = req.body.number;
    var email = req.body.email;
    var password = req.body.password;
    var pharma = new Pharma({
        name : name,
        number : number,
        email: email,
        password : password
    });
    pharma.save(function(err,result){
        if(err){
            console.log(err);
        }
        else {
            req.session.pharmaID = result._id;
            //res.send({status : 'success', message : 'successfully registered'});
            res.redirect('/health_care_provider?page=pharma_registered');
        }
    })
});

app.post('/healthcarelogin',function(req,res) {
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

//==========================Database connection===========================

//data base connection and opening port
var db = 'mongodb://localhost/Care';
mongoose.connect(db, {useMongoClient: true});


//=============================Start server========================
//connecting database and starting server
var database = mongoose.connection;
database.on('open', function () {
    console.log("database is connected");
    app.listen(app.get('port'), function () {
        console.log('server connected to http:localhost:' + app.get('port'));
    });
});


