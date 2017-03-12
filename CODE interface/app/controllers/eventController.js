var eventController = function (){
    var self = this;

    self.getDogEvents = function (dog_id, callback){
        var Events = require('../models/event');

        Events.find({ dog_id: dog_id },function (err, list_event) {
            //set id property for all records
            //for (var i = 0; i < list_event.length; i++)
            //list_event[i].id = list_event[i].id;

            callback(list_event);
        });
    };

    self.addNewEvent = function (event, dog_id, sid, callback){
        // grab the dog model
        var Event = require('../models/event');

        // create a new dog
        var newEvent = Event({
            text: event.text,
            start_date: event.start_date,
            end_date: event.end_date,
            color: event.color,
            dog_id: dog_id,
            id: sid
        });

        // save the dog
        newEvent.save(callback);
    };

    self.deleteEvent = function (event_id, callback){
        // grab the event model
        var Event = require('../models/event');

        Event.find({id: event_id}).remove(callback);
    };

};

module.exports = eventController;
