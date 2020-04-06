// include express for url routing
var express = require('express')
var router = express.Router()

// include mongoose & mealType model references for crud
var mongoose = require('mongoose')
var MealType = require('../models/mealType')

//Get main mealType page
router.get('/',(req,res, next)=>{
    //use  mealType model & mongoose to select all the mealTypes from MongoDB
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