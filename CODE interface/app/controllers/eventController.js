var eventController = function (){
    var self = this;

    self.getDogEvents = function (dog_id, callback){
        var Events = require('../models/event');

        Events.find({ dog_id: dog_id },function (err, list_event) {
            //set id property for all records
            for (var i = 0; i < list_event.length; i++)
                list_event[i].id = list_event[i]._id;

            callback(list_event);
        });
    };

    self.addNewEvent = function (event, callback){
        // grab the dog model
        var Event = require('../models/event');

        var event_text = event.text;
        var event_start_date = event.start_date;
        var event_end_date = event.end_date;
        var event_color = event.color;
        var event_dog_id = event.dog_id;

        // create a new dog
        var newEvent = Event({
            text: event_text,
            start_date: event_start_date,
            end_date: event_end_date,
            color: event_color,
            dog_id: event_dog_id
        });

        // save the dog
        newEvent.save(function(err) {
            if (err) {
                console.log('ERROR : ' + err); // todo : Integrate logger for info, warn and error..
            }

            console.log('Event created!');
            callback();
        });
    };

};

module.exports = eventController;
