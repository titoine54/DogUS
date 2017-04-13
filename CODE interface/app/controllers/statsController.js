const moment = require('moment');
const async = require('async');

var statsController = function (){
    var self = this;

    /**
     * Log unlock door event with the collarID.
     * @param {string} collar_id - Id of the dog collar.
     * @param {function} callback
     */
    self.logUnlock = function (collar_id, callback){
        var unlockStats = require('../models/unlockStats');
        var now = moment.now;

        var newStat = unlockStats({
            collar_id: collar_id,
            time: now
        });

        newStat.save(function(err) {
            if (err) {
                console.log('ERROR : ' + err); // todo : Integrate logger for info, warn and error..
            }

            console.log("Unlocked door for dog with collar :", collar_id);
            callback();
        });
    };

    /**
     * Get all unlock event corresponding with the collar ID
     * @param {string} collar_id - Id of the dog collar.
     * @param {function} callback
     */
    self.getUnlockStats = function(collar_id, callback) {
        var unlockStats = require('../models/unlockStats');
        unlockStats.find({ collar_id: collar_id },function (err, list_logs) {

            var today = moment();
            var todayLogs = list_logs.filter(function (log) {
                return moment(log.time).isSame(today, 'day');
            });

            var oneDayBefore = moment('00:00:00', 'hh:mm:ss a').subtract(1, 'day');
            var oneDayBeforeLogs = list_logs.filter(function (log) {
                return moment(log.time).isSame(oneDayBefore, 'day');
            }).length;

            var twoDayBefore = moment('00:00:00', 'hh:mm:ss a').subtract(2, 'day');
            var twoDayBeforeLogs = list_logs.filter(function (log) {
                return moment(log.time).isSame(twoDayBefore, 'day');
            }).length;

            var threeDayBefore = moment('00:00:00', 'hh:mm:ss a').subtract(3, 'day');
            var threeDayBeforeLogs = list_logs.filter(function (log) {
                return moment(log.time).isSame(threeDayBefore, 'day');
            }).length;

            var fourDayBefore = moment('00:00:00', 'hh:mm:ss a').subtract(4, 'day');
            var fourDayBeforeLogs = list_logs.filter(function (log) {
                return moment(log.time).isSame(fourDayBefore, 'day');
            }).length;

            var fiveDayBefore = moment('00:00:00', 'hh:mm:ss a').subtract(5, 'day');
            var fiveDayBeforeLogs = list_logs.filter(function (log) {
                return moment(log.time).isSame(fiveDayBefore, 'day');
            }).length;

            var sixDayBefore = moment('00:00:00', 'hh:mm:ss a').subtract(6, 'day');
            var sixDayBeforeLogs = list_logs.filter(function (log) {
                return moment(log.time).isSame(sixDayBefore, 'day');
            }).length;

            var data = [sixDayBeforeLogs, fiveDayBeforeLogs, fourDayBeforeLogs, threeDayBeforeLogs, twoDayBeforeLogs, oneDayBeforeLogs, todayLogs];
            var labels = [sixDayBefore.format('ll'), fiveDayBefore.format('ll'), fourDayBefore.format('ll'), threeDayBefore.format('ll'), twoDayBefore.format('ll'), oneDayBefore.format('ll'), today.format('ll')];
            var logStats = {
                data : data,
                labels: labels
            };
            callback(logStats);

        });
    }
};

module.exports = statsController;
