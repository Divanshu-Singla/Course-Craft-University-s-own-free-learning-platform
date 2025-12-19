const express = require("express");
const { getUsers, getUserById, getCurrentUser, updateUser, partialUpdateUser, deleteUser, getNotifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification, markLessonComplete, getCourseProgress } = require("../controllers/userController");
const { uploadSingle } = require("../middlewares/multerConfig"); // Import multer middleware
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect(["admin"]), getUsers);
router.get("/me", protect(["admin", "learner", "trainer"]), getCurrentUser);
router.get("/:id", protect(["admin"]), getUserById);
router.put("/:id", protect(["admin", "learner", "trainer"]), uploadSingle, updateUser); // ✅ Allow file uploads
router.patch("/:id", protect(["admin", "learner", "trainer"]), uploadSingle, partialUpdateUser);
router.delete("/:id", protect(["admin", "learner", "trainer"]), deleteUser);

// Notification routes
router.get("/notifications/all", protect(["admin", "learner", "trainer"]), getNotifications);
router.patch("/notifications/:notificationId/read", protect(["admin", "learner", "trainer"]), markNotificationAsRead);
router.patch("/notifications/mark-all-read", protect(["admin", "learner", "trainer"]), markAllNotificationsAsRead);
router.delete("/notifications/:notificationId", protect(["admin", "learner", "trainer"]), deleteNotification);

// Course progress routes
router.post("/progress/lesson-complete", protect(["admin", "learner", "trainer"]), markLessonComplete);
router.get("/progress/:courseId", protect(["admin", "learner", "trainer"]), getCourseProgress);

module.exports = router;
