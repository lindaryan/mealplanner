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

// GET: register page
router.get('/register', (req, res, next) => {
  res.render('register')
})

// POST: register page using passport to create new user
router.post('/register', (req, res, next) => {
  // using User model & passport to register, sending password separately using passport to hash it
  User.register(new User({ username: req.body.username }), req.body.password, (err, newUser) => {
    if (err) { // reload register page and pass error details to it for display
      console.log(err)
      res.render('register', { message: err} )
    }
    else { // register was successful so log user in and load meals index
      req.login(newUser, (err) => {
        res.redirect('/meals')
        user: req.user
      })
    }
  })
})

// GET: login page
router.get('/login', (req, res, next) => {
  res.render('login')
  let messages = req.session.messages || [] //store session messages in local variable
  req.session.messges = []

  //pass any messages to login view
  res.render('login',  {
    // messages: []
  })
})

// POST: /login (authenticate user)
router.post('/login', passport.authenticate('local', { //strategy =  one param - local db? google?
  successRedirect: '/meals',
  failureRedirect: '/login',
  failureMessage: 'Invalid Login'
}))

// GET: /logout (log out user)
router.get('/logout', (req, res, next) => {
  req.session.messages = [] // clear msgs in session var
  // sign out & redir back to login page
  req.logout()
  res.redirect('/login')
  user: req.user
})

// GOOGLE SIGN-IN
// GET: /google
router.get('/google', passport.authenticate('google', {
  scope: ['profile']
}), (req, res, next) => {})

// GET: /google/callback - Successful sign in req
router.get('/google/callback', passport.authenticate('google', {
  failureRedirect: '/login'
}), (req, res, next) => {
  res.redirect('/meals')
})

// github sign in
// GET: /github
router.get('/github', passport.authenticate('github', {
  scope: ['user:email']
}), (req, res, next) => {})


// GET: /github/callback - successful
router.get('/github/callback', passport.authenticate('github', {
  failureRedirect: '/login'
}), (req, res, next) => {
  res.redirect('/meals')
})

module.exports = router