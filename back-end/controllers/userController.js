const User = require("../models/User");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary"); // Import Cloudinary

// ✅ Get all users (Admin only)
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Get user by ID (Admin & User themselves)
const getUserById = async (req, res) => {
    try {
        const { id } = req.params;
        console.log("🔹 Requested User ID:", id);
        console.log("🔹 Authenticated User:", req.user);

        if (req.user.role !== "admin" && req.user._id.toString() !== id) {
            return res.status(403).json({ message: "Access denied" });
        }

        // Ensure ObjectId format before querying
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid user ID format." });
        }

        const user = await User.findById(id).select("-password");
        console.log("🔹 Retrieved User:", user);

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({
            ...user.toObject(),
            isBanned: user.isBanned || false, // ✅ Ensure `isBanned` is sent
        });
    } catch (error) {
        console.error("🔴 Error retrieving user:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// ✅ Get current logged-in user
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


// const updateUser = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Check if the user has permission
//         if (req.user.id !== id && req.user.role !== "admin") {
//             return res.status(403).json({ message: "Access denied" });
//         }

//         let updates = { ...req.body };

//         // ✅ Handle profile picture upload
//         if (req.file) {
//             const uploadedFile = req.file;
//             updates.profilePicture = uploadedFile.path; // Cloudinary URL

//             // 🔴 Remove old profile picture from Cloudinary
//             const user = await User.findById(id);
//             if (user?.profilePicture) {
//                 const oldImagePublicId = user.profilePicture.split("/").pop().split(".")[0]; // Extract public ID
//                 await cloudinary.uploader.destroy(oldImagePublicId); // Delete from Cloudinary
//             }
//         }

//         // ✅ Update user in database
//         const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");

//         if (!updatedUser) return res.status(404).json({ message: "User not found" });

//         res.status(200).json({ message: "User updated successfully", user: updatedUser });
//     } catch (error) {
//         console.error("🔴 Error updating user:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };

// // ✅ Partially update user (PATCH request)
// const partialUpdateUser = async (req, res) => {
//     try {
//         const { id } = req.params;

//         // Check if the user has permission
//         if (req.user.id !== id && req.user.role !== "admin") {
//             return res.status(403).json({ message: "Access denied" });
//         }

//         let updates = { ...req.body };

//         // ✅ Handle profile picture upload
//         if (req.file) {
//             const uploadedFile = req.file;
//             updates.profilePicture = uploadedFile.path; // Cloudinary URL

//             // 🔴 Remove old profile picture from Cloudinary
//             const user = await User.findById(id);
//             if (user?.profilePicture) {
//                 const oldImagePublicId = user.profilePicture.split("/").pop().split(".")[0]; // Extract public ID
//                 await cloudinary.uploader.destroy(oldImagePublicId); // Delete from Cloudinary
//             }
//         }

//         // ✅ Update user with partial changes
//         const updatedUser = await User.findByIdAndUpdate(id, { $set: updates }, { new: true }).select("-password");

//         if (!updatedUser) return res.status(404).json({ message: "User not found" });

//         res.status(200).json({ message: "User updated successfully", user: updatedUser });
//     } catch (error) {
//         console.error("🔴 Error updating user:", error);
//         res.status(500).json({ message: "Server Error", error: error.message });
//     }
// };


const updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // 🛑 Prevent unauthorized updates
        if (req.user.id !== id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. You can only update your own profile." });
        }

        // ❌ Prevent updating restricted fields
        const restrictedFields = ["_id", "role", "password", "tokens"];
        Object.keys(req.body).forEach((key) => {
            if (restrictedFields.includes(key)) {
                delete req.body[key];
            }
        });

        let updates = { ...req.body };

        // ✅ Handle profile picture upload (if provided)
        if (req.file) {
            const uploadedFile = req.file;
            updates.profilePicture = uploadedFile.path; // Save Cloudinary URL

            // 🔴 Remove old profile picture from Cloudinary
            const user = await User.findById(id);
            if (user?.profilePicture) {
                const oldImagePublicId = user.profilePicture.split("/").pop().split(".")[0]; // Extract public ID
                await cloudinary.uploader.destroy(oldImagePublicId); // Delete from Cloudinary
            }
        }

        // ✅ Update user in database
        const updatedUser = await User.findByIdAndUpdate(id, updates, { new: true }).select("-password");

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("🔴 Error updating user:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};


const partialUpdateUser = async (req, res) => {
    try {
        const { id } = req.params;

        // 🛑 Check if the user has permission
        if (req.user.id !== id && req.user.role !== "admin") {
            return res.status(403).json({ message: "Access denied. You can only update your own profile." });
        }

        // ❌ Prevent updating restricted fields
        const restrictedFields = ["_id", "role", "password", "tokens"];
        Object.keys(req.body).forEach((key) => {
            if (restrictedFields.includes(key)) {
                delete req.body[key];
            }
        });

        let updates = { ...req.body };

        // ✅ Handle profile picture upload
        if (req.file) {
            const uploadedFile = req.file;
            updates.profilePicture = uploadedFile.path; // Save Cloudinary URL

            // 🔴 Remove old profile picture from Cloudinary
            const user = await User.findById(id);
            if (user?.profilePicture) {
                const oldImagePublicId = user.profilePicture.split("/").pop().split(".")[0]; // Extract public ID
                await cloudinary.uploader.destroy(oldImagePublicId); // Delete from Cloudinary
            }
        }

        // ✅ Update user with partial changes
        const updatedUser = await User.findByIdAndUpdate(id, { $set: updates }, { new: true }).select("-password");

        if (!updatedUser) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
    } catch (error) {
        console.error("🔴 Error updating user:", error);
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// ✅ Delete user (Admin & User themselves)
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Only admin can delete other users
        if (req.user.role !== "admin" && req.user.id !== id) {
            return res.status(403).json({ message: "Access denied. Admin privileges required." });
        }

        // Find and permanently delete the user
        const user = await User.findByIdAndDelete(id);

        if (!user) return res.status(404).json({ message: "User not found" });

        // If user had a profile picture on Cloudinary, delete it
        if (user.profilePicture && user.profilePicture.includes('cloudinary')) {
            try {
                const publicId = user.profilePicture.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`profile_pictures/${publicId}`);
            } catch (cloudinaryError) {
                console.error("Failed to delete profile picture from Cloudinary:", cloudinaryError);
            }
        }

        res.status(200).json({ message: "User deleted permanently", deletedUser: { id: user._id, name: user.fullName } });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get user notifications
const getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("notifications");
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Sort notifications by createdAt descending (newest first)
        const sortedNotifications = user.notifications.sort((a, b) => b.createdAt - a.createdAt);

        res.status(200).json({
            success: true,
            notifications: sortedNotifications
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Mark notification as read
const markNotificationAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { notificationId } = req.params;

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const notification = user.notifications.id(notificationId);
        
        if (!notification) {
            return res.status(404).json({ message: "Notification not found" });
        }

        notification.isRead = true;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Notification marked as read"
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Mark all notifications as read
const markAllNotificationsAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        user.notifications.forEach(notification => {
            notification.isRead = true;
        });
        
        await user.save();

        res.status(200).json({
            success: true,
            message: "All notifications marked as read"
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Mark lesson as complete
const markLessonComplete = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, lessonId } = req.body;

        const user = await User.findById(userId);
        const Course = require("../models/Course");
        const course = await Course.findById(courseId).populate("lessons");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Find or create progress entry for this course
        let progressEntry = user.courseProgress.find(p => p.courseId.toString() === courseId);

        if (!progressEntry) {
            progressEntry = {
                courseId: courseId,
                completedLessons: [],
                progressPercentage: 0,
                lastAccessed: new Date()
            };
            user.courseProgress.push(progressEntry);
        }

        // Add lesson to completed if not already there
        if (!progressEntry.completedLessons.some(l => l.toString() === lessonId)) {
            progressEntry.completedLessons.push(lessonId);
        }

        // Update last accessed lesson
        progressEntry.lastAccessedLesson = lessonId;
        progressEntry.lastAccessed = new Date();

        // Calculate progress percentage
        const totalLessons = course.lessons.length;
        const completedCount = progressEntry.completedLessons.length;
        progressEntry.progressPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

        await user.save();

        res.status(200).json({
            success: true,
            message: "Lesson marked as complete",
            progress: {
                completedLessons: progressEntry.completedLessons.length,
                totalLessons: totalLessons,
                progressPercentage: progressEntry.progressPercentage
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

// Get course progress
const getCourseProgress = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId } = req.params;

        const user = await User.findById(userId).populate({
            path: "courseProgress.completedLessons",
            model: "Lesson"
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const progressEntry = user.courseProgress.find(p => p.courseId.toString() === courseId);

        if (!progressEntry) {
            return res.status(200).json({
                success: true,
                progress: {
                    completedLessons: [],
                    progressPercentage: 0,
                    totalCompleted: 0
                }
            });
        }

        res.status(200).json({
            success: true,
            progress: {
                completedLessons: progressEntry.completedLessons,
                progressPercentage: progressEntry.progressPercentage,
                totalCompleted: progressEntry.completedLessons.length,
                lastAccessedLesson: progressEntry.lastAccessedLesson
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Server Error", error: error.message });
    }
};

module.exports = { getUsers, getUserById, getCurrentUser, updateUser, partialUpdateUser, deleteUser, getNotifications, markNotificationAsRead, markAllNotificationsAsRead, markLessonComplete, getCourseProgress };
