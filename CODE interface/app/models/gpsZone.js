// load the things we need
var mongoose = require('mongoose');

var gpsZoneSchema = mongoose.Schema({
  dog_id: { type: String, required: true },
  center: { type: Object, required: true },
  radius: { type: Number, required: true },
});

module.exports = mongoose.model('GpsZone', gpsZoneSchema);
