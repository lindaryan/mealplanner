// include express for url routing
var express = require('express')
var router = express.Router()
var passport = require('passport')
// include mongoose & Meal model references for crud
var mongoose = require('mongoose')
var Meal = require('../models/meal')
var MealType = require('../models/mealType')

// check for user identity
function isAuthenticated(req, res, next) {
    //if found continue
    if (req.isAuthenticated()) {
        return next()
    }
    //redirect anonymous to login
    res.redirect('/login')
}

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
                meals: meals,
                user: req.user //have linked to passport, now passing this user data
            })
        }
    })
})

// GET /meals/add for logged in users
router.get('/add', isAuthenticated, (req, res, next) => {
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
router.post('/add', isAuthenticated, (req, res, next) => {
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
            user: req.user

        }
    })
})

// GET /meals/delete/abc123 - :_id means this method expects a parameter called "_id"
router.get('/delete/:_id', isAuthenticated, (req, res, next) => {
    // use the mongoose Model to delete the selected document
    Meal.remove({ _id: req.params._id }, (err) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else {
            res.redirect('/meals')
        }
    })
})

// GET /meals/edit/:_id -> display populated edit form
router.get('/edit/:_id', isAuthenticated, (req, res, next) => {
    Meal.findById(req.params._id, (err, meal) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else {
            res.render('meals/edit', {
                meal: meal,
                user: req.user
            })
        }
    })
})

// POST /meals/edit/:_id -> updated selected meal document
router.post('/edit/:_id', isAuthenticated, (req, res, next) => {
    Meal.findOneAndUpdate({ _id: req.params._id },
        {
            name: req.body.name,
            mealType: req.body.mealType
        }, (err, meal) => {
            if (err) {
                console.log(err)
                res.send(err)
            }
            else {
                res.redirect('/meals')
            }
        })
})



// make the controller public
module.exports = router