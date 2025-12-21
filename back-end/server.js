const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const examRoutes = require('./routes/examRoutes');
const connectDB = require("./config/db"); 
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require("./routes/adminRoutes");
const certificateRoutes = require('./routes/certificateRoutes');



dotenv.config(); 

const app = express();

// Middleware
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use("/public", express.static("public"));


// CORS Configuration - Allow both local and production URLs
const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    process.env.CLIENT_URL, // Production frontend URL from env
    "https://your-frontend.vercel.app", // Replace with your Vercel URL
    "https://lms-frontend.onrender.com" // If hosting frontend on Render
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,              
    methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors()); // Handle preflight requests globally
// Remove hardcoded Vercel origin; rely on cors middleware above

connectDB();

// Health Check Endpoint (for Render monitoring)
app.get("/api/auth/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running", timestamp: new Date().toISOString() });
});

// Root endpoint
app.get("/", (req, res) => {
    res.json({ message: "LMS Backend API", version: "1.0.0", status: "running" });
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/courses",courseRoutes);
app.use("/api/lessons", lessonRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/certificates', certificateRoutes);
// Add Admin Routes
app.use("/api/admin", adminRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({
        error: err.message || "Internal Server Error",
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    });
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌍 CORS enabled for: ${process.env.CLIENT_URL || 'localhost'}`);
});
