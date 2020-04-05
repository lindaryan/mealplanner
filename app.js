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
    secret: 'w20@mealplannerString',
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
passport.deserializeUser(User.deserializeUser())
passport.serializeUser(User.serializeUser())



app.use('/users', usersController);


var indexController = require('./controllers/index');
app.use('/', indexController);

// map any urls starting with /meals to be handled by the meals controller
app.use('/meals', mealsController)
app.use('/mealTypes', mealTypesController)

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
