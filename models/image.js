var mongoose = require('mongoose');

var imageSchema = new Schema({
    path:  {
        type: String
    },
    caption: {
        type: String
    }
});

module.exports = mongoose.model('images', imageSchema);