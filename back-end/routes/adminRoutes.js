const express = require("express");
const { getAdminStats, banUser, unbanUser } = require("../controllers/adminController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// ✅ Admin Stats Route (Protected - Admin only)
router.get("/stats", protect(["admin"]), getAdminStats);

// ✅ Ban & Unban User Routes (Protected - Admin only)
router.put("/ban/:userId", protect(["admin"]), banUser);
router.put("/unban/:userId", protect(["admin"]), unbanUser);

module.exports = router;
