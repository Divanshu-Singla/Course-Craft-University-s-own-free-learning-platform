const Lesson = require("../models/Lesson");
const Course = require("../models/Course");
const cloudinary = require("../config/cloudinary");

// ✅ Create Lesson for a Course (Trainer Only)
const createLesson = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, order } = req.body;

        // ✅ Validate required fields
        if (!title || !description) {
            return res.status(400).json({ 
                success: false, 
                message: "Title and description are required" 
            });
        }

        // ✅ Check if course exists and user is authorized
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ 
                success: false, 
                message: "Course not found" 
            });
        }

        // ✅ Check if user is the trainer of this course or admin
        if (req.user.role !== "admin" && course.trainer.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized to add lessons to this course" 
            });
        }

        // ✅ Get Cloudinary URL from uploaded file (already uploaded by CloudinaryStorage)
        let videoUrl = null;
        let imageUrl = null;
        if (req.file) {
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

        // ✅ Add lesson to course
        course.lessons.push(lesson._id);
        await course.save();

        return res.status(201).json({
            success: true,
            message: "Lesson created successfully",
            lesson
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// ✅ Delete Lesson (Trainer Only)
const deleteLesson = async (req, res) => {
    try {
        const { lessonId } = req.params;

        // ✅ Find lesson
        const lesson = await Lesson.findById(lessonId);
        if (!lesson) {
            return res.status(404).json({ 
                success: false, 
                message: "Lesson not found" 
            });
        }

        // ✅ Find course and check authorization
        const course = await Course.findById(lesson.course);
        if (!course) {
            return res.status(404).json({ 
                success: false, 
                message: "Course not found" 
            });
        }

        // ✅ Check if user is authorized
        if (req.user.role !== "admin" && course.trainer.toString() !== req.user.id) {
            return res.status(403).json({ 
                success: false, 
                message: "Unauthorized to delete this lesson" 
            });
        }

        // ✅ Delete video or image from Cloudinary if exists
        if (lesson.videoUrl) {
            try {
                // Extract public_id from Cloudinary URL
                // URL format: https://res.cloudinary.com/cloud_name/video/upload/v123456/folder/public_id.ext
                const urlParts = lesson.videoUrl.split('/');
                const fileWithExt = urlParts[urlParts.length - 1];
                const publicId = `lesson_videos/${fileWithExt.split('.')[0]}`;
                
                await cloudinary.uploader.destroy(publicId, { 
                    resource_type: "video" 
                });
            } catch (error) {
                // Continue even if Cloudinary delete fails
            }
        }
        
        if (lesson.imageUrl) {
            try {
                // Extract public_id from Cloudinary URL
                const urlParts = lesson.imageUrl.split('/');
                const fileWithExt = urlParts[urlParts.length - 1];
                const publicId = `lesson_images/${fileWithExt.split('.')[0]}`;
                
                await cloudinary.uploader.destroy(publicId, { 
                    resource_type: "image" 
                });
            } catch (error) {
                // Continue even if Cloudinary delete fails
            }
        }

        // ✅ Remove lesson from course
        course.lessons = course.lessons.filter(
            lessonRef => lessonRef.toString() !== lessonId
        );
        await course.save();

        // ✅ Delete lesson
        await Lesson.findByIdAndDelete(lessonId);

        return res.status(200).json({
            success: true,
            message: "Lesson deleted successfully"
        });

    } catch (error) {
        return res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

module.exports = {
    createLesson,
    deleteLesson
};
