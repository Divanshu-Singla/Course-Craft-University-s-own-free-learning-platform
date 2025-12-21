const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid");

// ✅ Dynamic Storage Based on File Type
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "general_uploads";
    let resourceType = "raw";

    if (file.mimetype.startsWith("image/")) {
      folder = req.baseUrl.includes("/courses") ? "course_images" : "user_profiles";
      return {
        folder,
        format: file.mimetype.split("/")[1], 
        public_id: `${uuidv4()}-${file.originalname}`,
        resource_type: "image"
      };
    }

    if (file.mimetype.startsWith("video/")) {
      folder = "lesson_videos";
      return {
        folder,
        public_id: `${uuidv4()}-${file.originalname}`,
        resource_type: "video",
        chunk_size: 6000000, // 6MB chunks for large videos
        timeout: 120000 // 2 minutes timeout
      };
    }

    if (file.mimetype.startsWith("image/") && req.baseUrl.includes("/lessons")) {
      folder = "lesson_images";
      return {
        folder,
        format: file.mimetype.split("/")[1], 
        public_id: `${uuidv4()}-${file.originalname}`,
        resource_type: "image"
      };
    }

    if (file.mimetype === "text/csv") {
      folder = "exam_questions";
      return {
        folder,
        format: "csv",
        public_id: `${uuidv4()}-${file.originalname}`,
        resource_type: "raw"
      };
    }

    throw new Error("Invalid file type");
  },
});

// ✅ Handle CSV Uploads Along with Other Files

const upload = multer({
  storage: storage,
  limits: { 
    fileSize: 100 * 1024 * 1024, // 100 MB
  },
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || 
        file.mimetype.startsWith('video/') || 
        file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only images, videos, and CSV files are allowed'), false);
    }
  }
});

module.exports = {
  upload,  // ✅ export the raw multer instance
  uploadSingle: upload.single("profilePicture"),
  uploadCourseFiles: upload.any(), // ✅ Accept any field names (lessonVideos[0], lessonVideos[1], etc.)
  uploadCSV: upload.single("file"),
};
