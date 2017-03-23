// load the things we need
var mongoose = require('mongoose');
//var ObjectId = require('mongodb').ObjectID;

// define the schema for our user model
var dogSchema = mongoose.Schema({
  name: { type: String, required: true},
  owner_email: { type: String, required: true},
  age: { type: Number, required: true},
  weight: { type: Number, required: true},
  description: { type: String, required: true},
    color : {type: String, required: true}
  //img: { data: Buffer, contentType: String }
});

// create the model for users and expose it to our app
module.exports = mongoose.model('Dog', dogSchema);
