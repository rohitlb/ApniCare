var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bluebird = require('bluebird');
var favicon = require('serve-favicon');
var path = require('path');

mongoose.Promise = bluebird;

var EmailList = require('./models/EmailList');
// req models for feedback and need help
var Feedback = require('./models/feedback');
var Needhelp = require('./models/needhelp');
var NeedhelpWL = require('./models/needhelpWL');


var User  = require('./models/registration');
var Doctor = require('./models/doctorregistration');
var Pharma = require('./models/pharma');
var Professional = require('./models/professional');
//require for medicine index
var Company = require('./models/company');
var Brand = require('./models/brand');
var Dosage = require('./models/dosage');
var Strength = require('./models/strength');
//require for disease
var Disease = require('./models/disease');
//require molecule
var Molecule = require('./models/molecule');

var app = express();

app.disable('x-powered-by');
app.set('view engine','pug');
app.set('port', process.env.APP_PORT || 3300);
app.set('env','production');

app.use(bodyParser.json());
app.use('/public',express.static(path.join(__dirname,'public')));
app.use(favicon(path.join(__dirname,'favicon.ico')));

app.get('/',function (req, res) {
    res.render('home');
    res.end();
});

app.post('/storemail',function (req, res) {

    var msg = {};

    if(!req.body.email){
        msg = {success: 0,message: "Please enter correct email"};
        res.send(JSON.stringify(msg));
        res.end();
        return;
    }

    var emailList = new EmailList(
        {
            email: req.body.email
        }
    );

    emailList.save(function (err) {
       if(err){
           msg = {success: 0,message: "Please try again or later"};
           res.send(JSON.stringify(msg));
           res.end();
           return;
       }

        msg = {success: 1,message: "Great! welcome to the Fraternity"};
        res.send(JSON.stringify(msg));
        res.end();
    });
});

app.use(function (req, res) {

    res.status(404);
    res.render('404');
});

//500 route handler
app.use(function (err,req, res,next) {

    res.status(500);
    res.render('500');
});

//////////////////////////// Health care provider///////////////////////////////////////////////

app.get('/health_care_provider',function(req,res) {
    var page = 'home';
    var brand = req.query.brand;
    var disease = req.query.disease;
    var molecule = req.query.molecule;

    if(req.query.page == 'profile') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }

    if(req.query.page == 'profile_student_doctor') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' ||  req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }

    if(req.query.page == 'profile_student_pharmacist') {
        Pharma.findOne({_id: req.session.pharmaID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' ||  req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
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

    if(req.query.page == 'profile_doctor') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_pharmacist' ||  req.query.page == 'profile_student_doctor' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
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
                {path : 'strength_id', select : '-_id strength strengths packaging prescription dose_taken warnings price dose_timing potent_substance.name'}
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

    if(req.query.page == 'profile_pharmacist') {
        Pharma.findOne({_id: req.session.pharmaID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }

    if(req.query.page == 'drug_data') {

        Brand.find({},'-_id brand_name types categories').populate(
            {path : 'dosage_id', select : '-_id dosage_form',populate :
                {path : 'strength_id', select : '-_id strength strengths packaging potent_substance.name'}
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
        Disease.find().populate({path : 'dosage_id',populate : {path : 'strength_id'}}).populate({path : 'company_id'}).sort({disease_name : 1}).exec(function (err,brand) {
            if (err) {
                console.log(err);
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' ||  req.query.page == 'profile_student_doctor' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: brand

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

app.post('/health_care_provider',function(req,res) {
    var page = 'home';
    var brand = req.query.brand;
    var disease = req.query.disease;
    var molecule = req.query.molecule;

    if(req.query.page == 'profile') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }

    if(req.query.page == 'profile_student_doctor') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' ||  req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }

    if(req.query.page == 'profile_student_pharmacist') {
        Pharma.findOne({_id: req.session.pharmaID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' ||  req.query.page == 'profile_student_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
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

    if(req.query.page == 'profile_doctor') {
        Doctor.findOne({_id: req.session.doctorID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_pharmacist' ||  req.query.page == 'profile_student_doctor' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
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
                {path : 'strength_id', select : '-_id strength strengths packaging prescription dose_taken warnings price dose_timing potent_substance.name'}
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

    if(req.query.page == 'profile_pharmacist') {
        Pharma.findOne({_id: req.session.pharmaID}, function (err, result) {
            if (err) {
                console.log(err)
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile_student_doctor' || req.query.page == 'profile' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: result

                    });
            }
        });
    }

    if(req.query.page == 'drug_data') {

        Brand.find({},'-_id brand_name types categories').populate(
            {path : 'dosage_id', select : '-_id dosage_form',populate :
                {path : 'strength_id', select : '-_id strength strengths packaging potent_substance.name'}
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
        Disease.find().populate({path : 'dosage_id',populate : {path : 'strength_id'}}).populate({path : 'company_id'}).sort({disease_name : 1}).exec(function (err,brand) {
            if (err) {
                console.log(err);
            }
            else {
                if (req.query.page == 'home' || req.query.page == 'profile_doctor' || req.query.page == 'profile_student_pharmacist' || req.query.page == 'profile' ||  req.query.page == 'profile_student_doctor' || req.query.page == 'profile_pharmacist' || req.query.page == 'drug_data' || req.query.page == 'molecule_data' || req.query.page == 'disease_data' || req.query.page == 'drug_data_form' || req.query.page == 'molecule_data_form' || req.query.page == 'disease_data_form' || req.query.page == 'feedback_contributions' || req.query.page == 'feedback_profile' || req.query.page == 'notifications' || req.query.page == 'need_help')
                    page = req.query.page;
                res.render('home_profile_doctor',
                    {
                        page: page,
                        data: brand

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

//////////////////////////// Feedback and need help //////////////////////////////////////////

app.post('/feedback' , function (req,res) {
    var usefulness = req.body.usefulness;
    var suggestion = req.body.suggestion;

    var feedback = new Feedback({
        usefulness : usefulness,
        suggestion : suggestion
    });

    feedback.save(function (err, result) {
        if (err) {
            console.log(err);
        } else {
            res.send("Thnx for the feedback")
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
        } else {
            res.send("We will contact you soon")
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
        } else {
            res.send("We will contact you soon")
        }
    });
});

////////////////////////////////////////// register as a doctor and user ///////////////////////////////////////////////

app.get('/doctorasuser',function (req,res) {
    res.render('doctoruser');
});

app.post('/doctorasuser',function (req,res) {
    var name = req.body.name;
    var email = req.body.email;
    var number = req.body.number;
    var password = req.body.password;

    User.find({number : number}).exec(function (err,result) {
        if(err){
            console.log(err);
        }
        else{
            if(result === ""){
                res.send({status: "failure", message: "User already exist"});
            }
            else{
                Doctor.find({number : number},function (err1,result1) {
                    if(err1){
                        console.log(err1);
                    }
                    else{
                        if(result1){
                            var doctor = new Doctor({
                                name: name,
                                email : email,
                                number: number,
                                password: password

                            });
                            doctor.save(function (err, results) {
                                if (err) {
                                    console.log(err);
                                    res.end();
                                } else {
                                    doctor_contact = results.number;
                                    res.send({status: "success", message: "successfully registered"});
                                    res.end();
                                }
                            });
                        }
                        else{
                            res.send({status: "failure", message: "Doctor already exist"});
                        }
                    }
                });
            }
        }
    });
});

//////////////////////////////////Drug index start from here////////////////////////////////////////////////////////////

app.get('/medicine',function (req,res) {
    // if(req.session.doctorID) {
    //     res.render('medicine');
    // }
    // res.send({status : "failure", message : "Please login first"});
    res.render('medicine');
});

app.post('/medicine',function(req,res) {
    var dosage_form = req.body.dosage_form;
    var brand_name = req.body.brand_name;
    var categories = req.body.categories;
    var primarily_used_for = req.body.primarily_used_for;
    var company_name = req.body.company_name;
    var strength = req.body.strength1;
    var strengths = req.body.strength2;
    //console.log(strengtHH);
    console.log(brand_name);
    console.log(company_name);
    console.log(categories);
    //console.log(company_name);
    console.log(strength);
    console.log(strengths);
    var types = req.body.types;
    var name = req.body.subhead111;
    var molecule_strength = req.body.subhead222;
    var packaging = req.body.packaging;
    var price = req.body.price;
    var dose_taken = req.body.dose_taken;
    var dose_timing = req.body.dose_timing;
    var warnings = req.body.warnings;
    var prescription = req.body.prescription;
    var companyresult = null;
    var brandresult = null;
    var subhead11 = [];
    // subhead11['subhead1'] = {};
    // for(var i=0;i<active_ingredients.length;i++){
    //     subhead11['subhead1'] = {
    //         subhead1 : active_ingredients
    //     }
    // }
    //
    // var subhead22 = [];
    // subhead22['subhead2'] = {};
    // for(var j=0;j<molecule_strengths.length;j++){
    //     subhead22['subhead2'] = {
    //         subhead2 : molecule_strengths
    //     }
    // }
    console.log(name);
    console.log(dosage_form);
    console.log(packaging);
    console.log(price);
    console.log(prescription);
    console.log(dose_taken);
    console.log(dose_timing);
    console.log(primarily_used_for);
    console.log(types);
    console.log(warnings);
    console.log(molecule_strength);

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
                                    strength: strength,
                                    strengths: strengths,
                                    potent_substance: {
                                        name: name,
                                        molecule_strength: molecule_strength
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
                                                                                console.log(err);
                                                                            }
                                                                            else {
                                                                                console.log(result7);
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
                        strength: strength,
                        strengths: strengths,
                        potent_substance: {
                            name: name,
                            molecule_strength: molecule_strength
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
                    Strength.findOne({strength: strength}, function (err, result1) {
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
                        strength: strength,
                        strengths: strengths,
                        potent_substance: {
                            name: name,
                            molecule_strength: molecule_strength
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
                        strength: strength,
                        strengths: strengths,
                        potent_substance: {
                            name: name,
                            molecule_strength: molecule_strength
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
    var subhead5 = req.body.subhead5;
    var info5 = req.body.info5;
    var subhead4 = req.body.subhead4;
    var info4 = req.body.info4;
    var subhead3 = req.body.subhead3;
    var info3 = req.body.info3;
    var subhead2 = req.body.subhead2_dosage;
    var info2 = req.body.info2;
    var food = req.body.food;
    var source = req.body.source;
    // // ......... Other drug interactions ............. //
    // console.log("test subhead5"+subhead5);
    // console.log("test subhead51"+subhead51);
    //
    // var subhead51 = [];
    // subhead51['subhead5'] = {};
    // for(var i5=0;i5<subhead5.length;i5++){
    //     subhead51['subhead5'] = {
    //         subhead5 : subhead5
    //     }
    // }
    // var subhead52 = [];
    // subhead52['info5'] = {};
    // for(var j5=0;j5<info5.length;j5++){
    //     subhead52['info5'] = {
    //         info5 : info5
    //     }
    // }
    //
    // // ............. Other interactions ............... //
    // var subhead41 = [];
    // subhead41['subhead4'] = {};
    // for(var i4=0;i4<subhead4.length;i4++){
    //     subhead41['subhead4'] = {
    //         subhead4 : subhead4
    //     }
    // }
    // var subhead42 = [];
    // subhead42['info4'] = {};
    // for(var j4=0;j4<info4.length;j4++){
    //     subhead42['info4'] = {
    //         info4 : info4
    //     }
    // }
    //
    // // ............ Dosage in molecule ............ //
    // var subhead31 = [];
    // subhead31['subhead3'] = {};
    // for(var i3=0;i3<subhead3.length;i3++){
    //     subhead31['subhead3'] = {
    //         subhead3 : subhead3
    //     }
    // }
    // var subhead32 = [];
    // subhead32['info3'] = {};
    // for(var j3=0;j3<info3.length;j3++){
    //     subhead32['info3'] = {
    //         info3 : info3
    //     }
    // }
    //
    // // ........... List of contraindications ........ //
    // var subhead21 = [];
    // subhead21['subhead2'] = {};
    // for(var i2=0;i2<subhead2.length;i2++){
    //     subhead21['subhead2'] = {
    //         subhead2 : subhead2
    //     }
    // }
    // var subhead22 = [];
    // subhead22['info2'] = {};
    // for(var j2=0;j2<info2.length;j2++){
    //     subhead22['info2'] = {
    //         info2 : info2
    //     }
    // }

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
        source : source,
        other_drug_interaction: {
            subhead5: subhead5,
            info5: info5
        },
        other_interaction: {
            subhead4: subhead4,
            info4: info4
        },
        dosage:{
            subhead3: subhead3,
            info3: info3
        },
        contraindications: {
            subhead2: subhead2,
            info2: info2
        }
    });
    molecule.save(function (err, result) {
        if (err) {
            console.log(err);
        }
        else {
            res.send("Molecules details added");
        }
    });
});
// disease details
app.get('/disease',function (req,res) {
    res.render('disease');
});

app.post('/diseases',function (req,res) {
    console.log('reaches');
    var disease_name = req.body.disease_name;
    var symptoms = req.body.symptoms;
    var risk_factor = req.body.risk_factor;
    var cause = req.body.cause;
    var subhead1 = req.body.subhead1;
    var subhead2 = req.body.subhead2;
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
                        subhead1 : subhead1,
                        subhead2 : subhead2
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
                        console.log(result1);
                        res.send({message : "Disease saved successfully"});
                    }
                });
            }
        }
    });
});


var database = mongoose.connect('mongodb://127.0.0.1/Apniwebsite',
//var database = mongoose.connect('mongodb://admin:abc1234@127.0.0.1/Apniwebsite',
    {
        useMongoClient: true
    });

database.on('open',function () {

    app.listen(app.get('port'),function () {
        console.log('Server now started at port '+app.get('port'));
    });
});

database.on('error',function () {
    console.log('server not started due to database failure');
});