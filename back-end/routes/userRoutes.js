const express = require("express");
const { getUsers, getUserById, getCurrentUser, updateUser, partialUpdateUser, deleteUser, getNotifications, markNotificationAsRead, markAllNotificationsAsRead, markLessonComplete, getCourseProgress } = require("../controllers/userController");
const { uploadSingle } = require("../middlewares/multerConfig"); // Import multer middleware
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/", protect(["admin"]), getUsers);
router.get("/me", protect(["admin", "learner", "trainer", "examinee"]), getCurrentUser);
router.get("/:id", protect(["admin"]), getUserById);
router.put("/:id", protect(["admin", "learner", "trainer", "examinee"]), uploadSingle, updateUser); // ✅ Allow file uploads
router.patch("/:id", protect(["admin", "learner", "trainer", "examinee"]), uploadSingle, partialUpdateUser);
router.delete("/:id", protect(["admin", "learner", "trainer", "examinee"]), deleteUser);

// Notification routes
router.get("/notifications/all", protect(["admin", "learner", "trainer", "examinee"]), getNotifications);
router.patch("/notifications/:notificationId/read", protect(["admin", "learner", "trainer", "examinee"]), markNotificationAsRead);
router.patch("/notifications/mark-all-read", protect(["admin", "learner", "trainer", "examinee"]), markAllNotificationsAsRead);

// Course progress routes
router.post("/progress/lesson-complete", protect(["admin", "learner", "trainer", "examinee"]), markLessonComplete);
router.get("/progress/:courseId", protect(["admin", "learner", "trainer", "examinee"]), getCourseProgress);

module.exports = router;
