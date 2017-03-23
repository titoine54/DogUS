const moment = require('moment');
const async = require('async');

var eventController = function (){
    var self = this;

    self.getDogEvents = function (dog_id, callback){
        var Events = require('../models/event');
        var Dogs = require('../models/dog');


        if(dog_id === 'all') {
            Events.find(function (err, list_event) {
                if(err){
                    console.log("ERROR : " + err);
                }

                self._prepareEvent(list_event, function(events) {
                    var finalEvents = [];

                    async.each(events, function(event, asynCallback) {
                        Dogs.findById(event.dog_id ,function (err, dog) {
                            if(err || _.isEmpty(dog)) {
                                asynCallback(err);
                            } else {
                                event.text = dog.name + ' : ' + event.text;
                                finalEvents.push(event);
                                asynCallback();
                            }
                        });
                    }, function(err) {
                        if( err ) {
                            console.log('ERROR : ' + err);
                        } else {
                            callback(finalEvents);
                        }
                    });
                });
            });
        } else {
            Events.find({ dog_id: dog_id },function (err, list_event) {
                if(err){
                    console.log("ERROR : " + err);
                }

                self._prepareEvent(list_event, callback);
            });
        }
    };

    self._prepareEvent = function (eventList, callback) {

        var events = [];
        _.each(eventList, function(savedEvent) {
            var currentDay = moment().isoWeekday();
            var startTime;
            var endTime;

            if(savedEvent.day >= currentDay) {
                startTime = new Date(moment(savedEvent.start_time, 'hh:mm:ss a').add(savedEvent.day - currentDay, 'day').format("YYYY-MM-DD HH:mm"));
                endTime = new Date(moment(savedEvent.end_time, 'hh:mm:ss a').add(savedEvent.day - currentDay, 'day').format("YYYY-MM-DD HH:mm"));

            } else if (savedEvent.day < currentDay) {
                startTime = new Date(moment(savedEvent.start_time, 'hh:mm:ss a').subtract(currentDay - savedEvent.day, 'day').format("YYYY-MM-DD HH:mm"));
                endTime = new Date(moment(savedEvent.end_time, 'hh:mm:ss a').subtract(currentDay - savedEvent.day, 'day').format("YYYY-MM-DD HH:mm"));
            }

            var event = {
                id : savedEvent.id,
                text: savedEvent.text,
                start_date: startTime,
                end_date: endTime,
                color: savedEvent.color,
                dog_id: savedEvent.dog_id
            };
            events.push(event);
        });
        callback(events);
    };

    self.addNewEvent = function (event, dog_id, sid, callback){
        // grab the dog model
        var Event = require('../models/event');
        var day = moment(event.start_date).isoWeekday();
        var startTime = moment(event.start_date).format("hh:mm:ss a");
        var endTime = moment(event.end_date).format("hh:mm:ss a");

        // create a new event
        var newEvent = Event({
            text: event.text,
            day: day,
            start_time: startTime,
            end_time: endTime,
            color: event.color,
            dog_id: dog_id,
            id: sid
        });

        // save the dog
        newEvent.save(callback);
    };

    self.updateEvents = function (newData, event_id, callback) {
        var Event = require('../models/event');

        var day = moment(newData.start_date).isoWeekday();
        var startTime = moment(newData.start_date).format("hh:mm:ss a");
        var endTime = moment(newData.end_date).format("hh:mm:ss a");

        var event = {
            text: newData.text,
            day: day,
            start_time: startTime,
            end_time: endTime,
            color: newData.color,
            dog_id: newData.dog_id,
            id: event_id
        };

        Event.findOneAndUpdate({id: event_id}, event, callback);
    };

    self.deleteEvent = function (event_id, callback){
        // grab the event model
        var Event = require('../models/event');

        Event.find({id: event_id}).remove(callback);
    };

};

module.exports = eventController;
