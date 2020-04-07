// create a json object of global variables
module.exports = {
    'db': 'mongodb+srv://comp2106:Georgian2020!@cluster0-vh0e5.mongodb.net/mealplanner?retryWrites=true&w=majority',
    'ids': {
        'google': {
            'clientID': '489844810910-bmprquroavtn9jgcoqom5ba49shddpij.apps.googleusercontent.com',
            'clientSecret': 'ZcYqB-idIgZWR0w45490ul9f',
            'callbackURL': 'https://mealplanner-lindaryan.herokuapp.com/google/callback'
        },
        'github': {
            'clientID': 'dc99753ee9b5ec4bc17e',
            'clientSecret': '483ca5d1074bb734573d0ae9f9378eadc74df163',
            'callbackURL': 'https://mealplanner-lindaryan.herokuapp.com/github/callback'
        }
    }
}

