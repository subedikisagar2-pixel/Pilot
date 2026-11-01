const express = require("express");
const router = express.Router();
const { getLogs } = require("../controllers/logController");

// GET /api/search?q=&tag=  -> delegates to the same logic as GET /api/logs
router.get("/", getLogs);

module.exports = router;
