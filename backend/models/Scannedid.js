const mongoose = require("mongoose");

const scannedIDSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },

    id_number: { type: String },
    last_name: { type: String },
    given_name: { type: String },
    middle_name: { type: String },
    birthdate: { type: String },
    address: { type: String },

    sex: { type: String },
    blood_type: { type: String },
    civil_status: { type: String },
    place_of_birth: { type: String },

    front_image: { type: String }, 
    back_image: { type: String },  

    front_raw_text: { type: String },
    back_raw_text: { type: String },
  },
  { timestamps: true } 
);

scannedIDSchema.index({ user: 1, id_number: 1 }, { unique: false });

module.exports = mongoose.model("ScannedID", scannedIDSchema);
