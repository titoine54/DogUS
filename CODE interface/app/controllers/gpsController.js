var gpsController = function (){
  var self = this;

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

  self.addPositionToDB = function (message, callback){
    // splitting the message

    var [type, gps_dogID, gps_latitude, gps_longitude, gps_timestamp] = message.split(',');

    // grab the GPS model
    var gpsPosition = require('../models/gpsPosition');

    // var gps_dogID = '58a5304c5952a53636f9b8ed';
    // var gps_timestamp = Date.now();
    // var gps_latitude = 45;
    // var gps_longitude = 45;

    // create a new dog
    var newgpsPosition = gpsPosition({
      dogID: gps_dogID,
      timestamp: gps_timestamp,
      latitude: gps_latitude,
      longitude: gps_longitude
    });

    // save the dog
    newgpsPosition.save(function(err) {
      if (err) {
        console.log('ERROR : ' + err); // todo : Integrate logger for info, warn and error..
      }

      console.log('Added new dog position to DB');
      return callback();
    });
  };
};

module.exports = gpsController;
