const Course = require("../models/Course");
const Lesson = require("../models/Lesson");
const User = require("../models/User");
const cloudinary = require("../config/cloudinary");

// ✅ Create Course (Trainers Only, Starts Pending for Admin Approval)
const createCourse = async (req, res) => {
    try {
        const { 
            title, description, category, duration, prerequisites, 
            courseLevel, certificationAvailable, syllabus: syllabusRaw 
        } = req.body;
        
        // ✅ Parse lessons strictly from JSON/string (reverted)
        const lessons = Array.isArray(req.body.lessons)
            ? req.body.lessons
            : JSON.parse(req.body.lessons || "[]");

        // ✅ Ensure user is a trainer
        const trainer = await User.findById(req.user.id);
        if (!trainer || trainer.role !== "trainer") {
            return res.status(403).json({ success: false, message: "Only trainers can create courses" });
        }

        // ✅ Get Cloudinary URL from uploaded file (already uploaded by multer-storage-cloudinary)
        let thumbnail = null;
        
        // Handle both upload.fields() and upload.any() formats
        if (req.files) {
            if (Array.isArray(req.files)) {
                // upload.any() format - flat array
                const thumbnailFile = req.files.find(f => f.fieldname === 'thumbnail');
                thumbnail = thumbnailFile?.path || null;
            } else {
                // upload.fields() format - grouped by field name
                thumbnail = req.files?.thumbnail?.[0]?.path || null;
            }
        }

        // ✅ Validate Inputs
        if (!title || !description || !category || !duration || !courseLevel || !thumbnail) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        // ✅ Parse & Validate Syllabus strictly from JSON/string (reverted)
        let syllabus = [];
        try {
            syllabus = Array.isArray(syllabusRaw) ? syllabusRaw : JSON.parse(syllabusRaw || "[]");
            syllabus.forEach(item => {
                if (!item.title || !item.description) {
                    throw new Error("Each syllabus item must have a title and description.");
                }
            });
        } catch (err) {
            return res.status(400).json({ success: false, message: "Invalid syllabus format: " + err.message });
        }

        // ✅ Create Course (Pending for admin approval)
        const course = new Course({
            title,
            description,
            category,
            trainer: trainer._id,
            thumbnail,
            duration,
            prerequisites,
            courseLevel,
            certificationAvailable,
            syllabus,
            status: "pending"
        });

        await course.save();

        // ✅ Create lessons if provided
        if (lessons && lessons.length > 0) {
            for (let i = 0; i < lessons.length; i++) {
                const lesson = lessons[i];
                const { title, description, order } = lesson;
                
                // ✅ Get Cloudinary URL from uploaded file (already uploaded by CloudinaryStorage)
                let videoUrl = null;
                let imageUrl = null;
                
                // Handle both upload.fields() and upload.any() formats
                if (req.files) {
                    let file = null;
                    
                    if (Array.isArray(req.files)) {
                        // upload.any() format - find file by fieldname
                        file = req.files.find(f => f.fieldname === `lessonVideos[${i}]` || f.fieldname === 'lessonVideos');
                    } else if (req.files.lessonVideos) {
                        // upload.fields() format
                        file = req.files.lessonVideos[i];
                    }
                    
                    if (file) {
                        // file.path already contains the Cloudinary URL
                        if (file.mimetype.startsWith('video/')) {
                            videoUrl = file.path;
                        } else if (file.mimetype.startsWith('image/')) {
                            imageUrl = file.path;
                        }
                    }
                }

                // ✅ Create lesson
                const newLesson = new Lesson({
                    course: course._id,
                    title,
                    description,
                    videoUrl,
                    imageUrl,
                    order: order || i + 1
                });

                await newLesson.save();
                course.lessons.push(newLesson._id);
            }
            await course.save();
        }

        return res.status(201).json({
            success: true,
            message: "Course created successfully",
            course
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Approve or Reject Course (Admins Only)
const updateCourseApproval = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { status, rejectionReason } = req.body;

        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can approve or reject courses" });
        }

        if (!["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        if (status === "rejected" && !rejectionReason) {
            return res.status(400).json({ message: "Rejection reason is required" });
        }

        course.status = status;
        course.approvedBy = req.user.id;
        course.approvalDate = new Date();
        course.rejectionReason = status === "rejected" ? rejectionReason : null;

        await course.save();

        // Create notification for trainer
        const User = require("../models/User");
        const trainer = await User.findById(course.trainer);
        
        if (trainer) {
            const notification = {
                type: status === "approved" ? "course_approved" : "course_rejected",
                message: status === "approved" 
                    ? `Your course "${course.title}" has been approved by admin`
                    : `Your course "${course.title}" has been rejected by admin`,
                courseName: course.title,
                courseId: course._id,
                reason: status === "rejected" ? rejectionReason : null,
                isRead: false,
                createdAt: new Date()
            };
            
            trainer.notifications.push(notification);
            await trainer.save();
        }

        return res.status(200).json({
            success: true,
            message: `Course ${status} successfully`,
            course
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get All Approved Courses
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({ status: "approved" })
            .populate("trainer", "name email")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: "All approved courses fetched successfully",
            courses
        });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// ✅ Get Pending Courses (Admins Only)
const getPendingCourses = async (req, res) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ message: "Only admins can view pending courses" });
        }

        const courses = await Course.find({ status: "pending" }).populate("trainer", "name email");
        return res.status(200).json({ success: true, courses });

    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

const getCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)
            .populate("lessons")
            .populate("trainer", "name email");

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Ensure only approved courses are accessible to non-authenticated users
        // Authenticated users (admin/trainer) can see their own courses or pending courses
        if (course.status !== "approved") {
            // If user is not authenticated, they can only see approved courses
            if (!req.user) {
                return res.status(403).json({ success: false, message: "This course is not available" });
            }
            // If user is authenticated, check if they're admin or the trainer
            if (req.user.role !== "admin" && req.user.id !== course.trainer.toString()) {
                return res.status(403).json({ success: false, message: "This course is not available" });
            }
        }

        res.status(200).json({ success: true, course });
    } catch (error) {
        console.error("Error fetching course:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


const updateCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        let updates = req.body;

        // ✅ Validate course ID
        if (!courseId) {
            return res.status(400).json({ message: "Course ID is required" });
        }

        // ✅ Find course (populate to get lesson details if needed for display, but use IDs for updates)
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // ✅ Check user authorization (Trainer or Admin)
        if (req.user.role !== "admin" && course.trainer.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized to update this course" });
        }

        // ✅ Handle thumbnail upload if provided
        let thumbnailFile = null;
        if (req.files && Array.isArray(req.files)) {
            thumbnailFile = req.files.find(f => f.fieldname === 'thumbnail');
        } else if (req.files?.thumbnail) {
            thumbnailFile = req.files.thumbnail[0];
        }
        
        if (thumbnailFile) {
            // Thumbnail is already uploaded to Cloudinary by multer-storage-cloudinary
            // Just use the path directly
            updates.thumbnail = thumbnailFile.path;
        }

        // ✅ Handle syllabus update
        if (updates.syllabus) {
            try {
                const parsedSyllabus = Array.isArray(updates.syllabus) 
                    ? updates.syllabus 
                    : JSON.parse(updates.syllabus);
                    
                if (!Array.isArray(parsedSyllabus)) throw new Error("Invalid syllabus format");
                
                parsedSyllabus.forEach(item => {
                    if (!item.title || !item.description) {
                        throw new Error("Each syllabus item must have a title and description.");
                    }
                });

                updates.syllabus = parsedSyllabus;
            } catch (err) {
                return res.status(400).json({ success: false, message: "Invalid syllabus format" });
            }
        }

        // ✅ Handle lesson updates - SIMPLIFIED
        const hasLessonData = Object.keys(req.body).some(key => key.startsWith('lessons['));
        
        if (hasLessonData) {
            console.log('Processing lesson updates...');
            
            // Collect all lessons from form data
            const submittedLessons = [];
            const lessonMap = {};
            
            // Parse form data
            Object.keys(req.body).forEach(key => {
                const match = key.match(/lessons\[(\d+)\]\[(\w+)\]/);
                if (match) {
                    const index = match[1];
                    const field = match[2];
                    if (!lessonMap[index]) lessonMap[index] = {};
                    lessonMap[index][field] = req.body[key];
                }
            });
            
            // Convert to array
            Object.keys(lessonMap).sort().forEach(index => {
                submittedLessons.push(lessonMap[index]);
            });
            
            console.log(`Found ${submittedLessons.length} lessons in form data`);
            
            // Find uploaded files
            const uploadedFiles = {};
            if (req.files && Array.isArray(req.files)) {
                req.files.forEach(file => {
                    const match = file.fieldname.match(/lessonVideos\[(\d+)\]/);
                    if (match) uploadedFiles[match[1]] = file;
                });
            }
            
            const updatedLessonIds = [];
            
            // Process each submitted lesson
            for (let i = 0; i < submittedLessons.length; i++) {
                const lessonData = submittedLessons[i];
                const uploadedFile = uploadedFiles[i];
                
                if (lessonData._id) {
                    // UPDATE existing lesson
                    const update = {
                        title: lessonData.title,
                        description: lessonData.description
                    };
                    
                    // Handle media
                    if (uploadedFile) {
                        // New file uploaded
                        if (uploadedFile.mimetype.startsWith('video/')) {
                            update.videoUrl = uploadedFile.path;
                            update.imageUrl = null;
                        } else if (uploadedFile.mimetype.startsWith('image/')) {
                            update.imageUrl = uploadedFile.path;
                            update.videoUrl = null;
                        }
                    } else {
                        // No new file - keep existing
                        if (lessonData.videoUrl) update.videoUrl = lessonData.videoUrl;
                        if (lessonData.imageUrl) update.imageUrl = lessonData.imageUrl;
                    }
                    
                    await Lesson.findByIdAndUpdate(lessonData._id, update);
                    updatedLessonIds.push(lessonData._id);
                    console.log(`Updated lesson ${lessonData._id}`);
                    
                } else {
                    // CREATE new lesson
                    const newLesson = new Lesson({
                        course: courseId,
                        title: lessonData.title || 'Untitled',
                        description: lessonData.description || '',
                        videoUrl: uploadedFile && uploadedFile.mimetype.startsWith('video/') ? uploadedFile.path : null,
                        imageUrl: uploadedFile && uploadedFile.mimetype.startsWith('image/') ? uploadedFile.path : null
                    });
                    
                    await newLesson.save();
                    course.lessons.push(newLesson._id);
                    updatedLessonIds.push(newLesson._id.toString());
                    console.log(`Created new lesson ${newLesson._id}`);
                }
            }
            
            // DELETE lessons not in the submitted list
            const currentLessonIds = course.lessons.map(id => id.toString());
            const submittedIds = updatedLessonIds.map(id => id.toString());
            const toDelete = currentLessonIds.filter(id => !submittedIds.includes(id));
            
            if (toDelete.length > 0) {
                await Lesson.deleteMany({ _id: { $in: toDelete } });
                course.lessons = course.lessons.filter(id => submittedIds.includes(id.toString()));
                console.log(`Deleted ${toDelete.length} lessons`);
            }
        }
        
        // ✅ Apply partial updates (exclude lessons array to prevent overwriting)
        const { lessons: _, ...safeUpdates } = updates;
        Object.assign(course, safeUpdates);
        const updatedCourse = await course.save();
        
        // Populate lessons to return full course data
        await updatedCourse.populate('lessons');

        return res.status(200).json({
            message: "Course updated successfully",
            course: updatedCourse
        });

    } catch (error) {
        console.error("Error updating course:", error);
        console.error("Error stack:", error.stack);
        return res.status(500).json({ message: "Failed to update course", error: error.message });
    }
};



const deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // ✅ Find course by ID
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // ✅ Ensure only the trainer who created it or an admin can delete
        if (req.user.role !== "admin" && course.trainer.toString() !== req.user.id) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this course" });
        }

        // ✅ Delete associated lessons first
        await Lesson.deleteMany({ course: courseId });

        // ✅ Delete the course
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
        console.error("Error deleting course:", error);
        return res.status(500).json({ success: false, message: "Failed to delete course", error: error.message });
    }
};


const getTrainerCourses = async (req, res) => {
    try {
        const trainerId = req.user.id;

        const trainer = await User.findById(trainerId);
        if (!trainer || trainer.role !== "trainer") {
            return res.status(403).json({ success: false, message: "Only trainers can access their courses" });
        }

        const courses = await Course.find({ trainer: trainerId, status: "approved" })
            .populate("lessons");

        return res.status(200).json({
            success: true,
            courses,
        });

    } catch (error) {
        console.error("Error fetching trainer courses:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.user.id;

        // ✅ Find the course by ID
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // ✅ Find the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // ✅ Check if user is a learner
        if (user.role !== "learner") {
            return res.status(403).json({ success: false, message: "Only learners can enroll in courses" });
        }

        // ✅ Check if already enrolled
        if (user.enrolledCourses.includes(courseId)) {
            return res.status(400).json({ success: false, message: "Already enrolled in this course" });
        }

        // ✅ Enroll user in the course
        user.enrolledCourses.push(courseId);
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Enrolled in course successfully",
            enrolledCourses: user.enrolledCourses
        });

    } catch (error) {
        console.error("Error enrolling in course:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};
const getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        // ✅ Get the user with enrolled courses populated
        const user = await User.findById(userId)
            .populate("enrolledCourses", "title description category trainer lessons thumbnail")
            .select("fullName enrolledCourses");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Enrolled courses fetched successfully",
            enrolledCourses: user.enrolledCourses
        });

    } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    getCourse,
    deleteCourse,
    getTrainerCourses, 
    updateCourse,
    enrollCourse, 
    getEnrolledCourses,
    getPendingCourses,
    updateCourseApproval
};

