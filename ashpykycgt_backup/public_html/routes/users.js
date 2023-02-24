var express = require('express');
var mysql = require('mysql2')
var router = express.Router();
var user = require('../models').User;
var Blog = require('../models').Blog;
var Notes = require('../models').Notes;
var Bugs = require('../models').Bugs;
var Bubbles = require('../models').Bubbles;
var Visitors = require('../models').Visitors;
var Chats = require('../models').Chats;
var Plans = require('../models').Plans;
var SystemInfo = require('../models').SystemInfo;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
// This is your test secret API key.

var messages = require('../models').messages;
var Subscribers = require('../models').Subscribers;
var Notifications = require('../models').Notifications;
const Chance = require('chance');
let chance = new Chance();

var multer = require('multer');
var path = require('path');
var socketapi=require('../config/socket');
var io = socketapi.io;
//ssssssssssssssssssssssssssssssssssssssssssssssssssss
const moment=require('moment');
function info(name,text) {
    return {
        name,
        text,
        time:moment().format('h:mm a')
    }
}

//------ Changing mp4 to gif -------------------//
var ffmpeg = require('ffmpeg');
var ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
var ffprobePath = require('@ffprobe-installer/ffprobe').path
var ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg. setFfprobePath(ffprobePath);
// ffmpeg("./public/videos/demo.mp4")
//     .	setStartTime('00:00:00')
//     .	setDuration('7')
//     .	size("260x260")
//     .	fps(10)
//     .	output(`./public/${Date.now() + ".gif"}`)
//     .	on('end', function(err) {
//         if (!err) {
//             console.log('conversion Done')
//         }
//     }).on('error',function (err){
//     console.log(err)
// }).run()
var ffprobe = require('ffprobe'),
    ffprobeStatic = require('ffprobe-static');
// ffprobe('./public/videos/demo.mp4', { path: ffprobeStatic.path }, function (err, info) {
//     if (err){
//         console.log(err);
//     }
//
// else {
        // var index = info.streams.findIndex(x => x.codec_type ==="video")
        // ffmpeg("./public/videos/demo.mp4" )
        //     .outputOptions(["-vf fps=15,scale=320:-1:flags=lanczos,palettegen"])
        //     .output('./public/videos/palette.png')
        //     .on('end', function (err) {
        //     if (!err) {
        //         console.log('conversion Done')
        //     }
        //     }).on('error', function (err) {
        //     console.log(err)
        // }).run()
        //     ffmpeg("./public/videos/demo.mp4" )
        //         .inputFormat('mp4')
        //         .input("./public/videos/palette.png")
        //         .complexFilter(["fps=20,scale=320:-1:flags=lanczos,split[s0][s1];[s0]palettegen[p];[s1][p]paletteuse"])
        //         .setStartTime('00:00:00')
        //         .setDuration('10')
        //         .size("300x?").aspect(info.streams[index].width + ':' + info.streams[index].height)
        //         .fps(20)
        //         .   outputOptions('-loop', 0)
        //         // .   outputOptions('-fs', 300000)
        //         .output(`./public/${Date.now() + ".gif"}`)
        //         .on('end', function (err) {
        //             if (!err) {
        //                 console.log('conversion Done')
        //             }
        //         }).on('error', function (err) {
        //         console.log(err)
        //     }).run()
//
//     }
//
// })

//ssssssssssssssssssssssssssssssssssssssssssssssssssss

const {ensureAuthenticated, NotAuthenticated, isAdmin, isSubscribed} = require('../config/auth');
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const fe = require("fs");
const {Plans: Plan} = require("../models");
const fs = require("fs-extra");
const bodyParser = require("body-parser");

/* GET users listing. */
/* ------------ Complete Greet User listing ---------- */

router.get('/Dashboard',ensureAuthenticated,isSubscribed, async function (req, res, next) {
    var Logged=req.user
    const TODAY_START = new Date().setHours(0, 0, 0, 0);
    const NOW = new Date();
    let MaxCapacityVisitors=0
    const CurrentSubscriber = await Subscribers.findOne( {
        where: {
            UserId:Logged.id,
            isActive:1,
            isFinished:0,
            EndSubscribeDate: {
                [Op.gt]: NOW
            },
        },
    });
    let chats= await Chats.findAll({where:{HosterID:Logged.id},order: [['updatedAt', 'DESC']]})
    let Messages= await messages.findAll({where:{UserId:Logged.id},order: [['createdAt', 'DESC']]})
    let CurrentCapacityVisitors= await Visitors.findAll({where:{SubscriberID:CurrentSubscriber.id}})

    var Chatnumber=0
    var NewChatnumber=0
    var VisitorNumber=0
    var AllTimeVisitorNumber=0
    var NewVisitorsNumber=0
    var unreadchats=0
    //-------- getting new visitors ----------//


    const NewVisitors = await Visitors.findAll( {
        where: {
            SubscriberID:CurrentSubscriber.id,
            createdAt: {
                [Op.gt]: TODAY_START,
                [Op.lt]: NOW
            },
        },
    });

    const NewChats = await Chats.findAll( {
        where: {
            HosterID:Logged.id,
            createdAt: {
                [Op.gt]: TODAY_START,
                [Op.lt]: NOW
            },
        },
    });
    if (NewVisitors) {
        NewVisitors.forEach(async function (chat) {
            NewVisitorsNumber++

        })
    }
    //-------------------------------------//
    if (chats){
    chats.forEach( async function (chat){
        Chatnumber++

    })

    }
    if (NewChats){
        NewChats.forEach( async function (chat){
        NewChatnumber++

    })

    }
    if (CurrentCapacityVisitors){
        CurrentCapacityVisitors.forEach( async function (chat){
            VisitorNumber++

        })
    }
        let AllTimeVisitors= await Visitors.findAll({where:{UserId:Logged.id}})
    if (AllTimeVisitors){
        AllTimeVisitors.forEach( async function (chat){
            AllTimeVisitorNumber++

        })
    }
        let OldVisitorsNumber=AllTimeVisitorNumber-NewVisitorsNumber

    //----------- Function to return number as a syntax of (k,m,etc) --------//
    function kFormatter(num, digits) {
        const lookup = [
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" }
        ];
        const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var item = lookup.slice().reverse().find(function(item) {
            return num >= item.value;
        });
        return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    }
    //-------------------------------------//

    //---------------- getting all visitors within 1 month -------------//
    var date = new Date();
    date.setDate(date.getDate() - 30);
    var dateString = date.toISOString().split('T')[0];
    let CurrentMonthVisitors=await Visitors.findAll({
        where: {
            SubscriberID:CurrentSubscriber.id,
            createdAt: {
                [Op.gt]: CurrentSubscriber.createdAt,
                [Op.lt]: CurrentSubscriber.EndSubscribeDate
            },
        }
    })
    //-------------------------------------------//
    let visitorslimit=false
    let MonthAgoVisitorsNum=(await CurrentMonthVisitors).length
    if (CurrentSubscriber && Logged.userGroup!=1200){
        if (CurrentSubscriber.PCode=="CGBasicPType"){
            MaxCapacityVisitors=500
            if(MonthAgoVisitorsNum>=500){
                visitorslimit=true
            }

        }else if (CurrentSubscriber.PCode=="CGBuildPType"){
            MaxCapacityVisitors=10000

            if(MonthAgoVisitorsNum>=10000){
                visitorslimit=true
            }

        }else if (CurrentSubscriber.PCode=="CGGrowthPType"){
            MaxCapacityVisitors=40000

            if(MonthAgoVisitorsNum>=40000){
                visitorslimit=true
            }

        }else if (CurrentSubscriber.PCode=="CGExpandPType"){
            MaxCapacityVisitors=100000

            if(MonthAgoVisitorsNum>=100000){
                visitorslimit=true
            }

        }else if (CurrentSubscriber.PCode=="CGScalePType"){
            MaxCapacityVisitors=300000

            if(MonthAgoVisitorsNum>=300000){
                visitorslimit=true
            }

        }
    }
    //------------- Notes -----------//
    res.render('Dashboard',{
        user:Logged,
        visitorslimit:visitorslimit,
        MonthAgoVisitorsNum:MonthAgoVisitorsNum,
        AllowVisitorpermonth:MaxCapacityVisitors,
        ChatNumber:Chatnumber,
        NewChatnumber:NewChatnumber,
        VisitorNumber: kFormatter(VisitorNumber,2),
        AllTimeVisitorNumber: kFormatter(AllTimeVisitorNumber,2),
        OldVisitorsNumber: kFormatter(OldVisitorsNumber,2),
        NewVisitorsNumber:kFormatter(NewVisitorsNumber,2),
        unreadchats:unreadchats,
        Chats:chats.slice(0, 2),
        Messages:Messages
    });

});

router.get('/Bubble',ensureAuthenticated,isSubscribed,async function (req, res, next) {
    var Logged= await req.user
    var bubbles= await Bubbles.findAll({where:{UserId:Logged.id}})
    var chats= await Chats.findAll({where:{HosterID:Logged.id}})
    let Subscriber = await Subscribers.findOne({where:{SubscriberID:Logged.id,isActive:1,isFinished:0}})
    let BubblesNum=(await bubbles).length
    let bubblelimit=false
    if (Subscriber && Logged.userGroup!=1200){
        if (Subscriber.PCode=="CGBasicPType"){
            if(BubblesNum>=1){
                bubblelimit=true
            }

        }else if (Subscriber.PCode=="CGBuildPType"){
            if(BubblesNum>=10){
                bubblelimit=true
            }

        }else if (Subscriber.PCode=="CGGrowthPType"){
            if(BubblesNum>=10){
                bubblelimit=true
            }

        }else if (Subscriber.PCode=="CGExpandPType"){


        }else if (Subscriber.PCode=="CGScalePType"){


        }
    }
    res.render('Bubble',{
        user:Logged,
        Bubbles:bubbles,
        Chats:chats,
        bubblelimit:bubblelimit
    });

});

router.get('/Profile',ensureAuthenticated,async function (req, res, next) {

    var Logged= await req.user
    var chats= await Chats.findAll({where:{HosterID:Logged.id}})

    res.render('User-Profile',{user:Logged,Chats:chats});

});
router.post('/LiveOnChatUpdate',ensureAuthenticated,async function (req, res, next) {

    var Logged= await req.user
    let LiveOnChat=req.body.LiveOnChat
    let CUser=await user.findOne({where:{id:Logged.id}})
    if (LiveOnChat=="false"){
        CUser.LiveOnBubble=0
        CUser.save()
    }else if (LiveOnChat=="true"){
        CUser.LiveOnBubble=1
        CUser.save()
    }

    res.json({Status:"Success"})

});
router.post('/PushNotificationUpdate',ensureAuthenticated,async function (req, res, next) {

    var Logged= await req.user
    let PushNotification=req.body.PushNotification
    let CUser=await user.findOne({where:{id:Logged.id}})
    if (PushNotification=="false"){
        CUser.PushNotification=0
        CUser.save()
    }else if (PushNotification=="true"){
        CUser.PushNotification=1
        CUser.save()
    }

    res.json({Status:"Success"})

});
router.post('/SendEmailUpdate',ensureAuthenticated,async function (req, res, next) {

    var Logged= await req.user
    let SendEmail=req.body.SendEmail
    let CUser=await user.findOne({where:{id:Logged.id}})
    if (SendEmail=="false"){
        CUser.SendEmail=0
        CUser.save()
    }else if (SendEmail=="true"){
        CUser.SendEmail=1
        CUser.save()
    }

    res.json({Status:"Success"})

});

router.post('/BubbleInfo',async function (req, res, next) {
    var BubbleId= await req.body.CompleteGreet_ID
    var System= await SystemInfo.findOne({where:{Code:"CGSystem"}})
    var Bubble= await Bubbles.findOne({where:{BubbleCode:BubbleId,IsDeleted:0}})
    var BubbleOwner= await user.findOne({where:{id:Bubble.UserId}})
    if (Bubble){
        if (BubbleOwner.userGroup==1200){
            Bubble.BubbleAvailable=1
            Bubble.save()
        }
        if (Bubble.BubbleAvailable==1&&Bubble.BubbleDeactivated==0){
        var bubbleOwner=await user.findOne({where:{id:Bubble.UserId}})
        res.json({Status:"Success",Bubble:Bubble,NotificationSound:System.NotificationSound,liveOnBubble:bubbleOwner.LiveOnBubble})
        }else if (Bubble.BubbleDeactivated==1){
            res.json({Status:"Fail",msg:"Bubble Deactivated"})

        } else {
            res.json({Status:"Fail",msg:"Upgrade your plan to continue using bubble"})


        }
    }else {
        res.json({Status:"Fail",msg:"Bubble Not Found"})

    }


});
router.post('/VisitorInfo',async function (req, res, next) {
    const {IPAddress,City,Country,VisitorBubbleId}=req.body
    var Visitor=await Visitors.findOne({where:{IPAddress:IPAddress}})
    var Bubble= await Bubbles.findOne({where:{id:VisitorBubbleId}})
    var Logged=await user.findOne({where:{id:Bubble.UserId}})
    let Subscriber = await Subscribers.findOne({where:{SubscriberID:Bubble.UserId,isActive:1,isFinished:0}})
    //---------------- getting all visitors within 1 month -------------//
    const NOW = new Date();

    var date = new Date();
    date.setDate(date.getDate() - 30);
    var dateString = date.toISOString().split('T')[0];
    let CurrentSubscriber=await Visitors.findAll({
        where: {
            SubscriberID:Subscriber.id,
            createdAt: {
                [Op.gt]: dateString,
                [Op.lt]: NOW
            },
        }
    })
    //-------------------------------------------//
    let visitorslimit=false
    let MonthAgoVisitorsNum=(await CurrentSubscriber).length
    if (Subscriber && Logged.userGroup!=1200){
        if (Subscriber.PCode=="CGBasicPType"){
            if(MonthAgoVisitorsNum>=500-1){
                visitorslimit=true
            }

        }else if (Subscriber.PCode=="CGBuildPType"){
            if(MonthAgoVisitorsNum>=10000-1){
                visitorslimit=true
            }

        }else if (Subscriber.PCode=="CGGrowthPType"){
            if(MonthAgoVisitorsNum>=40000-1){
                visitorslimit=true
            }

        }else if (Subscriber.PCode=="CGExpandPType"){
            if(MonthAgoVisitorsNum>=100000-1){
                visitorslimit=true
            }

        }else if (Subscriber.PCode=="CGScalePType"){
            if(MonthAgoVisitorsNum>=300000-1){
                visitorslimit=true
            }

        }
    }
    if (Visitor && VisitorBubbleId==Visitor.BubbleID){
        Bubble.BubbleAvailable=1
        Bubble.save()
        res.json({Status:"Success"})

    }else if (visitorslimit==false) {
        Visitors.create({
            IPAddress: IPAddress,
            BubbleID:VisitorBubbleId,
            SubscriberID:Subscriber.id,
            Country: Country,
            UserID: Bubble.UserId,
            City: City,
        })
        Bubble.BubbleAvailable=1
        Bubble.save()
        res.json({Status:"Success"})

    }else if (visitorslimit==true){
        Visitors.create({
            IPAddress: IPAddress,
            BubbleID:VisitorBubbleId,
            SubscriberID:Subscriber.id,
            Country: Country,
            UserID: Bubble.UserId,
            City: City,
        })
        Bubble.BubbleAvailable=0
        Bubble.save()
        res.json({Status:"Success"})

    }


});
router.post('/Bubble/Video/Upload',ensureAuthenticated,async function (req, res, next) {
    const {Video} = req.body
    var Logged=req.user
    var System= await SystemInfo.findOne({where:{Code:"CGSystem"}})
    let maxVideoSize=System.MaxVideoSize*1000000
    var Videos = multer.diskStorage({
        destination: (req, file, callback) => {
            //  a file will automatically created for every coach/user and will store every thing belongs to
            // them in their file
            // let path = `public/images/`
            let path = `public/files/users/${Logged.id}/Bubble-Videos/`
            //  hnst5dmha 34an n5ly kol wa7d le file byt5zn fe el 7aga

            fs.mkdirsSync(path);
            callback(null, path);
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

        }
    });
    const avatar = multer({
        storage: Videos,
        fileFilter: checkVideo,
        limits: { fileSize: maxVideoSize }
    }).single('Bubble-Video-file');


    function checkVideo(req, file, cb) {
        var fileT = /mp4|mov|wmv|avi|mkv|webm|ogg/;
        var extname = fileT.test(path.extname(file.originalname).toLowerCase());
        var mimeType = fileT.test(file.mimetype);
        if (extname && mimeType) {
            return cb(null, true);
        } else {
            req.ImageError = "Videos only";
            cb('Error: Videos only', false)
        }
    }

    avatar(req,res,(err)=>{
        if (err){
            res.json({error:err})
        }else
        if(req.file.filename==undefined){
            // console.log('not found');
            res.json({error:'not found'})
        }
        else {
            var fileName=String(req.file.filename)
            ffprobe('./public/files/users/'+Logged.id+'/Bubble-Videos/'+req.file.filename, { path: ffprobeStatic.path }, function (err, info) {
                if (!err){
                    var index = info.streams.findIndex(x => x.codec_type ==="video")
                    ffmpeg("./public/files/users/"+Logged.id+"/Bubble-Videos/"+req.file.filename)
                        .	setStartTime('00:00:00')
                        .	setDuration('10')
                        .	size("300x?").aspect(info.streams[index].width+':'+info.streams[index].height)
                        .	fps(20)
                        // .   outputOptions('-fs', 300000)
                        .   outputOptions('-loop', -1)
                        .	output(`./public/files/users/${Logged.id}/Bubble-Videos/${fileName.substr(0, fileName.lastIndexOf(".")) + ".gif"}`)
                        .	on('end', function(err) {
                            if (!err) {
                                console.log('conversion Done')
                            }
                        }).on('error',function (err){
                        console.log(err)
                    }).run()
                } ;

            })
            // console.log(fileName)
            // console.log(22222222222)


            res.json({FileName:req.file.filename})

        }
    })
});
router.post('/Bubble/Creation',ensureAuthenticated,async function (req, res, next) {
    var Logged=req.user
    var BubbleCode = await chance.guid()

    var {BubbleName,
        BubbleVideo,
        BubbleGif,
        BubbleFontSize,
        BubbleTitle,
        BubbleSize,
        ExcludedPages,
        BubbleBorderColor,
        BubbleBackgroundColor,
        BubbleButtonColor,
        BubbleFontFamily,
        BubbleDelay,
        BubbleDeactivated,
        BubbleFirstMessageDelay,
        PagesFlag,
        BubbleDarken,
        BubbleGreetMsg,
        BubbleStyle,
        BubblePosition,
        BubbleVideoFit,
        BubbleAnimation} = req.body
    if (BubbleVideo== ''
        ||BubbleFontSize== ''
        ||BubbleSize== ''
        ||BubbleBackgroundColor== ''
        ||BubbleButtonColor== ''
        ||BubbleFontFamily== ''
        ||BubbleDarken== ''
        ||BubbleStyle== ''
        ||BubbleDelay== ''
        ||BubblePosition== ''
        ||BubbleVideoFit== ''
        ||BubbleAnimation== ''){
        res.json({Status:"Fail",error:"Empty Fields"})

    }else if (BubbleVideo== ''
        ||BubbleFontSize<15||BubbleFontSize>30
        ||BubbleSize<50||BubbleSize>300
        ||BubbleDelay<0||BubbleDelay>20
        ||BubbleFirstMessageDelay<0||BubbleFirstMessageDelay>20

    ){
        res.json({Status:"Fail",error:"Failed: Invalid Input Value"})

    }else  {
        if (BubbleBorderColor== ''){
            BubbleBorderColor="#FFFFFF00"
        }
        Bubbles.create({
            BubbleName: BubbleName,
            BubbleVideo: BubbleVideo,
            BubbleGif: BubbleGif,
            BubbleFontSize: BubbleFontSize,
            BubbleTitle: BubbleTitle,
            BubbleSize: BubbleSize,
            BubbleExcPages:ExcludedPages,
            BubbleAllPages:PagesFlag,
            BubbleBorderColor: BubbleBorderColor,
            BubbleBackgroundColor: BubbleBackgroundColor,
            BubbleButtonColor: BubbleButtonColor,
            BubbleFontFamily: BubbleFontFamily,
            BubbleDarken: BubbleDarken,
            BubbleStyle:BubbleStyle,
            BubbleDeactivated:BubbleDeactivated,
            BubblePosition: BubblePosition,
            BubbleVideoFit: BubbleVideoFit,
            BubbleAnimation: BubbleAnimation,
            BubbleDelay: BubbleDelay,
            BubbleFirstMessageDelay: BubbleFirstMessageDelay,
            BubbleGreetMsg: BubbleGreetMsg,
            BubbleCode: BubbleCode,
            IsDeleted:0,
            UserId:Logged.id
        })
        res.json({Status:"Success"})

    }
});
router.post('/Bubble/Edit',ensureAuthenticated,async function (req, res, next) {
    var Logged=req.user

    var {BubbleName,
        BubbleVideo,
        BubbleGif,
        BubbleFontSize,
        BubbleTitle,
        BubbleSize,
        PagesFlag,
        ExcludedPages,
        BubbleBorderColor,
        BubbleBackgroundColor,
        BubbleButtonColor,
        BubbleFirstMessageDelay,
        BubbleFontFamily,
        BubbleDarken,
        BubbleStyle,
        BubbleDeactivated,
        BubblePosition,
        BubbleVideoFit,
        BubbleDelay,
        BubbleGreetMsg,
        BubbleAnimation,
        BubbleCode} = req.body
    var Bubble =await Bubbles.findOne({where:{BubbleCode:BubbleCode}})
    if (BubbleVideo== ''
        ||BubbleFontSize== ''
        ||BubbleSize== ''
        ||BubbleBackgroundColor== ''
        ||BubbleButtonColor== ''
        ||BubbleFontFamily== ''
        ||BubbleDarken== ''
        ||BubbleStyle== ''
        ||BubbleDelay== ''
        ||BubblePosition== ''
        ||BubbleVideoFit== ''
        ||BubbleAnimation== ''){
        res.json({Status:"Fail",error:"Empty Fields"})

    }else if (BubbleVideo== ''
        ||BubbleFontSize<15||BubbleFontSize>30
        ||BubbleSize<50||BubbleSize>300
        ||BubbleDelay<0||BubbleDelay>20
        ||BubbleFirstMessageDelay<0||BubbleFirstMessageDelay>20

    ){
        res.json({Status:"Fail",error:"Failed: Invalid Input Value"})

    }else {
        if (BubbleBorderColor== ''){
            BubbleBorderColor="#FFFFFF00"
        }
        Bubble.BubbleName= BubbleName
            Bubble.BubbleVideo=BubbleVideo
            Bubble.BubbleGif=BubbleGif
            Bubble.BubbleFontSize=BubbleFontSize
            Bubble.BubbleTitle=BubbleTitle
            Bubble.BubbleSize=BubbleSize
            Bubble.BubbleBorderColor=BubbleBorderColor
            Bubble.BubbleBackgroundColor=BubbleBackgroundColor
            Bubble.BubbleButtonColor=BubbleButtonColor
            Bubble.BubbleFontFamily=BubbleFontFamily
            Bubble.BubbleDarken=BubbleDarken
            Bubble.BubbleStyle=BubbleStyle
            Bubble.BubbleAllPages= PagesFlag
            Bubble.BubbleExcPages=ExcludedPages
            Bubble.BubbleDelay=BubbleDelay
            Bubble.BubbleDeactivated=BubbleDeactivated
            Bubble.BubbleFirstMessageDelay=BubbleFirstMessageDelay
            Bubble.BubbleGreetMsg=BubbleGreetMsg
            Bubble.BubblePosition=BubblePosition
            Bubble.BubbleVideoFit=BubbleVideoFit
            Bubble.BubbleAnimation=BubbleAnimation
        Bubble.save()
        res.json({Status:"Success"})

    }
});
router.post('/Bubble/Delete',ensureAuthenticated,async function (req, res, next) {
    var Logged= await req.user
    const {BubbleCode} = await req.body
    var Bubble= await Bubbles.findOne({where:{BubbleCode:BubbleCode ,UserId:Logged.id}})

    if (Bubble){
        Bubble.IsDeleted=1
        Bubble.save()
        res.json({Status:"Success"})

    }else {
        res.json({Status:"Fail",error:"Bubble not found"})

    }




});
router.post('/GetChatInfo',async function (req, res, next) {
    const {Cookies,BubbleID,CGuser} = await req.body
    var chat= await Chats.findOne({where:{Chat_Cookie_id:Cookies,BubbleID:BubbleID }})
        //
    var Bubble= await Bubbles.findOne({where:{id:BubbleID}})
    var BubbleOwner= await user.findOne({where:{id:Bubble.UserId}})
    var GreetMsg=BubbleOwner.GreetMsg
    if (chat){
        if (CGuser){
            let allmessages=await messages.findAll({where:{ChatId:chat.id,UserId:chat.HosterID}})
            chat.NewChat=0
            chat.save()
            allmessages.forEach(function (msg){
                msg.isRead=1
                msg.save()
            })
        }
        var Messages=await messages.findAll({where:{ChatId:chat.id}})
        let CurrentUser=await user.findOne({where:{id:chat.HosterID}})
        var UserImage=CurrentUser.Image
        var ImageURL
        if (UserImage==null){
            ImageURL="https://completegreet.com/images/CompleteGreet/FavIcon.png"
        }else {
            ImageURL="https://completegreet.com/files/users/"+CurrentUser.id+"/Avatar/"+UserImage
        }

        res.json({Status:"ChatFound",chat,Messages,GreetMsg,ImageURL})

    }else {
        res.json({Status:"ChatNotFound",GreetMsg})

    }




});

router.get('/LiveChat',ensureAuthenticated,isSubscribed,async function (req, res, next) {
    let UserID=req.user.id
    try {
        let chats= await Chats.findAll({where:{HosterID:UserID},order: [['updatedAt', 'DESC']]})
        let Logged=req.user
        let Messages= await messages.findAll({where:{isRead:0}})
        let CheckNewChat= await messages.findAll({where:{ReceiverID:UserID}})
        let unreadChats=[]
        Messages.forEach(function (msg){

            unreadChats.push(msg.ChatId)
        })
        chats.forEach(function (chat){
            if (chat.NewChat==1){
                unreadChats.push(chat.id)

            }
        })
        // chats.forEach(async function (chat){
        //     let Messages= await messages.findAll({where:{ChatId:chat.id}})
        //     if (Messages.length<2){
        //         Messages.forEach(function (msg){
        //             if (msg.isRead==0){
        //                 unreadChats.push(msg.ChatId)
        //
        //             }
        //         })
        //         // unreadChats.push(chat.id)
        //
        //     }
        // })
        const NOW = new Date();

        let Subscriber = await Subscribers.findOne({where:{SubscriberID:Logged.id,isActive:1,isFinished:0}})
        //---------------- getting all visitors within 1 month -------------//
        var date = new Date();
        date.setDate(date.getDate() - 30);
        var dateString = date.toISOString().split('T')[0];
        let MonthAgoVisitors=await Visitors.findAll({
            where: {
                UserID:Logged.id,
                createdAt: {
                    [Op.gt]: dateString,
                    [Op.lt]: NOW
                },
            }
        })
        //-------------------------------------------//
        let visitorslimit=false
        let MonthAgoVisitorsNum=(await MonthAgoVisitors).length
        if (Subscriber && Logged.userGroup!=1200){
            if (Subscriber.PCode=="CGBasicPType"){
                if(MonthAgoVisitorsNum>=500){
                    visitorslimit=true
                }

            }else if (Subscriber.PCode=="CGBuildPType"){
                if(MonthAgoVisitorsNum>=10000){
                    visitorslimit=true
                }

            }else if (Subscriber.PCode=="CGGrowthPType"){
                if(MonthAgoVisitorsNum>=40000){
                    visitorslimit=true
                }

            }else if (Subscriber.PCode=="CGExpandPType"){
                if(MonthAgoVisitorsNum>=100000){
                    visitorslimit=true
                }

            }else if (Subscriber.PCode=="CGScalePType"){
                if(MonthAgoVisitorsNum>=300000){
                    visitorslimit=true
                }

            }
        }
        res.render('Live-Chat',{
            Chats:chats,
            visitorslimit:visitorslimit,
            unreadChats:unreadChats,
            UserID:UserID,
            user:Logged
        });
    } catch (e) {
        console.log(`Failed to get live chat with error ${e}`)
    }




});

router.get('/Bubble/:id',ensureAuthenticated,async function (req, res, next) {
    var Logged= await req.user
    var BubbleCode=req.params.id
    var chats= await Chats.findAll({where:{HosterID:Logged.id}})

    var Bubble= await Bubbles.findOne({where:{BubbleCode:BubbleCode ,UserId:Logged.id}})

    if (Bubble){
        res.render('BubbleEdits',{Bubble:Bubble,user:Logged,Chats:chats});
    }else {
        res.redirect('/Users/Dashboard');
    }


});
router.post('/AddNote',ensureAuthenticated,async function (req, res, next) {
    // date.replace("T"," ").slice(0,-8)+
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    var Logged= req.user
    const {NoteText}=req.body
    if (NoteText!=''){
        Notes.create({
            NoteText: NoteText,
            NoteCode:makeid(7),
            UserId:Logged.id,
            isDeleted: 0,
        }).then(note =>{
            res.json({Status:"Success",Note:note})

        })

    }else {
        res.json({Status:"Failed"})

    }




});
router.post('/getNotes',ensureAuthenticated,async function (req, res, next) {
    var Logged =req.user
    let notes=await Notes.findAll({where:{UserId:Logged.id,isDeleted:0}})
    res.json({Status:"Success",Notes:notes})



});
router.post('/deleteNote',ensureAuthenticated,async function (req, res, next) {
    var Logged =req.user
    const {notecode}=req.body
    let note=await Notes.findOne({where:{NoteCode:notecode,UserId:Logged.id,isDeleted:0}})
    if (note){
        note.isDeleted=1
        note.save()
        res.json({Status:"Success"})

    }else {
        res.json({Status:"Fail"})

    }



});
router.post('/AddBug',ensureAuthenticated,async function (req, res, next) {
    // date.replace("T"," ").slice(0,-8)+
    function makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() *
                charactersLength));
        }
        return result;
    }
    var Logged= req.user
    const {BugText}=req.body
    if (BugText!=''){
        Bugs.create({
            BugText: BugText,
            BugCode:makeid(7),
            UserId:Logged.id,
            isDeleted: 0,
        }).then(bug =>{
            res.json({Status:"Success",Bug:bug})

        })

    }else {
        res.json({Status:"Failed"})

    }




});
router.post('/getBugs',ensureAuthenticated,async function (req, res, next) {
    var Logged =req.user
    let bugs=await Bugs.findAll({where:{UserId:Logged.id,isDeleted:0}})
    res.json({Status:"Success",Bugs:bugs})



});
router.post('/deleteBug',ensureAuthenticated,async function (req, res, next) {
    var Logged =req.user
    const {bugcode}=req.body
    let bug=await Bugs.findOne({where:{BugCode:bugcode,UserId:Logged.id,isDeleted:0}})
    if (bug){
        bug.isDeleted=1
        bug.save()
        res.json({Status:"Success"})

    }else {
        res.json({Status:"Fail"})

    }



});
router.post('/GreetMsgUpdate',ensureAuthenticated,async function (req, res, next) {
    var Logged= req.user
    const {GreetMsg}=req.body
    if (GreetMsg!=''){
       var CurrentUser=await user.findOne({where:{id:Logged.id}})
        CurrentUser.GreetMsg=GreetMsg
        CurrentUser.save()
        res.json({Status:"Success"})

    }else {
        res.json({Status:"Failed"})

    }




});

router.get('/team', ensureAuthenticated,async function (req, res, next) {

    var Logged= await req.user
    var chats= await Chats.findAll({where:{HosterID:Logged.id}})

    res.render('team',{user:Logged,Chats:chats});

});
router.get('/subscription',ensureAuthenticated,isSubscribed,async function (req, res, next) {

    var Logged= await req.user
    var chats= await Chats.findAll({where:{HosterID:Logged.id}})
    const NOW = new Date();
    var MaxCapacityVisitors
    var MaxCapacityBubble
    const CurrentSubscriber = await Subscribers.findOne( {
        where: {
            UserId:Logged.id,
            isActive:1,
            isFinished:0,
            EndSubscribeDate: {
                [Op.gt]: NOW
            },
        },
    });
    const plan=await Plans.findOne({where:{Code:CurrentSubscriber.PCode}})
    if (CurrentSubscriber.PCode=="CGBasicPType"){
        MaxCapacityVisitors=500

    }else if (CurrentSubscriber.PCode=="CGBuildPType"){
        MaxCapacityVisitors=10000



    }else if (CurrentSubscriber.PCode=="CGGrowthPType"){
        MaxCapacityVisitors=40000

    }else if (CurrentSubscriber.PCode=="CGExpandPType"){
        MaxCapacityVisitors=100000


    }else if (CurrentSubscriber.PCode=="CGScalePType"){
        MaxCapacityVisitors=300000


    }
    if (CurrentSubscriber.PCode=="CGBasicPType"){
        MaxCapacityBubble=1

    }else if (CurrentSubscriber.PCode=="CGBuildPType"){
        MaxCapacityBubble=10

    }else if (CurrentSubscriber.PCode=="CGGrowthPType"){
        MaxCapacityBubble=10

    }else if (CurrentSubscriber.PCode=="CGExpandPType"){
        MaxCapacityBubble="Unlimited"


    }else if (CurrentSubscriber.PCode=="CGScalePType"){

        MaxCapacityBubble="Unlimited"

    }
    res.render('subscription',{
        user:Logged,
        Chats:chats,
        MaxCapacityVisitors:MaxCapacityVisitors,
        MaxCapacityBubble:MaxCapacityBubble,
        CurrentSubscriber:CurrentSubscriber,
        Plan:plan
    });

});

module.exports = router;
