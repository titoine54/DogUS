// load the things we need
var mongoose = require('mongoose');
//var ObjectId = require('mongodb').ObjectID;

// define the schema for our user model
var eventSchema = mongoose.Schema({
    text: { type: String, required: true},
    start_date: { type: Date, required: true},
    end_date: { type: Date, required: true},
    color: { type: String, required: true},
    dog_id: { type: String, required: true}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Event', eventSchema);