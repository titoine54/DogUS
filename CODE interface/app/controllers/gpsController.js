var gpsController = function (){
  var self = this;

  self.getLastPosition = function (collar_id, callback){
    var gpsPosition = require('../models/gpsPosition');

    //Find the last position
    gpsPosition.find({"collar_id": collar_id}).sort({"timestamp":-1}).exec(function (err, list_dog_positions) {
      var lastPosition;
      if (!_.isUndefined(list_dog_positions[0])) {
      lastPosition =
        {
        latitude: list_dog_positions[0].latitude,
        longitude: list_dog_positions[0].longitude,
        timestamp: list_dog_positions[0].timestamp
        };
      } else {
        lastPosition =
          {
          latitude: null,
          longitude: null,
          timestamp: null
        };
      }

      return callback(lastPosition);
    });
  };

  self.getGpsZone = function (collar_id, callback){
    var gpsZone = require('../models/gpsZone');

    //Find the last position
    gpsZone.find({"collar_id": collar_id}).exec(function (err, zones) {
      var theZone;
      if (!_.isUndefined(zones[0])) {
      theZone = zones[0];
      } else {
        theZone = null;
      }

      return callback(theZone);
    });
  };

  self.addPositionToDB = function (message, callback){
    // splitting the message

    var [start, type, gps_collar_id, gps_latitude, gps_longitude, gps_timestamp] = message.split(',');

    // grab the GPS model
    var gpsPosition = require('../models/gpsPosition');

    var newgpsPosition = gpsPosition({
      collar_id: gps_collar_id,
      timestamp: gps_timestamp,
      latitude: gps_latitude,
      longitude: gps_longitude
    });

    newgpsPosition.save(function(err) {
      if (err) {
        console.log('ERROR : ' + err); // todo : Integrate logger for info, warn and error..
      }

      console.log('Added new dog position to DB');
      return callback();
    });
  };

  self.changeGpsZone = function (collar_id, callback){
    var gpsZone = require('../models/gpsZone');

    gpsZone.find({collar_id: collar_id}).remove(callback);
  }

  self.addZoneToDB = function (collar_id, data, callback){
    var gpsZone = require('../models/gpsZone');

    var newGpsZone = gpsZone({
      collar_id: collar_id,
      center: JSON.parse(data.center),
      radius: data.radius
    });

    newGpsZone.save(function(err) {
      if (err) {
        console.log('ERROR : ' + err); // todo : Integrate logger for info, warn and error..
      }

      console.log('Added new dog zone to DB');
      return callback();
    });
  }
};

module.exports = gpsController;
