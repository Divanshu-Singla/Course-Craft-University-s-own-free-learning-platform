const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const cloudinary = require("../config/cloudinary");
const mongoose = require("mongoose");

// ✅ Create Lesson for a Course (Trainer Only)
const createLesson = async (req, res) => {
    try {
        console.log("➕ Create Lesson - Request Body:", req.body);
        console.log("📁 Create Lesson - File:", req.file);
        
        const { courseId } = req.params;
        const { title, description, order } = req.body;

        // ✅ Validate required fields
        if (!title || !description) {
            console.log("❌ Missing required fields");
            return res.status(400).json({ 
                success: false, 
                message: "Title and description are required" 
            });
        }

        // ✅ Check if course exists and user is authorized
        const course = await Course.findById(courseId);
        if (!course) {
            console.log("❌ Course not found");
            return res.status(404).json({ 
                success: false, 
                message: "Course not found" 
            });
        }

        // ✅ Check if user is the trainer of this course or admin
        if (req.user.role !== "admin" && course.trainer.toString() !== req.user.id) {
            console.log("❌ Unauthorized - User:", req.user.id, "Trainer:", course.trainer);
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized to add lessons to this course" 
            });
        }

        // ✅ Get Cloudinary URL from uploaded file (already uploaded by CloudinaryStorage)
        let videoUrl = null;
        let imageUrl = null;
        if (req.file) {
            console.log("📤 File uploaded to Cloudinary:", req.file.path);
            // req.file.path already contains the Cloudinary URL
            if (req.file.mimetype.startsWith('video/')) {
                videoUrl = req.file.path;
            } else if (req.file.mimetype.startsWith('image/')) {
                imageUrl = req.file.path;
            }
        }

        // ✅ Create lesson
        const lesson = new Lesson({
            course: courseId,
            title,
            description,
            videoUrl,
            imageUrl,
            order: order || 1
        });

        await lesson.save();
        console.log("✅ Lesson created:", lesson._id);

        // ✅ Add lesson to course
        course.lessons.push(lesson._id);
        await course.save();
        console.log("✅ Lesson added to course");

        return res.status(201).json({
            success: true,
            message: "Lesson created successfully",
            lesson
        });

    } catch (error) {
        console.error("❌ Create Lesson Error:", error);
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ✅ Delete Lesson (Trainer Only)
const deleteLesson = async (req, res) => {
    try {
        console.log("🗑️ Delete Lesson - Lesson ID:", req.params.lessonId);
        console.log("👤 User:", req.user);
        const { lessonId } = req.params;

        // ✅ Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(lessonId)) {
            console.log("❌ Invalid lesson ID format");
            return res.status(400).json({ 
                success: false, 
                message: "Invalid lesson ID format" 
            });
        }

        // ✅ Find lesson
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            console.log("❌ Lesson not found");
            return res.status(404).json({ 
                success: false, 
                message: "Lesson not found" 
            });
        }
        
        console.log("📚 Found Lesson:", lesson);

        // ✅ Find course and check authorization
        const course = await Course.findById(lesson.course);
        if (!course) {
            console.log("❌ Course not found");
            return res.status(404).json({ 
                success: false, 
                message: "Course not found" 
            });
        }

        // ✅ Check if user is authorized
        console.log("👤 User Role:", req.user.role);
        console.log("🎓 Course Trainer:", course.trainer.toString());
        console.log("🆔 User ID:", req.user.id);
        
        if (req.user.role !== "admin" && course.trainer.toString() !== req.user.id) {
            console.log("❌ Unauthorized");
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized to delete this lesson" 
            });
        }

        // ✅ Delete video or image from Cloudinary if exists
        if (lesson.videoUrl) {
            try {
                console.log("🎬 Deleting video from Cloudinary:", lesson.videoUrl);
                // Extract public_id from Cloudinary URL
                // URL format: https://res.cloudinary.com/cloud_name/video/upload/v123456/folder/public_id.ext
                const urlParts = lesson.videoUrl.split('/');
                const uploadIndex = urlParts.findIndex(part => part === 'upload');
                // Get everything after 'upload/v123456/' which is 'folder/filename.ext'
                const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
                // Remove extension
                const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
                
                console.log("📌 Video Public ID:", publicId);
                await cloudinary.uploader.destroy(publicId, { 
                    resource_type: "video" 
                });
                console.log("✅ Video deleted from Cloudinary");
            } catch (error) {
                console.log("⚠️ Cloudinary video delete failed:", error.message);
                // Continue even if Cloudinary delete fails
            }
        }
        
        if (lesson.imageUrl) {
            try {
                console.log("🖼️ Deleting image from Cloudinary:", lesson.imageUrl);
                // Extract public_id from Cloudinary URL
                const urlParts = lesson.imageUrl.split('/');
                const uploadIndex = urlParts.findIndex(part => part === 'upload');
                const pathAfterUpload = urlParts.slice(uploadIndex + 2).join('/');
                const publicId = pathAfterUpload.replace(/\.[^/.]+$/, '');
                
                console.log("📌 Image Public ID:", publicId);
                await cloudinary.uploader.destroy(publicId, { 
                    resource_type: "image" 
                });
                console.log("✅ Image deleted from Cloudinary");
            } catch (error) {
                console.log("⚠️ Cloudinary image delete failed:", error.message);
                // Continue even if Cloudinary delete fails
            }
        }

        // ✅ Remove lesson from course
        console.log("📝 Removing lesson from course.lessons array");
        course.lessons = course.lessons.filter(
            lessonRef => lessonRef.toString() !== lessonId
        );
        await course.save();
        console.log("✅ Course updated");

        // ✅ Delete lesson
        console.log("🗑️ Deleting lesson document");
        await Lesson.findByIdAndDelete(lessonId);
        console.log("✅ Lesson deleted successfully");

        return res.status(200).json({
            success: true,
            message: "Lesson deleted successfully"
        });

    } catch (error) {
        console.error("❌ Delete Lesson Error:");
        console.error("Error Message:", error.message);
        console.error("Error Stack:", error.stack);
        console.error("Error Name:", error.name);
        return res.status(500).json({ 
            success: false, 
            message: error.message || "Internal server error",
            error: process.env.NODE_ENV === "development" ? error.stack : undefined
        });
    }
};

module.exports = {
    createLesson,
    deleteLesson
};
