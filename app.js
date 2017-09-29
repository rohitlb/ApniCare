// require dependicies
var express = require('express');
var bodyparser = require('body-parser');
var path = require('path');
var mongoose = require('mongoose');
var promise = require('bluebird');
mongoose.Promise = promise;

var User  = require('./model/registration');
var Medicine = require('./model/drugindex');

//declare the app
var app = express();

//configure the app
app.set('port',4000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

//set all middleware
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname,'public')));

// test for Android
app.get('/test', function (req,res) {
    console.log('test');
    res.send(JSON.stringify({test : "test passed"}));
    res.render('test');

});

//front page
app.get('/',function (req,res) {
    res.render('index');
});

//registration with crosschecking of pre registered
app.get('/registration',function (req,res) {
    res.render('registration');
});


//registration with crosschecking of pre registered
app.post('/registration',function (req,res) {
    User.findOne({Number : req.body.number}).exec(function (err,result) {
        if (err) {
            console.log("Some error occured");
            res.end();
        }
        else {
            console.log(result);
            if (result) {
                console.log("User Alredy Exist");

                res.json({no : "already exist"});
                var result = {
                    success: "0",
                    message: "user already exists"
                };
                res.send(JSON.stringify(result));
                res.end();
            } else {
                var user = new User({
                    Name: req.body.name,
                    Number : req.body.number,
                    Password: req.body.password
                });
                user.save(function (err,results) {
                        console.log(results);
                        console.log('user save successfully');
                       // res.json({yes : "Welcome"});
                        res.end();
                });
            }
        }
    });
});

app.get('/DrugIndex',function (req,res) {
    res.render('medicine');
});


//entering new drugs to the database
app.post('/DrugIndex', function (req) {
    var medicine = new Medicine({
        Company : [{
            company_name: req.body.company_name,
            brand : [{
                name : req.body.brand_name,
                salt : req.body.salt,
                strength : req.body.strength,
                packaging : req.body.packaging,
                price : req.body.price

            }]
        }]
    });

    medicine.save(function (err,result) {
        if(err) {
            console.log(err);
        } else {
            console.log(result);
            console.log('Medicine saved Successfully');
        }
    });
});

//Profile page
app.get('/profile',function (req,res) {
    res.render('profile');
});

// incomplete = for listing the people reg
app.get('/find',function (req,res) {
    User.find({},function (err,result) {
        res.send(result);
    });
});

app.get('/login',function (req,res) {
    res.render('login');
});

app.post('/login',function (req,res) {
    User.findOne({Number: req.body.number , Password : req.body.password}).exec(function (err,results) {
        if(err){
            console.log("Some error occured");
            res.end();
        } else {
            console.log(results);
            if(results) {
                console.log("Successfully login");
                //res.send('Successfully login');
            //    res.json({yes : "success"});
                res.end();
            } else{
                console.log("check your name or password");
                //res.json({no : "Wrong no. or pwd"});
                var result = {
                    success: "0",
                    message: "Wrong Number or Password"
                };
                res.send(JSON.stringify(result));
                res.end();
            }
        }
    });
});

var db = 'mongodb://localhost/Works';
mongoose.connect(db,{ useMongoClient: true });
//start server
var database = mongoose.connection;
database.on('open',function () {
    console.log("database is connected");
    app.listen(app.get('port'), function () {
        console.log('server connected to http:localhost:' + app.get('port'));
    });
});
