const Comment = require("../models/Comment");
const TravelLog = require("../models/TravelLog");

// @desc    Add a comment to a log
// @route   POST /api/comments/:logId
// @access  Private
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text)
      return res.status(400).json({ message: "Comment text is required" });

    const log = await TravelLog.findById(req.params.logId);
    if (!log) return res.status(404).json({ message: "Travel log not found" });

    const comment = await Comment.create({
      log: req.params.logId,
      user: req.user._id,
      text,
    });

    const populatedComment = await comment.populate(
      "user",
      "name profilePicture",
    );

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

module.exports = { addComment };
 