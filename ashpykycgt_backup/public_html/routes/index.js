var express = require('express');
var router = express.Router();
var user = require('../models').User;
var Posts = require('../models').Posts;
var Replies = require('../models').Replies;
var Plans = require('../models').Plans;
var Blog = require('../models').Blog;
var SystemInfo = require('../models').SystemInfo;
const { Op } = require("sequelize");
var Chats = require('../models').Chats;
var Bubbles = require('../models').Bubbles;
const stripe = require("stripe")('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');
var Subscribers = require('../models').Subscribers;
var Bubbles = require('../models').Bubbles;
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

const {ensureAuthenticated, NotAuthenticated, isCoach } = require('../config/auth');
const moment = require("moment");
const {Notifications} = require("../models");
const bodyParser = require("body-parser");
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
/* GET home page. */
router.get('/', async function (req, res, next) {
var System =await SystemInfo.findAll()
    var Bubble= await Bubbles.findOne({where:{id:System[0].BubbleId}})
    res.render('HomePage',{Bubble:Bubble});


});
router.get('/Demo', async function (req, res, next) {



    res.render('Demo',{});


});
router.get('/About-Us', async function (req, res, next) {



    res.render('About-Us',{});


});
router.get('/Pricing', async function (req, res, next) {
var plans=await Plans.findAll()


    res.render('Pricing',{Plans:plans});


});
router.get('/Blogs', async function (req, res, next) {



    res.render('Blogs',{});


});
router.get('/Affiliate-Program', async function (req, res, next) {



    res.render('Affiliate-Program',{});


});
router.get('/verify-account/:code1/:id',function (req, res, next) {

user.findByPk(req.params.id).then(user=>{
    if(req.params.code1==user.VerifyCode){
    user.Active=1;
    user.save();
    }else{
        console.log('not equal')
    }

})
    res.redirect('/login');
});
// -------- Stripe Payment GateWay ----------//
router.post("/create-payment-intent",ensureAuthenticated, async (req, res) => {
    const { Plan } = req.body
    let Logged= await  req.user

    const CPlan= await Plans.findOne({where:{Code:Plan[0].Code}})
    // calculateOrderAmount(items)
    // Create a PaymentIntent with the order amount and currency
    if (CPlan){
        if (Plan[0].Duration==12){
            const paymentIntent = await stripe.paymentIntents.create({
                amount:Math.round(CPlan.Price*12*0.8*100) ,
                currency: "usd",
                description:CPlan.PName,
                metadata:{
                    UserID:Logged.id,
                    Code:CPlan.Code,
                    Duration:Plan[0].Duration
                },
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        }else if (Plan[0].Duration==1){
            const paymentIntent = await stripe.paymentIntents.create({
                amount:CPlan.Price*100 ,
                currency: "usd",
                description:CPlan.PName,
                metadata:{
                    UserID:Logged.id,
                    Code:CPlan.Code,
                    Duration:Plan[0].Duration
                },
                receipt_email:Logged.email,
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            res.send({
                clientSecret: paymentIntent.client_secret,
            });
        }

    }

});
router.get('/checkout/:id', ensureAuthenticated,async function (req, res, next) {
    var geturlinfo=req.query.dur;
    let Duration;
    if (geturlinfo=="/mly"){
        Duration=1
    }else if (geturlinfo=="/yly"){
        Duration=12
    }
    Plan= await Plans.findOne({where:{Code:req.params.id}})
    if (Plan){
        if (Plan.Price==0){
            res.redirect('/users/dashboard')
        }else {

            if (Duration==1||Duration==12){
            res.render('checkout',{
                Plan:Plan,
                Duration: Duration,
                geturlinfo:geturlinfo,
                pid:req.params.id

            });
        }else {
            res.send('Invalid Duration');
            }
        }
    }else {
        res.send('Invalid Plan');

    }
    //?dur=%2Fmly


});
//------------ Listening to events when payment is processing --------//

// router.post('/webhook', bodyParser.raw({type: 'application/json'}),async (request, response) => {
//     let event;
//     const endpointSecret = "whsec_6ffa2719cb465ddfc59795019f4c1f1f55be18936ea06a7257bb4855f99c50d5";
//     const endpoint = await stripe.webhookEndpoints.create({
//         url: 'https://example.com/my/webhook/endpoint',
//         enabled_events: [
//             'charge.failed',
//             'charge.succeeded',
//         ],
//     });
//     // Only verify the event if you have an endpoint secret defined.
//     // Otherwise use the basic event deserialized with JSON.parse
//     if (endpointSecret) {
//         // Get the signature sent by Stripe
//         const signature = request.headers['stripe-signature'];
//         try {
//             event = stripe.webhooks.constructEvent(
//                 request.body,
//                 signature,
//                 endpointSecret
//             );
//         } catch (err) {
//             console.log(`⚠️  Webhook signature verification failed.`, err.message);
//             return response.sendStatus(400);
//         }
//     }
//     if (event.type==='payment_intent.created'){
//         console.log("now here we go")
//     }
//     console.log("hooook")
//     // Handle the event
//     switch (event.type) {
//         case 'payment_intent.succeeded':
//             const paymentIntent = event.data.object;
//             console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//             // Then define and call a method to handle the successful payment intent.
//             // handlePaymentIntentSucceeded(paymentIntent);
//             break;
//         case 'payment_method.attached':
//             const paymentMethod = event.data.object;
//             // Then define and call a method to handle the successful attachment of a PaymentMethod.
//             // handlePaymentMethodAttached(paymentMethod);
//             break;
//         default:
//             // Unexpected event type
//             console.log(`Unhandled event type ${event.type}.`);
//     }
//
//     // Return a 200 response to acknowledge receipt of the event
//     response.send();
// });
router.post('/webhook', express.json({type: 'application/json'}),async (request, response) => {
    const event = request.body;

    // Handle the event

    switch (event.type) {
        case 'payment_intent.succeeded':
            const paymentIntent = event.data.object;
            var Plan=await Plans.findOne({where:{Code:event.data.object.metadata.Code}})
            var User=await user.findOne({where:{id:event.data.object.metadata.UserID}})
            var Subscriber= await Subscribers.findOne({where:{UserId:event.data.object.metadata.UserID,isFinished:0}})
            var date = new Date();
            var finishdate=date.setDate(date.getDate() + 30);
            // var d = new Date();
            // d.setMinutes(d.getMinutes() + 2)
            if (Subscriber){
                Subscriber.isActive=0
                Subscriber.isFinished=1
                Subscriber.save()
                Subscribers.create({
                    PName:Plan.PName,
                    PCode: Plan.Code,
                    Subscriber: User.Name,
                    SubscriberID: User.id,
                    UserId: User.id,
                    PlanId: Plan.id,
                    Price:event.data.object.amount/100,
                    Duration: event.data.object.metadata.Duration,
                    EndSubscribeDate: finishdate,
                    isActive: 1,
                    isFinished: 0,
                }).then(async subscriber=>{
                    // let endSubscription=cron.schedule('*/2 * * * *', async () => {
                    //     subscriber.isFinished=1
                    //     subscriber.isActive=0
                    //     subscriber.save()
                    //     console.log(subscriber.Subscriber)
                    //     endSubscription.stop();
                    // });
                    // endSubscription.start();
                    var Bubble=Bubbles.findAll({where:{UserId:subscriber.UserId,BubbleAvailable:0}})
                    if (Bubble){
                        (await Bubble).forEach(function (bubble){
                            bubble.BubbleAvailable=1
                            bubble.save()
                        })
                    }



                })

            }else {
                Subscribers.create({
                    PName:Plan.PName,
                    PCode: Plan.Code,
                    Subscriber: User.Name,
                    SubscriberID: User.id,
                    UserId: User.id,
                    PlanId: Plan.id,
                    Price:event.data.object.amount/100,
                    Duration: event.data.object.metadata.Duration,
                    EndSubscribeDate: finishdate,
                    isActive: 1,
                    isFinished: 0,
                }).then(async subscriber=>{
                    // let endSubscription=cron.schedule('*/2 * * * *', async () => {
                    //     subscriber.isFinished=1
                    //     subscriber.isActive=0
                    //     subscriber.save()
                    //     console.log(subscriber.Subscriber)
                    //     endSubscription.stop();
                    // });
                    // endSubscription.start();
                    var Bubble=Bubbles.findAll({where:{UserId:subscriber.UserId,BubbleAvailable:0}})
                    if (Bubble){
                        (await Bubble).forEach(function (bubble){
                            bubble.BubbleAvailable=1
                            bubble.save()
                        })
                    }



                })

            }

            // Then define and call a method to handle the successful payment intent.
            // handlePaymentIntentSucceeded(paymentIntent);
            break;
        case 'payment_method.attached':
            const paymentMethod = event.data.object;
            // Then define and call a method to handle the successful attachment of a PaymentMethod.
            // handlePaymentMethodAttached(paymentMethod);
            break;
        // ... handle other event types
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    response.json({received: true});
});
router.get('/status/:id', async function (req, res, next) {
    var geturlinfo=req.query.dur;
    let Duration;
    if (geturlinfo=="/mly"){
        Duration=1
    }else if (geturlinfo=="/yly"){
        Duration=12
    }
    Plan= await Plans.findOne({where:{Code:req.params.id}})
    if (Plan){
        if (Plan.Price==0){
            res.redirect('/users/dashboard')
        }else {

            if (Duration==1||Duration==12){
                res.render('status',{
                    Plan:Plan,
                    Duration: Duration,

                });
            }else {
                res.send('Invalid Duration');
            }
        }
    }else {
        res.send('Invalid Plan');

    }


});

router.get('/login',NotAuthenticated,function (req, res, next) {
    var lastURL=req.query.essa;

    res.render('login',{lastURL:lastURL});
});
//----------------- Password Reset ----------------------//
router.get('/Password-Reset',NotAuthenticated,function (req, res, next) {

    res.render('PassReset',);
});

router.get('/Password-Reset/:code/:id',NotAuthenticated,async function (req, res, next) {
    var passcode=req.params.code
    var id=await req.params.id

    var users=await user.findOne({where: {id: id}})
    if (passcode!=users.PassReset||users.PassReset==0||users.PassReset.length<10){
        req.flash('error_msg','Session Expired');
        res.redirect('/login');
    }else {
        res.render('PasswordReset',{id:id,passcode:passcode});

    }
});
router.post('/Password-Reset',NotAuthenticated,async function (req, res, next) {
    var email= await req.body.email
    var random = await chance.string({ length: 35,casing: 'upper', alpha: true, numeric: true })
    var users=await user.findOne({where: {email: email}})
if (users){
    var transporter = await nodemailer.createTransport({
        pool: true,
        host: "secure.emailsrvr.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "contact@completegreet.com", // generated ethereal user
            pass: "1212921509Azad",
        },

    });
    var html2="<!DOCTYPE HTML PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional //EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" +
        "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">\n" +
        "<head>\n" +
        "<!--[if gte mso 9]>\n" +
        "<xml>\n" +
        "  <o:OfficeDocumentSettings>\n" +
        "    <o:AllowPNG/>\n" +
        "    <o:PixelsPerInch>96</o:PixelsPerInch>\n" +
        "  </o:OfficeDocumentSettings>\n" +
        "</xml>\n" +
        "<![endif]-->\n" +
        "  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n" +
        "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
        "  <meta name=\"x-apple-disable-message-reformatting\">\n" +
        "  <!--[if !mso]><!--><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><!--<![endif]-->\n" +
        "  <title></title>\n" +
        "  \n" +
        "    <style type=\"text/css\">\n" +
        "      @media only screen and (min-width: 620px) {\n" +
        "  .u-row {\n" +
        "    width: 600px !important;\n" +
        "  }\n" +
        "  .u-row .u-col {\n" +
        "    vertical-align: top;\n" +
        "  }\n" +
        "\n" +
        "  .u-row .u-col-50 {\n" +
        "    width: 300px !important;\n" +
        "  }\n" +
        "\n" +
        "  .u-row .u-col-100 {\n" +
        "    width: 600px !important;\n" +
        "  }\n" +
        "\n" +
        "}\n" +
        "\n" +
        "@media (max-width: 620px) {\n" +
        "  .u-row-container {\n" +
        "    max-width: 100% !important;\n" +
        "    padding-left: 0px !important;\n" +
        "    padding-right: 0px !important;\n" +
        "  }\n" +
        "  .u-row .u-col {\n" +
        "    min-width: 320px !important;\n" +
        "    max-width: 100% !important;\n" +
        "    display: block !important;\n" +
        "  }\n" +
        "  .u-row {\n" +
        "    width: calc(100% - 40px) !important;\n" +
        "  }\n" +
        "  .u-col {\n" +
        "    width: 100% !important;\n" +
        "  }\n" +
        "  .u-col > div {\n" +
        "    margin: 0 auto;\n" +
        "  }\n" +
        "}\n" +
        "body {\n" +
        "  margin: 0;\n" +
        "  padding: 0;\n" +
        "}\n" +
        "\n" +
        "table,\n" +
        "tr,\n" +
        "td {\n" +
        "  vertical-align: top;\n" +
        "  border-collapse: collapse;\n" +
        "}\n" +
        "\n" +
        "p {\n" +
        "  margin: 0;\n" +
        "}\n" +
        "\n" +
        ".ie-container table,\n" +
        ".mso-container table {\n" +
        "  table-layout: fixed;\n" +
        "}\n" +
        "\n" +
        "* {\n" +
        "  line-height: inherit;\n" +
        "}\n" +
        "\n" +
        "a[x-apple-data-detectors='true'] {\n" +
        "  color: inherit !important;\n" +
        "  text-decoration: none !important;\n" +
        "}\n" +
        "\n" +
        "table, td { color: #000000; } #u_body a { color: #3b5dcd; text-decoration: underline; }\n" +
        "    </style>\n" +
        "  \n" +
        "  \n" +
        "\n" +
        "<!--[if !mso]><!--><link href=\"https://fonts.googleapis.com/css?family=Lato:400,700&display=swap\" rel=\"stylesheet\" type=\"text/css\"><!--<![endif]-->\n" +
        "\n" +
        "</head>\n" +
        "\n" +
        "<body class=\"clean-body u_body\" style=\"margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000\">\n" +
        "  <!--[if IE]><div class=\"ie-container\"><![endif]-->\n" +
        "  <!--[if mso]><div class=\"mso-container\"><![endif]-->\n" +
        "  <table id=\"u_body\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
        "  <tbody>\n" +
        "  <tr style=\"vertical-align: top\">\n" +
        "    <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +
        "    <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" style=\"background-color: #f9f9f9;\"><![endif]-->\n" +
        "    \n" +
        "\n" +
        "<div class=\"u-row-container\" style=\"padding: 0px;background-color: #f9f9f9\">\n" +
        "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;\">\n" +
        "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
        "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: #f9f9f9;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #f9f9f9;\"><![endif]-->\n" +
        "      \n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <table height=\"0px\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #f9f9f9;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
        "    <tbody>\n" +
        "      <tr style=\"vertical-align: top\">\n" +
        "        <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
        "          <span>&#160;</span>\n" +
        "        </td>\n" +
        "      </tr>\n" +
        "    </tbody>\n" +
        "  </table>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
        "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;\">\n" +
        "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
        "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #ffffff;\"><![endif]-->\n" +
        "      \n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:25px 10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
        "  <tr>\n" +
        "    <td style=\"padding-right: 0px;padding-left: 0px;\" align=\"center\">\n" +
        "      \n" +
        "      <img align=\"center\" border=\"0\" src=\"https://completegreet.com/images/CompleteGreet/FavIcon.png\" alt=\"Image\" title=\"Image\" style=\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;width:30px;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 29%;max-width: 168.2px;\" width=\"168.2\"/>\n" +
        "      \n" +
        "    </td>\n" +
        "  </tr>\n" +
        "</table>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
        "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #3b5dcd;\">\n" +
        "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
        "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #3b5dcd;\"><![endif]-->\n" +
        "      \n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:35px 10px 10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
        "  <tr>\n" +
        "    <td style=\"padding-right: 0px;padding-left: 0px;\" align=\"center\">\n" +
        "      \n" +
        "      <img align=\"center\" border=\"0\" src=\"https://completegreet.com/images/CompleteGreet//image-6.png\" alt=\"Image\" title=\"Image\" style=\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 10%;max-width: 58px;\" width=\"58\"/>\n" +
        "      \n" +
        "    </td>\n" +
        "  </tr>\n" +
        "</table>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:0px 10px 30px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
        "    <p style=\"font-size: 14px; line-height: 140%; text-align: center;\"><span style=\"font-size: 28px; line-height: 39.2px; color: #ffffff; font-family: Lato, sans-serif;\">Please reset your password </span></p>\n" +
        "  </div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
        "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;\">\n" +
        "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
        "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #ffffff;\"><![endif]-->\n" +
        "      \n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
        "    <p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 18px; line-height: 25.2px; color: #666666;\">Hello,</span></p>\n" +
        "<p style=\"font-size: 14px; line-height: 140%;\">&nbsp;</p>\n" +
        "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 18px; line-height: 25.2px; color: #666666;\">We have sent you this email in response to your request to reset your password on CompleteGreet.</span></p>\n" +
        "<p style=\"font-size: 14px; line-height: 140%;\">&nbsp;</p>\n" +
        "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 18px; line-height: 25.2px; color: #666666;\">To reset your password, please follow the link below: </span></p>\n" +
        "  </div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:0px 40px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->\n" +
        "<div align=\"left\">\n" +
        "  <!--[if mso]><v:roundrect xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:w=\"urn:schemas-microsoft-com:office:word\" href=\"\" style=\"height:51px; v-text-anchor:middle; width:205px;\" arcsize=\"2%\"  stroke=\"f\" fillcolor=\"#CD7D3B\"><w:anchorlock/><center style=\"color:#FFFFFF;font-family:'Lato',sans-serif;\"><![endif]-->  \n" +
       "  <a href=\"https://completegreet.com/Password-Reset/"+random+"/"+users.id+"\" target=\"_blank\" class=\"v-button\" style=\"box-sizing: border-box;display: inline-block;font-family:'Lato',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #CD7D3B; border-radius: 1px;-webkit-border-radius: 1px; -moz-border-radius: 1px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;\">\n" +
        "      <span style=\"display:block;padding:15px 40px;line-height:120%;\"><span style=\"font-size: 18px; line-height: 21.6px;\">Reset Password</span></span>\n" +
        "    </a>\n"+
        "  <!--[if mso]></center></v:roundrect><![endif]-->\n" +
        "</div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
        "    <p style=\"font-size: 14px; line-height: 140%;\"><span style=\"color: #888888; font-size: 14px; line-height: 19.6px;\"><em><span style=\"font-size: 16px; line-height: 22.4px;\">Please ignore this email if you did not request a password change.</span></em></span><br /><span style=\"color: #888888; font-size: 14px; line-height: 19.6px;\"><em><span style=\"font-size: 16px; line-height: 22.4px;\">&nbsp;</span></em></span></p>\n" +
        "  </div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
        "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #3b5dcd;\">\n" +
        "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
        "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #3b5dcd;\"><![endif]-->\n" +
        "      \n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"300\" style=\"width: 300px;padding: 20px 20px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-50\" style=\"max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 20px 20px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
        "    <p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 16px; line-height: 22.4px; color: #ecf0f1;\">Contact</span></p>\n" +
        "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px; color: #ecf0f1;\">Skivevej 177, 7500 Holstebro</span></p>\n" +
        "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px; color: #ecf0f1;\"> contact@completegreet.com</span></p>\n" +
        "  </div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"300\" style=\"width: 300px;padding: 0px 0px 0px 20px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-50\" style=\"max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px 0px 0px 20px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:25px 10px 10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "<div align=\"left\">\n" +
        "  <div style=\"display: table; max-width:187px;\">\n" +
        "  <!--[if (mso)|(IE)]><table width=\"187\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"border-collapse:collapse;\" align=\"left\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:187px;\"><tr><![endif]-->\n" +
        "  \n" +
        "    \n" +
        "    <!--[if (mso)|(IE)]><td width=\"32\" style=\"width:32px; padding-right: 15px;\" valign=\"top\"><![endif]-->\n" +
        "    <table align=\"left\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"32\" height=\"32\" style=\"width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px\">\n" +
        "      <tbody><tr style=\"vertical-align: top\"><td align=\"left\" valign=\"middle\" style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +
        "      </td></tr>\n" +
        "    </tbody></table>\n" +
        "    <!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "    \n" +
        "    <!--[if (mso)|(IE)]><td width=\"32\" style=\"width:32px; padding-right: 15px;\" valign=\"top\"><![endif]-->\n" +
        "    <table align=\"left\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"32\" height=\"32\" style=\"width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px\">\n" +
        "      <tbody><tr style=\"vertical-align: top\"><td align=\"left\" valign=\"middle\" style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +

        "      </td></tr>\n" +
        "    </tbody></table>\n" +
        "    <!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "    \n" +
        "    <!--[if (mso)|(IE)]><td width=\"32\" style=\"width:32px; padding-right: 15px;\" valign=\"top\"><![endif]-->\n" +
        "    <table align=\"left\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"32\" height=\"32\" style=\"width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px\">\n" +
        "      <tbody><tr style=\"vertical-align: top\"><td align=\"left\" valign=\"middle\" style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +

        "      </td></tr>\n" +
        "    </tbody></table>\n" +
        "    <!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "    \n" +
        "    <!--[if (mso)|(IE)]><td width=\"32\" style=\"width:32px; padding-right: 0px;\" valign=\"top\"><![endif]-->\n" +
        "    <table align=\"left\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"32\" height=\"32\" style=\"width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px\">\n" +
        "      <tbody><tr style=\"vertical-align: top\"><td align=\"left\" valign=\"middle\" style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +

        "      </td></tr>\n" +
        "    </tbody></table>\n" +
        "    <!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "    \n" +
        "    \n" +
        "    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:5px 10px 10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
        "    <p style=\"line-height: 140%; font-size: 14px;\"><span style=\"font-size: 14px; line-height: 19.6px;\"><span style=\"color: #ecf0f1; font-size: 14px; line-height: 19.6px;\"><span style=\"line-height: 19.6px; font-size: 14px;\">CompleteGreet &copy;&nbsp; All Rights Reserved</span></span></span></p>\n" +
        "  </div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "<div class=\"u-row-container\" style=\"padding: 0px;background-color: #f9f9f9\">\n" +
        "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #3b5dcd;\">\n" +
        "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
        "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: #f9f9f9;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #3b5dcd;\"><![endif]-->\n" +
        "      \n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <table height=\"0px\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #3b5dcd;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
        "    <tbody>\n" +
        "      <tr style=\"vertical-align: top\">\n" +
        "        <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
        "          <span>&#160;</span>\n" +
        "        </td>\n" +
        "      </tr>\n" +
        "    </tbody>\n" +
        "  </table>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
        "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;\">\n" +
        "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
        "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #f9f9f9;\"><![endif]-->\n" +
        "      \n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:0px 40px 30px 20px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
        "    \n" +
        "  </div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "\n" +
        "    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->\n" +
        "    </td>\n" +
        "  </tr>\n" +
        "  </tbody>\n" +
        "  </table>\n" +
        "  <!--[if mso]></div><![endif]-->\n" +
        "  <!--[if IE]></div><![endif]-->\n" +
        "</body>\n" +
        "\n" +
        "</html>\n"
    var mailOptions = {
        from: '"Complete Greet" <contact@completegreet.com>',
        to: email,
        subject: 'Password Reset',
        text:"You Can Reset Your Password by Clicking the Following ",
        html:html2,
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
    users.PassReset=random
    users.save()
    let endSession=cron.schedule('*/15 * * * *', async () => {
        var random = await chance.string({ length: 5,casing: 'upper', alpha: true, numeric: true })
        users.PassReset=random
        users.save()
        endSession.stop();
    });
    req.flash('error_msg','Please check your email');
    res.redirect('/login');}
else {
    req.flash('error_msg','This Email is not Registered');
    res.redirect('/login');
}

});
router.post('/Password-Reset/:code/:id',NotAuthenticated,async function (req, res, next) {
    var password= await req.body.password
    var Cpassword=await req.body.Cpassword
    var passcode=req.params.code
    var id=await req.params.id

    var users=await user.findOne({where: {id: id}})

    if (passcode!=users.PassReset||users.PassReset==0||users.PassReset.length<10){
        res.redirect('/Dashboard')
    }

    else if (password.length < 8) {
        req.flash('error_msg','Password Should be at Least 8 chars');
        res.redirect('/Password-Reset/'+passcode+'/'+id);

    }
    else if (password !=Cpassword) {
        req.flash('error_msg','Passwords are not the same');
        res.redirect('/Password-Reset/'+passcode+'/'+id);

    }
    else {
        var random = await chance.string({ length: 5,casing: 'upper', alpha: true, numeric: true })

        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        users.password=hash
        users.Cpassword=hash
        users.PassReset=random
        users.save()
        req.flash('Success_msg','Password has changed');
        res.redirect('/login')
    }

});
//--------------------------------------------------------------//

router.post('/login' , async function(req, res, next) {
    var lastURL=req.body.lastURL;
    const {email, password} = req.body

    if (email == '' || password == '') {
        // errors.push({msg: 'Please fill the required fields'});
        res.json({Status:"Fail",err:'Please fill the required fields',Field:'Empty'})
        // res.render('Coach-Register', {errors: errors ,firstName,lastName,email,password,Birth,phoneno});

    }else {
    passport.authenticate('local', async function (err, user, info) {
        if (err) {
            return next(err);
        }
        if (!user) {
            return        res.json({Status:"Fail",err:info.message,Field:'Email'})
            // res.render('login',{lastURL:lastURL,errorn:info.message});
        }
        req.logIn(user, async function (err) {
            if (err) {
                return next(err);
            }
            const NOW = new Date();
            var User=req.user
            const CurrentSubscriber = await Subscribers.findOne( {
                where: {
                    UserId:req.user.id,
                    isActive:1,
                    isFinished:0,
                    EndSubscribeDate: {
                        [Op.lt]: NOW
                    },
                },
            });
            if (CurrentSubscriber){
                if (CurrentSubscriber.Duration==12&&CurrentSubscriber.CurrentMonth<=12){
                    var Plan=await Plans.findOne({where:{Code:CurrentSubscriber.PCode}})

                    var date = new Date();
                    var finishdate=date.setDate(date.getDate() + 30);
                    Subscribers.create({
                        PName: Plan.PName,
                        PCode: Plan.Code,
                        Subscriber: User.Name,
                        SubscriberID: User.id,
                        UserId: User.id,
                        PlanId: Plan.id,
                        Price: "Yearly subscription",
                        Duration: 12,
                        CurrentMonth:CurrentSubscriber.CurrentMonth+1,
                        EndSubscribeDate: finishdate,
                        isActive: 1,
                        isFinished: 0,
                    }).then( async subscriber=>{
                        var Bubble=Bubbles.findAll({where:{UserId:subscriber.UserId,BubbleAvailable:0}})
                        if (Bubble){
                            (await Bubble).forEach(function (bubble){
                                bubble.BubbleAvailable=1
                                bubble.save()
                            })
                        }
                    })
                    CurrentSubscriber.isActive=0
                    CurrentSubscriber.isFinished=1
                    await CurrentSubscriber.save()
                }else {
                    CurrentSubscriber.isActive=0
                    CurrentSubscriber.isFinished=1
                    await CurrentSubscriber.save()
                }

            }else {
                const GetCurrentSubscriber = await Subscribers.findOne( {
                    where: {
                        UserId:req.user.id,
                        isActive:1,
                        isFinished:0,
                        EndSubscribeDate: {
                            [Op.gt]: NOW
                        },
                    },
                });
                if (GetCurrentSubscriber){

                }else{
                    var Plan=await Plans.findOne({where:{Code:"CGBasicPType"}})

                    var date = new Date();
                    var finishdate=date.setDate(date.getDate() + 30);
                    Subscribers.create({
                        PName: Plan.PName,
                        PCode: Plan.Code,
                        Subscriber: User.Name,
                        SubscriberID: User.id,
                        UserId: User.id,
                        PlanId: Plan.id,
                        Price: 0,
                        Duration: 1,
                        EndSubscribeDate: finishdate,
                        isActive: 1,
                        isFinished: 0,
                    }).then( async subscriber=>{
                        var Bubble=Bubbles.findAll({where:{UserId:subscriber.UserId,BubbleAvailable:0}})
                        if (Bubble){
                            (await Bubble).forEach(function (bubble){
                                bubble.BubbleAvailable=1
                                bubble.save()
                            })
                        }
                    })
                }

            }





        });

        res.json({Status:"Success"})



    })(req, res, next)

    }

});
// @desc    Auth with Google
// // @route   GET /auth/google
// router.get('/auth/google' , function(req, res, next) {
//
//
//     passport.authenticate('google', { scope: ['profile'] },function (err, user, info) {
//         console.log(user)
//         console.log(info)
//         if (err) {
//             return next(err);
//         }
//         if (!user) {
//             return        res.json({Status:"Fail",err:info.message,Field:'Email'})
//             // res.render('login',{lastURL:lastURL,errorn:info.message});
//         }
//         req.logIn(user, function (err) {
//             if (err) {
//                 return next(err);
//             }
//
//         });
//         // if (req.body.remember) {
//         //     issueToken(req.user, function (err, token) {
//         //         if (err) {
//         //             return next(err);
//         //         }
//         //         res.cookie('Tamrenak', token, { path: '/', httpOnly: true, maxAge: 604800000 });
//         //         if (lastURL==''|| lastURL==undefined){
//         //         res.redirect('/');
//         //         }
//         //         else {
//         //             res.redirect(lastURL)
//         //         }
//         //     });
//         // }
//         res.json({Status:"Success"})
//
//         // if (lastURL==''|| lastURL==undefined){
//         //         res.redirect('/');
//         //     }
//         //     else {
//         //         res.redirect(lastURL)
//         //     }
//
//
//
//     })(req, res, next)
// });
//
// // router.get('/auth/google')
//
// // @desc    Google auth callback
// // @route   GET /auth/google/callback
//
// router.get(
//     '/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: '/' }),
//     (req, res) => {
//         res.redirect('/dashboard')
//     }
// )
router.get('/Logout', function (req, res, next) {
    res.clearCookie('Tamrenak');
    req.logout();
    res.redirect('/');

});

router.post('/Bubble/Connect',async function (req, res, next) {

    res.json({Status:"Success",error:"Bubble not found"})




});
var allClients = [];

io.on('connection',async (socket)=>{

    socket.on("new connection",(ClientChatCode,UserId,ClientEmail)=>{
        let index = allClients.findIndex(x => x.ChatCode ==ClientChatCode);
if (index==-1){
    allClients.push({
        SocketId:socket.id,
        ChatCode:ClientChatCode,
        UserId:UserId,
        ClientEmail:ClientEmail,
        DateConnect:new Date()
    })
}
    })
    var ChatCode,ChatID
    socket.removeAllListeners('new chat');
    socket.on("connect", () => {

    });
    socket.on("disconnect",async () => {
      if (socket.id!=undefined && allClients.find((x)=> x.SocketId == socket.id)?.UserId!=undefined){
          let UserID= allClients.find((x)=> x.SocketId == socket.id).UserId
          const Datedisconnect=new Date()
          let currentUser= await user.findOne({where:{id:UserID}})
          let Chatmessages= await messages.findAll({where:{
                  createdAt: {
                      [Op.gt]: allClients.find((x)=> x.SocketId == socket.id).DateConnect,
                      [Op.lt]: Datedisconnect
                  },
              }
          })
          if (Chatmessages!=''&& Chatmessages){

              if (currentUser.SendEmail==true){
                  SendTranscriptEmail(currentUser.email,Chatmessages,currentUser.Name,allClients.find((x)=> x.SocketId == socket.id).ClientEmail,allClients.find((x)=> x.SocketId == socket.id).ClientEmail)

                  SendTranscriptEmail(allClients.find((x)=> x.SocketId == socket.id).ClientEmail,Chatmessages,currentUser.Name,allClients.find((x)=> x.SocketId == socket.id).ClientEmail,currentUser.Name)

              }else {

              }
          }

          let index = allClients.findIndex(x => x.SocketId ==socket.id);
          allClients.splice(index, 1);

      }
      });




    socket.on('new chat',async (msg,IPAddress,City,Country)=>{
        let chat=await Chats.findOne({where:{Chat_Cookie_id:msg.CookieID,BubbleID:msg.BubbleID}})
        let User=await user.findOne({where:{id:msg.Receiver_ID}})
        if(!chat) {


            //------------------ Sending Email to User ----------//

            var transporter =  nodemailer.createTransport({
                pool: true,
                host: "secure.emailsrvr.com",
                port: 465,
                secure: true, // use TLS
                auth: {
                    user: "contact@completegreet.com", // generated ethereal user
                    pass: "1212921509Azad",
                },

            });
            var html2="<!DOCTYPE HTML PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional //EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" +
                "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">\n" +
                "<head>\n" +
                "<!--[if gte mso 9]>\n" +
                "<xml>\n" +
                "  <o:OfficeDocumentSettings>\n" +
                "    <o:AllowPNG/>\n" +
                "    <o:PixelsPerInch>96</o:PixelsPerInch>\n" +
                "  </o:OfficeDocumentSettings>\n" +
                "</xml>\n" +
                "<![endif]-->\n" +
                "  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n" +
                "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
                "  <meta name=\"x-apple-disable-message-reformatting\">\n" +
                "  <!--[if !mso]><!--><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><!--<![endif]-->\n" +
                "  <title></title>\n" +
                "  \n" +
                "    <style type=\"text/css\">\n" +
                "      @media only screen and (min-width: 620px) {\n" +
                "  .u-row {\n" +
                "    width: 600px !important;\n" +
                "  }\n" +
                "  .u-row .u-col {\n" +
                "    vertical-align: top;\n" +
                "  }\n" +
                "\n" +
                "  .u-row .u-col-50 {\n" +
                "    width: 300px !important;\n" +
                "  }\n" +
                "\n" +
                "  .u-row .u-col-100 {\n" +
                "    width: 600px !important;\n" +
                "  }\n" +
                "\n" +
                "}\n" +
                "\n" +
                "@media (max-width: 620px) {\n" +
                "  .u-row-container {\n" +
                "    max-width: 100% !important;\n" +
                "    padding-left: 0px !important;\n" +
                "    padding-right: 0px !important;\n" +
                "  }\n" +
                "  .u-row .u-col {\n" +
                "    min-width: 320px !important;\n" +
                "    max-width: 100% !important;\n" +
                "    display: block !important;\n" +
                "  }\n" +
                "  .u-row {\n" +
                "    width: calc(100% - 40px) !important;\n" +
                "  }\n" +
                "  .u-col {\n" +
                "    width: 100% !important;\n" +
                "  }\n" +
                "  .u-col > div {\n" +
                "    margin: 0 auto;\n" +
                "  }\n" +
                "}\n" +
                "body {\n" +
                "  margin: 0;\n" +
                "  padding: 0;\n" +
                "}\n" +
                "\n" +
                "table,\n" +
                "tr,\n" +
                "td {\n" +
                "  vertical-align: top;\n" +
                "  border-collapse: collapse;\n" +
                "}\n" +
                "\n" +
                "p {\n" +
                "  margin: 0;\n" +
                "}\n" +
                "\n" +
                ".ie-container table,\n" +
                ".mso-container table {\n" +
                "  table-layout: fixed;\n" +
                "}\n" +
                "\n" +
                "* {\n" +
                "  line-height: inherit;\n" +
                "}\n" +
                "\n" +
                "a[x-apple-data-detectors='true'] {\n" +
                "  color: inherit !important;\n" +
                "  text-decoration: none !important;\n" +
                "}\n" +
                "\n" +
                "table, td { color: #000000; } #u_body a { color: #3b5dcd; text-decoration: underline; }\n" +
                "    </style>\n" +
                "  \n" +
                "  \n" +
                "\n" +
                "<!--[if !mso]><!--><link href=\"https://fonts.googleapis.com/css?family=Lato:400,700&display=swap\" rel=\"stylesheet\" type=\"text/css\"><!--<![endif]-->\n" +
                "\n" +
                "</head>\n" +
                "\n" +
                "<body class=\"clean-body u_body\" style=\"margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000\">\n" +
                "  <!--[if IE]><div class=\"ie-container\"><![endif]-->\n" +
                "  <!--[if mso]><div class=\"mso-container\"><![endif]-->\n" +
                "  <table id=\"u_body\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
                "  <tbody>\n" +
                "  <tr style=\"vertical-align: top\">\n" +
                "    <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +
                "    <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" style=\"background-color: #f9f9f9;\"><![endif]-->\n" +
                "    \n" +
                "\n" +
                "<div class=\"u-row-container\" style=\"padding: 0px;background-color: #f9f9f9\">\n" +
                "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;\">\n" +
                "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
                "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: #f9f9f9;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #f9f9f9;\"><![endif]-->\n" +
                "      \n" +
                "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
                "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
                "  <div style=\"height: 100%;width: 100% !important;\">\n" +
                "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
                "  \n" +
                "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
                "        \n" +
                "  <table height=\"0px\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #f9f9f9;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
                "    <tbody>\n" +
                "      <tr style=\"vertical-align: top\">\n" +
                "        <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
                "          <span>&#160;</span>\n" +
                "        </td>\n" +
                "      </tr>\n" +
                "    </tbody>\n" +
                "  </table>\n" +
                "\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "\n" +
                "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
                "  </div>\n" +
                "</div>\n" +
                "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
                "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</div>\n" +
                "\n" +
                "\n" +
                "\n" +
                "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
                "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;\">\n" +
                "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
                "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #ffffff;\"><![endif]-->\n" +
                "      \n" +
                "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
                "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
                "  <div style=\"height: 100%;width: 100% !important;\">\n" +
                "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
                "  \n" +
                "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:25px 10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
                "        \n" +
                "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "  <tr>\n" +
                "    <td style=\"padding-right: 0px;padding-left: 0px;\" align=\"center\">\n" +
                "      \n" +
                "      <img align=\"center\" border=\"0\" src=\"https://completegreet.com/images/CompleteGreet/FavIcon.png\" alt=\"Image\" title=\"Image\" style=\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;width:30px;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 29%;max-width: 168.2px;\" width=\"168.2\"/>\n" +
                "      \n" +
                "    </td>\n" +
                "  </tr>\n" +
                "</table>\n" +
                "\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "\n" +
                "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
                "  </div>\n" +
                "</div>\n" +
                "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
                "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</div>\n" +
                "\n" +
                "\n" +
                "\n" +
                "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
                "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #3b5dcd;\">\n" +
                "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
                "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #3b5dcd;\"><![endif]-->\n" +
                "      \n" +
                "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
                "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
                "  <div style=\"height: 100%;width: 100% !important;\">\n" +
                "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
                "  \n" +
                "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:35px 10px 10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
                "        \n" +
                "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
                "  <tr>\n" +
                "    <td style=\"padding-right: 0px;padding-left: 0px;\" align=\"center\">\n" +
                "      \n" +
                "      <img align=\"center\" border=\"0\" src=\"https://completegreet.com/images/CompleteGreet//Message.png\" alt=\"Image\" title=\"Image\" style=\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 10%;max-width: 58px;\" width=\"58\"/>\n" +
                "      \n" +
                "    </td>\n" +
                "  </tr>\n" +
                "</table>\n" +
                "\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "\n" +
                "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:0px 10px 30px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
                "        \n" +
                "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
                "    <p style=\"font-size: 14px; line-height: 140%; text-align: center;\"><span style=\"font-size: 28px; line-height: 39.2px; color: #ffffff; font-family: Lato, sans-serif;\">You have received a new new message </span></p>\n" +
                "  </div>\n" +
                "\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "\n" +
                "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
                "  </div>\n" +
                "</div>\n" +
                "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
                "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</div>\n" +
                "\n" +
                "\n" +
                "\n" +
                "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
                "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;\">\n" +
                "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
                "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #ffffff;\"><![endif]-->\n" +
                "      \n" +
                "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
                "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
                "  <div style=\"height: 100%;width: 100% !important;\">\n" +
                "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
                "  \n" +
                "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
                "        \n" +
                "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
                "    <p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 18px; line-height: 25.2px; color: #666666;\">Hello,</span></p>\n" +
                "<p style=\"font-size: 14px; line-height: 140%;\">&nbsp;</p>\n" +
                "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 18px; line-height: 25.2px; color: #666666;\">You have received a new message from "+msg.Sender_Email+" .</span></p>\n" +
                "<p style=\"font-size: 14px; line-height: 140%;\">&nbsp;</p>\n" +
                "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 18px; line-height: 25.2px; color: #666666;\">To view message, please follow the link below: </span></p>\n" +
                "  </div>\n" +
                "\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "\n" +
                "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:0px 40px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
                "        \n" +
                "  <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->\n" +
                "<div align=\"left\">\n" +
                "  <!--[if mso]><v:roundrect xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:w=\"urn:schemas-microsoft-com:office:word\" href=\"\" style=\"height:51px; v-text-anchor:middle; width:205px;\" arcsize=\"2%\"  stroke=\"f\" fillcolor=\"#CD7D3B\"><w:anchorlock/><center style=\"color:#FFFFFF;font-family:'Lato',sans-serif;\"><![endif]-->  \n" +
                "  <a href=\"https://completegreet.com/users/livechat/\" target=\"_blank\" class=\"v-button\" style=\"box-sizing: border-box;display: inline-block;font-family:'Lato',sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #CD7D3B; border-radius: 1px;-webkit-border-radius: 1px; -moz-border-radius: 1px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;\">\n" +
                "      <span style=\"display:block;padding:15px 40px;line-height:120%;\"><span style=\"font-size: 18px; line-height: 21.6px;\">View Message</span></span>\n" +
                "    </a>\n"+
                "  <!--[if mso]></center></v:roundrect><![endif]-->\n" +
                "</div>\n" +
                "\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "\n" +
                "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
                "        \n" +
                "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
                "    <p style=\"font-size: 14px; line-height: 140%;\"><span style=\"color: #888888; font-size: 14px; line-height: 19.6px;\"><em><span style=\"font-size: 16px; line-height: 22.4px;\"></span></em></span><br /><span style=\"color: #888888; font-size: 14px; line-height: 19.6px;\"><em><span style=\"font-size: 16px; line-height: 22.4px;\">&nbsp;</span></em></span></p>\n" +
                "  </div>\n" +
                "\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "\n" +
                "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
                "  </div>\n" +
                "</div>\n" +
                "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
                "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</div>\n" +
                "\n" +
                "\n" +
                "\n" +
                "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
                "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #3b5dcd;\">\n" +
                "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
                "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #3b5dcd;\"><![endif]-->\n" +
                "      \n" +
                "<!--[if (mso)|(IE)]><td align=\"center\" width=\"300\" style=\"width: 300px;padding: 20px 20px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
                "<div class=\"u-col u-col-50\" style=\"max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;\">\n" +
                "  <div style=\"height: 100%;width: 100% !important;\">\n" +
                "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 20px 20px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
                "  \n" +
                "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
                "        \n" +
                "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
                "    <p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 16px; line-height: 22.4px; color: #ecf0f1;\">Contact</span></p>\n" +
                "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px; color: #ecf0f1;\">Skivevej 177, 7500 Holstebro</span></p>\n" +
                "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px; color: #ecf0f1;\"> contact@completegreet.com</span></p>\n" +
                "  </div>\n" +
                "\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "\n" +
                "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
                "  </div>\n" +
                "</div>\n" +
                "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
                "<!--[if (mso)|(IE)]><td align=\"center\" width=\"300\" style=\"width: 300px;padding: 0px 0px 0px 20px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
                "<div class=\"u-col u-col-50\" style=\"max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;\">\n" +
                "  <div style=\"height: 100%;width: 100% !important;\">\n" +
                "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px 0px 0px 20px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
                "  \n" +
                "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:25px 10px 10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
                "        \n" +
                "<div align=\"left\">\n" +
                "  <div style=\"display: table; max-width:187px;\">\n" +
                "  <!--[if (mso)|(IE)]><table width=\"187\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"border-collapse:collapse;\" align=\"left\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:187px;\"><tr><![endif]-->\n" +
                "  \n" +
                "    \n" +
                "    <!--[if (mso)|(IE)]><td width=\"32\" style=\"width:32px; padding-right: 15px;\" valign=\"top\"><![endif]-->\n" +
                "    <table align=\"left\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"32\" height=\"32\" style=\"width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px\">\n" +
                "      <tbody><tr style=\"vertical-align: top\"><td align=\"left\" valign=\"middle\" style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +
                "      </td></tr>\n" +
                "    </tbody></table>\n" +
                "    <!--[if (mso)|(IE)]></td><![endif]-->\n" +
                "    \n" +
                "    <!--[if (mso)|(IE)]><td width=\"32\" style=\"width:32px; padding-right: 15px;\" valign=\"top\"><![endif]-->\n" +
                "    <table align=\"left\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"32\" height=\"32\" style=\"width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px\">\n" +
                "      <tbody><tr style=\"vertical-align: top\"><td align=\"left\" valign=\"middle\" style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +

                "      </td></tr>\n" +
                "    </tbody></table>\n" +
                "    <!--[if (mso)|(IE)]></td><![endif]-->\n" +
                "    \n" +
                "    <!--[if (mso)|(IE)]><td width=\"32\" style=\"width:32px; padding-right: 15px;\" valign=\"top\"><![endif]-->\n" +
                "    <table align=\"left\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"32\" height=\"32\" style=\"width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px\">\n" +
                "      <tbody><tr style=\"vertical-align: top\"><td align=\"left\" valign=\"middle\" style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +

                "      </td></tr>\n" +
                "    </tbody></table>\n" +
                "    <!--[if (mso)|(IE)]></td><![endif]-->\n" +
                "    \n" +
                "    <!--[if (mso)|(IE)]><td width=\"32\" style=\"width:32px; padding-right: 0px;\" valign=\"top\"><![endif]-->\n" +
                "    <table align=\"left\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"32\" height=\"32\" style=\"width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px\">\n" +
                "      <tbody><tr style=\"vertical-align: top\"><td align=\"left\" valign=\"middle\" style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +

                "      </td></tr>\n" +
                "    </tbody></table>\n" +
                "    <!--[if (mso)|(IE)]></td><![endif]-->\n" +
                "    \n" +
                "    \n" +
                "    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
                "  </div>\n" +
                "</div>\n" +
                "\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "\n" +
                "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:5px 10px 10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
                "        \n" +
                "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
                "    <p style=\"line-height: 140%; font-size: 14px;\"><span style=\"font-size: 14px; line-height: 19.6px;\"><span style=\"color: #ecf0f1; font-size: 14px; line-height: 19.6px;\"><span style=\"line-height: 19.6px; font-size: 14px;\">CompleteGreet &copy;&nbsp; All Rights Reserved</span></span></span></p>\n" +
                "  </div>\n" +
                "\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "\n" +
                "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
                "  </div>\n" +
                "</div>\n" +
                "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
                "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</div>\n" +
                "\n" +
                "\n" +
                "\n" +
                "<div class=\"u-row-container\" style=\"padding: 0px;background-color: #f9f9f9\">\n" +
                "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #3b5dcd;\">\n" +
                "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
                "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: #f9f9f9;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #3b5dcd;\"><![endif]-->\n" +
                "      \n" +
                "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
                "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
                "  <div style=\"height: 100%;width: 100% !important;\">\n" +
                "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
                "  \n" +
                "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
                "        \n" +
                "  <table height=\"0px\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #3b5dcd;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
                "    <tbody>\n" +
                "      <tr style=\"vertical-align: top\">\n" +
                "        <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
                "          <span>&#160;</span>\n" +
                "        </td>\n" +
                "      </tr>\n" +
                "    </tbody>\n" +
                "  </table>\n" +
                "\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "\n" +
                "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
                "  </div>\n" +
                "</div>\n" +
                "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
                "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</div>\n" +
                "\n" +
                "\n" +
                "\n" +
                "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
                "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;\">\n" +
                "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
                "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #f9f9f9;\"><![endif]-->\n" +
                "      \n" +
                "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
                "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
                "  <div style=\"height: 100%;width: 100% !important;\">\n" +
                "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
                "  \n" +
                "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
                "  <tbody>\n" +
                "    <tr>\n" +
                "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:0px 40px 30px 20px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
                "        \n" +
                "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
                "    \n" +
                "  </div>\n" +
                "\n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody>\n" +
                "</table>\n" +
                "\n" +
                "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
                "  </div>\n" +
                "</div>\n" +
                "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
                "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
                "    </div>\n" +
                "  </div>\n" +
                "</div>\n" +
                "\n" +
                "\n" +
                "    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->\n" +
                "    </td>\n" +
                "  </tr>\n" +
                "  </tbody>\n" +
                "  </table>\n" +
                "  <!--[if mso]></div><![endif]-->\n" +
                "  <!--[if IE]></div><![endif]-->\n" +
                "</body>\n" +
                "\n" +
                "</html>\n"
            var mailOptions = {
                from: '"Complete Greet" <contact@completegreet.com>',
                to: User.email,
                subject: 'New Message',
                text:"You Can Reset Your Password by Clicking the Following ",
                html:html2,
            };

            transporter.sendMail(mailOptions, function(error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            })
            ChatCode= msg.ChatCode
            let Subscriber=await Subscribers.findOne({where:{UserId:msg.Receiver_ID,isActive:1,isFinished:0}})

            // ,BubbleID:msg.BubbleID
            //----- Creating Chat if not Existed ----//
            Chats.create({
                Chat_Cookie_id: msg.CookieID,
                ClientName: msg.Sender_Name,
                ClientIPAddress: IPAddress,
                ClientCity: City,
                ClientCountry: Country,
                ChatCode:msg.ChatCode,
                ClientEmail: msg.Sender_Email,
                HosterID: msg.Receiver_ID,
                BubbleID: msg.BubbleID,
                Chat_Date: msg.date,
                NewChat: 1,
                SubscriberID:Subscriber.id ,

            }).then( async chat=> {

                if (chat.ClientCity==''||chat.ClientCity==null){

                }
                let Bubble=await Bubbles.findOne({where:{id:chat.BubbleID}})

                ChatID = chat.id

                //------------- Sending First Message --------//
                if (Bubble.BubbleGreetMsg.replace(/\s/g, '').length&&Bubble.BubbleGreetMsg!=null&&Bubble.BubbleGreetMsg!='') {
                    setTimeout(function (){
                        messages.create({
                            SenderID: chat.HosterID,
                            time:new Date(),
                            content: Bubble.BubbleGreetMsg,
                            UserId:chat.HosterID,
                            ReceiverID:chat.ClientEmail,
                            ChatId:ChatID,
                            BubbleID: chat.BubbleID,
                            ChatCode:ChatCode,
                            isRead:0
                        }).then(async message=>{
                            let CurrentUser=await user.findOne({where:{id:message.UserId}})
                            var UserImage=CurrentUser.Image
                            var ImageURL
                            if (UserImage==null){
                                ImageURL ="https://completegreet.com/images/CompleteGreet/FavIcon.png"
                            }else {
                                ImageURL="https://completegreet.com/files/users/"+CurrentUser.id+"/Avatar/"+UserImage
                            }

                            io.emit(ChatCode,message,chat,ImageURL);
                        })
                    },Bubble.BubbleFirstMessageDelay*1000)


                }else {

                }

                //--------------------------------------------//
                socket.on(chat.ChatCode,async (msg)=>{
                    // socket.removeAllListeners(ChatCode);

                    messages.create({
                        SenderID: msg.SenderID,
                        time:new Date(),
                        content: msg.text,
                        UserId:msg.UserId,
                        ReceiverID:msg.Receiver,
                        ChatId:ChatID,
                        BubbleID: msg.BubbleID,
                        ChatCode:ChatCode,
                        isRead:0
                    }).then(async message=>{
                        let chat=await Chats.findOne({where:{id:message.ChatId}})
                        chat.Chat_Date=Date.now()
                        chat.save()
                        if (message.SenderID==message.UserId){
                            let allmessages=await messages.findAll({where:{ChatId:message.ChatId,UserId:message.SenderID}})
                            allmessages.forEach(function (msg){
                                msg.isRead=1
                                msg.save()
                            })

                        }

                        let CurrentUser=await user.findOne({where:{id:message.UserId}})
                        var UserImage=CurrentUser.Image
                        var ImageURL
                        if (UserImage==null){
                            ImageURL ="https://completegreet.com/images/CompleteGreet/FavIcon.png"
                        }else {
                            ImageURL="https://completegreet.com/files/users/"+CurrentUser.id+"/Avatar/"+UserImage
                        }
                         
                    io.emit(chat.ChatCode,message,chat,ImageURL);
                    })

                })

                io.emit('new chat', chat,msg)
                socket.on(chat.ChatCode+"UL",async (msg)=>{
                    io.emit(chat.ChatCode+"ULURL","getinfo")
                })
                socket.on(chat.ChatCode+"ULURL",async (msg)=>{
                    io.emit(chat.ChatCode+"UL",msg)
                })
            })

        }else {
            // ChatCode= chat.ChatCode
            // ChatID=chat.id

        }


    })
    // assign()
    // function assign(){
    //     var timer=setInterval(function (){
    //         if (ChatCode==undefined||ChatID==undefined){
    //
    //         }else {
    //             Socket(ChatCode)
    //             clearInterval(timer)
    //
    //         }
    //     },100)
    //
    // }
    function Socket(ChatCode) {
        socket.on(ChatCode,async (msg)=>{
            // socket.removeAllListeners(ChatCode);
            let chat=await Chats.findOne({where:{ChatCode:ChatCode}})
            messages.create({
                SenderID: msg.SenderID,
                time:new Date(),
                content: msg.text,
                UserId:msg.UserId,
                ReceiverID:msg.Receiver,
                BubbleID: msg.BubbleID,
                ChatId:chat.id,
                ChatCode:ChatCode,
                isRead:0
            }).then(async message=>{
                let chat=await Chats.findOne({where:{id:message.ChatId}})


                let CurrentUser=await user.findOne({where:{id:message.UserId}})
                var UserImage=CurrentUser.Image
                var ImageURL
                if (UserImage==null){
                    ImageURL ="https://completegreet.com/images/CompleteGreet/FavIcon.png"
                }else {
                    ImageURL="https://completegreet.com/files/users/"+CurrentUser.id+"/Avatar/"+UserImage
                }
                 
                    io.emit(chat.ChatCode,message,chat,ImageURL);
            })

        })

    }
    var allChats= await Chats.findAll()

    if (allChats!=''){
        allChats.forEach(function (chat){

            socket.on(chat.ChatCode.toString(),async (msg)=>{
                // let chat=await Chats.findOne({where:{ChatCode:chat.ChatCode}})

                // socket.removeAllListeners(ChatCode);
                messages.create({
                    SenderID: msg.SenderID,
                    time:new Date(),
                    content: msg.text,
                    UserId:msg.UserId,
                    ReceiverID:msg.Receiver,
                    ChatId:chat.id,
                    BubbleID: msg.BubbleID,
                    ChatCode:chat.ChatCode,
                    isRead:0
                }).then(async message=>{
                    let chat=await Chats.findOne({where:{id:message.ChatId}})

                    chat.Chat_Date=Date.now()
                    chat.save()
                    if (message.SenderID==message.UserId){
                        let allmessages=await messages.findAll({where:{ChatId:message.ChatId,UserId:message.SenderID}})
                        allmessages.forEach(function (msg){
                            msg.isRead=1
                            msg.save()
                        })

                    }
                    let CurrentUser=await user.findOne({where:{id:message.UserId}})
                    var UserImage=CurrentUser.Image
                    var ImageURL
                    if (UserImage==null){
                       ImageURL ="https://completegreet.com/images/CompleteGreet/FavIcon.png"
                    }else {
                        ImageURL="https://completegreet.com/files/users/"+CurrentUser.id+"/Avatar/"+UserImage
                    }

                     
                    io.emit(chat.ChatCode,message,chat,ImageURL);
                })

            })
            socket.on(chat.ChatCode+"UL",async (msg)=>{
                io.emit(chat.ChatCode+"ULURL","getinfo")
            })
            socket.on(chat.ChatCode+"ULURL",async (msg)=>{
                io.emit(chat.ChatCode+"UL",msg)
            })

        })
    }
    socket.on('new User chat',async (msg,IPAddress,City,Country)=>{
        let chat=await Chats.findOne({where:{Chat_Cookie_id:msg.CookieID}})
        if(!chat) {
            socket.on(chat.ChatCode,async (msg)=>{
                // socket.removeAllListeners(ChatCode);

                messages.create({
                    SenderID: msg.SenderID,
                    time:new Date(),
                    content: msg.text,
                    UserId:msg.UserId,
                    ReceiverID:msg.Receiver,
                    ChatId:chat.id,
                    BubbleID: msg.BubbleID,
                    ChatCode:chat.ChatCode,
                    isRead:0
                }).then(async message=>{
                    let chat=await Chats.findOne({where:{id:message.ChatId}})
                    chat.Chat_Date=Date.now()
                    chat.save()
                    if (message.SenderID==message.UserId){
                        let allmessages=await messages.findAll({where:{ChatId:message.ChatId,UserId:message.SenderID}})
                        allmessages.forEach(function (msg){
                            msg.isRead=1
                            msg.save()
                        })

                    }

                    let CurrentUser=await user.findOne({where:{id:message.UserId}})
                    var UserImage=CurrentUser.Image
                    var ImageURL
                    if (UserImage==null){
                        ImageURL ="https://completegreet.com/images/CompleteGreet/FavIcon.png"
                    }else {
                        ImageURL="https://completegreet.com/files/users/"+CurrentUser.id+"/Avatar/"+UserImage
                    }
                     
                    io.emit(chat.ChatCode,message,chat,ImageURL);
                })

            })
            socket.on(chat.ChatCode+"UL",async (msg)=>{
                io.emit(chat.ChatCode+"ULURL","getinfo")
         

            })
            socket.on(chat.ChatCode+"ULURL",async (msg)=>{
                io.emit(chat.ChatCode+"UL",msg)
            })

        }else {
            socket.on(chat.ChatCode,async (msg)=>{
                // socket.removeAllListeners(ChatCode);

                messages.create({
                    SenderID: msg.SenderID,
                    time:new Date(),
                    content: msg.text,
                    UserId:msg.UserId,
                    ReceiverID:msg.Receiver,
                    ChatId:chat.id,
                    BubbleID: msg.BubbleID,
                    ChatCode:chat.ChatCode,
                    isRead:0
                }).then(async message=>{
                    let chat=await Chats.findOne({where:{id:message.ChatId}})
                    chat.Chat_Date=Date.now()
                    chat.save()
                    if (message.SenderID==message.UserId){
                        let allmessages=await messages.findAll({where:{ChatId:message.ChatId,UserId:message.SenderID}})
                        allmessages.forEach(function (msg){
                            msg.isRead=1
                            msg.save()
                        })

                    }

                    let CurrentUser=await user.findOne({where:{id:message.UserId}})
                    var UserImage=CurrentUser.Image
                    var ImageURL
                    if (UserImage==null){
                        ImageURL ="https://completegreet.com/images/CompleteGreet/FavIcon.png"
                    }else {
                        ImageURL="https://completegreet.com/files/users/"+CurrentUser.id+"/Avatar/"+UserImage
                    }
                     
                    io.emit(chat.ChatCode,message,chat,ImageURL);
                })

            })
            socket.on(chat.ChatCode+"UL",async (msg)=>{
                io.emit(chat.ChatCode+"ULURL","getinfo")
            })
            socket.on(chat.ChatCode+"ULURL",async (msg)=>{
                io.emit(chat.ChatCode+"UL",msg)
            })

        }


    })

})



router.post('/Avatar-Upload', function (req, res, next) {
    var CroppedAvatar=req.body.CroppedAvatar
    var coachID=req.user.id
    var Coach=req.user
     var CroppedAvatarEdit=CroppedAvatar.split(";");
    var FinalCroppedAvatar=CroppedAvatarEdit[1].split(',')
    var timeSaved=Date.now()
    Coach.CroppedImage="Profile-Pic-"+timeSaved+"Cropped.png"
    Coach.save()

    fe.writeFile(`public/images/Coaches-Avatar/${coachID}/Profile-Pic-${timeSaved}Cropped.png`, FinalCroppedAvatar[1], 'base64', function(err) {
        console.log(err);
    });

    res.json({Success:"Success"})

});
router.post('/upload', ensureAuthenticated,function (req, res, next) {
    var coach = req.user;
    var coachID=req.user.id


    var avatars = multer.diskStorage({
        destination: (req, file, callback) => {
            //  a file will automatically created for every coach/user and will store every thing belongs to
            // them in their file
            // let path = `public/images/`
            let path = `public/files/users/${coachID}/Avatar/`
            //  hnst5dmha 34an n5ly kol wa7d le file byt5zn fe el 7aga

            fs.mkdirsSync(path);
            callback(null, path);
        },
        filename: function (req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));

        }
    });
    var avatar = multer({
        storage: avatars,
        fileFilter: checkAvatar
    }).single('Profile-Pic');


    function checkAvatar(req, file, cb) {
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

    avatar(req,res,(err)=>{
        if (err){
            res.json({error:err})
        }else
            if(req.file.filename==undefined){
                res.json({error:"not found"})

            }
        else {
           coach.Image= req.file.filename;
           coach.save();
                res.json({Success:"Success"})

            }
    })

});
router.get('/cron',async function (req, res, next) {
    // var counter=0
    // cron.schedule('*/3 * * * * *', () => {
    //     console.log(counter);
    //     counter++
    // });
    var  Chatmessage=await messages.findAll()
    SendTranscriptEmail("abdallah22335@hotmail.com",Chatmessage,"Ahmed","william")

});

async function  SendTranscriptEmail(email,Chatmessages,ReceiverName,UserName,Chatwith){
    var transporter = await nodemailer.createTransport({
        pool: true,
        host: "secure.emailsrvr.com",
        port: 465,
        secure: true, // use TLS
        auth: {
            user: "contact@completegreet.com", // generated ethereal user
            pass: "1212921509Azad",
        },

    });
    let transcriptcont=''
    Chatmessages.forEach(function (msg){
        if (isNaN(msg.ReceiverID)){
            transcriptcont+=    "<p style=\"font-size: 14px; line-height: 140%;\">&nbsp;</p>\n" +
                "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 18px; line-height: 25.2px; color: #666666;\"> <span style='color: #3B5DCD;font-size: 13px' > ["+msg.createdAt.toLocaleString().replace("T"," ").replace(","," ")+"] <span style='font-size: 18px'> "+ReceiverName+":</span></span> <br>"+msg.content+" </span></p>\n"


        }else {
            transcriptcont+=    "<p style=\"font-size: 14px; line-height: 140%;\">&nbsp;</p>\n" +
                "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 18px; line-height: 25.2px; color: #666666;\"> <span style='color: #3B5DCD;font-size: 13px' > ["+msg.createdAt.toLocaleString().replace("T"," ").replace(","," ")+"] <span style='font-size: 18px'> "+UserName+":</span></span> <br>"+msg.content+" </span></p>\n"

        }
      })
    var html2="<!DOCTYPE HTML PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional //EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n" +
        "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:v=\"urn:schemas-microsoft-com:vml\" xmlns:o=\"urn:schemas-microsoft-com:office:office\">\n" +
        "<head>\n" +
        "<!--[if gte mso 9]>\n" +
        "<xml>\n" +
        "  <o:OfficeDocumentSettings>\n" +
        "    <o:AllowPNG/>\n" +
        "    <o:PixelsPerInch>96</o:PixelsPerInch>\n" +
        "  </o:OfficeDocumentSettings>\n" +
        "</xml>\n" +
        "<![endif]-->\n" +
        "  <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n" +
        "  <meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">\n" +
        "  <meta name=\"x-apple-disable-message-reformatting\">\n" +
        "  <!--[if !mso]><!--><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge\"><!--<![endif]-->\n" +
        "  <title></title>\n" +
        "  \n" +
        "    <style type=\"text/css\">\n" +
        "      @media only screen and (min-width: 620px) {\n" +
        "  .u-row {\n" +
        "    width: 600px !important;\n" +
        "  }\n" +
        "  .u-row .u-col {\n" +
        "    vertical-align: top;\n" +
        "  }\n" +
        "\n" +
        "  .u-row .u-col-50 {\n" +
        "    width: 300px !important;\n" +
        "  }\n" +
        "\n" +
        "  .u-row .u-col-100 {\n" +
        "    width: 600px !important;\n" +
        "  }\n" +
        "\n" +
        "}\n" +
        "\n" +
        "@media (max-width: 620px) {\n" +
        "  .u-row-container {\n" +
        "    max-width: 100% !important;\n" +
        "    padding-left: 0px !important;\n" +
        "    padding-right: 0px !important;\n" +
        "  }\n" +
        "  .u-row .u-col {\n" +
        "    min-width: 320px !important;\n" +
        "    max-width: 100% !important;\n" +
        "    display: block !important;\n" +
        "  }\n" +
        "  .u-row {\n" +
        "    width: calc(100% - 40px) !important;\n" +
        "  }\n" +
        "  .u-col {\n" +
        "    width: 100% !important;\n" +
        "  }\n" +
        "  .u-col > div {\n" +
        "    margin: 0 auto;\n" +
        "  }\n" +
        "}\n" +
        "body {\n" +
        "  margin: 0;\n" +
        "  padding: 0;\n" +
        "}\n" +
        "\n" +
        "table,\n" +
        "tr,\n" +
        "td {\n" +
        "  vertical-align: top;\n" +
        "  border-collapse: collapse;\n" +
        "}\n" +
        "\n" +
        "p {\n" +
        "  margin: 0;\n" +
        "}\n" +
        "\n" +
        ".ie-container table,\n" +
        ".mso-container table {\n" +
        "  table-layout: fixed;\n" +
        "}\n" +
        "\n" +
        "* {\n" +
        "  line-height: inherit;\n" +
        "}\n" +
        "\n" +
        "a[x-apple-data-detectors='true'] {\n" +
        "  color: inherit !important;\n" +
        "  text-decoration: none !important;\n" +
        "}\n" +
        "\n" +
        "table, td { color: #000000; } #u_body a { color: #3b5dcd; text-decoration: underline; }\n" +
        "    </style>\n" +
        "  \n" +
        "  \n" +
        "\n" +
        "<!--[if !mso]><!--><link href=\"https://fonts.googleapis.com/css?family=Lato:400,700&display=swap\" rel=\"stylesheet\" type=\"text/css\"><!--<![endif]-->\n" +
        "\n" +
        "</head>\n" +
        "\n" +
        "<body class=\"clean-body u_body\" style=\"margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #f9f9f9;color: #000000\">\n" +
        "  <!--[if IE]><div class=\"ie-container\"><![endif]-->\n" +
        "  <!--[if mso]><div class=\"mso-container\"><![endif]-->\n" +
        "  <table id=\"u_body\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #f9f9f9;width:100%\" cellpadding=\"0\" cellspacing=\"0\">\n" +
        "  <tbody>\n" +
        "  <tr style=\"vertical-align: top\">\n" +
        "    <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +
        "    <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td align=\"center\" style=\"background-color: #f9f9f9;\"><![endif]-->\n" +
        "    \n" +
        "\n" +
        "<div class=\"u-row-container\" style=\"padding: 0px;background-color: #f9f9f9\">\n" +
        "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;\">\n" +
        "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
        "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: #f9f9f9;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #f9f9f9;\"><![endif]-->\n" +
        "      \n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <table height=\"0px\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #f9f9f9;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
        "    <tbody>\n" +
        "      <tr style=\"vertical-align: top\">\n" +
        "        <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
        "          <span>&#160;</span>\n" +
        "        </td>\n" +
        "      </tr>\n" +
        "    </tbody>\n" +
        "  </table>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
        "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;\">\n" +
        "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
        "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #ffffff;\"><![endif]-->\n" +
        "      \n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:25px 10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
        "  <tr>\n" +
        "    <td style=\"padding-right: 0px;padding-left: 0px;\" align=\"center\">\n" +
        "      \n" +
        "      <img align=\"center\" border=\"0\" src=\"https://completegreet.com/images/CompleteGreet/FavIcon.png\" alt=\"Image\" title=\"Image\" style=\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;width:30px;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 29%;max-width: 168.2px;\" width=\"168.2\"/>\n" +
        "      \n" +
        "    </td>\n" +
        "  </tr>\n" +
        "</table>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
        "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #3b5dcd;\">\n" +
        "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
        "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #3b5dcd;\"><![endif]-->\n" +
        "      \n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:35px 10px 10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "<table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n" +
        "  <tr>\n" +
        "    <td style=\"padding-right: 0px;padding-left: 0px;\" align=\"center\">\n" +
        "      \n" +
        "      <img align=\"center\" border=\"0\" src=\"https://completegreet.com/images/CompleteGreet//Message.png\" alt=\"Image\" title=\"Image\" style=\"outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 10%;max-width: 58px;\" width=\"58\"/>\n" +
        "      \n" +
        "    </td>\n" +
        "  </tr>\n" +
        "</table>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:0px 10px 30px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
        "    <p style=\"font-size: 14px; line-height: 140%; text-align: center;\"><span style=\"font-size: 28px; line-height: 39.2px; color: #ffffff; font-family: Lato, sans-serif;\">Chat Transcript Email </span></p>\n" +
        "  </div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
        "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;\">\n" +
        "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
        "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #ffffff;\"><![endif]-->\n" +
        "      \n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
        "    <p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 18px; line-height: 25.2px; color: #666666;\">Hello,</span></p>\n" +
        "<p style=\"font-size: 14px; line-height: 140%;\">&nbsp;</p>\n" +
        "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 18px; line-height: 25.2px; color: #666666;\">here is a transcript for the chat you with "+Chatwith+":</span></p>\n" +
        "  <table height=\"0px\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #3b5dcd;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
        "    <tbody>\n" +
        "      <tr style=\"vertical-align: top\">\n" +
        "        <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
        "          <span>&#160;</span>\n" +
        "        </td>\n" +
        "      </tr>\n" +
        "    </tbody>\n" +
        "  </table>\n" +
        " "+`${transcriptcont}`+"" +
        "  <table height=\"0px\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #3b5dcd;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
        "    <tbody>\n" +
        "      <tr style=\"vertical-align: top\">\n" +
        "        <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
        "          <span>&#160;</span>\n" +
        "        </td>\n" +
        "      </tr>\n" +
        "    </tbody>\n" +
        "  </table>\n" +
       "  </div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +

        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:0px 40px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->\n" +
        "<div align=\"left\">\n" +

        "</div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:40px 40px 30px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
        "    <p style=\"font-size: 14px; line-height: 140%;\"><span style=\"color: #888888; font-size: 14px; line-height: 19.6px;\"><em><span style=\"font-size: 16px; line-height: 22.4px;\"></span></em></span><br /><span style=\"color: #888888; font-size: 14px; line-height: 19.6px;\"><em><span style=\"font-size: 16px; line-height: 22.4px;\">&nbsp;</span></em></span></p>\n" +
        "  </div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
        "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #3b5dcd;\">\n" +
        "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
        "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #3b5dcd;\"><![endif]-->\n" +
        "      \n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"300\" style=\"width: 300px;padding: 20px 20px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-50\" style=\"max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 20px 20px 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
        "    <p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 16px; line-height: 22.4px; color: #ecf0f1;\">Contact</span></p>\n" +
        "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px; color: #ecf0f1;\">Skivevej 177, 7500 Holstebro</span></p>\n" +
        "<p style=\"font-size: 14px; line-height: 140%;\"><span style=\"font-size: 14px; line-height: 19.6px; color: #ecf0f1;\"> contact@completegreet.com</span></p>\n" +
        "  </div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"300\" style=\"width: 300px;padding: 0px 0px 0px 20px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-50\" style=\"max-width: 320px;min-width: 300px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px 0px 0px 20px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:25px 10px 10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "<div align=\"left\">\n" +
        "  <div style=\"display: table; max-width:187px;\">\n" +
        "  <!--[if (mso)|(IE)]><table width=\"187\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"border-collapse:collapse;\" align=\"left\"><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:187px;\"><tr><![endif]-->\n" +
        "  \n" +
        "    \n" +
        "    <!--[if (mso)|(IE)]><td width=\"32\" style=\"width:32px; padding-right: 15px;\" valign=\"top\"><![endif]-->\n" +
        "    <table align=\"left\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"32\" height=\"32\" style=\"width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px\">\n" +
        "      <tbody><tr style=\"vertical-align: top\"><td align=\"left\" valign=\"middle\" style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +
        "      </td></tr>\n" +
        "    </tbody></table>\n" +
        "    <!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "    \n" +
        "    <!--[if (mso)|(IE)]><td width=\"32\" style=\"width:32px; padding-right: 15px;\" valign=\"top\"><![endif]-->\n" +
        "    <table align=\"left\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"32\" height=\"32\" style=\"width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px\">\n" +
        "      <tbody><tr style=\"vertical-align: top\"><td align=\"left\" valign=\"middle\" style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +

        "      </td></tr>\n" +
        "    </tbody></table>\n" +
        "    <!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "    \n" +
        "    <!--[if (mso)|(IE)]><td width=\"32\" style=\"width:32px; padding-right: 15px;\" valign=\"top\"><![endif]-->\n" +
        "    <table align=\"left\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"32\" height=\"32\" style=\"width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 15px\">\n" +
        "      <tbody><tr style=\"vertical-align: top\"><td align=\"left\" valign=\"middle\" style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +

        "      </td></tr>\n" +
        "    </tbody></table>\n" +
        "    <!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "    \n" +
        "    <!--[if (mso)|(IE)]><td width=\"32\" style=\"width:32px; padding-right: 0px;\" valign=\"top\"><![endif]-->\n" +
        "    <table align=\"left\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" width=\"32\" height=\"32\" style=\"width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px\">\n" +
        "      <tbody><tr style=\"vertical-align: top\"><td align=\"left\" valign=\"middle\" style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top\">\n" +

        "      </td></tr>\n" +
        "    </tbody></table>\n" +
        "    <!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "    \n" +
        "    \n" +
        "    <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:5px 10px 10px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
        "    <p style=\"line-height: 140%; font-size: 14px;\"><span style=\"font-size: 14px; line-height: 19.6px;\"><span style=\"color: #ecf0f1; font-size: 14px; line-height: 19.6px;\"><span style=\"line-height: 19.6px; font-size: 14px;\">CompleteGreet &copy;&nbsp; All Rights Reserved</span></span></span></p>\n" +
        "  </div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "<div class=\"u-row-container\" style=\"padding: 0px;background-color: #f9f9f9\">\n" +
        "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #3b5dcd;\">\n" +
        "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
        "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: #f9f9f9;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #3b5dcd;\"><![endif]-->\n" +
        "      \n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <table height=\"0px\" align=\"center\" border=\"0\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" style=\"border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #3b5dcd;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
        "    <tbody>\n" +
        "      <tr style=\"vertical-align: top\">\n" +
        "        <td style=\"word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%\">\n" +
        "          <span>&#160;</span>\n" +
        "        </td>\n" +
        "      </tr>\n" +
        "    </tbody>\n" +
        "  </table>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "\n" +
        "\n" +
        "<div class=\"u-row-container\" style=\"padding: 0px;background-color: transparent\">\n" +
        "  <div class=\"u-row\" style=\"Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #f9f9f9;\">\n" +
        "    <div style=\"border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;\">\n" +
        "      <!--[if (mso)|(IE)]><table width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\"><tr><td style=\"padding: 0px;background-color: transparent;\" align=\"center\"><table cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"width:600px;\"><tr style=\"background-color: #f9f9f9;\"><![endif]-->\n" +
        "      \n" +
        "<!--[if (mso)|(IE)]><td align=\"center\" width=\"600\" style=\"width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\" valign=\"top\"><![endif]-->\n" +
        "<div class=\"u-col u-col-100\" style=\"max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;\">\n" +
        "  <div style=\"height: 100%;width: 100% !important;\">\n" +
        "  <!--[if (!mso)&(!IE)]><!--><div style=\"height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;\"><!--<![endif]-->\n" +
        "  \n" +
        "<table style=\"font-family:'Lato',sans-serif;\" role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" width=\"100%\" border=\"0\">\n" +
        "  <tbody>\n" +
        "    <tr>\n" +
        "      <td style=\"overflow-wrap:break-word;word-break:break-word;padding:0px 40px 30px 20px;font-family:'Lato',sans-serif;\" align=\"left\">\n" +
        "        \n" +
        "  <div style=\"line-height: 140%; text-align: left; word-wrap: break-word;\">\n" +
        "    \n" +
        "  </div>\n" +
        "\n" +
        "      </td>\n" +
        "    </tr>\n" +
        "  </tbody>\n" +
        "</table>\n" +
        "\n" +
        "  <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->\n" +
        "  </div>\n" +
        "</div>\n" +
        "<!--[if (mso)|(IE)]></td><![endif]-->\n" +
        "      <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->\n" +
        "    </div>\n" +
        "  </div>\n" +
        "</div>\n" +
        "\n" +
        "\n" +
        "    <!--[if (mso)|(IE)]></td></tr></table><![endif]-->\n" +
        "    </td>\n" +
        "  </tr>\n" +
        "  </tbody>\n" +
        "  </table>\n" +
        "  <!--[if mso]></div><![endif]-->\n" +
        "  <!--[if IE]></div><![endif]-->\n" +
        "</body>\n" +
        "\n" +
        "</html>\n"
    var mailOptions = {
        from: '"Complete Greet" <contact@completegreet.com>',
        to: email,
        subject: 'noreply@completegreet.com',
        text:"You Can Reset Your Password by Clicking the Following ",
        html:html2,
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = router;

