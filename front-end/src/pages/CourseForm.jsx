import React, { useState } from "react";
import { useCourse } from "../contexts/CourseContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"

const CourseForm = () => {
    const { loading, createCourse } = useCourse();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        category: "",
        duration: "",
        prerequisites: "",
        courseLevel: "",
        certificationAvailable: false,
        thumbnail: null,
    });

    const [lessons, setLessons] = useState([]); // Store lessons
    const [syllabus, setSyllabus] = useState([]); // Store syllabus items

    // ✅ Handle Text Inputs & Checkbox
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    // ✅ Handle File Inputs (Thumbnail)
    const handleFileChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.files[0] });
    };

    // ✅ Handle Syllabus Input Change
    const handleSyllabusChange = (index, field, value) => {
        const updatedSyllabus = syllabus.map((item, i) =>
            i === index ? { ...item, [field]: value } : item
        );
        setSyllabus(updatedSyllabus);
    };

    // ✅ Add New Syllabus Item
    const addSyllabusItem = () => {
        setSyllabus([...syllabus, { title: "", description: "" }]);
    };

    // ✅ Handle Lesson Input Change
    const handleLessonChange = (index, field, value) => {
        const updatedLessons = lessons.map((lesson, i) =>
            i === index ? { ...lesson, [field]: value } : lesson
        );
        setLessons(updatedLessons);
    };

    // ✅ Handle Lesson Video Upload
    const handleLessonFileChange = (index, file) => {
        const updatedLessons = lessons.map((lesson, i) =>
            i === index ? { ...lesson, video: file } : lesson
        );
        setLessons(updatedLessons);
    };

    // ✅ Add New Lesson Dynamically
    const addLesson = () => {
        setLessons([
            ...lessons,
            {
                title: "",
                description: "",
                video: null,
                order: lessons.length + 1,
            },
        ]);
    };

    // ✅ Handle Form Submit
    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Validate syllabus before submission
        if (syllabus.some(item => !item.title.trim() || !item.description.trim())) {
            toast.warning("Each syllabus item must have a title and description.");
            return;
        }

        const courseData = new FormData();

        // ✅ Append all form fields except lessons
        for (const key in formData) {
            if (formData[key]) {
                if (key === "certificationAvailable") {
                    courseData.append(key, formData[key] ? "true" : "false");
                } else {
                    courseData.append(key, formData[key]);
                }
            }
        }

        // ✅ Append Lesson Details
        lessons.forEach((lesson, index) => {
            courseData.append(`lessons[${index}][title]`, lesson.title);
            courseData.append(`lessons[${index}][description]`, lesson.description);
            courseData.append(`lessons[${index}][order]`, lesson.order);
            if (lesson.video) {
                courseData.append(`lessonVideos`, lesson.video); // ✅ Keep same key for all videos
            }
        });

        // ✅ Append Syllabus Details (with correct `description` key)
        syllabus.forEach((item, index) => {
            courseData.append(`syllabus[${index}][title]`, item.title);
            courseData.append(`syllabus[${index}][description]`, item.description);
        });

        // ✅ Create Course
        try {
            await createCourse(courseData);
            toast.success("Course created successfully! 🚀");
            navigate("/profile");
        } catch (err) {
            toast.error(`❌ Error: ${err.message || "Failed to create course"}`);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 my-6 bg-white shadow-lg rounded-lg">
            <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
                <h2 className="text-2xl font-bold">Create a New Course</h2>
                <p className="text-blue-100 mt-1 text-sm">Fill in the details to create your course</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Course Title</label>
                    <input 
                        type="text" 
                        name="title" 
                        placeholder="e.g., Complete Web Development Bootcamp" 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                        required 
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                    <textarea 
                        name="description" 
                        placeholder="Provide a detailed description of the course..." 
                        onChange={handleChange} 
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required 
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
                        <input 
                            type="text" 
                            name="category" 
                            placeholder="e.g., Programming, Design" 
                            onChange={handleChange} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            required 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Duration (in hours)</label>
                        <input 
                            type="text" 
                            name="duration" 
                            placeholder="e.g., 40" 
                            onChange={handleChange} 
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                            required 
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Prerequisites</label>
                    <input 
                        type="text" 
                        name="prerequisites" 
                        placeholder="e.g., Basic HTML and CSS knowledge" 
                        onChange={handleChange} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    />
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Course Level</label>
                    <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        name="courseLevel"
                        required
                        value={formData.courseLevel}
                        onChange={handleChange}
                    >
                        <option value="" disabled hidden>Select Course Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advance">Advance</option>
                    </select>
                </div>

                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
                    <input 
                        type="checkbox" 
                        name="certificationAvailable" 
                        onChange={handleChange} 
                        className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <label className="text-sm font-medium text-gray-700">Certification Available</label>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">Course Thumbnail</label>
                    <input 
                        type="file" 
                        name="thumbnail" 
                        accept="image/*" 
                        onChange={handleFileChange} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        required 
                    />
                </div>

                <div className="border-t pt-4 mt-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Course Syllabus</h3>
                    {syllabus.map((item, index) => (
                        <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg mt-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Syllabus Title {index + 1}</label>
                            <input
                                type="text"
                                placeholder="e.g., Introduction to JavaScript"
                                value={item.title}
                                onChange={(e) => handleSyllabusChange(index, "title", e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 mb-2"
                            />
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                            <textarea
                                placeholder="Provide a brief description of this syllabus section"
                                value={item.description}
                                onChange={(e) => handleSyllabusChange(index, "description", e.target.value)}
                                required
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addSyllabusItem}
                        className="w-full mt-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                    >
                        + Add New Syllabus Section
                    </button>
                </div>

                <div className="border-t pt-4 mt-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Course Lessons</h3>
                    {lessons.map((lesson, index) => (
                        <div key={index} className="p-4 bg-green-50 border border-green-200 rounded-lg mt-2">
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Lesson {index + 1} Title</label>
                            <input
                                type="text"
                                placeholder="e.g., Basics of HTML"
                                value={lesson.title}
                                onChange={(e) => handleLessonChange(index, "title", e.target.value)}
                                required
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-2"
                            />
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
                            <textarea
                                placeholder="Provide a detailed description of this lesson"
                                value={lesson.description}
                                onChange={(e) => handleLessonChange(index, "description", e.target.value)}
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 mb-2"
                            />
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Lesson Video/Image</label>
                            <input
                                type="file"
                                accept="video/*,image/*"
                                onChange={(e) => handleLessonFileChange(index, e.target.files[0])}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                            />
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addLesson}
                        className="w-full mt-2 px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                    >
                        + Add New Lesson
                    </button>
                </div>

                <button 
                    type="submit" 
                    disabled={loading} 
                    className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                    {loading ? "Creating Course..." : "Create Course"}
                </button>
            </form>
        </div>
    );
};

export default CourseForm;
