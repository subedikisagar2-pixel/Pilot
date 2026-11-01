const mongoose = require("mongoose");

const travelLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    dateOfTravel: { type: Date, required: true },
    description: { type: String, required: true },
    photos: [{ type: String }], // max 5, enforced in controller
    rating: { type: Number, min: 1, max: 5, default: 5 },
    tags: [{ type: String, trim: true, lowercase: true }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

travelLogSchema.index({ title: "text", destination: "text" });

module.exports = mongoose.model("TravelLog", travelLogSchema);
