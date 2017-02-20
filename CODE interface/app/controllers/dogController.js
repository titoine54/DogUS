var dogController = function (){
  var self = this;

  self.getUserDogs = function (user_email, callback){
    var Dogs = require('../models/dog');
    Dogs.find({ owner_email: user_email },function (err, list_dog) {
      return callback(list_dog);
    });
  }

};

module.exports = dogController;
