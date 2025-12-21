import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCourse } from "../contexts/CourseContext";

const UpdateCourseModal = ({ course, isOpen, onClose }) => {
    const { updateCourse } = useCourse();

    const [updatedData, setUpdatedData] = useState({
        title: course?.title || "",
        description: course?.description || "",
        category: course?.category || "",
        duration: course?.duration || "",
        level: course?.level || "Beginner",
        prerequisites: course?.prerequisites || "",
        certificationAvailable: course?.certificationAvailable || false,
        syllabus: course?.syllabus || [],
    });

    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState(course?.thumbnail || "");

    // Handle text inputs
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    // Handle Thumbnail Upload
    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    // Handle syllabus updates
    const handleSyllabusChange = (index, field, value) => {
        setUpdatedData((prevData) => {
            const updatedSyllabus = [...prevData.syllabus];
            updatedSyllabus[index] = { ...updatedSyllabus[index], [field]: value };
            return { ...prevData, syllabus: updatedSyllabus };
        });
    };


    // Add new syllabus module
    // Add new syllabus module
    const addSyllabus = () => {
        setUpdatedData((prevData) => ({
            ...prevData,
            syllabus: [...prevData.syllabus, { title: "", description: "" }],
        }));
    };


    // Remove syllabus module
    const removeSyllabus = (index) => {
        setUpdatedData((prevData) => ({
            ...prevData,
            syllabus: prevData.syllabus.filter((_, i) => i !== index),
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("title", updatedData.title);
        formData.append("description", updatedData.description);
        formData.append("category", updatedData.category);
        formData.append("duration", updatedData.duration);
        formData.append("level", updatedData.level);
        formData.append("prerequisites", updatedData.prerequisites);
        formData.append("certificationAvailable", updatedData.certificationAvailable);
        formData.append("syllabus", JSON.stringify(updatedData.syllabus));

        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        // Update the course
        await updateCourse({ courseId: course._id, updatedData: formData });
        onClose();
    };

    if (!isOpen) return null;

    return (
        
        <div className="fixed inset-0 z-50 flex items-center text-black justify-center bg-black/30 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl p-6 shadow-2xl"
            >
                {/* Header Section */}
                <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-bold">Update Course</h2>
                            <p className="text-blue-100 mt-1 text-sm">Modify course details and content</p>
                        </div>
                        <button onClick={onClose} className="text-white hover:text-blue-100 text-2xl font-bold">
                            &times;
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Course Title</label>
                        <input type="text" name="title" value={updatedData.title} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition" placeholder="Enter course title" required />
                    </div>

                    {/* Category, Duration, Level */}
                    <div className="grid md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                            <input type="text" name="category" value={updatedData.category} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition" placeholder="e.g., Programming" required />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Duration</label>
                            <input type="text" name="duration" value={updatedData.duration} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition" placeholder="e.g., 6 weeks" required />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Level</label>
                            <select name="level" value={updatedData.level} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition">
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    {/* Prerequisites */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Prerequisites</label>
                        <input type="text" name="prerequisites" value={updatedData.prerequisites} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition" placeholder="Enter prerequisites (optional)" />
                    </div>

                    {/* Certification Available */}
                    <div className="flex items-center p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <input type="checkbox" name="certificationAvailable" checked={updatedData.certificationAvailable} onChange={handleChange} className="mr-3 h-4 w-4 text-blue-600 focus:ring-2 focus:ring-blue-500" />
                        <label className="text-sm font-semibold text-gray-700">Certification Available</label>
                    </div>

                    {/* Thumbnail Upload */}
                    <div className="border-t pt-4">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Course Thumbnail</label>
                        <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition" />
                        {thumbnailPreview && <img src={thumbnailPreview} alt="Thumbnail Preview" className="mt-3 w-40 h-40 object-cover rounded-lg border-2 border-blue-200" />}
                    </div>

                    {/* Syllabus Section */}
                    <div className="border-t pt-4">
                        <h3 className="text-lg font-bold text-gray-800 mb-3">Course Syllabus</h3>
                        {updatedData.syllabus.map((item, index) => (
                            <div key={index} className="mb-3 p-4 border border-blue-200 rounded-lg bg-blue-50">
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-sm font-semibold text-blue-800">Module {index + 1}</h4>
                                    <button
                                        type="button"
                                        onClick={() => removeSyllabus(index)}
                                        className="text-red-600 hover:text-red-800 text-sm font-semibold transition"
                                    >
                                        Remove
                                    </button>
                                </div>

                                <label className="block text-sm font-semibold text-gray-700 mb-1">Module Title</label>
                                <input
                                    type="text"
                                    value={item.title}
                                    onChange={(e) => handleSyllabusChange(index, "title", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition mb-2"
                                    placeholder="Enter module title"
                                />

                                <label className="block text-sm font-semibold text-gray-700 mb-1">Module Description</label>
                                <textarea
                                    value={item.description}
                                    onChange={(e) => handleSyllabusChange(index, "description", e.target.value)}
                                    className="w-full px-3 py-2 rounded-lg border border-blue-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition resize-none"
                                    rows="3"
                                    placeholder="Enter module description"
                                />
                            </div>
                        ))}

                        <button
                            type="button"
                            onClick={addSyllabus}
                            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition mb-4"
                        >
                            Add Module
                        </button>
                    </div>

                    {/* Submit Buttons */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-500 text-white font-semibold rounded-lg hover:bg-gray-600 transition">
                            Cancel
                        </button>
                        <button type="submit" className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">
                            Save Changes
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UpdateCourseModal;
