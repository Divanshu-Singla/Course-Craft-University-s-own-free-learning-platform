import React, { useEffect, useState } from "react";
import { useCourse } from "../contexts/CourseContext";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiBook, FiClipboard, FiDollarSign, FiBarChart, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";
import CourseCard from "../components/CourseCard";

const AllCourses = () => {
    const navigate = useNavigate();
    
    const { courses, pendingCourses, loading, error, fetchAllCourses, getPendingCourses, updateCourseApproval, deleteCourse } = useCourse();
    const { user } = useAuth(); // Get logged-in user details
    
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const handleDelete = async (courseId, courseTitle) => {
        if (window.confirm(`Are you sure you want to delete course "${courseTitle}"? This action cannot be undone.`)) {
            try {
                await deleteCourse(courseId);
                alert('Course deleted successfully!');
                fetchAllCourses();
            } catch (err) {
                alert('Failed to delete course: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    useEffect(() => {
        fetchAllCourses();
        if (user?.role === "admin") {
            getPendingCourses();
        }
    }, [user?.role]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredCourses(courses);
        } else {
            const filtered = courses.filter((course) =>
                course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                course.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredCourses(filtered);
        }
        setCurrentPage(1);
    }, [searchQuery, courses]);

    const handleApproval = async (courseId) => {
        await updateCourseApproval({ courseId, status: "approved", rejectionReason: "" });
        fetchAllCourses();
        getPendingCourses();
    };
    
    const handleRejection = async (courseId) => {
        const reason = prompt("Enter rejection reason:");
        if (reason) {
            await updateCourseApproval({ courseId, status: "rejected", rejectionReason: reason });
            fetchAllCourses();
            getPendingCourses();
        }
    };
    

    const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentCourses = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
    const prevPage = () => setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-blue-900 text-white p-5">
                <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
                <nav>
                    <ul className="space-y-4">
                        <li>
                            <Link to="/admin/usersList" className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
                                <FiUsers /> Manage Users
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/coursesList" className="flex items-center gap-2 p-2 bg-blue-700 rounded">
                                <FiBook /> Manage Courses
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/exams" className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
                                <FiClipboard /> Manage Exams
                            </Link>
                        </li>
                        <li>
                            <Link to="/admin/dash" className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
                                <FiHome /> Back to Admin Dashboard
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <h2 className="text-3xl font-bold mb-6 text-center">All Courses</h2>

                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search courses by title or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border rounded-lg shadow-md w-full max-w-md"
                    />
                </div>

                {loading && <p className="text-center text-gray-600">Loading courses...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && currentCourses.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentCourses.map((course) => (
                            <div key={course._id} className="bg-white rounded-lg shadow-md overflow-hidden">
                                <CourseCard
                                    image={course.thumbnail || "/placeholder.png"}
                                    category={course.category || "General"}
                                    heading={course.title || "Untitled Course"}
                                    level={course.courseLevel || "Beginner"}
                                    duration={course.duration || "N/A"}
                                    link={`/CourseDetails/${course._id}`}
                                />
                                <div className="p-3 flex gap-2">
                                    <button
                                        onClick={() => navigate(`/CourseDetails/${course._id}`)}
                                        className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                    >
                                        View
                                    </button>
                                    <button
                                        onClick={() => handleDelete(course._id, course.title)}
                                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-4">No courses found.</p>
                )}

                {/* Pending Courses (Admin Only) */}
                {user?.role === "admin" && pendingCourses.length > 0 && (
                    <div className="mt-12">
                        <h3 className="text-2xl font-bold mb-4 text-center">Pending Course Approvals</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {pendingCourses.map((course) => (
                                <div key={course._id} className="border p-4 rounded-lg shadow-md bg-white">
                                    <CourseCard
                                        image={course.thumbnail || "/placeholder.png"}
                                        category={course.category || "General"}
                                        heading={course.title || "Untitled Course"}
                                        level={course.courseLevel || "Beginner"}
                                        duration={course.duration || "N/A"}
                                    />
                                    <div className="flex justify-between mt-3">
                                        <button
                                            onClick={() => handleApproval(course._id)}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleRejection(course._id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex justify-center mt-8 space-x-4">
                    <button
                        onClick={prevPage}
                        disabled={currentPage === 1}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg shadow hover:bg-gray-700 transition disabled:bg-gray-400"
                    >
                        Previous
                    </button>
                    <span className="text-lg font-semibold">{currentPage} / {totalPages}</span>
                    <button
                        onClick={nextPage}
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                        Next
                    </button>
                </div>
            </main>
        </div>
    );
};

export default AllCourses;
