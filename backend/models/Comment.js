const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    log: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TravelLog",
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Comment", commentSchema);
