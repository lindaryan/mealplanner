// include express for url routing
var express = require('express')
var router = express.Router()
var passport = require('passport')
// for crud include mongoose & Meal model refs
var mongoose = require('mongoose')
var Meal = require('../models/meal')
var MealType = require('../models/mealType')

// check for user identity
function isAuthenticated(req, res, next) {
    //if found continue
    if (req.isAuthenticated()) {
        return next()
    }
    //redirect anon to login page
    res.redirect('/login')
}

// GET main meal page - public (read-only)
router.get('/', (req, res, next) => {
    // select meals from db using meal model
    Meal.find((err, meals) => {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else {
            // load main meals page
            res.render('meals/index', {
                meals: meals,
                user: req.user //pass the user data
            })
        }
    })
})

// GET /meals/add for logged in users only
router.get('/add', isAuthenticated, (req, res, next) => {
    // load /meals/add view using ist of mealTypes to populate dropdown
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

// POST /meals/add form submission
router.post('/add', isAuthenticated, (req, res, next) => {
    // create new meal item in the meals db collection
    Meal.create({
        name: req.body.name,
        mealType: req.body.mealType
    }, function(err, newMeal) {
        if (err) {
            console.log(err)
            res.send(err)
        }
        else {
            // load updated meals page
            res.redirect('/meals')
            user: req.user

        }
    })
})

// GET /meals/delete/:_id where :_id references the selected document
router.get('/delete/:_id', isAuthenticated, (req, res, next) => {
    // use mongoose Model to delete the selected document
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

// GET /meals/edit/:_id - display edit form, populated by selected id
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

// POST /meals/edit/:_id - update meal document by selected id
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