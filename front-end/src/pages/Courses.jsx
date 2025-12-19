import React, { useEffect, useState } from "react";
import { useCourse } from "../contexts/CourseContext";
import { useLocation } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import { motion } from "framer-motion";

const CoursesList = () => {
    const { courses, loading, error, fetchAllCourses } = useCourse();
    const location = useLocation();

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const [levelFilter, setLevelFilter] = useState("");

    useEffect(() => {
        fetchAllCourses();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get("query") || "";
        setSearchQuery(query);
    }, [location.search]);

    useEffect(() => {
        let filtered = [...courses];

        if (searchQuery.trim() !== "") {
            filtered = filtered.filter((course) =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        if (levelFilter) {
            filtered = filtered.filter((course) =>
                course.courseLevel.toLowerCase() === levelFilter.toLowerCase()
            );
        }

        setFilteredCourses(filtered);
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [courses, searchQuery, levelFilter]);

    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const currentCourses = filteredCourses.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" }); // Optional: Scroll to top on page change
        }
    };

    const goToPage = (page) => setCurrentPage(page);

    const paginationButtons = Array.from({ length: totalPages }, (_, i) => i + 1);

    if (loading) {
        return (
            <div className="p-6 bg-gray-100">
                <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
                    Loading Courses...
                </h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                    {[...Array(8)].map((_, idx) => (
                        <div key={idx} className="bg-white p-4 rounded-lg shadow animate-pulse">
                            <div className="h-40 bg-gray-300 rounded mb-4"></div>
                            <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (error) return <p className="text-red-500 text-center">{error}</p>;

    return (
        <div className="p-6 bg-gray-200">
            <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
                Available Courses
            </h1>

            <motion.div
                className="bg-white p-6 rounded-xl shadow-xl mb-8 border border-gray-200"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium">Filter by Level</label>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setLevelFilter("")}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                            levelFilter === "" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setLevelFilter("beginner")}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                            levelFilter === "beginner" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Beginner
                    </button>
                    <button
                        onClick={() => setLevelFilter("intermediate")}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                            levelFilter === "intermediate" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Intermediate
                    </button>
                    <button
                        onClick={() => setLevelFilter("advance")}
                        className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                            levelFilter === "advance" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                    >
                        Advanced
                    </button>
                </div>
            </motion.div>

            {searchQuery && (
                <p className="text-center text-lg text-gray-600 mb-4">
                    Search results for: <span className="font-semibold text-blue-600">{searchQuery}</span>
                </p>
            )}

            <div className="mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {currentCourses.length > 0 ? (
                    currentCourses.map((course) => (
                        <motion.div
                            key={course._id}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            viewport={{ once: true, amount: 0.3 }}
                        >
                            <CourseCard
                                image={course.thumbnail || "https://via.placeholder.com/300"}
                                category={course.category || "Coding"}
                                heading={course.title || "Untitled Course"}
                                level={course.courseLevel || "Beginner"}
                                duration={course.duration || "N/A"}
                                link={`/CourseDetails/${course._id}`}
                            />
                        </motion.div>
                    ))
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="flex flex-col items-center justify-center bg-white p-6 rounded-lg shadow-lg"
                    >
                        <img
                            src="https://cdni.iconscout.com/illustration/premium/thumb/no-data-5302901-4448828.png"
                            alt="No Results"
                            className="w-48 h-48 object-contain mb-4"
                        />
                        <p className="text-lg text-gray-600">🚫 No courses found. Try a different search.</p>
                    </motion.div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="mt-10 flex flex-col items-center space-y-4">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={`px-4 py-2 rounded-md text-sm font-medium border transition ${currentPage === 1
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : " text-white bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            Prev
                        </button>
                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={`px-4 py-2 rounded-md text-sm font-medium border transition ${currentPage === totalPages
                                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                                : "text-white bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            Next
                        </button>
                    </div>

                    <p className="text-sm text-gray-600">
                        Page <span className="font-semibold">{currentPage}</span> of{" "}
                        <span className="font-semibold">{totalPages}</span>
                    </p>
                </div>
            )}
        </div>
    );
};

export default CoursesList;