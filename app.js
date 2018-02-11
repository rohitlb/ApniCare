// require dependencies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var favicon = require('serve-favicon');
var request = require('request');
var mongoose = require('mongoose');
var promise = require('bluebird');
var sleep = require('thread-sleep');
var session = require('express-session');
var fileParser = require('connect-multiparty')();
var cloudinary = require('cloudinary');
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var bcrypt = require('bcryptjs');
var mongoDBStore = require('connect-mongodb-session')(session);
mongoose.Promise = promise;
var async = require('async');
var keys = require('./private/keys');

// req model for feedback and need help
var Feedback = require('./model/adminfeedback');
var Needhelp = require('./model/needhelp');
var NeedhelpWL = require('./model/needhelpWL');


var User  = require('./model/registration');
var Doctor = require('./model/doctorregistration');
var Pharma = require('./model/pharma');
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
///Some Policies///
var Terms = require('./model/terms');
var FAQ = require('./model/faq');
var Policy = require('./model/policy');
var Licence = require('./model/open_source_licence');
//AdminPanel
var DrugData = require('./model/drugdatalive');
var DiseaseData = require('./model/diseasedatalive');
var MoleculeData = require('./model/moleculedatalive');
var CategoryData = require('./model/categorydatalive');


//declare the app
var app = express();

var store = new mongoDBStore({
    uri : 'mongodb://127.0.0.1/ApniCaresite',
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
//extended false means it won't be accepting nested objects (accept only single)
// here security for session to be added like.... session validate
app.use(bodyParser.urlencoded({extended : false}));
app.use(expressValidator());
app.use(express.static(path.join(__dirname,'public')));
// Handle 404

app.use(cookieParser());

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

//==================================Session Functions=============================

function requiresLogin(req, res, next) {
    if (req.session && ((req.session.userID) ||(req.session.doctorID) || (req.session.pharmaID))) {
        return next();
    } else {
        //var err = new Error('You must be logged in to view this page.');
        res.redirect('/');
    }
}

function userrequiresLogin(req, res, next) {
    if (req.session && req.session.userID) {
        return next();
    } else {
        //var err = new Error('You must be logged in to view this page.');
        res.redirect('/');
    }
}

function healthrequiresLogin(req, res, next) {
    if (req.session && ((req.session.doctorID) || (req.session.pharmaID))) {
        return next();
    } else {
        //var err = new Error('You must be logged in to view this page.');
        res.redirect('/');
    }
}

function adminrequiresLogin(req, res, next) {
    if (req.session && req.session.admin) {
        return next();
    } else {
        //var err = new Error('You must be logged in to view this page.');
        res.redirect('/');
    }
}

// app.get('/admin',function (req,res) {
//     var page = 'home';
//     if(page == 'home')
//     {
//         res.render('./admin/home_admin',
//             {
//                 page: page
//             });
//     }
//     //res.render('./admin/home_admin');
// });

//*************************************Feedback and needhelp*******************************************************************

app.post('/feedback' ,requiresLogin,  function (req,res) {
    var name;
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
            res.send({status: "success", message: "Thanks for feedback"});
        }
    });
});

app.post('/your_feedback',requiresLogin,function(req,res){
    if(req.session.userID){
        var person_id = req.session.userID;
    }
    if(req.session.doctorID){
        var person_id = req.session.doctorID;
    }
    if(req.session.pharmaID){
        var person_id = req.session.pharmaID;
    }
    Feedback.find({feedbackFrom : person_id},'',function(err,result){

    });
});

app.post('/needhelp' , function (req,res) {
    //console.log("pranjal");
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
            res.send({status: "failure", message: "Some error occured"});
        } else {
            res.send({status: "success", message: "We will Contact You soon"});
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
    console.log("reached");

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
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/.test(number);
    if(num === false){
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }
    var email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(req.body.email);
    if(email === false ){
        res.send({status: "failure", message: "please enter a valid email and try again"});
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
                        //var temp = JSON.parse(body);
                        //req.session.sid = temp.Details;
                        res.send({status: "success", message: "OTP sent to your number"});
                    }
                });
            }
            else{
                res.send({status: "failure", message: "number Already Exists"});
            }
        }
    });
});

app.post('/VerifyOTP',function (req, res) {
    var otp = req.body.number;
    console.log(otp);
    if(otp == 1234){
        res.send({status : 'success' , message : 'OTP verified'});
    }
    else{
        return;
    }
    // var options = { method: 'GET',
    //     url: 'http://2factor.in/API/V1/'+keys.api_key()+'/SMS/VERIFY/'+req.session.sid+'/'+otp,
    //     headers: { 'content-type': 'application/x-www-form-urlencoded' },
    //     form: {} };
    //
    // request(options, function (error, response, body) {
    //     if (error) throw new Error(error);
    //     var temp = JSON.parse(body);
    //     res.send({status : 'success' , message: temp.Status })
    // });
    req.session.sid = null;
});


// with real 2factor OTP service
//
// app.post('/sendOTP',function (req, res) {
//     var number = req.body.number;
//     //regex for checking whether entered number is indian or not
//     var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/.test(number);
//     if(num === false){
//         res.send({status: "failure", message: "wrong number ! please try again "});
//         return;
//     }
//     async.series({
//         Doctors: function (callback) {
//             Doctor.find({number: number}, function (err, result) {
//                 if (err) {
//                     console.log(err);
//                 }
//                 else {
//                     callback(null, result);
//                 }
//             });
//         },
//         Pharmas : function(callback){
//             Pharma.find({number : number},function(err,result){
//                 if(err){
//                     console.log(err);
//                 }
//                 else{
//                     callback(null,result);
//                 }
//             });
//         },
//         Users : function(callback){
//             User.find({number : number},function(err,result){
//                 if(err){
//                     console.log(err);
//                 }
//                 else{
//                     callback(null,result);
//                 }
//             });
//         }
//     },function(err,result){
//         if(err){
//             console.log(err);
//         }
//         else{
//             if(((result.Doctors.length === 0)&&(result.Pharmas.length === 0))&&(result.Users.length === 0)){
//                 var options = { method: 'GET',
//                     url: 'http://2factor.in/API/V1/'+keys.api_key()+'/SMS/'+number+'/AUTOGEN',
//                     headers: { 'content-type': 'application/x-www-form-urlencoded' },
//                     form: {} };
//
//                 request(options, function (error, response, body) {
//                     if (error) {
//                         throw new Error(error);
//                     }
//                     else {
//                         var temp = JSON.parse(body);
//                         req.session.sid = temp.Details;
//                         res.send({status: "success", message: "OTP sent to your number"});
//                     }
//                 });
//             }
//             else{
//                 res.send({status: "failure", message: "number Already Exists"});
//             }
//         }
//     });
// });
//
// app.post('/VerifyOTP',function (req, res) {
//     var otp = req.body.number;
//
//     var options = { method: 'GET',
//         url: 'http://2factor.in/API/V1/'+keys.api_key()+'/SMS/VERIFY/'+req.session.sid+'/'+otp,
//         headers: { 'content-type': 'application/x-www-form-urlencoded' },
//         form: {} };
//
//     request(options, function (error, response, body) {
//         if (error) throw new Error(error);
//         console.log(body);
//         var temp = JSON.parse(body);
//         res.send({status : 'success' , message: temp.Status });
//         req.session.sid = null;
//     });
// });


app.get('/', function (req, res) {
    if (req.session.userID) {
       res.redirect('/profile');
    }
    else{
        if(req.session.doctorID || req.session.pharmaID){
            res.redirect('/health_care_provider');
        }
        else{
            var page="index";
            res.render('index',{
                page : page
            });
            res.end();
        }
    }
});

//////////////// Molecule data ///////////////////

//User registration
app.post('/userregister', function (req, res) {
    console.log('done');
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
app.get('/profile',userrequiresLogin, function (req, res) {
    if (req.session.userID) {
        User.find({_id : req.session.userID},function(err,user){
            if(err){
                console.log(err);
            }
            else{
                var page = "profile";
                console.log(user[0].name);
                res.render('profile', {
                    page: page,
                    user : user[0].name
                });
                res.end();
            }
        });
    }
});

app.post('/doctorregister', function (req, res) {
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
                                password: hash
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

app.post('/pharmaregister', function (req, res) {
    console.log('reaches');
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
                                password: hash
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
app.get('/ApniCare/About',function (req,res) {
    var page= 'AboutUs';
    if(req.query.page=='AboutUs' || req.query.page=='Contact' || req.query.page=='NeedHelp' || req.query.page=='FeedBack')
        page= req.query.page;
                res.render('index',
                    {
                        page:page
                    });

});
//for basic info like disease,drug and molecule Information*******************************************************
app.get('/ApniCare/information',function (req,res) {
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
    console.log(molecule);
    Molecule.find({molecule_name : molecule},'-_id').exec(function (err, result) {
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
    console.log(disease);
    Disease.find({disease_name : disease},'-_id').exec(function (err, result) {
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
    var dosage = req.query.dosage;
    console.log(brand);
    console.log(dosage);
    Brand.find({brand_name : brand},'-_id brand_name categories types primarily_used_for').populate(
        {path : 'dosage_id', select : '-_id dosage_form',populate :
                {path : 'strength_id', select : '-_id strength packaging prescription dose_taken warnings price dose_timing potent_substance.name potent_substance.molecule_strength'}
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

// it takes name and give all info or list in array like disease ,brands , molecule etc
app.post('/searchspecific',function(req,res){
    console.log("searchspecific");
    var value = req.body.search;
    console.log(value);
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
            console.log(result);
            res.send({status : 'searchspecific' , data : result});
        }
    });
});

////////////For search during submitting//////////////

app.post('/brandsdata',function(req,res){
    var value = req.body.term;
    var spaceRemoved = value.replace(/\s/g, '');
    var search = new RegExp('^'+spaceRemoved,'i' );
    console.log("hey:"+value);
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

app.get('/companiesdata',function(req,res){
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

app.get('/moleculesdata',function(req,res){
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

app.get('/categoriesdata',function(req,res){
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

app.get('/diseasesdata',function(req,res){
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
//===================================for APP============================
app.get('/rohitsearching', function(req,res){
   res.render('rohitsearching');
   res.end();
});

app.post('/moleculeslist'/*,healthrequiresLogin*/,function(req,res){
    console.log("moleculeslist");
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

app.post('/brandslist'/*,healthrequiresLogin*/,function(req,res){
    console.log("brandslist");
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

app.post('/categorieslist'/*,healthrequiresLogin*/,function(req,res){
    console.log("categorieslist");
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

app.post('/diseaseslist'/*,healthrequiresLogin*/,function(req,res){
    console.log("diseaseslist");
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

app.post('/organslist'/*,healthrequiresLogin*/,function(req,res){
    console.log("organslist");
    var skip = parseInt(req.body.nskip);
    //            Search.find({name : search}, '-_id name').sort({"updated_at":-1}).sort({"created_at":-1}).skip(skip).limit(10).exec(function (err, result) {

    Search.find({name : search}, '-_id name').sort({"updated_at":-1}).sort({"created_at":-1}).skip(skip).limit(10).exec(function (err, result) {
        if (err) {
            console.log(err);
        }
        else{
            res.send({ message : "organs list" , data :result });
        }
    });
});

app.post('/symptomslist'/*,healthrequiresLogin*/,function(req,res){
    console.log("symptomslist");
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

// similar barnds + info + combination
// app.post('/formolecule',healthrequiresLogin,function (req,res) {
//     console.log("formolecule");
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

app.post('/formolecule',function (req,res){
    console.log("formolecule");
    console.log("page"+req.body.page );
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
        Strength.find({'potent_substance.name' : molecule},'-_id -__v -potent_substance._id '
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
                        //res.send(brand);
                        res.send({message : 'molecule brand', data: brand.data});
                    }
                });
            }
        });

    }
    if(req.body.page == 'combination'){
        Strength.find({'potent_substance.name' : molecule},'-_id -__v -submitted_by -potent_substance._id '
        ).populate({path: 'brands_id',select : '-_id' , populate: {path: 'dosage_id', select : '-_id -__v -strength_id ' , populate : {path : 'strength_id' , select :'-_id submitted_by'}}
        }).populate({path : 'brands_id', select : '-_id -__v',populate : {path : 'company_id' , select : "-_id -__v -brand_id"}}).sort({brand_name: 1}).skip(skip).limit(10).exec(function (err,brands) {
            if (err) {
                console.log(err);
            }
            else {
                res.send({message : 'molecule combination',data : brands});
            }
        });
    }
});

// similar disease + organ + symptom FILTERED + TAKES RAW
app.post('/DOSlist',healthrequiresLogin,function (req,res) {
    console.log("search_dos");
    var raw = req.body.search;
    var skip = parseInt(req.body.nskip);
    console.log(raw);
    console.log(typeof raw);
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
app.post('/similarbrands',healthrequiresLogin,function(req,res){
    console.log("similarbrands");
    var molecule = req.body.molecule;
    var strength = req.body.strength;
    console.log(molecule);
    console.log(strength);
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
app.post('/searchall',function (req,res) {
    var raw = req.body.search;
    console.log("searchall");
    console.log(raw);
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
            console.log(result);
            res.send({ message : "search all" , data :result });
        }
    });
});

//===================================for WEB============================
app.post('/searchspecificweb',function(req,res){
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
        Symptoms: function (callback) {  // gives organs sorted list
            Disease.find({symptoms : search}, '-_id symptoms').sort({"updated_at":-1}).sort({"created_at":-1}).exec(function (err, result) {
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

app.get('/searchsymptons',function(req,res){
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

app.get('/searchorgans',function(req,res){
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

app.get('/searchcategories',function(req,res){
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


// search molecule , brand, category and takes raw name for it
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

// take brand name and gives all information of any brand
app.post('/brandinfo', function(req,res){
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
app.post('/search_dos',function (req,res) {
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
app.post('/dos_info',function (req,res){
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

// takes brand name and give info of it
app.post('/readmore', function(req,res){
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

//*****************************************USER LOGIN*******************************************************************
//login with filter and session

app.post('/login',function (req,res) {
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
                req.session.userID = user[0]._id;
                res.send({status : 'success' , value : 'user'});
            }
            if(result.Doctor == true){
                req.session.doctorID = doctor[0]._id;
                res.send({status : 'success' , value : 'doctor'});
            }
            if(result.Pharma == true){
                req.session.pharmaID = pharma[0]._id;
                res.send({status : 'success' , value : 'pharma'});
            }
            if((result.User != true)&&(result.Doctor != true)&&(result.Pharma != true)){
                res.send({status : 'failure' , message : 'Wrong Credential'});
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
app.get('/logout',requiresLogin, function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

//***************************************Edit User Profile*****************************************************************

//***************Edit Name and Email **********************************

app.get('/verifypassword',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('verifypassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/verifypassword',userrequiresLogin,function (req,res) {

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

app.get('/updatenameandemail',userrequiresLogin,function (req,res) {
    if(req.session.userID){
        res.render('updatenameandemail');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/updatenameandemail',userrequiresLogin,function (req,res) {
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

app.get('/updatepassword',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('updatepassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/updatepassword',userrequiresLogin,function (req,res) {
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

app.get('/verifydetailspassword',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('verifydetailspassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/verifydetailspassword',userrequiresLogin,function (req,res) {
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

app.post('/userpersonalinfo',userrequiresLogin,function (req,res) {
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

app.post('/addresspassword',userrequiresLogin,function (req,res) {
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

app.get('/editaddress',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('editaddress');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/useraddress',userrequiresLogin,function (req,res) {
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

app.get('/confidentialpassword',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('confidentialpassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/confidentialpassword',userrequiresLogin,function (req,res) {
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

app.get('/editconfidential',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('editconfidential');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/editconfidential',userrequiresLogin,function (req,res) {
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

app.get('/emergencypassword',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('emergencypassword');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/emergencypassword',userrequiresLogin,function (req,res) {
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

app.get('/editemergency',userrequiresLogin,function (req,res) {
    if(req.session.userID) {
        res.render('editemergency');
    }
    res.send({status : "failure", message : "Please login first"});
});

app.post('/useremergency',userrequiresLogin,function (req,res) {
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

//////////////////////////////////////////Not Now///////////////////////////////////////////////////////////////////////
////////////////////////////////////////Insert Doctor///////////////////////////////////////////////////////////////////


//forgot password
app.post('/checkforgotpassword',function (req,res) {
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
                        req.session.sid = temp.Details;
                        req.session.updatenumber = number;
                        res.send({status: "success", message: "OTP sent to your number"});

                    }
                });
            }
            else {
                res.send({status: 'success', message: 'Please check your number'});
            }
        }
    });

});

app.post('/updateforgotpassword',function(req,res){
    var number = req.session.updatenumber;
    var password = req.body.password;
    if(password == null){
        res.send({status : 'success' , message : "Please enter some password"})
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
                                    req.session.userID = result.User[0]._id;
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

//forgot password for doctor
app.post('/doctorcheckforgotpassword',function (req,res) {
    var number = req.body.number;
    //regex for checking whether entered number is indian
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[6789]\d{9}|(\d[ -]?){10}\d$/.test(number);
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
app.post('/doctorupdatepassword',healthrequiresLogin,function (req,res) {
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

// ************************************About Molecule ***************************************************


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

//======================= save profile pic ====================================
//using cloudinary

app.get('/upload', function(res,res){
    res.render('rohitimage') ;
});


cloudinary.config({
    cloud_name: 'dgxhqin7e',
    api_key:    '825578459372821',
    api_secret: 'wk9ez8EkyiKVeGzGWD0rlUS1l0U'
});

app.post('/upload', fileParser, function(req, res){
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


//////////////////// try for free /////////////////////////////////////////

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

app.get('/health_care_provider',healthrequiresLogin,function(req,res) {
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
            //console.log(result);
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

app.post('/health_care_provider',healthrequiresLogin,function(req,res) {
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
            //console.log(result);
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

//////////////////////////////////////Doctor  Profile Insert ///////////////////////////////////////////////////////////

app.get('/doctor',function (req,res) {
    res.redirect('/health_care_provider?page=profile_doctor');
});

app.post('/profession',healthrequiresLogin,function (req,res) {
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

app.post('/basic',healthrequiresLogin,function(req,res) {
    var name = req.body.name;
    var title = req.body.title;
    var gender = req.body.gender;
    var city = req.body.city;
    var experience = req.body.experience;
    var about = req.body.about;
    console.log(name);
    console.log(title);
    console.log(gender);
    console.log(city);
    console.log(experience);
    console.log(about);

    Doctor.update({_id: req.session.doctorID}, {
        $set: {
            name : name,
            title : title,
            gender: gender,
            city: city,
            year_of_experience: experience,
            About_you : about
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

app.post('/education',healthrequiresLogin,function(req,res){
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

app.post('/certificate',healthrequiresLogin,function(req,res) {
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

app.post('/pharma_profession',healthrequiresLogin,function (req,res) {
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

app.post('/pharma_basic',healthrequiresLogin,function(req,res) {
    var name = req.body.name;
    var title = req.body.title;
    var gender = req.body.gender;
    var city = req.body.city;
    var experience = req.body.experience;
    var about = req.body.about;


    Pharma.update({_id: req.session.pharmaID}, {
        $set: {
            name : name,
            title : title,
            gender: gender,
            city: city,
            year_of_experience: experience,
            About_you : about
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

app.post('/pharma_education',healthrequiresLogin,function(req,res){
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

app.post('/pharma_certificate',healthrequiresLogin,function(req,res) {
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

app.post('/healthcarelogin',healthrequiresLogin,function(req,res) {
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

//=========================TERM AND CONDITION ,,FAQ ,,PRIVACY POLICY ,, OPEN SOURCE LICENCE ============================

app.post('/terms',function(req,res){
    var terms = req.body.terms;
    Terms.find({terms : terms},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.send({status : 'success' , data : result});
        }
    })
});

app.post('/faqs',function(req,res){
    var faqs = req.body.faqs;
    FAQ.find({faqs : faqs},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.send({status : 'success' , data : result});
        }
    })
});

app.post('/policy',function(req,res){
    var policy = req.body.policy;
    Policy.find({policy : policy},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.send({status : 'success' , data : result});
        }
    })
});

app.post('/licence',function(req,res){
    var licence = req.body.licence;
    Licence.find({licence : licence},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.send({status : 'success' , data : result});
        }
    })
});


//=========================Admin Panel==================================================================================

/////////insertData from User to make it live/////////////////////////

app.post('/drugData',healthrequiresLogin,function(req,res){
    var company_name = req.body.company_name;
    var brand_name = req.body.brand_name;
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
                                            if(result3 != ""){
                                                res.send({status : 'failure' , message : 'Drug Already Exist'});
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

app.post('/diseaseData',healthrequiresLogin,function(req,res) {
    var disease_name = req.body.disease_name;
    var symptoms = req.body.symptoms;
    var risk_factor = req.body.risk_factor;
    var cause = req.body.cause;
    //for diagnosis
    var diagnosis_subhead = req.body.subhead1; // heading
    console.log(diagnosis_subhead);
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

app.post('/moleculeData',healthrequiresLogin,function(req,res) {
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

//////admin Panel/////////////
app.get('/adminpanellink',function (req,res) {
    res.render('adminpanellink');
});

app.get('/adminloginpage',function(req,res){
    res.render('adminloginpage');
});

app.post('/adminLogin',function (req,res) {
    var username = req.body.username;
    var password = req.body.password;

    if((username == '8477922297') && (password == '8477922297' )){
        req.session.admin = 'Admin';
        res.render('adminPanel');
    }
    else{
        res.send({status : 'failure' , message : "Wrong credential"});
    }
});

app.get('/admin_home',adminrequiresLogin,function(req,res){
    async.parallel({
        user: function (callback) {
            User.find().count().exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        doctor: function (callback) {
            Doctor.find().count().exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        pharma: function (callback) {
            Pharma.find().count().exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        }
    },function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            res.render('adminHome',{result : result});
        }
    });
});

app.get('/admin_report',adminrequiresLogin,function(req,res){
    async.parallel({
        User : function (callback) {
            User.find({},'-_id name number session_device.platform session_device.ach session_in session_out').exec(
                function(err,result){
                    if(err){
                        console.log(err);
                    }
                    else{
                        callback(null,result);
                    }
                });
        },
        Doctor : function(callback){
            Doctor.find({},'-_id name number').exec(function(err,result){
                if(err){
                    console.log(err);
                }
                else{
                    callback(null,result);
                }
            });
        },
        Pharma : function (callback) {
            Pharma.find({},'-_id name number').exec(function(err,result){
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
            res.render('adminReport',{result : result});
        }
    });
});

////////////////////////////////////////Admin Account///////////////////////////////////////////////////////////////////
app.get('/admin_account',adminrequiresLogin,function(req,res){
    res.render('adminAccount');
});

app.get('/admin_accountUser',adminrequiresLogin,function(req,res){
    async.parallel({
        TotalUser : function (callback) {
            User.find().count().exec(function(err,result){
                if(err){
                    console.log(err);
                }
                else{
                    callback(null,result);
                }
            });
        },
        NewUser : function(callback){
            var now = new Date();
            var  today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            User.find({registered_at: {$gte: today}}).count().exec(function(err,result){
                if(err){
                    console.log(err);
                }
                else{
                    callback(null,result);
                }
            });
        },
        UserData : function (callback) {
            User.find({},'-_id name number status').exec(function(err,result){
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
            res.render('admin_accountUser',{result : result});
        }
    });
});

app.get('/blockUser',adminrequiresLogin,function(req,res){
    var number = req.query.number;
    console.log("here blocking"+number);
    User.update({number : number},{
        $set : {status : 'blocked'}
    },function (err) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/admin_accountUser');
        }
    });
});

app.get('/unblockUser',adminrequiresLogin,function(req,res){
    var number = req.query.number;
    console.log(number);
    User.update({number : number},{
        $set : {status : 'unblocked'}
    },function (err) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/admin_accountUser');
        }
    })
});

app.get('/admin_accountDoctor',adminrequiresLogin,function(req,res){
    async.parallel({
        TotalDoctor : function (callback) {
            Doctor.find().count().exec(function(err,result){
                if(err){
                    console.log(err);
                }
                else{
                    callback(null,result);
                }
            });
        },
        DoctorData : function (callback) {
            Doctor.find({},'-_id name number status').exec(function(err,result){
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
            res.render('admin_accountDoctor',{result : result});
        }
    });
});

app.get('/blockDoctor',adminrequiresLogin,function(req,res){
    var number = req.query.number;
    Doctor.update({number : number},{
        $set : {status : 'blocked'}
    },function (err) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/admin_accountDoctor');
        }
    });
});

app.get('/unblockDoctor',adminrequiresLogin,function(req,res){
    var number = req.query.number;
    Doctor.update({number : number},{
        $set : {status : 'unblocked'}
    },function (err) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/admin_accountDoctor');
        }
    })
});

app.get('/admin_accountPharma',adminrequiresLogin,function(req,res){
    async.parallel({
        TotalPharma : function (callback) {
            Pharma.find().count().exec(function(err,result){
                if(err){
                    console.log(err);
                }
                else{
                    callback(null,result);
                }
            });
        },
        PharmaData : function (callback) {
            Pharma.find({},'-_id name number status').exec(function(err,result){
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
            res.render('admin_accountPharma',{result : result});
        }
    });
});

app.get('/blockPharma',adminrequiresLogin,function(req,res){
    var number = req.query.number;
    Pharma.update({number : number},{
        $set : {status : 'blocked'}
    },function (err) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/admin_accountPharma');
        }
    });
});

app.get('/unblockPharma',adminrequiresLogin,function(req,res){
    var number = req.query.number;
    Pharma.update({number : number},{
        $set : {status : 'unblocked'}
    },function (err) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/admin_accountPharma');
        }
    })
});

app.get('/admin_accountBlocked',adminrequiresLogin,function(req,res){
    res.render('admin_accountBlocked');
});

app.get('/admin_accountBlockedAccountUser',adminrequiresLogin,function(req,res){
    User.find({status : 'blocked'},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render('admin_accountBlockedAccountUser',{data : result});
        }
    });
});

app.get('/admin_accountBlockedAccountHealthCare',adminrequiresLogin,function(req,res) {
    async.parallel({
        Doctor: function (callback) {
            Doctor.find({status: 'blocked'}, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    callback(null, result);
                }
            });
        },
        Pharma: function (callback) {
            Pharma.find({status: 'blocked'}, function (err, result) {
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
            res.render('admin_accountBlockedAccountHealthCare', {data: result});
        }
    });
});

/////////////////////////// Admin Add new contact/////////////

app.get('/admin_accountNewContact',adminrequiresLogin,function(req,res){
    res.render('admin_accountNewContact');
});

/////////////////////////////////////////////////Admin / Data Center ///////////////////////////////////////////////////

////////Drug Index/////////////////////////////
app.get('/admin_dataCenter',adminrequiresLogin,function(req,res){
    res.render('admin_dataCenter');
});

app.get('/admin_dataCenterDrug',adminrequiresLogin,function(req,res){
    Brand.find({},'-_id brand_name',function(err,brands){
        if(err){
            console.log(err);
        }
        else{
            res.render('admin_dataCenterDrug',{brands : brands});
        }
    });
});

app.get('/admin_dataCenterParticularDrug',adminrequiresLogin,function(req,res){
    var brand = req.query.brand;
    Brand.find({brand_name : brand},'-_id brand_name categories types primarily_used_for').populate(
        {path : 'dosage_id',select : '-_id dosage_form',populate :
            {path : 'strength_id', select : '-_id strength strengths packaging prescription dose_taken warnings price dose_timing potent_substance.name potent_substance.molecule_strength'}
        }).populate(
        {path : 'company_id', select: '-_id company_name'}).sort({brand_name : 1}).exec(function (err,brand) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('admin_dataCenterParticularDrug',{brand : brand});
        }
    });

});

////////Disease Index///////////////////////
app.get('/admin_dataCenterDisease',adminrequiresLogin,function(req,res){
    Disease.find({},'-_id',function(err,diseases){
        if(err){
            console.log(err);
        }
        else{
            res.render('admin_dataCenterDisease',{diseases : diseases});
        }
    });
});

app.get('/admin_dataCenterParticularDisease',adminrequiresLogin,function(req,res){
    var disease = req.query.disease;
    Disease.find({disease_name : disease},'-_id -diagnosis._id',function(err,diseases){
        if(err){
            console.log(err);
        }
        else{
            res.render('admin_dataCenterParticularDisease',{diseases : diseases});
        }
    });
});

//////////////Molecule Index/////////////

app.get('/admin_dataCenterMolecule',adminrequiresLogin,function(req,res){
    Molecule.find({},'-_id',function(err,molecules){
        if(err){
            console.log(err);
        }
        else{
            res.render('admin_dataCenterMolecule',{molecules : molecules});
        }
    });
});

app.get('/admin_dataCenterParticularMolecule',adminrequiresLogin,function(req,res){
    var molecule = req.query.molecule;
    Molecule.find({molecule_name : molecule},'-_id',function(err,molecules){
        if(err){
            console.log(err);
        }
        else{
            res.render('admin_dataCenterParticularMolecule',{molecules : molecules});
        }
    });
});

////////////////////////////////// Admin / Activity Queue //////////////////////////////////////////////////////////////

app.get('/admin_activityQueue',adminrequiresLogin,function(req,res){
    res.render('adminActivity');
});

////////////////////////Drug Data Live Process/////////

app.get('/admin_activityDrug',adminrequiresLogin,function(req,res){
    DrugData.find({},function(err,strengths){
        if(err){
            console.log(err);
        }
        else{
            if(strengths){
                var data = {};
                data['submitted'] = [];
                async.each(strengths,function (result,callback) {
                    async.parallel({
                        Doctor : function (callback) {
                            Doctor.find({_id : result.submitted_by},'-_id name number').exec(function(err,results){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    if(results != '') {
                                        if (!data['submitted']) { data['submitted'] = [];}
                                        data['submitted'].push({
                                            name: results[0].name,
                                            number: results[0].number,
                                            str_ticket : result.ticket
                                        });
                                        callback(null, data);
                                    }
                                    else{
                                        callback();
                                    }
                                }
                            });
                        },
                        Pharma : function (callback) {
                            Pharma.find({_id : result.submitted_by},'-_id name number').exec(function(err,results){
                                if(err){
                                    console.log(err);
                                }
                                else{
                                    if(results != '') {
                                        if (!data['submitted']) {
                                            data['submitted'] = [];
                                        } // to check if it is the first time you are inserting inside data['brand'], in which case it needs to be initialized.
                                        data['submitted'].push({
                                            name: results[0].name,
                                            number: results[0].number,
                                            str_ticket : result.ticket
                                        });
                                        callback(null, data);
                                    }
                                    else{
                                        callback();
                                    }
                                }
                            });
                        }
                    },function(err,results){
                        callback();
                    });
                },function (err,results) {
                    if(err){
                        console.log(err);
                    }
                    res.render('admin_activityDrug', {result : data});
                });
            }
        }
    });
});

app.get('/adminDrugDataInfo',adminrequiresLogin,function(req,res) {
    var ticket = req.query.str_ticket;
    DrugData.find({ticket : ticket}, function (err, strengths) {
        if (err) {
            console.log(err);
        }
        else {
            //console.log(strengths);
            res.render('adminDrugDataInfo',{result : strengths});
        }
    });
});

app.get('/adminDrugDataMakeLive',adminrequiresLogin,function(req,res,next){
    var str_ticket = req.query.str_ticket;
    DrugData.find({ticket : str_ticket},function(err,result) {
        if (err) {
            console.log(err);
        }
        else {
            res.locals.value1 = result;
            var dosage_form = result[0].dosage_form;
            var brand_name = result[0].brand_name;
            var categories = result[0].categories;
            var primarily_used_for = result[0].primarily_used_for;
            var company_name = result[0].company_name;
            var strengtH = result[0].strength;
            var types = result[0].types;
            var potent_name = result[0].potent_substance.name;
            var potent_strength = result[0].potent_substance.molecule_strength;
            var packaging = result[0].packaging;
            var price = result[0].price;
            var dose_taken = result[0].dose_taken;
            var dose_timing = result[0].dose_timing;
            var warnings = result[0].warnings;
            var prescription = result[0].prescription;
            var name = result[0].submitted_by;
            var ticket = result[0].ticket;
            var companyResult = null;
            async.waterfall([
                function (callback) {
                    Company.findOne({company_name: company_name}, function (err1, result) {
                        if (err1) {
                            console.log(err1);
                            throw new Error(err1);
                        }
                        else {
                            callback(null, result);
                        }
                    });
                },
                function (result, callback) {
                    if (result != null) {
                        res.locals.brandResult = result.brand_id;
                        companyResult = result._id;
                        res.locals.companyResult = companyResult;
                        Brand.findOne({_id : result.brand_id , brand_name: brand_name}, function (err2, result1) {
                            if (err2) {
                                console.log(err2);
                                throw new Error(err2);
                            }
                            else {
                                res.locals.value2 = result1;
                                next();
                            }
                        });
                    }
                    else {
                        Brand.findOne({brand_name: brand_name}, function (err3, result1) {
                            if (err3) {
                                console.log(err3);
                                throw new Error(err3);
                            }
                            else {
                                if (result1) {
                                    res.send({message : "other company cannot have same brand"});
                                }
                                else {
                                    var STRength = new Strength({
                                        strength: strengtH,
                                        potent_substance : {
                                            name: potent_name,
                                            molecule_strength: potent_strength
                                        },
                                        packaging: packaging,
                                        price: price,
                                        dose_taken: dose_taken,
                                        dose_timing: dose_timing,
                                        warnings: warnings,
                                        prescription: prescription,
                                        ticket : ticket
                                    });
                                    STRength.save(function (err4, result2) {
                                        if (err4) {
                                            console.log(err4);
                                            throw new Error(err4);
                                        }
                                        else {
                                            var dosage = new Dosage({
                                                dosage_form: dosage_form,
                                                strength_id: result2._id
                                            });
                                            dosage.save(function (err5, result3) {
                                                if (err5) {
                                                    console.log(err5);
                                                    throw new Error(err5);
                                                }
                                                else {
                                                    var brand = new Brand({
                                                        brand_name: brand_name,
                                                        categories: categories,
                                                        types: types,
                                                        primarily_used_for: primarily_used_for,
                                                        dosage_id: result3._id
                                                    });
                                                    brand.save(function (err6, result4) {
                                                        if (err6) {
                                                            console.log(err6);
                                                            throw new Error(err6);
                                                        }
                                                        else {
                                                            var company = new Company({
                                                                company_name: company_name,
                                                                brand_id: result4._id
                                                            });
                                                            company.save(function (err7, result5) {
                                                                if (err7) {
                                                                    console.log(err7);
                                                                    throw new Error(err7);
                                                                }
                                                                else {
                                                                    Brand.update({brand_name: brand_name}, {
                                                                        $set: {
                                                                            company_id: result5._id
                                                                        }
                                                                    }, function (err8) {
                                                                        if (err8) {
                                                                            console.log(err8);
                                                                        }
                                                                        else {
                                                                            Strength.update({_id: result2._id}, {
                                                                                $push: {
                                                                                    brands_id: result4._id
                                                                                }
                                                                            }, function (err9, result7) {
                                                                                if (err9) {
                                                                                    console.log(err9);
                                                                                }
                                                                                else {
                                                                                    Strength.update({_id: result2._id}, {
                                                                                        $set: {submitted_by: name}
                                                                                    }, function (err10) {
                                                                                        callback();
                                                                                    });
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
                }
            ],function(err,result){
                DrugData.remove({ticket : str_ticket},function(err11,result){
                    res.send({status : 'success' , message : 'Drug added successfully'});
                });
            });
        }
    });
});

app.get('/adminDrugDataMakeLive',adminrequiresLogin,function(req,res,next) {
    var value1 = res.locals.value1;
    var value2 = res.locals.value2;
    var brandResult = res.locals.brandResult;
    var companyResult = res.locals.companyResult;
    if (value2 != null) {
        Dosage.find({_id : value2.dosage_id , dosage_form : value1[0].dosage_form},function(err,result){
            if(err){
                console.log(err);
            }
            else{
                console.log("dosage is"+result);
                res.locals.value1 = value1;
                res.locals.value2 = result;
                res.locals.brandResult = brandResult;
                res.locals.companyResult = companyResult;
                next();
            }
        });
    }
    else {
        Dosage.findOne({dosage_form: value1[0].dosage_form}, function (err, result1) {
            if (err) {
                console.log(err);
                throw new Error(err);
            }
            else {
                var strength = new Strength({
                    strength: value1[0].strength,
                    potent_substance: {
                        name: value1[0].potent_substance.name,
                        molecule_strength: value1[0].potent_substance.molecule_strength
                    },
                    packaging: value1[0].packaging,
                    price: value1[0].price,
                    dose_taken: value1[0].dose_taken,
                    dose_timing: value1[0].dose_timing,
                    warnings: value1[0].warnings,
                    prescription: value1[0].prescription,
                    ticket : value1[0].ticket
                });
                strength.save(function (err, result) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var dosage = new Dosage({
                            dosage_form: value1[0].dosage_form,
                            strength_id: result._id
                        });
                        dosage.save(function (err1, result1) {
                            if (err1) {
                                console.log(err1);
                            }
                            else {
                                var brand = new Brand({
                                    brand_name: value1[0].brand_name,
                                    categories: value1[0].categories,
                                    types: value1[0].types,
                                    primarily_used_for: value1[0].primarily_used_for,
                                    dosage_id: result1._id
                                });
                                brand.save(function (err2, result2) {
                                    if (err2) {
                                        console.log(err2);
                                    }
                                    else {
                                        Company.update({company_name: value1[0].company_name}, {
                                            $push: {brand_id: result2._id}
                                        }).exec(function (err3) {
                                            if (err3) {
                                                console.log(err3);
                                            }
                                            else {
                                                Brand.update({brand_name: value1[0].brand_name}, {
                                                    $push: {
                                                        company_id: companyResult
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
                                                                Strength.update({_id: result._id}, {
                                                                    $set: {submitted_by: value1[0].submitted_by}
                                                                }, function (err8, result8) {
                                                                    DrugData.remove({_id: value1[0]._id}, function (err, result) {
                                                                        res.send({message : 'Drug added successfully'});
                                                                    });
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
                });
            }
        });
    }
});

app.get('/adminDrugDataMakeLive',adminrequiresLogin,function(req,res,next){
    var value1 = res.locals.value1;
    var value2 = res.locals.value2;
    var brandResult = res.locals.brandResult;
    var companyResult = res.locals.companyResult;
    if(value2 != ''){
        Strength.find({_id : value2.strength_id , strength : value1[0].strength},function(err,result){
            if(err){
                console.log(err);
            }
            else{
                res.locals.value1 = value1;
                res.locals.value2 = result;
                res.locals.brandResult = brandResult;
                res.locals.companyResult = companyResult;
                next();
            }
        });
    }
    else {
        Strength.findOne({strength: value1[0].strength}, function (err, result1) {
            if (err) {
                console.log(err);
                throw new Error(err);
            }
            else {
                var sTrength = new Strength({
                    strength: value1[0].strength,
                    potent_substance: {
                        name: value1[0].potent_substance.name,
                        molecule_strength: value1[0].potent_substance.molecule_strength
                    },
                    brands_id: brandResult,
                    packaging: value1[0].packaging,
                    price: value1[0].price,
                    dose_taken: value1[0].dose_taken,
                    dose_timing: value1[0].dose_timing,
                    warnings: value1[0].warnings,
                    prescription: value1[0].prescription,
                    ticket : value1[0].ticket
                });
                sTrength.save(function (err, result1) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        var dosage = new Dosage({
                            dosage_form: value1[0].dosage_form,
                            strength_id: result1._id
                        });
                        dosage.save(function (err1, result2) {
                            if (err1) {
                                console.log(err1);
                            }
                            else {
                                Brand.update({brand_name: value1[0].brand_name}, {
                                    $push: {
                                        dosage_id: result2._id
                                    }
                                }).exec(function (err2) {
                                    if (err2) {
                                        console.log(err2);
                                    }
                                    else {
                                        Strength.update({_id: result1._id}, {
                                            $set: {submitted_by: value1[0].submitted_by}
                                        }, function (err8, result8) {
                                            DrugData.remove({_id: value1[0]._id}, function (err, result) {
                                                res.send({message : 'Drug added successfully'});
                                            });
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

app.get('/adminDrugDataMakeLive',adminrequiresLogin,function(req,res) {
    var value1 = res.locals.value1;
    var value2 = res.locals.value2;
    var brandResult = res.locals.brandResult;
    console.log(value1);
    console.log(value2);
    if (value2 != "") {
        res.send({message: 'Medicine Already exist'});
    }
    else {
        var strength = new Strength({
            strength: value1[0].strength,
            potent_substance: {
                name: value1[0].potent_substance.name,
                molecule_strength: value1[0].potent_substance.molecule_strength
            },
            brands_id: brandResult,
            packaging: value1[0].packaging,
            price: value1[0].price,
            dose_taken: value1[0].dose_taken,
            dose_timing: value1[0].dose_timing,
            warnings: value1[0].warnings,
            prescription: value1[0].prescription,
            ticket : value1[0].ticket
        });
        strength.save(function (err, result1) {
            if (err) {
                console.log(err);
            }
            else {
                Dosage.update({dosage_form: value1[0].dosage_form}, {
                    $push: {strength_id: result1._id}
                }).exec(function (err2) {
                    if (err2) {
                        console.log(err2);
                    }
                    else {
                        Strength.update({_id: result1._id}, {
                            $set: {submitted_by: value1[0].submitted_by}
                        }, function (err8, result8) {
                            DrugData.remove({_id: value1[0]._id}, function (err, result) {
                                res.send({message : 'Drug added successfully'});
                            });
                        });
                    }
                });
            }
        });
    }
});

///////////////////////////Disease Data Live Process

app.get('/admin_activityDisease',adminrequiresLogin,function(req,res){
    DiseaseData.find({},function(err,diseases){
        if(err){
            console.log(err);
        }
        else{
            var data = {};
            data['submitted'] = [];
            async.each(diseases,function (result,callback) {
                async.parallel({
                    Doctor : function (callback) {
                        Doctor.find({_id : result.submitted_by},'-_id name number').exec(function(err,results){
                            if(err){
                                console.log(err);
                            }
                            else{
                                if(results != '') {
                                    if (!data['submitted']) { data['submitted'] = [];}
                                    data['submitted'].push({
                                        name: results[0].name,
                                        number: results[0].number,
                                        disease : result.disease_name
                                    });
                                    callback(null, data);
                                }
                                else{
                                    callback(null,null);
                                }
                            }
                        });
                    },
                    Pharma : function (callback) {
                        Pharma.find({_id : result.submitted_by},'-_id name number').exec(function(err,results){
                            if(err){
                                console.log(err);
                            }
                            else{
                                if(results != '') {
                                    if (!data['submitted']) {
                                        data['submitted'] = [];
                                    } // to check if it is the first time you are inserting inside data['brand'], in which case it needs to be initialized.
                                    data['submitted'].push({
                                        name: results[0].name,
                                        number: results[0].number,
                                        disease : result.disease_name
                                    });
                                    callback(null, data);
                                }
                                else{
                                    callback();
                                }
                            }
                        });
                    }
                },function(err){
                    callback();
                });
            },function (err) {
                if(err){
                    console.log(err);
                }
                res.render('admin_activityDisease', {result : data});
            });
        }
    });
});

app.get('/adminDiseaseDataInfo',adminrequiresLogin,function(req,res){
    var disease = req.query.disease;
    DiseaseData.find({disease_name : disease},function(err,diseases){
        if(err){
            console.log(err);
        }
        else{
            res.render('adminDiseaseDataInfo',{result : diseases});
        }
    });
});

app.get('/adminDiseaseDataMakeLive',adminrequiresLogin,function(req,res){
    var disease = req.query.disease;
    DiseaseData.find({disease_name : disease},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            var diseases = new Disease({
                disease_name: result[0].disease_name,
                symptoms: result[0].symptoms,
                risk_factor: result[0].risk_factor,
                cause: result[0].cause,
                diagnosis: {
                    subhead : result[0].diagnosis.subhead,
                    info : result[0].diagnosis.info
                },
                organs: {
                    subhead : result[0].organs.subhead,
                    info : result[0].organs.info
                },
                treatment: result[0].treatment,
                outlook: result[0].outlook,
                prevention: result[0].prevention,
                source : result[0].source,
                submitted_by: result[0].submitted_by
            });
            diseases.save(function(errs){
                if(errs){
                    console.log(errs);
                }
                else{
                    async.each(result[0].organs.subhead,function(organ,callback){
                        var search  = new Search({
                            name : organ
                        });
                        search.save(function(organerr,organ){
                            if(organerr){
                                console.log(organerr);
                            }
                            else{
                                callback();
                            }
                        });
                    },function(organerr,organ){
                        if(organerr){
                            console.log(organerr);
                        }
                        else{
                            DiseaseData.remove({disease_name : disease},function(errors){
                                res.send({message : 'Disease successfully Added'});
                            });
                        }
                    });
                }
            });
        }
    });
});

/////////////////////////////Molecule data Live////////////////////////

app.get('/admin_activityMolecule',adminrequiresLogin,function(req,res){
    MoleculeData.find({},function(err,molecules){
        if(err){
            console.log(err);
        }
        else{
            var data = {};
            data['submitted'] = [];
            async.each(molecules,function (result,callback) {
                async.parallel({
                    Doctor : function (callback) {
                        Doctor.find({_id : result.submitted_by},'-_id name number').exec(function(err,results){
                            if(err){
                                console.log(err);
                            }
                            else{
                                if(results != '') {
                                    if (!data['submitted']) { data['submitted'] = [];}
                                    data['submitted'].push({
                                        name: results[0].name,
                                        number: results[0].number,
                                        molecule : molecules[0].molecule_name
                                    });
                                    callback(null, data);
                                }
                                else{
                                    callback();
                                }
                            }
                        });
                    },
                    Pharma : function (callback) {
                        Pharma.find({_id : result.submitted_by},'-_id name number').exec(function(err,results){
                            if(err){
                                console.log(err);
                            }
                            else{
                                if(results != '') {
                                    if (!data['submitted']) {
                                        data['submitted'] = [];
                                    } // to check if it is the first time you are inserting inside data['brand'], in which case it needs to be initialized.
                                    data['submitted'].push({
                                        name: results[0].name,
                                        number: results[0].number,
                                        molecule : molecules[0].molecule_name
                                    });
                                    callback(null, data);
                                }
                                else{
                                    callback();
                                }
                            }
                        });
                    }
                },function(err){
                    callback();
                });
            },function (err,result) {
                if(err){
                    console.log(err);
                }
                console.log(result);
                res.render('admin_activityMolecule', {result : data});
            });
        }
    });
});

app.get('/adminMoleculeDataInfo',adminrequiresLogin,function(req,res){
    var molecule = req.query.molecule;
    MoleculeData.find({molecule_name : molecule},function(err,molecules){
        if(err){
            console.log(err);
        }
        else{
            res.render('adminMoleculeDataInfo',{result : molecules});
        }
    });
});

app.get('/adminMoleculeDataMakeLive',adminrequiresLogin,function(req,res){
    var molecule = req.query.molecule;
    MoleculeData.find({molecule_name : molecule},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            var molecules = new Molecule({
                molecule_name: result[0].molecule_name,
                drug_categories: result[0].drug_categories,
                description: result[0].description,
                absorption: result[0].absorption,
                distribution: result[0].distribution,
                metabolism: result[0].metabolism,
                excretion: result[0].excretion,
                side_effect: result[0].side_effect,
                precaution: result[0].precaution,
                food: result[0].food,
                other_drug_interaction: {
                    subhead: result[0].other_drug_interaction.subhead,
                    info: result[0].other_drug_interaction.info
                },
                other_interaction: {
                    subhead: result[0].other_interaction.subhead,
                    info: result[0].other_interaction.info
                },
                dosage: {
                    subhead: result[0].dosage.subhead,
                    info: result[0].dosage.info
                },
                contraindications: {
                    subhead: result[0].contraindications.subhead,
                    info: result[0].contraindications.info
                },
                source: result[0].source,
                submitted_by : result[0].submitted_by
            });
            molecules.save(function(errs){
                if(errs){
                    console.log(errs);
                }
                else{
                    MoleculeData.remove({molecule_name : molecule},function(errors){
                        res.send({message : 'Molecule successfully Added'});
                    });
                }
            });
        }
    });
});

//////////////////////////Drug data Having Issue////////////

app.get('/adminDrugDataIssue',adminrequiresLogin,function(req,res){
    var ticket = req.query.str_ticket;
    req.session.adminIssue = ticket;
    res.render('adminDrugDataIssue');
});

app.post('/adminDrugDataIssueSend',adminrequiresLogin,function(req,res){
    var issue = req.body.drugIssue;
    var ticket = req.session.adminIssue;
    DrugData.find({ticket : ticket},function(err,name){
        if(err){
            console.log(err);
        }
        else{
            async.parallel({
                Doctor : function(callback){
                    Doctor.find({_id : name[0].submitted_by},function(errs,result){
                        if(errs){
                            console.log(errs);
                        }
                        else{
                            callback(null,result);
                        }
                    });
                },
                Pharma : function(callback){
                    Pharma.find({_id : name[0].submitted_by},function(errs,result){
                        if(errs){
                            console.log(errs);
                        }
                        else{
                            callback(null,result);
                        }
                    });
                }
            },function(errs,result){
                if(errs){
                    console.log(errs);
                }
                else{
                    if(result.Pharma != ""){
                        Pharma.update({_id : name[0].submitted_by},{
                            $push : {
                                issue : {
                                    issueType : 'Drug Index',
                                    issueIn : ticket,
                                    issueFrom : req.session.admin,
                                    issueInfo : issue
                                }
                            }
                        },function(uperr){
                            if(uperr){
                                console.log(uperr);
                            }
                            else{
                                res.send({message : 'Issue send to Pharma'});
                            }
                        });
                    }
                    if(result.Doctor != ""){
                        Doctor.update({_id : name[0].submitted_by},{
                            $push : {
                                issues : {
                                    issueType : 'Drug Index',
                                    issueIn : ticket,
                                    issueFrom : req.session.admin,
                                    issueInfo : issue
                                }
                            }
                        },function(uperr){
                            if(uperr){
                                console.log(uperr);
                            }
                            else{
                                res.send({message : 'Issue send to Doctor'});
                            }
                        });
                    }
                }
            });
        }
    });
});

app.get('/adminDiseaseDataIssue',adminrequiresLogin,function(req,res){
    var disease = req.query.disease;
    req.session.adminIssue = disease;
    res.render('adminDiseaseDataIssue');
});

app.post('/adminDiseaseDataIssueSend',adminrequiresLogin,function(req,res){
    var issue = req.body.diseaseIssue;
    var disease = req.session.adminIssue;
    DiseaseData.find({disease_name : disease},function(err,name){
        if(err){
            console.log(err);
        }
        else{
            async.parallel({
                Doctor : function(callback){
                    Doctor.find({_id : name[0].submitted_by},function(errs,result){
                        if(errs){
                            console.log(errs);
                        }
                        else{
                            callback(null,result);
                        }
                    });
                },
                Pharma : function(callback){
                    Pharma.find({_id : name[0].submitted_by},function(errs,result){
                        if(errs){
                            console.log(errs);
                        }
                        else{
                            callback(null,result);
                        }
                    });
                }
            },function(errs,result) {
                if (errs) {
                    console.log(errs);
                }
                else {
                    if (result.Pharma != "") {
                        Pharma.update({_id: name[0].submitted_by}, {
                            $push: {
                                issues: {
                                    issueType: 'Disease Index',
                                    issueIn: disease,
                                    issueFrom: req.session.admin,
                                    issueInfo: issue
                                }
                            }
                        }, function (uperr) {
                            if (uperr) {
                                console.log(uperr);
                            }
                            else {
                                res.send({message: 'Issue send to Pharma'});
                            }
                        });
                    }
                    if (result.Doctor != "") {
                        Doctor.update({_id: name[0].submitted_by}, {
                            $push: {
                                issues: {
                                    issueType: 'Disease Index',
                                    issueIn: disease,
                                    issueFrom: req.session.admin,
                                    issueInfo: issue
                                }
                            }
                        }, function (uperr) {
                            if (uperr) {
                                console.log(uperr);
                            }
                            else {
                                res.send({message: 'Issue send to Doctor'});
                            }
                        });
                    }
                }
            });
        }
    });
});

app.get('/adminMoleculeDataIssue',adminrequiresLogin,function(req,res){
    var molecule = req.query.molecule;
    req.session.adminIssue = molecule;
    res.render('adminMoleculeDataIssue');
});

app.post('/adminMoleculeDataIssueSend',adminrequiresLogin,function(req,res){
    var issue = req.body.moleculeIssue;
    var molecule = req.session.adminIssue;
    MoleculeData.find({molecule_name : molecule},function(err,name){
        if(err){
            console.log(err);
        }
        else{
            async.parallel({
                Doctor : function(callback){
                    Doctor.find({_id : name[0].submitted_by},function(errs,result){
                        if(errs){
                            console.log(errs);
                        }
                        else{
                            callback(null,result);
                        }
                    });
                },
                Pharma : function(callback){
                    Pharma.find({_id : name[0].submitted_by},function(errs,result){
                        if(errs){
                            console.log(errs);
                        }
                        else{
                            callback(null,result);
                        }
                    });
                }
            },function(errs,result){
                if(errs){
                    console.log(errs);
                }
                else {
                    if (result.Pharma != "") {
                        Pharma.update({_id: name[0].submitted_by}, {
                            $push: {
                                issues: {
                                    issueType: 'Molecule Index',
                                    issueIn: molecule,
                                    issueFrom: req.session.admin,
                                    issueInfo: issue
                                }
                            }
                        }, function (uperr) {
                            if (uperr) {
                                console.log(uperr);
                            }
                            else {
                                res.send({message: 'Issue send to Pharma'});
                            }
                        });
                    }
                    if (result.Doctor != "") {
                        Doctor.update({_id: name[0].submitted_by}, {
                            $push: {
                                issues: {
                                    issueType: 'Molecule Index',
                                    issueIn: molecule,
                                    issueFrom: req.session.admin,
                                    issueInfo: issue
                                }
                            }
                        }, function (uperr) {
                            if (uperr) {
                                console.log(uperr);
                            }
                            else {
                                res.send({message: 'Issue send to Doctor'});
                            }
                        });
                    }
                }
            });
        }
    });
});

app.get('/adminDataIssueInfo',adminrequiresLogin,function(req,res){
    var info = req.query.info;
    res.render('adminDataIssueInfo',{info : info});
});

////////////////////////// Admin / Activity/ Data Issue///////////

app.get('/admin_activityDataIssue',adminrequiresLogin,function(req,res){
    async.parallel({
        Doctor : function(callback){
            Doctor.find({},'-_id  name number issues.issueInfo issues.issueFrom issues.issueType',function(err,result){
                if(err){
                    console.log(err);
                }
                else{
                    callback(null,result);
                }
            });
        },
        Pharma : function(callback){
            Pharma.find({},'-_id name number issues.issueInfo issues.issueFrom issues.issueType',function(err,result){
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
            res.render('admin_activityDataIssue',{data : result});
        }
    });
});

///////////////////////////Admin / Feedback ///////////////////////////////////////////////////////////////////////////

app.get('/admin_feedback',adminrequiresLogin,function(req,res){
    res.render('admin_feedback');
});

/////// User Feedback/////////////
app.get('/admin_feedbackUser',adminrequiresLogin,function(req,res){
    Feedback.find({},'-_id',function(err,feedbacks){
        if(err){
            console.log(err);
        }
        else {
            var data = {};
            data['feedbacks'] = [];
            async.each(feedbacks, function (feedback,callback) {
                User.find({_id: feedback.feedbackFrom}, '-_id name number', function (errs, user) {
                    if (errs) {
                        console.log(errs);
                    }
                    else {
                        if(user != ""){
                            data['feedbacks'].push({
                                User_name: user[0].name,
                                User_number: user[0].number,
                                Categories: feedback.feedbackCategory,
                                Info: feedback.feedbackInfo,
                                Response: feedback.feedbackResponse,
                                Ticket: feedback.feedbackTicket
                            });
                            callback();
                        }
                        else{
                            callback();
                        }
                    }
                });
            },function(errs){
                if(err){
                    console.log(errs);
                }
                else{
                    res.render('admin_feedbackUser', {data: data});
                }
            });
        }
    });
});

app.get('/adminFeedbackInfoUser',adminrequiresLogin,function(req,res){
    var ticket = req.query.ticket;
    Feedback.find({feedbackTicket : ticket},function(err,info){
        if(err){
            console.log(err);
        }
        else {
            User.find({_id: info[0].feedbackFrom}, function (err, result) {
                if (err) {
                    console.log(err);
                }
                else {
                    var data = {};
                    data['feedbacks'] = [];
                    data['feedbacks'].push({
                        Name: result[0].name,
                        Number: result[0].number,
                        Categories: info[0].feedbackCategory,
                        Info: info[0].feedbackInfo,
                        Ticket: info[0].feedbackTicket
                    });
                    res.render('adminFeedbackInfoUser', {data: data});
                }
            });
        }
    });
});

//////// Health Care feedback////////

app.get('/admin_feedbackHealthCare',adminrequiresLogin,function(req,res){
    Feedback.find({},'-_id',function(err,feedbacks){
        if(err){
            console.log(err);
        }
        else {
            var data = {};
            data['feedbacks'] = [];
            async.each(feedbacks,function(feedback,callback) {
                async.parallel({
                    Doctor: function (callback) {
                        Doctor.find({_id: feedback.feedbackFrom}, '-_id name number', function (errs, doctor) {
                            if (errs) {
                                console.log(errs);
                            }
                            else {
                                callback(null, doctor);
                            }
                        });
                    },
                    Pharma: function (callback) {
                        Pharma.find({_id: feedback.feedbackFrom}, '-_id name number', function (errs, pharma) {
                            if (errs) {
                                console.log(errs);
                            }
                            else {
                                callback(null, pharma);
                            }
                        });
                    },
                    User : function(callback){
                        User.find({_id : feedback.feedbackFrom},function(err,user){
                            callback(null,user);
                        });
                    }
                }, function (errs, result) {
                    if (errs) {
                        console.log(errs);
                    }
                    else {
                        if (result.Doctor != "") {
                            data['feedbacks'].push({
                                Status: 'Dr',
                                Name: result.Doctor[0].name,
                                Number: result.Doctor[0].number,
                                Categories: feedback.feedbackCategory,
                                Info: feedback.feedbackInfo,
                                Ticket: feedback.feedbackTicket,
                                Response: feedback.feedbackResponse
                            });
                            callback();
                        }
                        if (result.Pharma != "") {
                            data['feedbacks'].push({
                                Status: 'DRx',
                                Name: result.Pharma[0].name,
                                Number: result.Pharma[0].number,
                                Categories: feedback.feedbackCategory,
                                Info: feedback.feedbackInfo,
                                Ticket: feedback.feedbackTicket,
                                Response: feedback.feedbackResponse
                            });
                            callback();
                        }
                        if(result.User != ""){
                            callback();
                        }
                        if ((result.Doctor != "") && (result.Pharma != "")) {
                            res.send({message: 'There is no feedback'});
                        }
                    }
                });
            },function(eacherror,eachresult){
                if(eacherror){
                    console.log(eacherror);
                }
                else{
                    res.render('admin_feedbackHealthCare', {data: data});
                }
            });
        }
    });
});

app.get('/adminFeedbackInfo',adminrequiresLogin,function(req,res){
    var ticket = req.query.ticket;
    Feedback.find({feedbackTicket : ticket},'-_id -__v',function(err,info){
        if(err){
            console.log(err);
        }
        else{
            async.parallel({
                Doctor : function(callback){
                    Doctor.find({_id : info[0].feedbackFrom},function(err,result){
                        if(err){
                            console.log(err);
                        }
                        else{
                            callback(null,result);
                        }
                    });
                },
                Pharma : function(callback){
                    Pharma.find({_id : info[0].feedbackFrom},function(err,result){
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
                    var data = {};
                    data['feedbacks'] =[];
                    if(result.Doctor != ""){
                        data['feedbacks'].push({
                            Name : result.Doctor[0].name,
                            Number : result.Doctor[0].number,
                            Categories : info[0].feedbackCategory,
                            Info : info[0].feedbackInfo,
                            Ticket : info[0].feedbackTicket
                        });
                        res.render('adminFeedbackInfo',{data : data});
                    }
                    if(result.Pharma != ""){
                        data['feedbacks'].push({
                            Name : result.Doctor[0].name,
                            Number : result.Doctor[0].number,
                            Categories : info[0].feedbackCategory,
                            Info : info[0].feedbackInfo,
                            Ticket : info[0].feedbackTicket
                        });
                        res.render('adminFeedbackInfo',{data : data});
                    }
                }
            });
        }
    });
});

app.get('/adminFeedbackResponse',adminrequiresLogin,function(req,res){
    var ticket = req.query.ticket;
    Feedback.find({feedbackTicket : ticket},'-_id feedbackTicket feedbackResponse',function(err,response){
        if(err){
            console.log(err);
        }
        else{
            res.render('adminFeedbackResponse',{data : response});
        }
    });
});

app.get('/adminFeedbackAddResponse',adminrequiresLogin,function(req,res){
    res.render('adminFeedbackAddResponse',{Ticket : req.query.ticket});
});

app.post('/adminFeedbackEnterResponse',adminrequiresLogin,function(req,res){
    var ticket = req.query.ticket;
    var response = req.body.response;
    console.log(ticket);
    console.log(response);
    Feedback.update({feedbackTicket : ticket},{
        $push : {
            feedbackResponse : response
        }
    },function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/admin_feedback');
        }
    });
});

app.post('/adminFeedbackEnterResponse',adminrequiresLogin,function(req,res){
    var ticket = req.query.ticket;
    var response = req.body.response;
    console.log(ticket);
    console.log(response);
    Feedback.update({feedbackTicket : ticket},{
        $push : {
            feedbackResponse : response
        }
    },function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/admin_feedback');
        }
    });
});

//////////////////PAGE NOT FOUND///////////////////////////////////////////////

app.use(function(req, res) {
    res.status(404).render('not_found');
});

// Handle 500
app.use(function(error, req, res, next) {
    res.status(500).send("Internal server error");
});

//==========================Database connection===========================

//data base connection and opening port
var db = 'mongodb://127.0.0.1/ApniCaresite';
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