const moment = require('moment');
const async = require('async');

var eventController = function (){
    var self = this;

    /**
     * Get all events corresponding on the dog ID.
     * @param {string} dog_id - Id of the dog.
     * @param {string} email - Email of the current user.
     * @param {function} callback
     */
    self.getDogEvents = function (dog_id, email, callback){
        var Events = require('../models/event');
        var Dogs = require('../models/dog');


        if(dog_id === 'all') {
            Events.find({user_email: email}, function (err, list_event) {
                if(err){
                    console.log("ERROR : " + err);
                }

                self._prepareEvent(list_event, function(events) {
                    var finalEvents = [];

                    async.each(events, function(event, asynCallback) {

                        Dogs.findById(event.dog_id ,function (err, dog) {
                            if(!_.isEmpty(dog)) {
                                event.color = dog.color;
                            }
                            finalEvents.push(event);
                            asynCallback();
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
                Events.find({ dog_id: 'all' },function (err, list_allEvent) {
                    if(err){
                        console.log("ERROR : " + err);
                    }
                var allEvents = _.union(list_event, list_allEvent);
                self._prepareEvent(allEvents, callback);
                });
            });
        }
    };

    /**
     * Change the day and time attribute to a timestamp with the current week.
     * @param {array} eventList - Array with all events to prepare.
     * @param {function} callback
     */
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
                dog_id: savedEvent.dog_id,
                user_email: savedEvent.user_email
            };
            events.push(event);
        });
        callback(events);
    };

    /**
     * Get all events corresponding on the dog ID.
     * @param {object} event - Object with all the event info.
     * @param {string} dog_id - Id of the dog.
     * @param {string} sid - Id used by the front end to recognize the event.
     * @param {string} email - Email of the current user.
     * @param {function} callback
     */
    self.addNewEvent = function (event, dog_id, sid, email, callback){
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
            id: sid,
            user_email: email
        });

        // save the dog
        newEvent.save(callback);
    };

    /**
     * Modify a event with the event ID.
     * @param {object} newData - All new event info.
     * @param {string} event_id - id of the event to modify.
     * @param {function} callback
     */
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
            id: event_id,
            user_email: newData.user_email
        };

        Event.findOneAndUpdate({id: event_id}, event, callback);
    };

    /**
     * Delete an event with his ID.
     * @param {string} event_id - ID of the event to delete.
     * @param {function} callback
     */
    self.deleteEvent = function (event_id, callback){
        // grab the event model
        var Event = require('../models/event');

        Event.find({id: event_id}).remove(callback);
    };

};

module.exports = eventController;
