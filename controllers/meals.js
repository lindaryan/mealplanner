// add express for url routing
var express = require('express')
var router = express.Router()

// add mongoose & Meal model references for CRUD
var mongoose = require('mongoose')
var Meal = require('../models/meal')

// authentication check
function isAuthenticated(req, res, next) {
    // use express built-in method to check for user identity. If found, just continue to the next method
    if (req.isAuthenticated()) {
        return next()
    }
    // anonymous so redirect to login
    res.redirect('/login')
}

// GET main meal page
router.get('/', (req, res, next) => {
    // use the Meal model & mongoose to select all the meals from MongoDB
    Meal.find((err, meals) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else {
            // load the main meals page
            res.render('meals/index', {
                meals: meals
            })
        }
    })
})

// make the controller public
module.exports = router
