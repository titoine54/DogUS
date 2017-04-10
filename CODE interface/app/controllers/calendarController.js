var calendarController = function (){
    var self = this;

    self.getDogById = function (dogs, dogId, callback){
        var dog;

        if(dogId === 'all') {
            dog = {
                _id : dogId,
                name : 'All animals'
            }
        } else {
            dog = dogs.find(function(dog){
                if(dog._id === dogId) {
                    return dog;
                }
            });
        }

        callback(dog);
    };

    self.getCalendar = function (dog_id, email, day, collar_id, callback){
      var Events = require('../models/event');

      Events.find({day: day, $or: [ { dog_id: dog_id } ,{ dog_id: "all", user_email: email } ] }, function (err, events) {
        if (events[0] != []){
          const moment = require('moment');

          var message = "$,C," + collar_id + "," + day;

          for (i = 0; i < events.length; ++i) {
            var tmp_time = moment(events[i].start_time, "hh:mm:ss a").toDate();
            var time = moment(tmp_time).format("HH.mm");
            message = message + "," + time;
          }

          for (i = 0; i < events.length; ++i) {
            var tmp_time = moment(events[i].end_time, "hh:mm:ss a").toDate();
            var time = moment(tmp_time).format("HH.mm");
            message = message + "," + time;
          }
        }
        return callback(message);
      });

    };
};

module.exports = calendarController;
