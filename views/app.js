// require dependicies
var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var assert = require('assert');
var mongoose = require('mongoose');
var promise = require('bluebird');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var mongoDBStore = require('connect-mongodb-session')(session);
mongoose.Promise = promise;

// req models
var User  = require('./model/registration');
var Brand = require('./model/brand');
var Company = require('./model/company');
var Dosage = require('./model/dosage');
var Strength = require('./model/strength');
//declare the app
var app = express();

var store = new mongoDBStore({
    uri : 'mongodb://localhost/Duplicate',
    collection : 'mySessions'
});

store.on('error',function (error) {
    assert.ifError(error);
    assert.ok(false);
});

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
    cookie : {maxAge : 1000* 60 * 60 * 24 * 7},
    store : store,
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

//render logout page
app.get('/logout', function (req, res) {
    res.render('logout');
});

//logout the user
    app.get('/startlogout', function (req, res) {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            } else {
                res.redirect('/home');
            }
        });
    });

//render profile page of user
app.get('/profile', function (req, res) {
    res.render('profile', {number: req.session.userID});
});

app.get('/medicine',function (req,res) {
    res.render('medicine');
});


app.post('/medicine',function (req,res) {
    var dosage_form = req.body.dosage_form;
    var brand_name = req.body.brand_name;
    var company_name = req.body.company_name;
    var strength = req.body.strength;
    var active_ingredients = req.body.active_ingredients;
    var packaging = req.body.packaging;
    var price = req.body.price;

    Dosage.findOne({company_name: {$elemMatch: {name: company_name}},dosage_form: dosage_form}).exec(function(err,result) {
        if (err) {
            console.log(err);
        } else {
            if (result) {
                console.log("reaches");

                Company.findOne({brand_name: {elemMatch: {name: brand_name}}}, function (err1, result1) {
                    if (err1) {
                        console.log(err1);
                    } else {
                        if (result1) {
                            Brand.findOne({strength: {elemMatch: {quantity: strength}}}, function (err2, result2) {
                                if (err2) {
                                    console.log(err2);
                                } else {
                                    if (result2) {
                                        res.send("Medicine Already Exist");
                                    } else {
                                        Brand.update({brand_name: brand_name}, {
                                            $push: {strength: {quantity: strength}}
                                        }).exec(function (err3) {
                                            if (err3) {
                                                console.log(err3);
                                            } else {
                                                var strength = new Strength({
                                                    strength: strength,
                                                    packaging: packaging,
                                                    price: price,
                                                    active_ingredients: active_ingredients
                                                });
                                                strength.save(function (err4) {
                                                    if (err) {
                                                        console.log(err4);
                                                    } else {
                                                        res.send("All same but insert New Strength");
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            });
                        } else {
                            Company.update({company_name: company_name}, {
                                $push: {brand_name: {name: brand_name}}
                            }).exec(function (err5) {
                                if (err5) {
                                    console.log(err5);
                                } else {
                                    var brand = new Brand({
                                        brand_name: brand_name,
                                        strength: {quantity: strength}
                                    });
                                    brand.save(function (err6) {
                                        if (err6) {
                                            console.log(err6);
                                        } else {
                                            var strength = new Strength({
                                                strength: strength,
                                                packaging: packaging,
                                                price: price,
                                                active_ingredients: {name: active_ingredients}
                                            });
                                            strength.save(function (err7) {
                                                if (err7) {
                                                    console.log(err7);
                                                } else {
                                                    res.send("Insert new brand and update all");
                                                }
                                            });

                                        }

                                    })

                                }
                            });

                        }
                    }


                });
            } else {
                Dosage.findOne({dosage_form: dosage_form}, function (err8, result8) {
                    if (err8) {
                        console.log(err8);
                    } else {
                        if (result8) {
                            Dosage.update({dosage_form: dosage_form}, {
                                $push: {company_name: {name: company_name}}
                            }).exec(function (err9) {
                                if (err9) {
                                    console.log(err9);
                                } else {
                                    var company = new Company({
                                        company_name: company,
                                        brand_name: {name: brand_name}
                                    });
                                    company.save(function (err10) {
                                        if (err10) {
                                            console.log(err10);
                                            res.end();
                                        } else {
                                            var brand = new Brand({
                                                brand_name: brand_name,
                                                strength: {quantity: strength}
                                            });
                                            brand.save(function (err11) {
                                                if (err11) {
                                                    console.log(err11);
                                                } else {
                                                    var strength = new Strength({
                                                        strength: strength,
                                                        packaging: packaging,
                                                        price: price,
                                                        active_ingredients: {name: active_ingredients}
                                                    });
                                                    strength.save(function (err12) {
                                                            if (err12) {
                                                                console.log(err12);
                                                            } else {
                                                                res.send("create new company and all new");
                                                            }
                                                        }
                                                    )
                                                }
                                            });
                                        }
                                    });
                                }
                            });
                        } else {
                            Dosage.findOne({company_name: {elemMatch: {name: company_name}}}, function (err13,result13) {
                                if (err13) {
                                    console.log(err13);
                                    res.end();
                                } else {
                                    if (result13) {
                                        var dosage = new Dosage({
                                            dosage_form: dosage_form,
                                            company_name: {name: company_name}
                                        });
                                        dosage.save(function (err14) {
                                            if (err14) {
                                                console.log(err14);
                                            } else {
                                                var company = new Company({
                                                    company_name: company,
                                                    brand_name: {name: brand_name}
                                                });
                                                company.save(function (err10) {
                                                    if (err10) {
                                                        console.log(err10);
                                                        res.end();
                                                    } else {
                                                        var brand = new Brand({
                                                            brand_name: brand_name,
                                                            strength: {quantity: strength}
                                                        });
                                                        brand.save(function (err11) {
                                                            if (err11) {
                                                                console.log(err11);
                                                            } else {
                                                                var strength = new Strength({
                                                                    strength: strength,
                                                                    packaging: packaging,
                                                                    price: price,
                                                                    active_ingredients: {name: active_ingredients}
                                                                });
                                                                strength.save(function (err12) {
                                                                        if (err12) {
                                                                            console.log(err12);
                                                                        } else {
                                                                            res.send("create new dosage and company and all new");
                                                                        }
                                                                    }
                                                                )
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });

                                    } else {
                                        var dosage = new Dosage({
                                            dosage_form: dosage_form,
                                            company_name: {name: company_name}
                                        });
                                        dosage.save(function (err14) {
                                            if (err14) {
                                                console.log(err14);
                                            } else {
                                                var company = new Company({
                                                    company_name: company,
                                                    brand_name: {name: brand_name}
                                                });
                                                company.save(function (err10) {
                                                    if (err10) {
                                                        console.log(err10);
                                                        res.end();
                                                    } else {
                                                        var brand = new Brand({
                                                            brand_name: brand_name,
                                                            strength: {quantity: strength}
                                                        });
                                                        brand.save(function (err11) {
                                                            if (err11) {
                                                                console.log(err11);
                                                            } else {
                                                                var strength = new Strength({
                                                                    strength: strength,
                                                                    packaging: packaging,
                                                                    price: price,
                                                                    active_ingredients: {name: active_ingredients}
                                                                });
                                                                strength.save(function (err12) {
                                                                        if (err12) {
                                                                            console.log(err12);
                                                                        } else {
                                                                            res.send("create new dosage and company and all new");
                                                                        }
                                                                    }
                                                                )
                                                            }
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }
                            })
                        }
                    }
                });
            }
        }
    });
});






//data base connection and opening port
    var db = 'mongodb://localhost/Duplicate';
    mongoose.connect(db, {useMongoClient: true});

//connecting database and starting server
    var database = mongoose.connection;
    database.on('open', function () {
        console.log("database is connected");
        app.listen(app.get('port'), function () {
            console.log('server connected to http:localhost:' + app.get('port'));
        });
    });

