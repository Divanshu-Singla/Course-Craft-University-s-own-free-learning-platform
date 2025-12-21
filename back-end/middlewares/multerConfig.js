const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");
const { v4: uuidv4 } = require("uuid");

// ✅ Dynamic Storage Based on File Type
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    let folder = "general_uploads";
    let resourceType = "raw"; // Cloudinary treats CSV as "raw" files

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
        format: "mp4",
        public_id: `${uuidv4()}-${file.originalname}`,
        resource_type: "video"
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
      folder = "exam_questions"; // Store CSV files in a dedicated folder
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
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});

module.exports = {
  upload,  // ✅ export the raw multer instance
  uploadSingle: upload.single("profilePicture"),
  uploadCourseFiles: upload.any(), // ✅ Accept any field names (lessonVideos[0], lessonVideos[1], etc.)
  uploadCSV: upload.single("file"),
};
