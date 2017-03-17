var collarController = function (){
  var self = this;

  self.getUserCollars = function (user_email, callback){
    var Collar = require('../models/collar');
    Collar.find({ owner_email: user_email },function (err, list_collar) {
      return callback(list_collar);
    });
  };

  self.addNewCollars = function (req, callback){
    var Collar = require('../models/collar');

    var dog_name = req.body.dog_name;;

    // create a new dog
    var newCollar = Collar({
      name: dog_name,
    });

    // save the dog
    newCollar.save(function(err) {
      if (err) {
        console.log('ERROR : ' + err); // todo : Integrate logger for info, warn and error..
      }

      console.log('Collar created for user : ' + req.user.local.email);
      return callback();
    });
  };

  self.deleteCollar = function (req, collar_id, callback){
    // grab the dog model
    var Collar = require('../models/collar');

    Collar.find({ _id: collar_id }).remove(function(err) {
      if (err) {
        console.log('ERROR : ' + err); // todo : Integrate logger for info, warn and error..
      }

      console.log('Collar deleted by user : ' + req.user.local.email);
      return callback();
    });
  };

};

module.exports = collarController;
