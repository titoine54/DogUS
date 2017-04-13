// load the things we need
var mongoose = require('mongoose');

var unlockStatsSchema = mongoose.Schema({
    collar_id: { type: String, required: true },
    time: { type: Date, required: true }
});

module.exports = mongoose.model('UnlockStats', unlockStatsSchema);
