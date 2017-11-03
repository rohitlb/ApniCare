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
var expressValidator = require('express-validator');
var cookieParser = require('cookie-parser');
var keys = require('./private/keys');

var otp;

mongoose.Promise = promise;

// req models
var User  = require('./model/registration');
var Doctor = require('./model/doctorregistration');


// use after drug index schema implementation
// var Drug = require('./model/drugindex');

//declare the app
var app = express();

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
// if saveUninitialized : false than it will store session till the instance is in existence
// secret is hashing secret
// secret should be that much complex that one couldnt guess it easily
app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true
}));

app.get('/adminprofile',function (req,res) {
    res.render('admin_home1');
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

//user
app.post('/sendOTP',function (req, res) {

    var number = req.body.number;
    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
    if(num === false){
        console.log("wrong number entered");
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }

    User.findOne({Number : number},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
            if (result) {
                console.log("User Already Exist");
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
                        console.log(body);
                        var temp = JSON.parse(body);
                        console.log(temp.Details);
                        sid = temp.Details;
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
        console.log("wrong number entered");
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }

    Doctor.findOne({Number : number},function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
            if (result) {
                console.log("User Already Exist");
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
                        console.log(body);
                        var temp = JSON.parse(body);
                        console.log(temp.Details);
                        sid = temp.Details;
                        res.send({status: "success", message: "OTP sent to your number"});
                    }
                });
            }
        }
    });
});

app.post('/VerifyOTP',function (req, res) {
    otp = req.body.number;
    console.log(otp);

    var options = { method: 'GET',
        url: 'http://2factor.in/API/V1/'+keys.api_key()+'/SMS/VERIFY/'+sid+'/'+otp,
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        form: {} };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        console.log('verifyotp');
        console.log(body);
        var temp = JSON.parse(body);
        console.log(temp.Details);
        res.send({message: temp.Status })
        });
});

app.get('/home',function (req,res) {
    if (req.session.userID) {
        res.redirect('/profile');
        res.end();
    } else {
        res.render('home');
        res.end();
    }
});

app.get('/', function (req, res) {
        if (req.session.userID) {
            res.redirect('/profile');
            res.end();
        } else {
            res.render('home');
            res.end();
        }
    });

app.get('/register',function (req,res) {
    if (req.session.userID) {
        res.redirect('/profile');
        res.end();
    } else {
        res.render('home');
        res.end();
    }
});


var user_contact = null;
//User registration
app.post('/register', function (req, res) {
    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(req.body.number);
    if (num === false) {
        console.log("wrong number entered");
        res.send({Status: "failure", message: "wrong number ! please try again "});
        return;
    }
    // regex for checking whether password is numeric or not (pass iff pwd is numeric)
    var a = /[0-9]{4}/.test(req.body.password);
    if (a === false) {
        console.log(typeof req.body.password);
        console.log("password is not numeric");
        res.send({Status: "failure", message: "please enter a numeric password and try again"});
        return;
    }
    User.findOne({Number: req.body.number}).exec(function (err, result) {
        if (err) {
            console.log("Some error occured");
            res.end();
        } else {
            console.log(result);
            if (result) {
                console.log("User Already Exist");
                res.send({Status: "failure", message: "user Already Exists"});
                res.end();

            } else {
                var user = new User({
                    Name: req.body.name,
                    email : req.body.email,
                    Number: req.body.number,
                    Password: req.body.password
                });
                user.save(function (err, results) {
                    if (err) {
                        console.log("There is an error");
                        res.end();
                    } else {
                        console.log(results._id);
                        user_contact = results.Number;
                        console.log('user save successfully');
                        res.send({Status: "Success", message: "successfully registered"});
                        res.end();
                    }
                });
            }
        }
    });
});

app.get('/profiles',function (req,res) {
    res.render('profiles');
});
//user profile update
app.post('/profiles',function (req,res) {

    var dob = req.body.dob;
    var gender = req.body.gender;
    var blood_group = req.body.blood_group;
    var marital_status = req.body.marital_status;
    var height = req.body.height;
    var weight = req.body.height;
    var address = req.body.address;
    var aadhaar_number = req.body.aadhaar_number;
    var income = req.body.income;
    var contact = req.body.contact;
    var relation = req.body.relation;

    User.update({Number : user_contact}, {
        $set : {
            dob: dob,
            gender: gender,
            blood_group: blood_group,
            marital_status: marital_status,
            height: height,
            weight: weight,
            address: [address],
            adhaar_number: aadhaar_number,
            income: income,
            contact: contact,
            relation: relation
        }
    },function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            console.log(result);
            res.send("successfully updated");
        }
    });
});


//Doctor registration
app.post('/doctorregister', function (req, res) {
    //regex for checking whether entered number is indian or not
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(req.body.number);
    if (num === false) {
        console.log("wrong number entered");
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }
    // regex for checking whether password is numeric or not (pass iff pwd is numeric)
    var a = /[0-9]{4}/.test(req.body.password);
    if (a === false) {
        console.log("password is not numeric");
        res.send({status: "failure", message: "please enter a numeric password and try again"});
        return;
    }
    Doctor.findOne({Number: req.body.number}).exec(function (err, result) {
        if (err) {
            console.log("Some error occured");
            res.end();
        } else {
            console.log(result);
            if (result) {
                console.log("User Already Exist");
                res.send({status: "failure", message: "user Already Exists"});
                res.end();

            } else {
                var doctor = new Doctor({
                    Name: req.body.name,
                    Number: req.body.number,
                    Password: req.body.password

                });
                doctor.save(function (err, results) {
                    if (err) {
                        console.log("There is an error");
                        res.end();
                    } else {
                        console.log(results);
                        console.log('user save successfully');
                        res.send({status: "success", message: "successfully registered"});
                        //res.redirect('/login');
                        res.end();
                    }
                });
            }
        }
    });
});

var number = null;

//forgot password
app.post('/checkforgotpassword',function (req,res) {
    console.log("app");
    console.log(req.body.number);
     number = req.body.number;
     console.log(number);
    //regex for checking whether entered number is indian
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
    if(num === false){
        console.log("wrong number entered");
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }

    User.findOne({Number : number}, function (err,result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);

            if (result) {
                console.log("sending otp");
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
                        console.log(body);
                        var temp = JSON.parse(body);
                        console.log(temp.Details);
                        sid = temp.Details;
                        res.send({status: "success", message: "OTP sent to your number"});

                    }
                });

            }
            else {
                console.log("user is not registered");
                res.send({status: "failure", message: "this number is not registered"});
            }
        }

    });

});

//forgot password for doctor
app.post('/doctorcheckforgotpassword',function (req,res) {
    console.log("app");
    console.log(req.body.number);
    number = req.body.number;
    console.log(number);
    //regex for checking whether entered number is indian
    var num = /^(?:(?:\+|0{0,2})91(\s*[\ -]\s*)?|[0]?)?[789]\d{9}|(\d[ -]?){10}\d$/.test(number);
    if(num === false){
        console.log("wrong number entered");
        res.send({status: "failure", message: "wrong number ! please try again "});
        return;
    }

    Doctor.findOne({Number : number}, function (err,result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);

            if (result) {
                console.log("sending otp");
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
                        console.log(body);
                        var temp = JSON.parse(body);
                        console.log(temp.Details);
                        sid = temp.Details;
                        res.send({status: "success", message: "OTP sent to your number"});

                    }
                });

            }
            else {
                console.log("user is not registered");
                res.send({status: "failure", message: "this number is not registered"});
            }
        }

    });

});

//doc update password
app.post('/doctorupdatepassword',function (req,res) {
    console.log('updating password');
    console.log(req.body.number);
    console.log(number);
    var password = req.body.password;
    console.log(password);
    Doctor.update({Number : number},{
        $set : {Password : password}
    },function (err,result1) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(result1);
            res.send({status: "success", message: "new password update"});
            res.end();
        }
    });
});

app.post('/updatepassword',function (req,res) {
    console.log('updating password');
    console.log(req.body.number);
    console.log(number);
    var password = req.body.password;
    console.log(password);
    User.update({Number : number},{
        $set : {Password : password}
        },function (err,result1) {
        if (err) {
            console.log(err);
        }
        else {
            console.log(result1);
            res.send({status: "success", message: "new password update"});
            res.end();
        }
    });
});

//login with filter and session
app.post('/login',function (req,res) {
    console.log("login reaches here");
    User.findOne({Number: req.body.number , Password : req.body.password}).exec(function (err,result) {
        if(err){
            console.log("Some error occurred");
            res.send({Status: "failure", message : "Some error occurred"});
            res.end();
        } else {
            console.log(result);
            if(result) {
                        console.log("Successfully login");
                        req.session.userID = result._id;
                        if (req.session.userID) {
                            res.send({Status: "Success", message: "successfully login" ,number: req.session.userID});
                            res.end();
                        }
            } else {
                        console.log("check your name or password");
                        res.send({Status: "failure", message: "Can't login"});
                        res.end();
            }
        }
    });
});

//Doctor login
app.post('/doctorlogin',function (req,res) {
    console.log("login reaches here");
    Doctor.findOne({Number: req.body.number , Password : req.body.password}).exec(function (err,result) {
        if(err){
            console.log("Some error occurred");
            res.send({status: "failure", message : "Some error occurred"});
            res.end();
        } else {
            console.log(result);
            if(result) {
                console.log("Successfully login");
                req.session.userID = result._id;
                if (req.session.userID) {
                    res.send({status: "success", message: "successfully login" ,number: req.session.userID});
                    res.end();
                }
            } else {
                console.log("check your name or password");
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
            res.redirect('/register');
        }
    });
});

//render profile page of user
// app.get('/profile', function (req, res) {
//     res.render('profile', {number: req.session.userID});
// });

//data base connection and opening port
var db = 'mongodb://localhost/ApniCare';
mongoose.connect(db, {useMongoClient: true});

//connecting database and starting server
var database = mongoose.connection;
database.on('open', function () {
        console.log("database is connected");
        app.listen(app.get('port'), function () {
            console.log('server connected to http:localhost:' + app.get('port'));
        });
    });