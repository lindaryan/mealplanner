// include express for url routing
var express = require('express')
var router = express.Router()

// include mongoose & Meal model references for crud
var mongoose = require('mongoose')
var Meal = require('../models/meal')
var MealType = require('../models/mealType')

// GET main meal page
router.get('/', (req, res, next) => {
    // use the Meal model & mongoose to select all meals from MongoDB
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

// GET /meals/add (for now public, change to logged in only)
router.get('/add', (req, res, next) => {
    // load the add view and get list of meal types for dropdown
    MealType.find((err, mealTypes) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else {
            res.render('meals/add', {
                mealTypes: mealTypes
            })
        }
    }).sort({name:1})
})

// POST /meals/add process form submission
router.post('/add', (req, res, next) => {
    // create a new item in the meals db collection
    Meal.create({
        name: req.body.name,
        mealType: req.body.mealType
    }, function(err, newMeal) {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else {
            // load updated meals index
            res.redirect('/meals')
        }
    })
})
// make the controller public
module.exports = router
