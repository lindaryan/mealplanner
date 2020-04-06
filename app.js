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

// add ref to controllers
var usersController = require('./controllers/users');
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

// google auth
var googleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new googleStrategy({
        clientID: globals.ids.google.clientID,
        clientSecret: globals.ids.google.clientSecret,
        callbackURL: globals.ids.google.callbackURL
    },
    (token, tokenSecret, profile, done) => {
        // evaluate the info that comes back from google
        User.findOne({oauthID: profile.id}, (err, user) => {
            if (err) {
                console.log(err)
            }
            if (!err && user !== null) {
                done(null, user)
            }
            else {
                // if user doesn't exist create new user from google acct
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

// use passport to read/write user data and store to session obj
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

// helper method to select the proper mealtype in the meals/edit view
var hbs = require('hbs')

hbs.registerHelper('createOption', (currentValue, selectedValue) => {
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

// error handler in development only (set locals)
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error'); // render error page
});

module.exports = app;
