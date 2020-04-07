// include mongoose
var mongoose = require('mongoose')

// create a schema for meals
var mealSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name is required'
        },
    mealType:{
        type: String,
        required: 'Meal type is required'
    // },
    // image: {
    //     type: String,
    //     required: 'Image is required'
    }
})

// make this model public with the name 'Meal'
module.exports = mongoose.model('Meal', mealSchema)
