var createError = require('http-errors');
var express = require('express');
var bodyParser = require('body-parser');
var back = require('express-back');
var flash = require('connect-flash');
var path = require('path');
const session = require('express-session');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var passport=require('passport');
const db = require('./models/index');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var registerRouter = require('./routes/Register');
var adminRouter = require('./routes/Admin');
const cors = require('cors');
const dotenv = require('dotenv')
dotenv.config({ path: './config/config.env' })
var Plans = require('./models').Plans;
var user = require('./models').User;
var SystemInfo = require('./models').SystemInfo;
const Chance = require('chance');
let chance = new Chance();
require('./config/passport');
const bcrypt = require("bcryptjs");
var Bubbles = require('./models').Bubbles;
const SequelizeStore = require("connect-session-sequelize")(session.Store);

var app = express();
db.sequelize.authenticate().then( ()=>console.log("DB Connection") ).catch(err=>console.log("error"+err))
//------------ Allowing Other Cross Platform ----------//
const corsOptions ={
  // origin:'http://localhost:4600',
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200
}
//-------- Inserting default data to the database -------------//
app.use(async function(req, res, next) {
  var plans=await Plans.findAll()
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
  if (plans==''){
    for (var i=1;i<=5;i++){
      if (i==1){
        Plans.create({
          PName:"Free" ,
          // Description:{  type: DataTypes.JSON,defaultValue: '["'},
          Duration:1,
          Order: i,
          Price:0,
          Code:"CGBasicPType",
        })
      }else if (i==2){
        Plans.create({
          PName:"Build" ,
          // Description:{  type: DataTypes.JSON,defaultValue: '["'},
          Duration:1,
          Order: i,
          Price:19,
          Code:"CGBuildPType",
        })
      }else if (i==3){
        Plans.create({
          PName:"Growth" ,
          // Description:{  type: DataTypes.JSON,defaultValue: '["'},
          Duration:1,
          Order: i,
          Price:25,
          Code:"CGGrowthPType",
        })
      }else if (i==4){
        Plans.create({
          PName:"Expand" ,
          // Description:{  type: DataTypes.JSON,defaultValue: '["'},
          Duration:1,
          Order: i,
          Price:49,
          Code:"CGExpandPType",
        })
      }else if (i==5){
        Plans.create({
          PName:"Scale" ,
          // Description:{  type: DataTypes.JSON,defaultValue: '["'},
          Duration:1,
          Order: i,
          Price:99,
          Code:"CGScalePType",
        })
      }

    }
  }
  var Users= await user.findAll()
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync("CGAdmin404", salt);
  var BubbleCode = await chance.guid()

  if (Users==''){
    user.create(
        {
          userGroup:1200,
          Name: "Admin",
          email: "Admin@completegreet.com",
          password:hash,
          BusinessName:"Complete Greet",
          Industry:"SAAS",
          WebsiteURL:"Completegreet.com ",
          Goals:"Goals",
          isEnrolled:0,
          Banned: 0,
          Verified: 1,
          VerifyCode: "none",
        }).then( async adminuser=>{
      Bubbles.create({
        BubbleName: "Complete Greet",
        BubbleVideo: "CompleteGreetDemo.mp4",
        BubbleGif: "CompleteGreetDemo.gif",
        BubbleFontSize: "23",
        BubbleTitle: "Hey!",
        BubbleSize: "175",
        BubbleDelay: 4,
        BubbleBorderColor: "#3B5DCD",
        BubbleBackgroundColor: "#ffffff",
        BubbleButtonColor: "#CD7D3B",
        BubbleFontFamily: "Helvetica",
        BubbleDarken: 0,
        BubbleStyle:"Circle",
        BubblePosition: "Right",
        BubbleVideoFit: 1,
        BubbleAnimation: "Top-to-bottom",
        BubbleCode: BubbleCode,
        IsDeleted:0,
        UserId:adminuser.id
      })
    })
  }

  let System= await SystemInfo.findAll()
  if (System==''){
    SystemInfo.create({
      LogoImage: "Dashboard-logo.png",
      MetaTitle: "Add Meta Title",
      MetaDescription: "Add Meta Description",
      NotificationSound: "https://assets.mixkit.co/sfx/preview/mixkit-happy-bells-notification-937.mp3",
      BubbleId:1,
      Code:"CGSystem",
      MaxVideoSize:10000,
    })
  }
next()
});
async function SystemInfoRender(req, res, next) {
  let System = await SystemInfo.findAll()
  let Bubble=await Bubbles.findOne({where:{id:System[0].BubbleId}})
  res.locals.System = System;
  res.locals.SystemBubbleCode = Bubble.BubbleCode;
  next();
}
const sessionStore = new SequelizeStore({
  db: db.sequelize,
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.use('/dist', express.static(path.join(__dirname, 'node_modules/admin-lte/dist')));
app.use('/plugins', express.static(path.join(__dirname, 'node_modules/admin-lte/plugins')));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  parameterLimit: 100000,
  limit: '50mb',
  extended: true
}));
app.use(cors(corsOptions));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser('shhhhhhhhhhh'));


app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: 'ww2ww2ww2',
  cookie: { maxAge: 100000000 },
  saveUninitialized: true,
  store: sessionStore,
  resave: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(back());
app.use(flash());
app.use(function (req,res,next) {
  res.locals.errorn=req.flash('error');
  res.locals.error_msg=req.flash('error_msg');
  res.locals.Success_msg=req.flash('Success_msg');

  res.locals.isAuth=req.isAuthenticated();
  next();
});
app.use(SystemInfoRender);


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/Register', registerRouter);
app.use('/CG-Admin', adminRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {


  // next(createError(404));
  res.status(404).render("404")

});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
