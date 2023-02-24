var query=require('querystring');
const Sequelize = require("sequelize");
var Subscribers = require('../models').Subscribers;
const Op = Sequelize.Op;

module.exports={
    ensureAuthenticated:function (req,res,next) {
if(!req.isAuthenticated()){
    var first = req.originalUrl;

    first.indexOf(1);

    first.toLowerCase();

    first = first.split("/")[1];
    if (first=="checkout"){
        res.redirect('/register/User?SubS');

    }else {
        req.flash('error_msg','Login to view this page.');
        /*
        bashof lw el user kan wa2f fe page mo3yna w lw kda  bb3t el link bta3 el page dh fe el url bta3 el
         login page
        */
        const v=req.originalUrl;
        let abdo=query.stringify({
            "essa":v
        })
        res.redirect('/login?'+abdo);
    }

} else{
    next();
}



    },
    NotAuthenticated:function (req,res,next) {
        if(req.isAuthenticated()){
            return res.redirect('/Users/Dashboard');
        } else{
            next();
        }

    },

    isAdmin:function (req,res,next) {
var user=req.user;
if(user.userGroup==1200){
    next();
}
else {
    req.flash('error_msg','You are not Authorized to see this page');
    res.redirect('/login');
}
    },
    isSubscribed:async function (req,res,next) {
        let Logged =req.user
        const NOW = new Date();

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
        if (CurrentSubscriber&&CurrentSubscriber!=''){
            next()
        }else {
            res.redirect('/logout')
        }
    },

}