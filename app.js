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
var Drug = require('./model/drugindex');

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
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname,'public')));
app.use(cookieParser());
app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true
}));

app.get('/register',function (req,res) {
res.render('home');
    res.end();
});

app.post('/register',function (req,res) {
    User.findOne({Number : req.body.number}).exec(function (err,result) {
        if (err) {
            console.log("Some error occured");
            res.end();
        } else {
            console.log(result);
            if (result) {
                console.log("User Already Exist");
                res.send({status: "failure", message : "user Already Exists"});
                res.end();
            } else {
                var user = new User({
                    Name: req.body.name,
                    Number : req.body.number,
                    Password: req.body.password
                });
                user.save(function (err,results) {
                    if (err) {
                        console.log("There is an error");
                        res.end();
                    } else {
                        console.log(results);
                        console.log('user save successfully');
                        res.send({status: "success", message : "successfully registered"});
                        //res.redirect('/login');
                        res.end();
                    }
                });
            }
        }
    });
});

//Profile page
app.get('/profile',function (req,res) {
    res.render('profile');
    res.end();
});


//login with filter and session
app.get('/login',function (req,res) {
    if(req.session.userID) {
        res.redirect('/nextpage');
    } else {
        res.render('login');
    }
});
app.post('/login',function (req,res) {
    User.findOne({Number: req.body.number , Password : req.body.password}).exec(function (err,results) {
        if(err){
            console.log("Some error occurred");
            res.send(JSON.stringify({failure : "some error occurred"}));
            res.end();
        } else {

            if(results) {
                req.session.userID = req.body.number;
                console.log("Successfully login");
                res.end();
            }
            res.redirect('/nextpage');
        }
    });
});

// checking wither auth or not
app.get('/nextpage',function (req,res) {
    console.log(req.session.userID);
    if(req.session.userID) {
        res.render('profile', {number :req.session.userID});
    } else {
        console.log("check your name or password");
        res.send(JSON.stringify({failure : "check your number or password"}));
        res.end();

    }
});

//render logout page
app.get('/logout',function (req,res) {
    res.render('logout');
});

//logout the user
app.get('/startlogout',function (req,res) {
    req.session.destroy(function (err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/login');
        }
    });
});

//render preofile page of user
// app.get('/profile',function (req,res) {
//     res.render('profile',{number : req.session.userID});
// });


//data base connection and opening port
var db = 'mongodb://localhost/Works';
mongoose.connect(db,{ useMongoClient: true });

//connecting database and starting server
var database = mongoose.connection;
database.on('open',function () {
    console.log("database is connected");
    app.listen(app.get('port'), function () {
        console.log('server connected to http:localhost:' + app.get('port'));
    });
});
//
//
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
