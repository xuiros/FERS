const mongoose = require("mongoose");

const LocationSchema = new mongoose.Schema(
  {
    latitude: Number,
    longitude: Number,
  },
  { _id: false }
);

const AssignedStationSchema = new mongoose.Schema(
  {
    name: String,
    address: String,
    latitude: Number,
    longitude: Number,
  },
  { _id: false }
);

const ReportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: { type: String, default: "Unnamed" },
    message: { type: String, default: "" },
    type: { type: String, default: "" },
    level: { type: String, default: "" },
    description: { type: String, default: "" },
    location: { type: LocationSchema, default: () => ({}) },
    address: { type: String, default: "No address available" },
    status: { type: String, default: "Active" },

    assignedStation: { type: AssignedStationSchema, default: null },

    assignedAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Report || mongoose.model("Report", ReportSchema);
