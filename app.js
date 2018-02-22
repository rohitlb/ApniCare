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

var admin = require('./routes/admin');
var users = require('./routes/users');
var professionals = require('./routes/professionals');
var android = require('./routes/android');

var keys = require('./private/keys');

// req model for feedback and need help
var Feedback = require('./model/adminfeedback');
var Needhelp = require('./model/needhelp');
var NeedhelpWL = require('./model/needhelpWL');
var CategoryData = require('./model/categorydatalive');

var User  = require('./model/registration');
var Doctor = require('./model/doctorregistration');
var Pharma = require('./model/pharma');


//declare the app
var app = express();

var store = new mongoDBStore({
    uri : 'mongodb://127.0.0.1/ApniCare',
    collection : 'mySessions'
});

store.on('error',function (error) {
    assert.ifError(error);
    assert.ok(false);
});

// to hide X-Powered-By for Security,Save Bandwidth in ExpressJS(node.js)
app.disable('x-powered-by');

//configure the app
app.set('port',8000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// adding favicon of Apnicare
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//set all middleware
app.use(bodyParser.json());
//extended false means it won't be accepting nested objects (accept only single)
// here security for session to be added like.... session validate
app.use(logger('dev'));
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

app.use('/',android);
app.use('/health', professionals);
app.use('/users', users);
app.use('/admin',admin);



/////////////////////////////////////////START////////////////////////////////////////////////////////////////

function requiresLogin(req, res, next) {
    if (req.session && ((req.session.admin) || (req.session.userID) || (req.session.doctorID) || (req.session.pharmaID))) {
        return next();
    } else {
        res.render('/');
    }
}

function userrequiresLogin(req, res, next) {
    var rohit = req.body.sid;
    console.log("session ID = "+req.session.userID);
    if (req.session && req.session.userID) {
        return next();
    } else if(rohit) {
        return next();
    } else {
        //var err = new Error('You must be logged in to view this page.');
        res.send({status : "logout" , message : "Please Login First"});
        //res.redirect('/');
    }
}

function adminrequiresLogin(req, res, next) {
    if (req.session && req.session.admin) {
        return next();
    } else {
        //var err = new Error('You must be logged in to view this page.');
        res.send({status : "logout" , message : "Please Login First"});
        //res.redirect('/');
    }
}

//===============================================Rohit testing area=================================
app.get('/rohitsearching',function (req,res) {
    res.render('rohitsearching') ;
});

//===============================================middle wares=================================

//User registration


app.get('/', function (req, res) {
    if (req.session.userID) {
        res.redirect('/users/profile');
    }
    else{
        if(req.session.doctorID || req.session.pharmaID){
            res.redirect('/health/health_care_provider');
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

app.get('/adminlogin',function(req,res){
    if(req.session.admin){
        res.render('adminPanel');
    }
    else{
        res.render('adminloginpage');
    }
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
                res.send({status: "success", message: "OTP sent to your number"});
                // request(options, function (error, response, body) {
                //     if (error) {
                //         throw new Error(error);
                //     }
                //     else {
                //         var temp = JSON.parse(body);
                //         req.session.sid = temp.Details;
                //         res.send({status: "success", message: "OTP sent to your number"});
                //     }
                // });
            }
            else{
                res.send({status: "failure", message: "number Already Exists"});
            }
        }
    });
});

app.post('/VerifyOTP',function (req, res) {
    var otp = req.body.number;
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

app.post('/weblogin',function (req,res) {
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

//=================================================================================================================

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

//logout the user
app.get('/weblogout', function (req, res) {
    req.session.destroy(function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
});

///Category data insert and update in database

app.get('/categorydata',adminrequiresLogin,function(req,res){
    res.render('admin_categorydata');
});

app.post('/categorydata',adminrequiresLogin,function(req,res){

});

//*************************************Feedback and needhelp*******************************************************************

app.post('/feedback' ,requiresLogin,  function (req,res) {
    var name;
    var usefulness = req.body.usefulness;
    var suggestion = req.body.suggestion;
    var feedbackCategory = req.body.about;
    var ticket = req.body.token;

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
        feedbackCategory : feedbackCategory,
        feedbackTicket : ticket
    });

    feedback.save(function (err) {
        if (err) {
            console.log(err);
            res.send({status: "failure", message: "some error"});
        } else {
            res.send({status: "success", message: "Thanks for feedback"});
        }
    });
});

app.post('/needhelp' , function (req,res) {
    var subject = req.body.subject;
    var contact_message = req.body.contact_message;

    var needhelp = new Needhelp({
        //here user ID should be added
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

    needhelpWL.save(function (err, result) {
        if (err) {
            console.log(err);
            res.send({status: "failure", message: "some error"});
        } else {
            res.send({status: "success", message: "We will Contact you soon"});
        }
    });
});

//=========================TERM AND CONDITION ,,FAQ ,,PRIVACY POLICY ,, OPEN SOURCE LICENCE ============================

app.get('/terms',function(req,res){
    res.render('./staticpages/terms');
});

app.get('/faqs',function(req,res){
    res.render('./staticpages/faq');
});

app.get('/policy',function(req,res){
    res.render('./staticpages/policy');
});

app.get('/licence',function(req,res){
    res.render('./staticpages/opensource');
});

app.get('/licence',function(req,res){
    res.render('./staticpages/opensource');
});

app.get('/aboutus',function(req,res){
    res.render('./staticpages/aboutUs');
});


//////////////////PAGE NOT FOUND///////////////////////////////////////////////

app.use(function(req, res) {
    res.status(404).render('not_found');
});


// Handle 500
// app.use(function(error, req, res, next) {
//     res.status(500).send("Internal server error");
// });

module.exports = app;


//==========================Database connection===========================

//data base connection and opening port
var db = 'mongodb://127.0.0.1/ApniCare';
mongoose.connect(db);

//=============================Start server========================
//connecting database and starting server
var database = mongoose.connection;
database.on('open', function () {
    console.log("database is connected");
    app.listen(app.get('port'), function () {
        console.log('server connected to http://localhost:' + app.get('port'));
    });
});