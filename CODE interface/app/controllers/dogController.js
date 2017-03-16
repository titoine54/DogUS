var dogController = function (){
  var self = this;

  self.getUserDogs = function (user_email, callback){
    var Dogs = require('../models/dog');
    Dogs.find({ owner_email: user_email },function (err, list_dog) {
      return callback(list_dog);
    });
  };

  self.getLastPosition = function (dog_id, callback){
    var gpsPosition = require('../models/gpsPosition');

    //Find the last position
    gpsPosition.find({"dogID": dog_id}).sort({"timestamp":-1}).exec(function (err, list_dog_positions) {
      var lastPosition;
      if (!_.isUndefined(list_dog_positions[0])) {
      lastPosition =
        {
        latitude: list_dog_positions[0].latitude,
        longitude: list_dog_positions[0].longitude
        }
      } else {
        lastPosition =
          {
          latitude: null,
          longitude: null
          }
      }

      return callback(lastPosition);
    });
  };

  self.addNewDog = function (req, callback){
    // grab the dog model
    var Dog = require('../models/dog');

    var dog_name = req.body.dog_name;
    var dog_age = req.body.dog_age;
    var dog_weight = req.body.dog_weight;
    var dog_description = req.body.dog_description;

    // create a new dog
    var newDog = Dog({
      name: dog_name,
      owner_email: req.user.local.email,
      age: dog_age,
      weight: dog_weight,
      description: dog_description
    });

    // save the dog
    newDog.save(function(err) {
      if (err) {
        console.log('ERROR : ' + err); // todo : Integrate logger for info, warn and error..
      }

      console.log('Dog created for user : ' + req.user.local.email);
      return callback();
    });
  };

  self.editDog = function (req, callback){
    // grab the dog model
    var Dog = require('../models/dog');

    var dog_name = req.body.dog_name;
    var dog_age = req.body.dog_age;
    var dog_weight = req.body.dog_weight;
    var dog_description = req.body.dog_description;

    var dog_id = req.params.dog_id;

    // create a new dog
    var updatedDog = {
      name: dog_name,
      age: dog_age,
      weight: dog_weight,
      description: dog_description
    };

    // save the dog
    Dog.findOneAndUpdate({_id: dog_id}, updatedDog, function(err) {
      if (err) {
        console.log('ERROR : ' + err); // todo : Integrate logger for info, warn and error..
      }

      console.log('Dog edited for user : ' + req.user.local.email);
      return callback();
    });
  };

  self.deleteDog = function (req, dog_id, callback){
    // grab the dog model
    var Dog = require('../models/dog');

    // delete dog
    Dog.find({ _id: dog_id }).remove(function(err) {
      if (err) {
        console.log('ERROR : ' + err); // todo : Integrate logger for info, warn and error..
      }

      console.log('Dog deleted by user : ' + req.user.local.email);
      return callback();
    });
  };

};

module.exports = dogController;
