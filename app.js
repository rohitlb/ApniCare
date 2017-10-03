// require dependicies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var promise = require('bluebird');
var session = require('express-session');
var cookieParser = require('cookie-parser');
mongoose.Promise = promise;

// req models
var User  = require('./model/registration');
// use after 
//var Drug = require('./model/drugindex');

//declare the app
var app = express();

// to hide X-Powered-By for Security,Save Bandwidth in ExpressJS(node.js)
app.disable('x-powered-by');

//configure the app
app.set('port',4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//set all middleware
app.use(bodyParser.json());
//exteended false means it won't be accepting nested objects (accept only single)
// here security for session to be added like.... session validate
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());
// if saveUninitialized : false than it will store session till the instance is in existence
// secret is hashing secret
app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true
}));


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
        res.render('home');
        res.end();
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

//registration

app.post('/register', function (req, res) {
        User.findOne({Number: req.body.number}).exec(function (err, result) {
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
                    var user = new User({
                        Name: req.body.name,
                        Number: req.body.number,
                        Password: req.body.password
                    });
                    user.save(function (err, results) {
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


// limitation :: if session id is the phone number than any one who knows the number of registered person can get unauthorised access.
//login with filter and sessio
app.post('/login',function (req,res) {
    User.findOne({Number: req.body.number , Password : req.body.password}).exec(function (err,result) {
        if(err){
            console.log("Some error occurred");
            res.send({status: "failure", message : "Some error occurred"});
            res.end();
        } else {
            console.log(result);
            if(result) {
                        console.log("Successfully login");
                        req.session.userID = req.body.number;
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
    app.get('/profile', function (req, res) {
        res.render('profile', {number: req.session.userID});
    });

//data base connection and opening port
    var db = 'mongodb://localhost/Works';
    mongoose.connect(db, {useMongoClient: true});

//connecting database and starting server
    var database = mongoose.connection;
    database.on('open', function () {
        console.log("database is connected");
        app.listen(app.get('port'), function () {
            console.log('server connected to http:localhost:' + app.get('port'));
        });
    });


// //Drug Registration with drug update feature
// app.get('/medicine', function (req,res) {
//     res.render('medicine');
//     res.end();
// });

// // medicine registration (Drug Index)
// app.post('/medicine',function (req,res) {
//     var company_name = req.body.company_name;
//     var brand_name = req.body.brand_name;
//     var salt_name = req.body.salt_name;
//     var strength = req.body.strength;
//     var dosage = req.body.dosage;
//     var price = req.body.price;
//
//     Drug.findOne({
//         Company: {
//             $elemMatch: {
//                 Company_name: company_name, Brands: {
//                     $elemMatch: {
//                         Brand_name: brand_name, Salts: {
//                             $elemMatch: {
//                                 Salt_name: salt_name
//                             }
//                         }
//                     }
//                 }
//             }
//         }}, function (err, result) {
//         if (err) {
//             console.log(err);
//             res.end();
//         } else {
//             if(result) {
//                 console.log("Already Exist");
//             } else {
//                 Drug.findOne({
//                     Company: {
//                         $elemMatch: {
//                             Company_name: company_name, Brands: {
//                                 $elemMatch: {
//                                     Brand_name: brand_name
//                                 }
//                             }
//                         }
//                     }},function (err,result1) {
//                     if(err) {
//                         console.log(err);
//                     } else {
//                         if (result1) {
//                             Drug.update({"Company.Company_name": company_name}, {
//                                 $push : {"Company.0.Brands.$.Salts" : {
//                                     Salt_name : salt_name,
//                                     Strength : strength
//                                 }
//                                 }
//                             }).exec(function (err) {
//                                 if (err) {
//                                     console.log("there is an error");
//                                 } else {
//                                     res.send("Salt successfully added");
//                                 }
//                             });
//                         }    else {
//                             Drug.findOne({
//                                 Company: {
//                                     $elemMatch: {
//                                         Company_name: company_name
//                                     }
//                                 }},function (err,result1) {
//                                 if(err) {
//                                     console.log(err);
//                                 } else {
//                                     if (result1) {
//                                         console.log("Only Company Match");
//                                         Drug.update({"Company.Company_name": company_name}, {
//                                             $push : {
//                                                 "Company.$.Brands": {
//                                                     Brand_name : brand_name,
//                                                     Salts : {
//                                                         Salt_name : salt_name,
//                                                         Strength : strength
//                                                     },
//                                                     Dosage_form : dosage,
//                                                     Price : price
//                                                 }
//                                             }
//                                         }).exec(function (err) {
//                                             if (err) {
//                                                 console.log("there is an error");
//                                             } else {
//                                                 res.send("brand successfully added");
//                                             }
//                                         });
//                                     } else {
//                                         console.log("Not exist");
//                                         var drug = new Drug({
//                                             Company: [{
//                                                 Company_name: company_name,
//                                                 Brands: [{
//                                                     Brand_name: brand_name,
//                                                     Salts: [{
//                                                         Salt_name: salt_name,
//                                                         Strength: strength
//                                                     }],
//                                                     Dosage_form: dosage,
//                                                     Price: price
//                                                 }]
//                                             }]
//                                         });
//                                         drug.save(function (err,pass) {
//                                             if (err) {
//                                                 console.log(err);
//                                             } else {
//                                                 console.log(pass);
//                                                 console.log('full successfully save');
//                                                 res.send("done");
//                                             }
//                                         });
//                                     }
//                                 }
//                             });
//                         }
//                     }
//                 });
//             }
//         }
//     });
// });
