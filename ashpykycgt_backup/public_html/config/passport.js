var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy
var RememberMeStrategy=require('passport-remember-me').Strategy
var user = require('../models').User;
var bcrypt = require('bcryptjs');
var utils = require('../config/utils');
var flash = require('connect-flash');
const Chance = require('chance');

passport.use(new LocalStrategy({usernameField: 'email',passwordField: "password",}, function (email, password, done) {
    user.findOne({where: {email: email}}).then(user => {
        if (!user) {
            return done(null, false, {message: 'Email is not Registered.'})
        }
        bcrypt.compare(password, user.password, function (err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {

                return done(null, false, {message: 'Incorrect Password.'})
            }
        })
    }).catch(err => console.log(err))
}))

    passport.use(
        new GoogleStrategy(
            {
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: '/auth/google/callback',
            },
            async (accessToken, refreshToken, profile, done) => {
                const newUser = {
                    googleId: profile.id,
                    displayName: profile.displayName,
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    image: profile.photos[0].value,
                }

                try {
                    let User = await user.findOne({where:{ googleId: profile.id }})
                    if (User) {
                        // done(null, User)
                    } else {
                        // User = await User.create(newUser)
                        done(null, profile)
                    }
                } catch (err) {
                    console.error(err)
                }
            }
        )
    )
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    user.findOne({where: {id: id}}).then((user) => {
        done(null, user);
    }).catch(err => console.log(err));
});
//   token is then issued to replace it.
passport.use(new RememberMeStrategy(
    function (token, done) {
        User
            .findOne({where: {RememberHash: token}})
            .then(function (user) {
                if (user) {
                    user.update({
                        RememberHash: null
                    }).then(result => {
                        return done(null, user);
                    });
                } else {
                    return done(null, false);
                }


            }).catch(function (err) {
            return done(err, null);
        });

    }, issueToken
));

function issueToken(user, done) {
    let chance = new Chance();
    let token = chance.word({length: 60});
    user.update({
        RememberHash: token
    }).then(result => {
        return done(null, token);
    }).catch(err => {
        return done(err);
    })
}