var dogController = function (){
  var self = this;

  self.getUserDogs = function (user_email, callback){
    var Dogs = require('../models/dog');
    Dogs.find({ owner_email: user_email },function (err, list_dog) {
      return callback(list_dog);
    });
  };

  self.getLastPosition = function (user_email, dog_id, callback){
    var gpsPosition = require('../models/gpsPosition');

    //Return the last position
    gpsPosition.find().sort({"timestamp":-1}).exec(function (err, list_dog_positions) {
      return callback(list_dog_positions);
    });

    // Dogs.find({},function (err, list_dog_positions) {
    //   console.log(list_dog_positions);
    //   return callback(list_dog_positions);
    // });

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

      console.log('Dog created for user :' + req.user.local.email);
      return callback();
    });
  };

};

module.exports = dogController;
