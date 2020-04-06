var express = require('express');
var router = express.Router();
var passport = require('passport')
var mongoose = require('mongoose')
var User = require('../models/user')

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Meal Planner' });
  user: req.user
})

/* GET about page. */
router.get('/about', (req, res, next) => {
  res.render('about');
})

// GET: calendar page
router.get('/calendar', (req, res, next) => {
  res.render('calendar')
})

// GET: /register => load register form
router.get('/register', (req, res, next) => {
  res.render('register')
})

// POST: /register => use passport to create a new user
router.post('/register', (req, res, next) => {
  // use the User model & passport to register.  Send password separately so passport can hash it
  User.register(new User({ username: req.body.username }), req.body.password, (err, newUser) => {
    if (err) { // reload register page and pass error details to it for display
      console.log(err)
      res.render('register', { message: err} )
    }
    else { // register was successful.  log new user in and load main meals page
      req.login(newUser, (err) => {
        res.redirect('/meals')
        user: req.user
      })
    }
  })
})

// GET: /login => load login form
router.get('/login', (req, res, next) => {
  res.render('login')
  let messages = req.session.messages || [] //store any session messages in a local variable
  req.session.messges = [] //

  //pass any messages to login view
  res.render('login',  {
    // messages: []
  })
})

// POST: /login => authenticate user
router.post('/login', passport.authenticate('local', { //strategy =  one param - local db? google?
  successRedirect: '/meals',
  failureRedirect: '/login',
  failureMessage: 'Invalid Login'
}))

// GET: /logout => sign user out
router.get('/logout', (req, res, next) => {
  req.session.messages = [] // clear any msgs in session variable
  // sign out & redirect to login
  req.logout()
  res.redirect('/login')
  user: req.user
})

// GET: /google => invoke Google Sign-In
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}), (req, res, next) => {})

// GET: /google/callback => process successful google sign-in request
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), (req, res, next) => {
  res.redirect('/foods')
})

// GET: /google => invoke Google Sign-In
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}), (req, res, next) => {})


// GET: /facebook/callback => process successful facebook sign-in request
router.get('/facebook/callback', passport.authenticate('facebook') ,
    (req, res, next) => {}
)

// GET /facebook/callback => process successful facebook login
router.get('/facebook/callback', passport.authenticate('facebook', {
  failureRedirect: '/login'
}), (req, res, next) => {
  res.redirect('/meals')
})

module.exports = router
