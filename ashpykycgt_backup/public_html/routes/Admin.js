var express = require('express');
var router = express.Router();
var user = require('../models').User;
var Posts = require('../models').Posts;
var Replies = require('../models').Replies;
var Plans = require('../models').Plans;
var Blog = require('../models').Blog;
const { Op } = require("sequelize");
var Chats = require('../models').Chats;
var Bubbles = require('../models').Bubbles;
var SystemInfo = require('../models').SystemInfo;
var Subscribers = require('../models').Subscribers;
var Bugs = require('../models').Bugs;

var messages = require('../models').messages;

var plan_table = require('../models').planTable;
var Plan = require('../models').Plans;
let fs = require('fs-extra');
const fe = require('fs');

var socketapi=require('../config/socket');
var io = socketapi.io;
const { body, validationResult } = require('express-validator');
function PlanValidate() {
    return[
        body("Name", "Failed").exists().isLength({min:10})
    ]

}
var bcrypt = require('bcryptjs');
var back = require('express-back');
var passport = require('passport');
var utils = require('../config/utils');
var multer = require('multer');
var path = require('path');
var storage = multer.diskStorage({
    destination: 'public/images/Coaches-Avatar/',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

    }
});
var PImages = multer.diskStorage({
    destination: (req, file, callback) => {
        //  a file will automatically created for every coach/user and will store every thing belongs to
        // them in their file
        var user=req.user.id
        let path = `public/images/${user}/`
        fs.mkdirsSync(path);
        callback(null, path);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

    }
});
var upload = multer({
    storage: storage,
    fileFilter: checkFiletype
}).single('image');

var PImage = multer({
    storage: PImages,
    fileFilter: checkFiletype
}).single('PImage');

function checkFiletype(req, file, cb) {
    var fileT = /jpeg|jpg|png|gif/;
    var extname = fileT.test(path.extname(file.originalname).toLowerCase());
    var mimeType = fileT.test(file.mimetype);
    if (extname && mimeType) {
        return cb(null, true);
    } else {
        req.ImageError = "Images only";
        cb('Error: Images only', false)
    }
}

const Chance = require('chance');
const nodemailer = require("nodemailer");
const cron = require('node-cron');
const Nexmo = require('nexmo');
function mail() {
    //ddddddddddddddddddddddddddddddddddddddddddddd


    //ddddddddddddddddddddddddddddddddddddddddddddd
}

const {ensureAuthenticated, NotAuthenticated, isCoach,isAdmin } = require('../config/auth');
const moment = require("moment");
const {Notifications} = require("../models");
let chance = new Chance();
function issueToken(user, done) {
    let chance = new Chance();
    let token = chance.word({ length: 60 });
    user.update({
        RememberHash: token
    }).then(result => {
        return done(null, token);
    }).catch(err => {
        return done(err);
    })
}
/* GET CG-Admin page. */
router.get('/', ensureAuthenticated,isAdmin,async function (req, res, next) {
    var Logged= await req.user

    res.render('./Admin/Admin-Dashboard',{user:Logged});

});
router.get('/Users',ensureAuthenticated,isAdmin, async function (req, res, next) {
    var Logged= await req.user
    var Users= await user.findAll()
    var subscriber=await Subscribers.findAll()
    res.render('./Admin/Admin-Users',{
        Users:Users,
        user:Logged,
        Subscribers:subscriber
    });

});
router.get('/Bubbles',ensureAuthenticated,isAdmin, async function (req, res, next) {
    var Logged= await req.user
    var bubbles= await Bubbles.findAll()
    res.render('./Admin/Admin-Bubbles',{Bubbles:bubbles,user:Logged});

});
router.get('/Bugs',ensureAuthenticated,isAdmin, async function (req, res, next) {
    var Logged= await req.user
    var bugs= await Bugs.findAll({ include: user })
    res.render('./Admin/Admin-Bugs',{Bugs:bugs,user:Logged});

});
router.get('/Chats',ensureAuthenticated,isAdmin, async function (req, res, next) {
    var Logged= await req.user
    var chat= await Chats.findAll()
    var Messages= await messages.findAll({include:[{model:Chats}]})
    res.render('./Admin/Admin-Chats',{Chats:chat,user:Logged,Messages:Messages});

});
router.get('/System',ensureAuthenticated,isAdmin, async function (req, res, next) {
    var Logged= await req.user
    var plans= await Plans.findAll({order: [
            ['Order', 'ASC'],
        ],})
    var chats=[]
    res.render('./Admin/Admin-System',{Plans:plans,user:Logged,Chats:chats});

});
router.post('/getUserInfo',ensureAuthenticated, isAdmin, async function (req, res, next) {
    var UserId=req.body.UserID
    var User= await user.findOne({where:{id:UserId}})
    res.json({User})

});
router.post('/SaveUserInfo',ensureAuthenticated, isAdmin, async function (req, res, next) {
    const { userGroup,
        Name,
        email,
        password,
        BusinessName,
        Industry,
        WebsiteURL,
        Goals,
        Banned,
        UserId}=req.body


    var User= await user.findOne({where:{id:UserId}})
    User.userGroup=userGroup
        User.Name=Name
    if (password!=''){
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        User.password=hash
    }
    User.BusinessName=BusinessName
        User.Industry=Industry
        User.WebsiteURL=WebsiteURL
        User.Goals=Goals
        User.Banned=Banned
    User.save()
        res.json({Status:"Success"})


});
router.post('/SavePlanInfo',ensureAuthenticated, isAdmin, async function (req, res, next) {
    const {
    PName,
    PPrice,
        PlanOrder
    }=req.body
    var plan= await Plans.findOne({where:{Order:PlanOrder}})
    if (plan){
    plan.PName=PName
        plan.Price=PPrice
    plan.save()
        res.json({Status:"Success"})
    }else {
        res.json({Status:"Fail",err:"Plan Not Found"})

    }

});
router.post('/SaveSystemInfo',ensureAuthenticated, isAdmin, async function (req, res, next) {
    const {
        MetaTitle,
        MetaDescription,
        BubbleId,
        NotificationSound,
        MaxVideoSize,
    }=req.body
    var System= await SystemInfo.findOne({where:{Code:"CGSystem"}})
    if (System){
        System.MetaTitle=MetaTitle
            System.MetaDescription=MetaDescription
            System.BubbleId=BubbleId
            System.NotificationSound=NotificationSound
            System.MaxVideoSize=MaxVideoSize
    System.save()
        res.json({Status:"Success"})
    }else {
        res.json({Status:"Fail",err:"System Not Updated"})

    }

});
router.post('/SaveLogoImg', ensureAuthenticated,isAdmin,async function (req, res, next) {

    let System= await SystemInfo.findOne({where:{Code:"CGSystem"}})

    var Logo = multer.diskStorage({
        destination: (req, file, callback) => {

            let path = `public/images/CompleteGreet/`

            fs.mkdirsSync(path);
            callback(null, path);
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

        }
    });
    var avatar = multer({
        storage: Logo,
        fileFilter: checkAvatar
    }).single('LogoImg');


    function checkAvatar(req, file, cb) {
        var fileT = /jpeg|jpg|png|webp|gif/;
        var extname = fileT.test(path.extname(file.originalname).toLowerCase());
        var mimeType = fileT.test(file.mimetype);
        if (extname && mimeType) {
            return cb(null, true);
        } else {
            req.ImageError = "Images only";
            cb('Error: Images only', false)
        }
    }

    avatar(req,res,(err)=>{
        if (err){
            res.json({error:err})
        }else
        if(req.file.filename==undefined){
            res.json({error:"not found"})

        }
        else {
            System.LogoImage= req.file.filename;
            System.save();
            res.json({Success:"Success"})

        }
    })

});
router.post('/SaveNotificationSoundFile', ensureAuthenticated,isAdmin,async function (req, res, next) {

    let System= await SystemInfo.findOne({where:{Code:"CGSystem"}})

    var Sound = multer.diskStorage({
        destination: (req, file, callback) => {

            let path = `public/images/CompleteGreet/`

            fs.mkdirsSync(path);
            callback(null, path);
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

        }
    });
    var avatar = multer({
        storage: Sound,
        fileFilter: checkAvatar
    }).single('NotificationSoundFile');


    function checkAvatar(req, file, cb) {
        var fileT = /mp3|opus|wav|aif|mid|ogg|aac|alac|flac|aiff|pcm/;
        var extname = fileT.test(path.extname(file.originalname).toLowerCase());
        var mimeType = fileT.test(file.mimetype);
        if (extname && mimeType) {
            return cb(null, true);
        } else {
            req.ImageError = "Audio only";
            cb('Error: Images only', false)
        }
    }

    avatar(req,res,(err)=>{
        if (err){
            res.json({error:err})
        }else
        if(req.file.filename==undefined){
            res.json({error:"not found"})

        }
        else {
            System.NotificationSound="https://completegreet.com/images/CompleteGreet/"+ req.file.filename;
            System.save();
            res.json({Success:"Success"})

        }
    })

});

module.exports = router;

