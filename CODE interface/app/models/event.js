// load the things we need
var mongoose = require('mongoose');
//var ObjectId = require('mongodb').ObjectID;

// define the schema for our user model
var eventSchema = mongoose.Schema({
    text: { type: String, required: true},
    day: {type: Number, required: true},
    start_time: { type: String, required: true},
    end_time: { type: String, required: true},
    color: { type: String, default: "#4286f4", required: false},
    dog_id: { type: String, required: true},
    id: { type: String, required: true}
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Event', eventSchema);