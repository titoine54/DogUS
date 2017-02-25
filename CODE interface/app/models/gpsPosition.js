var mongoose = require('mongoose');
//var ObjectId = require('mongodb').ObjectID;

// define the schema for our gps positions model
var gpsPositionSchema = mongoose.Schema({
  userID: { type: String, required: true},
  dogID: { type: String, required: true},
  timestamp: { type: Date, required: true},
  latitude: { type: Number, required: true},
  longitude: { type: Number, required: true}
});

// create the model for gps positions and expose it to our app
module.exports = mongoose.model('gpsPosition', gpsPositionSchema, 'gpsPosition');
