// include express for url routing
var express = require('express')
var router = express.Router()
var passport = require('passport')
// for crud include mongoose & Meal model refs
var mongoose = require('mongoose')
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

//Get main mealType page
// router.get('/',(req,res, next)=>{
router.get('/', isAuthenticated, (req, res, next) => {
    // select meals from db using meal model
    MealType.find((err, mealTypes)=> {
        if(err){
            console.log(err)
            res.send(err)
        }else{
            // load the main mealTypes page
            res.render('mealTypes/index', {
                mealTypes: mealTypes,
            })
        }
    })
})

//make the controller public
module.exports = router;