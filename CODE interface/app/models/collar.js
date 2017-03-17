// load the things we need
var mongoose = require('mongoose');

var collarSchema = mongoose.Schema({
  mac_address: { type: String, required: true },
  owner_email: { type: String, required: true },
  dog_id: { type: String, required: true },
});

module.exports = mongoose.model('Collar', collarSchema);
