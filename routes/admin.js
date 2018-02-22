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
var router = express.Router();


var keys = require('../private/keys');

// req model for feedback and need help
var Feedback = require('../model/adminfeedback');
var Needhelp = require('../model/needhelp');
var NeedhelpWL = require('../model/needhelpWL');

var User  = require('../model/registration');
var Doctor = require('../model/doctorregistration');
var Pharma = require('../model/pharma');
//require for medicine index
var Company = require('../model/company');
var Brand = require('../model/brand');
var Dosage = require('../model/dosage');
var Strength = require('../model/strength');
//require for disease
var Disease = require('../model/disease');
//require molecule
var Molecule = require('../model/molecule');
var OrganSearch = require('../model/organsearch');
var SymptomSearch = require('../model/symptomsearch');

//AdminPanel
var DrugData = require('../model/drugdatalive');
var DiseaseData = require('../model/diseasedatalive');
var MoleculeData = require('../model/moleculedatalive');
var CategoryData = require('../model/categorydatalive');
/////Data having Issue
var Issue = require('../model/issue');


function adminrequiresLogin(req, res, next) {
    if (req.session && req.session.admin) {
        return next();
    } else {
        //var err = new Error('You must be logged in to view this page.');
        res.redirect('/');
    }
}


//=========================Admin Panel==================================================================================

// router.get('/admin',function (req,res) {
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

//////admin Panel/////////////


router.post('/adminLogin',function (req,res) {
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

router.get('/admin_home',adminrequiresLogin,function(req,res){
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

router.get('/admin_report',adminrequiresLogin,function(req,res){
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
router.get('/admin_account',adminrequiresLogin,function(req,res){
    res.render('adminAccount');
});

router.get('/admin_accountUser',adminrequiresLogin,function(req,res){
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

router.get('/blockUser',adminrequiresLogin,function(req,res){
    var number = req.query.number;
    User.update({number : number},{
        $set : {status : 'blocked'}
    },function (err) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/admin/admin_accountUser');
        }
    });
});

router.get('/unblockUser',adminrequiresLogin,function(req,res){
    var number = req.query.number;
    User.update({number : number},{
        $set : {status : 'unblocked'}
    },function (err) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/admin/admin_accountUser');
        }
    })
});

router.get('/admin_accountDoctor',adminrequiresLogin,function(req,res){
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

router.get('/blockDoctor',adminrequiresLogin,function(req,res){
    var number = req.query.number;
    Doctor.update({number : number},{
        $set : {status : 'blocked'}
    },function (err) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/admin/admin_accountDoctor');
        }
    });
});

router.get('/unblockDoctor',adminrequiresLogin,function(req,res){
    var number = req.query.number;
    Doctor.update({number : number},{
        $set : {status : 'unblocked'}
    },function (err) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/admin/admin_accountDoctor');
        }
    })
});

router.get('/admin_accountPharma',adminrequiresLogin,function(req,res){
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

router.get('/blockPharma',adminrequiresLogin,function(req,res){
    var number = req.query.number;
    Pharma.update({number : number},{
        $set : {status : 'blocked'}
    },function (err) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/admin/admin_accountPharma');
        }
    });
});

router.get('/unblockPharma',adminrequiresLogin,function(req,res){
    var number = req.query.number;
    Pharma.update({number : number},{
        $set : {status : 'unblocked'}
    },function (err) {
        if(err){
            console.log(err)
        }
        else{
            res.redirect('/admin/admin_accountPharma');
        }
    })
});

router.get('/admin_accountBlocked',adminrequiresLogin,function(req,res){
    res.render('admin_accountBlocked');
});

router.get('/admin_accountBlockedAccountUser',adminrequiresLogin,function(req,res){
    User.find({status : 'blocked'},function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.render('admin_accountBlockedAccountUser',{data : result});
        }
    });
});

router.get('/admin_accountBlockedAccountHealthCare',adminrequiresLogin,function(req,res) {
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

router.get('/admin_accountNewContact',adminrequiresLogin,function(req,res){
    res.render('admin_accountNewContact');
});

/////////////////////////////////////////////////Admin / Data Center ///////////////////////////////////////////////////

////////Drug Index/////////////////////////////
router.get('/admin_dataCenter',adminrequiresLogin,function(req,res){
    res.render('admin_dataCenter');
});

router.get('/admin_dataCenterDrug',adminrequiresLogin,function(req,res){
    Brand.find({},'-_id brand_name',function(err,brands){
        if(err){
            console.log(err);
        }
        else{
            res.render('admin_dataCenterDrug',{brands : brands});
        }
    });
});

router.get('/admin_dataCenterParticularDrug',adminrequiresLogin,function(req,res){
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
router.get('/admin_dataCenterDisease',adminrequiresLogin,function(req,res){
    Disease.find({},'-_id',function(err,diseases){
        if(err){
            console.log(err);
        }
        else{
            res.render('admin_dataCenterDisease',{diseases : diseases});
        }
    });
});

router.get('/admin_dataCenterParticularDisease',adminrequiresLogin,function(req,res){
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

router.get('/admin_dataCenterMolecule',adminrequiresLogin,function(req,res){
    Molecule.find({},'-_id',function(err,molecules){
        if(err){
            console.log(err);
        }
        else{
            res.render('admin_dataCenterMolecule',{molecules : molecules});
        }
    });
});

router.get('/admin_dataCenterParticularMolecule',adminrequiresLogin,function(req,res){
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

router.get('/admin_activityQueue',adminrequiresLogin,function(req,res){
    res.render('adminActivity');
});

////////////////////////Drug Data Live Process/////////

router.get('/admin_activityDrug',adminrequiresLogin,function(req,res){
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
                                    if((results != '')&&(result.issue_status != 0)) {
                                        if (!data['submitted']) { data['submitted'] = [];}
                                        data['submitted'].push({
                                            name: results[0].name,
                                            number: results[0].number,
                                            str_ticket : result.ticket,
                                            drug_name : result.brand_name
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
                                    if((results != '')&&(result.issue_status != 0)) {
                                        if (!data['submitted']) {
                                            data['submitted'] = [];
                                        } // to check if it is the first time you are inserting inside data['brand'], in which case it needs to be initialized.
                                        data['submitted'].push({
                                            name: results[0].name,
                                            number: results[0].number,
                                            str_ticket : result.ticket,
                                            drug_name : result.brand_name
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

router.get('/adminDrugDataInfo',adminrequiresLogin,function(req,res) {
    var ticket = req.query.str_ticket;
    DrugData.find({ticket : ticket}, function (err, strengths) {
        if (err) {
            console.log(err);
        }
        else {
            res.render('adminDrugDataInfo',{result : strengths});
        }
    });
});

router.get('/adminDrugDataMakeLive',adminrequiresLogin,function(req,res,next){
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

router.get('/adminDrugDataMakeLive',adminrequiresLogin,function(req,res,next) {
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
                res.locals.value1 = value1;
                res.locals.value3 = result;
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

router.get('/adminDrugDataMakeLive',adminrequiresLogin,function(req,res,next){
    var value1 = res.locals.value1;
    var value2 = res.locals.value3;
    var brandResult = res.locals.brandResult;
    var companyResult = res.locals.companyResult;
    if(value2 != ''){
        Strength.find({_id : value2.strength_id , strength : value1[0].strength},function(err,result){
            if(err){
                console.log(err);
            }
            else{
                res.locals.value1 = value1;
                res.locals.lastdosage = value2;
                res.locals.value4 = result;
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
                                                res.send({message: 'Drug added successfully'});
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

router.get('/adminDrugDataMakeLive',adminrequiresLogin,function(req,res) {
    var value1 = res.locals.value1;
    var value2 = res.locals.value4;
    var lastdosages = res.locals.lastdosage;
    var brandResult = res.locals.brandResult;
    if (value2[0] === undefined) {
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
                Dosage.update({_id : lastdosages[0]._id}, {
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
                                res.send({message: 'Drug added successfully'});
                            });
                        });

                    }
                });
            }
        });
    }
    else {
        res.send({message: 'Medicine Already exist'});
    }
});

///////////////////////////Disease Data Live Process

router.get('/admin_activityDisease',adminrequiresLogin,function(req,res){
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
                                if((results != '')&&(result.issue_status != 0)) {
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
                                if((results != '')&&(result.issue_status != 0)) {
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

router.get('/adminDiseaseDataInfo',adminrequiresLogin,function(req,res){
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

router.get('/adminDiseaseDataMakeLive',adminrequiresLogin,function(req,res){
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
                        var organsearch  = new OrganSearch({
                            name : organ
                        });
                        organsearch.save(function(organerr,organ){
                            if(organerr){
                                console.log(organerr);
                            }
                            else{
                                callback();
                            }
                        });
                    },function(organerr){
                        if(organerr){
                            console.log(organerr);
                        }
                        else{
                            async.each(result[0].symptoms,function(sympt,callback){
                                var symptomsearch  = new SymptomSearch({
                                    name : sympt
                                });
                                symptomsearch.save(function(sympterr){
                                    if(sympterr){
                                        console.log(sympterr);
                                    }
                                    else{
                                        callback();
                                    }
                                });
                            },function(sympterr){
                                if(sympterr){
                                    console.log(sympterr)
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
        }
    });
});

/////////////////////////////Molecule data Live////////////////////////

router.get('/admin_activityMolecule',adminrequiresLogin,function(req,res) {
    MoleculeData.find({}, function (err, molecule) {
        if (err) {
            console.log(err);
        }
        else {
            var data = {};
            data['submitted'] = [];
            async.each(molecule, function (result, callback) {
                async.parallel({
                    Doctor: function (callback) {
                        Doctor.find({_id: result.submitted_by}, '-_id name number').exec(function (err, results) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                if ((results != '') && (result.issue_status != 0)) {
                                    if (!data['submitted']) {
                                        data['submitted'] = [];
                                    }
                                    data['submitted'].push({
                                        name: results[0].name,
                                        number: results[0].number,
                                        molecule: result.molecule_name
                                    });
                                    callback(null, data);
                                }
                                else {
                                    callback(null, null);
                                }
                            }
                        });
                    },
                    Pharma: function (callback) {
                        Pharma.find({_id: result.submitted_by}, '-_id name number').exec(function (err, results) {
                            if (err) {
                                console.log(err);
                            }
                            else {
                                if ((results != '') && (result.issue_status != 0)) {
                                    if (!data['submitted']) {
                                        data['submitted'] = [];
                                    } // to check if it is the first time you are inserting inside data['brand'], in which case it needs to be initialized.
                                    data['submitted'].push({
                                        name: results[0].name,
                                        number: results[0].number,
                                        molecule: result.molecule_name
                                    });
                                    callback(null, data);
                                }
                                else {
                                    callback();
                                }
                            }
                        });
                    }
                }, function (err) {
                    callback();
                });
            }, function (err) {
                if (err) {
                    console.log(err);
                }
                console.log(data);
                res.render('admin_activityMolecule', {result: data});
            });
        }
    });
});

router.get('/adminMoleculeDataInfo',adminrequiresLogin,function(req,res){
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

router.get('/adminMoleculeDataMakeLive',adminrequiresLogin,function(req,res){
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

router.get('/adminDrugDataIssue',adminrequiresLogin,function(req,res){
    var ticket = req.query.str_ticket;
    req.session.adminIssue = ticket;
    res.render('adminDrugDataIssue');
});

router.post('/adminDrugDataIssueSend',adminrequiresLogin,function(req,res){
    var issue = req.body.drugIssue;
    var ticket = req.session.adminIssue;
    DrugData.find({ticket : ticket},function(err,name){
        if(err){
            console.log(err);
        }
        else{
            var dataissues = new Issue({
                issues : {
                    issueIn : ticket,
                    issueType : 'Drug Index',
                    issueInfo : issue,
                    issueFrom : req.session.admin,
                    status : 0
                }
            });
            dataissues.save(function(data_err){
                if(data_err){
                    console.log(data_err);
                }
                else{
                    DrugData.update({ticket : ticket},{
                        $set : {
                            issue_status : 0
                        }
                    },function(issue_err){
                        if(issue_err){
                            console.log(issue_err);
                        }
                        else{
                            res.send({message : 'Drug issue registered'});
                        }
                    });
                }
            });
        }
    });
});

router.get('/adminDiseaseDataIssue',adminrequiresLogin,function(req,res){
    var disease = req.query.disease;
    req.session.adminIssue = disease;
    res.render('adminDiseaseDataIssue');
});

router.post('/adminDiseaseDataIssueSend',adminrequiresLogin,function(req,res){
    var issue = req.body.diseaseIssue;
    var disease = req.session.adminIssue;
    DiseaseData.find({disease_name : disease},function(err,name){
        if(err){
            console.log(err);
        }
        else{
            var dataissues = new Issue({
                issues : {
                    issueIn : disease,
                    issueType : 'Disease Index',
                    issueInfo : issue,
                    issueFrom : req.session.admin,
                    status : 0
                }
            });
            dataissues.save(function(dis_err){
                if(dis_err){
                    console.log(dis_err);
                }
                else{
                    DiseaseData.update({disease_name : disease},{
                        $set : {
                            issue_status : 0
                        }
                    },function(issue_err){
                        if(issue_err){
                            console.log(issue_err);
                        }
                        else{
                            res.send({message : 'Disease issue registered'});
                        }
                    });
                }
            });
        }
    });
});

router.get('/adminMoleculeDataIssue',adminrequiresLogin,function(req,res){
    var molecule = req.query.molecule;
    req.session.adminIssue = molecule;
    res.render('adminMoleculeDataIssue');
});

router.post('/adminMoleculeDataIssueSend',adminrequiresLogin,function(req,res){
    var issue = req.body.moleculeIssue;
    var molecule = req.session.adminIssue;
    MoleculeData.find({molecule_name : molecule},function(err,name){
        if(err){
            console.log(err);
        }
        else{
            var dataissues = new Issue({
                issues : {
                    issueIn : molecule,
                    issueType : 'Molecule Index',
                    issueInfo : issue,
                    issueFrom : req.session.admin,
                    status : 0
                }
            });
            dataissues.save(function(mol_err){
                if(mol_err){
                    console.log(mol_err);
                }
                else{
                    MoleculeData.update({molecule_name : molecule},{
                        $set : {
                            issue_status : 0
                        }
                    },function(issue_err){
                        if(issue_err){
                            console.log(issue_err);
                        }
                        else{
                            res.send({message : 'Molecule issue registered'});
                        }
                    });
                }
            });
        }
    });
});

router.get('/adminDataIssueInfo',adminrequiresLogin,function(req,res){
    var info = req.query.info;
    res.render('adminDataIssueInfo',{info : info});
});

////////////////////////// Admin / Activity/ Data Issue///////////

router.get('/admin_activityDataIssue',adminrequiresLogin,function(req,res){
    res.render('admin_activityDataIssue');
});

router.get('/admin_activityDrugIssueList',adminrequiresLogin,function(req,res){
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
                                    if((results != '')&&(result.issue_status == 0)) {
                                        if (!data['submitted']) { data['submitted'] = [];}
                                        data['submitted'].push({
                                            name: results[0].name,
                                            number: results[0].number,
                                            str_ticket : result.ticket,
                                            drug_name : result.brand_name
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
                                    if((results != '')&&(result.issue_status == 0)) {
                                        if (!data['submitted']) {
                                            data['submitted'] = [];
                                        } // to check if it is the first time you are inserting inside data['brand'], in which case it needs to be initialized.
                                        data['submitted'].push({
                                            name: results[0].name,
                                            number: results[0].number,
                                            str_ticket : result.ticket,
                                            drug_name : result.brand_name
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

router.get('/admin_activityDiseaseIssueList',adminrequiresLogin,function(req,res){
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
                                if((results != '')&&(result.issue_status == 0)) {
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
                                if((results != '')&&(result.issue_status == 0)) {
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

router.get('/admin_activityMoleculeIssueList',adminrequiresLogin,function(req,res){
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
                                if((results != '')&&(result.issue_status == 0)) {
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
                                if((results != '')&&(result.issue_status == 0)) {
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
                res.render('admin_activityMolecule', {result : data});
            });
        }
    });
});

///////////////////////////Admin / Feedback ///////////////////////////////////////////////////////////////////////////

router.get('/admin_feedback',adminrequiresLogin,function(req,res){
    res.render('admin_feedback');
});

/////// User Feedback/////////////
router.get('/admin_feedbackUser',adminrequiresLogin,function(req,res){
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

router.get('/adminFeedbackInfoUser',adminrequiresLogin,function(req,res){
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

router.get('/admin_feedbackHealthCare',adminrequiresLogin,function(req,res){
    Feedback.find({},'-_id',function(err,feedbacks){
        if(err){
            console.log(err);
        }
        else {
            var data = {};
            data['feedbacks'] = [];
            async.each(feedbacks,function(feedback,callback) {
                console.log(feedback.feedbackFrom);
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
                            console.log('pharma');
                            console.log(result.Pharma);
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

router.get('/adminFeedbackInfo',adminrequiresLogin,function(req,res){
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

router.get('/adminFeedbackResponse',adminrequiresLogin,function(req,res){
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

router.get('/adminFeedbackAddResponse',adminrequiresLogin,function(req,res){
    res.render('adminFeedbackAddResponse',{Ticket : req.query.ticket});
});

router.post('/adminFeedbackEnterResponse',adminrequiresLogin,function(req,res){
    var ticket = req.query.ticket;
    var response = req.body.response;
    Feedback.update({feedbackTicket : ticket},{
        $push : {
            feedbackResponse : response
        }
    },function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/admin/admin_feedback');
        }
    });
});

router.post('/adminFeedbackEnterResponse',adminrequiresLogin,function(req,res){
    var ticket = req.query.ticket;
    var response = req.body.response;
    Feedback.update({feedbackTicket : ticket},{
        $push : {
            feedbackResponse : response
        }
    },function(err,result){
        if(err){
            console.log(err);
        }
        else{
            res.redirect('/admin/admin_feedback');
        }
    });
});



module.exports = router;