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

    self.getCalendar = function (dog_id, email, day, callback){
      var Events = require('../models/event');

      Events.find({day: day, $or: [ { dog_id: dog_id } ,{ dog_id: "all", user_email: email } ] } function (err, events) {
        console.log(events);
        return callback(events);
      });


//          Events.find({user_email: email}, function (err, list_event) {

    };
};

module.exports = calendarController;
