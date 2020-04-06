var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//passport references for auth
var passport = require('passport')
var session = require('express-session')

// add mongoose for db connection
var mongoose = require('mongoose')

var usersController = require('./controllers/users');

// add reference to meals and mealTypes controllers
var mealsController = require('./controllers/meals')
var mealTypesController = require('./controllers/mealTypes')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// db connection
var globals = require('./config/globals')

mongoose.connect(globals.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(
    (res) => {
      console.log('Connected to MongoDB')
    }
).catch(() => {
  console.log('Connection to MongoDB failed')
})


// passport auth config
// 1. set app to manage sessions
app.use(session({
    secret: '2020$mealplanner',
    resave: true,
    saveUninitialized: false
}))

// 2. initialize passport
app.use(passport.initialize())
app.use(passport.session())

// 3. link passport to the User model
var User = require('./models/user')
passport.use(User.createStrategy())

// 4. set up passport to read/write user data to/from the session object so as user moves thru site can constantly id them
//now modified for fb
// passport.deserializeUser(User.deserializeUser())
// passport.serializeUser(User.serializeUser())


// google auth
var googleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new googleStrategy({
        clientID: globals.ids.google.clientID,
        clientSecret: globals.ids.google.clientSecret,
        callbackURL: globals.ids.google.callbackURL
    },
    (token, tokenSecret, profile, done) => {
        // logic to evaluate what we got back from google
        User.findOne({oauthID: profile.id}, (err, user) => {
            if (err) {
                console.log(err)
            }

            // no error and we already have this user in mongodb users collection so pass the user on to the next method
            if (!err && user !== null) {
                done(null, user)
            }
            else {
                // user does not exist so create a new user from this google profile
                user = new User({
                    username: profile.displayName,
                    oauthID: profile.id,
                    oauthProvider: 'Google',
                    created: Date.now()
                })

                user.save((err) => {
                    if (err) {
                        console.log(err)
                    }
                    else {
                        done(null, user)
                    }
                })
            }
        })
    }
))


// // facebook login w/passport
// var facebookStrategy = require('passport-facebook').Strategy;
//
// passport.use(new facebookStrategy({
//         clientID: globals.ids.facebook.clientID,
//         clientSecret: globals.ids.facebook.clientSecret,
//         callbackURL: globals.ids.facebook.callbackURL
//     },
//     (accessToken, refreshToken, profile, done) => {
//         // check if this user already exists in our mongodb
//         User.findOne({oauthID: profile.id}, (err, user) => {
//         // User.findOne({oauth: profile.id}, (err, user) => {
//             if (err) {
//                 console.log(err)
//             }
//
//             // user with this fb profile already exists in our db, so just return their user account so they can access things
//             if (!err && user != null) {
//                 done(null, user)
//             }
//             else {
//                 // this is a new fb user for our site
//                 user = new User({
//                     oauthID: profile.id,
//                     username: profile.displayName,
//                     oauthProvider: 'Facebook',
//                     created: Date.now()
//                 })
//
//                 user.save((err) => {
//                     if (err) {
//                         console.log(err)
//                     }
//                     else {
//                         done(null, user)
//                     }
//                 })
//             }
//         })
//     }))

// write the user id to the session object for storage
passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        if (!err) {
            done(null, user)
        }
        else {
            done(err, null)
        }
    })
})





app.use('/users', usersController);

var indexController = require('./controllers/index');
app.use('/', indexController);

// map any urls starting with /meals to be handled by the meals controller
app.use('/meals', mealsController)
app.use('/mealTypes', mealTypesController)


// helper method to select the proper country in the meals/edit view
var hbs = require('hbs')

hbs.registerHelper('createOption', (currentValue, selectedValue) => {
    // if the 2 values match, add the text ' selected', otherwise add an empty string
    //var selectedProperty = currentValue === selectedValue ? ' selected' : ''
    var selectedProperty = ''
    if (currentValue === selectedValue) {
        selectedProperty = ' selected'
    }

    return new hbs.SafeString('<option' + selectedProperty + '>' + currentValue + '</option>')
})



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
