const express = require("express");
const router = express.Router();
const { addComment } = require("../controllers/commentController");
const { protect } = require("../middleware/auth");

router.post("/:logId", protect, addComment);

module.exports = router;
