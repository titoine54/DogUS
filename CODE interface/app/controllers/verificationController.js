var verificationController = function (){
  var self = this;

  self.activateUser = function (user_url, callback){
    // grab the user model
    var User = require('../models/user');

    var activate = {
      "local.active": true
    };

    // save the dog
    User.findOneAndUpdate({ "local.verif_url": user_url }, activate, function(err) {
      if (err) {
        console.log('ERROR : ' + err); // todo : Integrate logger for info, warn and error..
      }

      console.log('Activated user : ' + user_url);
      return callback();
    });
  };
};

module.exports = verificationController;
