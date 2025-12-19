const mongoose = require("mongoose");
const User = require("../models/User");
require("dotenv").config();

const removeAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/learning-management-system");
        console.log("Connected to MongoDB");

        // Find and remove the admin user
        const result = await User.deleteOne({ email: "admin@devdojo.com" });
        
        if (result.deletedCount > 0) {
            console.log("Admin user removed successfully!");
        } else {
            console.log("Admin user not found or already removed.");
        }
        
    } catch (error) {
        console.error("Error removing admin user:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB");
    }
};

removeAdminUser();

