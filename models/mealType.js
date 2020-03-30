// include mongoose
var mongoose = require('mongoose')

//create a schema for country
var mealTypeSchema = new mongoose.Schema({
    name:{
        type: String,
        required: 'Name is required'
    }
})

// make model public
module.exports = mongoose.model('MealType', mealTypeSchema)
