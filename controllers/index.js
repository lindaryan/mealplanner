var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Meal Planner' });
})

/* GET about page. */
router.get('/about', (req, res, next) => {
  res.render('about');
})

// GET: calendar page
router.get('/calendar', (req, res, next) => {
  res.render('calendar')
})

// GET: login page
router.get('/login', (req, res, next) => {
  res.render('login')
})

// GET: register page
router.get('/register', (req, res, next) => {
  res.render('register')
})

module.exports = router
