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


app.use(cors({
    origin: ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "http://127.0.0.1:3000"], 
    credentials: true,              
    methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.options("*", cors()); // Handle preflight requests globally
// Remove hardcoded Vercel origin; rely on cors middleware above

connectDB();

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

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
