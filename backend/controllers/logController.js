const TravelLog = require("../models/TravelLog");
const Comment = require("../models/Comment");

// @desc    Create a new travel log
// @route   POST /api/logs
// @access  Private
const createLog = async (req, res) => {
  try {
    const { title, destination, dateOfTravel, description, rating, tags } =
      req.body;

    if (!title || !destination || !dateOfTravel || !description) {
      return res
        .status(400)
        .json({
          message: "Title, destination, date, and description are required",
        });
    }

    // Photos come from multer (req.files) -> store relative paths/URLs
    let photos = [];
    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ message: "Maximum 5 photos allowed" });
      }
      photos = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const log = await TravelLog.create({
      user: req.user._id,
      title,
      destination,
      dateOfTravel,
      description,
      photos,
      rating,
      tags: tags
        ? Array.isArray(tags)
          ? tags
          : tags.split(",").map((t) => t.trim())
        : [],
    });

    res.status(201).json(log);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get all logs (feed) with pagination, search, filter
// @route   GET /api/logs?page=&limit=&q=&tag=
// @access  Public
const getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.q) {
      filter.$or = [
        { title: { $regex: req.query.q, $options: "i" } },
        { destination: { $regex: req.query.q, $options: "i" } },
      ];
    }
    if (req.query.tag) {
      filter.tags = req.query.tag.toLowerCase();
    }

    const [logs, total] = await Promise.all([
      TravelLog.find(filter)
        .populate("user", "name profilePicture")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      TravelLog.countDocuments(filter),
    ]);

    res.json({
      logs,
      page,
      totalPages: Math.ceil(total / limit),
      totalLogs: total,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// @desc    Get a single log + its comments
// @route   GET /api/logs/:id
// @access  Public
const getLogById = async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id).populate(
      "user",
      "name profilePicture",
    );
    if (!log) return res.status(404).json({ message: "Travel log not found" });

    const comments = await Comment.find({ log: log._id })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 });

    res.json({ log, comments, commentCount: comments.length });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
// @desc    Update own log
// @route   PUT /api/logs/:id
// @access  Private (owner only)
const updateLog = async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Travel log not found' });

    if (log.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this log' });
    }

    const { title, destination, dateOfTravel, description, rating, tags } = req.body;

    if (title) log.title = title;
    if (destination) log.destination = destination;
    if (dateOfTravel) log.dateOfTravel = dateOfTravel;
    if (description) log.description = description;
    if (rating) log.rating = rating;
    if (tags) log.tags = Array.isArray(tags) ? tags : tags.split(',').map((t) => t.trim());

    if (req.files && req.files.length > 0) {
      if (req.files.length > 5) {
        return res.status(400).json({ message: 'Maximum 5 photos allowed' });
      }
      log.photos = req.files.map((file) => `/uploads/${file.filename}`);
    }

    const updatedLog = await log.save();
    res.json(updatedLog);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete own log
// @route   DELETE /api/logs/:id
// @access  Private (owner only)
const deleteLog = async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Travel log not found' });

    if (log.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this log' });
    }

    await log.deleteOne();
    await Comment.deleteMany({ log: log._id });

    res.json({ message: 'Travel log deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getLogsByUser = async (req, res) => {
  try {
    const logs = await TravelLog.find({ user: req.params.userId })
      .populate('user', 'name profilePicture')
      .sort({ createdAt: -1 });
    
    const logsWithComments = await Promise.all(
      logs.map(async (log) => {
        const commentCount = await Comment.countDocuments({ log: log._id });
        return {
          ...log.toObject(),
          commentCount,
        };
      })
    );
    
    res.json(logsWithComments);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Like / unlike a log
// @route   PUT /api/logs/:id/like
// @access  Private
const toggleLike = async (req, res) => {
  try {
    const log = await TravelLog.findById(req.params.id);
    if (!log) return res.status(404).json({ message: 'Travel log not found' });

    const alreadyLiked = log.likes.includes(req.user._id);
    if (alreadyLiked) {
      log.likes = log.likes.filter((id) => id.toString() !== req.user._id.toString());
    } else {
      log.likes.push(req.user._id);
    }
    await log.save();
    res.json({ likesCount: log.likes.length, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createLog,
  getLogs,
  getLogById,
  updateLog,
  deleteLog,
  getLogsByUser,
  toggleLike,
};