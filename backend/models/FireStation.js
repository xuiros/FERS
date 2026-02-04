const mongoose = require("mongoose");

const FireStationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  address: { type: String, required: true },
});

module.exports = mongoose.models.FireStation || mongoose.model("FireStation", FireStationSchema);
