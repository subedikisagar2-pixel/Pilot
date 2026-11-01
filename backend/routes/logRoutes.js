const express = require("express");
const router = express.Router();
const {
  createLog,
  getLogs,
  getLogById,
  updateLog,
  deleteLog,
  getLogsByUser,
  toggleLike,
} = require("../controllers/logController");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.get("/", getLogs);
router.get("/user/:userId", getLogsByUser);
router.get("/:id", getLogById);

router.post("/", protect, upload.array("photos", 5), createLog);
router.put("/:id", protect, upload.array("photos", 5), updateLog);
router.delete("/:id", protect, deleteLog);
router.put("/:id/like", protect, toggleLike);

module.exports = router;
