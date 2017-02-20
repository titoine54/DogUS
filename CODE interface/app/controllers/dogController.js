var dogController = function (){
  var self = this;

  self.getUserDogs = function (user_email){
    // var mongoose = require('mongoose');
    // var configDB = require('../../config/database.js');
    //
    // var mongoose = require('mongoose'),
    //     db = mongoose.createConnection(configDB.url);
    // db.on('error', console.error.bind(console, 'connection error:'));

    var Dogs = require('../models/dog');

    Dogs.find({ owner_email: user_email },function (err, list_dog) {

      return list_dog;
    });
  }

};

module.exports = dogController;
