// require dependicies
var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var promise = require('bluebird');
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
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname,'public')));

// test for Android app
app.get('/test', function (req,res) {
    console.log('test done by Android app');
    res.send(JSON.stringify({test : "test passed"}));
   // res.render('test');
});

// home page
app.get('/home',function (req,res) {
   res.render('home');
   res.end();
});


//NOT AVAILABLE
//front page
// app.get('/',function (req,res) {
//     res.render('index');
//     res.end();
// });

//registration with crosschecking of pre registrations
app.get('/registration',function (req,res) {
    res.render('register');
    res.end();
});


app.post('/registration',function (req,res) {
    User.findOne({Number : req.body.number}).exec(function (err,result) {
        if (err) {
            console.log("Some error occured");
            res.end();
        } else {
            console.log(result);
            if (result) {
                console.log("User Already Exist");
                res.send(JSON.stringify({failure : "user Already Exists"}));
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
                        res.send(JSON.stringify({success : "user save successfully"}));
                        res.end();
                    }
                });
            }
        }
    });
});


//Drug Registration with drug update feature
app.get('/medicine', function (req,res) {
    res.render('medicine');
    res.end();
});

app.post('/medicine',function (req,res) {
    var company_name = req.body.company_name;
    var brand_name = req.body.brand_name;
    var salt_name = req.body.salt_name;
    var strength = req.body.strength;
    var dosage = req.body.dosage;
    var price = req.body.price;

    Drug.findOne({
        Company: {
            $elemMatch: {
                Company_name: company_name, Brands: {
                    $elemMatch: {
                        Brand_name: brand_name, Salts: {
                            $elemMatch: {
                                Salt_name: salt_name
                            }
                        }
                    }
                }
            }
        }}, function (err, result) {
        if (err) {
            console.log(err);
            res.end();
        } else {
            if(result) {
                console.log("Already Exist");
            } else {
                Drug.findOne({
                    Company: {
                        $elemMatch: {
                            Company_name: company_name, Brands: {
                                $elemMatch: {
                                    Brand_name: brand_name
                                }
                            }
                        }
                    }},function (err,result1) {
                    if(err) {
                        console.log(err);
                    } else {
                        if (result1) {
                            Drug.update({"Company.Company_name": company_name}, {
                                $push : {"Company.0.Brands.$.Salts" : {
                                    Salt_name : salt_name,
                                    Strength : strength
                                }
                                }
                            }).exec(function (err) {
                                if (err) {
                                    console.log("there is an error");
                                } else {
                                    res.send("Salt successfully added");
                                }
                            });
                        }    else {
                            Drug.findOne({
                                Company: {
                                    $elemMatch: {
                                        Company_name: company_name
                                    }
                                }},function (err,result1) {
                                if(err) {
                                    console.log(err);
                                } else {
                                    if (result1) {
                                        console.log("Only Company Match");
                                        Drug.update({"Company.Company_name": company_name}, {
                                            $push : {
                                                "Company.$.Brands": {
                                                    Brand_name : brand_name,
                                                    Salts : {
                                                        Salt_name : salt_name,
                                                        Strength : strength
                                                    },
                                                    Dosage_form : dosage,
                                                    Price : price
                                                }
                                            }
                                        }).exec(function (err) {
                                            if (err) {
                                                console.log("there is an error");
                                            } else {
                                                res.send("brand successfully added");
                                            }
                                        });
                                    } else {
                                        console.log("Not exist");
                                        var drug = new Drug({
                                            Company: [{
                                                Company_name: company_name,
                                                Brands: [{
                                                    Brand_name: brand_name,
                                                    Salts: [{
                                                        Salt_name: salt_name,
                                                        Strength: strength
                                                    }],
                                                    Dosage_form: dosage,
                                                    Price: price
                                                }]
                                            }]
                                        });
                                        drug.save(function (err,pass) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                console.log(pass);
                                                console.log('full successfully save');
                                                res.send("done");
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

//Profile page
app.get('/profile',function (req,res) {
    res.render('profile');
    res.end();
});

// incomplete = for listing the people reg
app.get('/find',function (req,res) {
    User.find({},function (err,result) {
        res.send(result);
        res.end();
    });
});

//login with filter
app.get('/login',function (req,res) {
    res.render('login');
});


app.post('/login',function (req,res) {
    User.findOne({Number: req.body.number , Password : req.body.password}).exec(function (err,results) {
        if(err){
            console.log("Some error occured");
            res.send(JSON.stringify({failure : "some error occurred"}));
            res.end();
        } else {
            console.log(results);
            if(results) {
                console.log("Successfully login");
                res.send(JSON.stringify({name : 'res.body.name'}));

                res.end();
            } else{
                console.log("check your name or password");
                res.send(JSON.stringify({failure : "check your number"}));
                res.end();
            }
        }
    });
});



//
// // bad request error handler
// app.use(function (req, res, next) {
//     res.render('404');
//     res.end();
// });
//
// //server error handler
// app.use(function (err, req, res, next) {
//     res.render('500');
//     res.end();
// });
//
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