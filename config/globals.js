// create a json object of global variables
module.exports = {
    'db': 'mongodb+srv://comp2106:Georgian2020!@cluster0-vh0e5.mongodb.net/mealplanner?retryWrites=true&w=majority',
    'ids': {
        // 'google': {
        //     'clientId': '305161992946-sptgf282fhit65qtvp1k2n0lir01se3m.apps.googleusercontent.com',
        //     'clientSecret': 'CjqRgUjrT8QbZp5BsTwGyt10',
        //     'callbackURL': 'http://localhost:3000/google/callback'
        //     // https://comp2106-globalfood.herokuapp.com/google/callback
        // },
        'facebook': {
            'clientID': '238544547519529',
            'clientSecret': 'fda4d9cbb8c76192c433adda4df04448',
            // 'callbackURL': 'http://localhost:3000/facebook/callback'
            'callbackURL': 'https://mealplanner-lindaryan.herokuapp.com/facebook/callback'
        }
    }
}

