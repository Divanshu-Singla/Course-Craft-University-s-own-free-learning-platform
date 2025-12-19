import React, { useEffect, useState } from "react";
import { useExam } from "../contexts/ExamContext";
import { useNavigate } from "react-router-dom";
import { FiUsers, FiBook, FiClipboard, FiDollarSign, FiBarChart, FiHome } from "react-icons/fi";
import { Link } from "react-router-dom";

const AdminExamList = () => {
    const navigate = useNavigate();
    const { exams, status, loading, error, fetchExams, deleteExam } = useExam();

    const [searchQuery, setSearchQuery] = useState("");
    const [filteredExams, setFilteredExams] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    const handleDelete = async (examId, examTitle) => {
        if (window.confirm(`Are you sure you want to delete exam "${examTitle}"? This action cannot be undone.`)) {
            try {
                await deleteExam(examId);
                alert('Exam deleted successfully!');
                fetchExams();
            } catch (err) {
                alert('Failed to delete exam: ' + (err.response?.data?.message || err.message));
            }
        }
    };
    useEffect(() => {
        if (status === "idle") {
            fetchExams(); // Fetch exams only if not already loaded
        }
    }, [status, fetchExams]);

    useEffect(() => {
        fetchExams();
    }, [fetchExams]);

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredExams(exams);
        } else {
            const filtered = exams.filter((exam) =>
                exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                exam.category.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredExams(filtered);
        }
        setCurrentPage(1);
    }, [searchQuery, exams]);

    const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentExams = filteredExams.slice(indexOfFirstItem, indexOfLastItem);

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
                            <Link to="/admin/coursesList" className="flex items-center gap-2 p-2 hover:bg-blue-700 rounded">
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
                <h2 className="text-3xl font-bold mb-6 text-center">All Exams</h2>

                <div className="mb-6 flex justify-center">
                    <input
                        type="text"
                        placeholder="Search exams by title or category..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="px-4 py-2 border rounded-lg shadow-md w-full max-w-md"
                    />
                </div>

                {loading && <p className="text-center text-gray-600">Loading exams...</p>}
                {error && <p className="text-center text-red-500">{error}</p>}

                {!loading && !error && currentExams.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentExams.map((exam) => {
                            const difficultyColors = {
                                Beginner: 'bg-green-100 text-green-800 border-green-300',
                                Moderate: 'bg-yellow-100 text-yellow-800 border-yellow-300',
                                Advanced: 'bg-red-100 text-red-800 border-red-300'
                            };

                            return (
                                <div 
                                    key={exam._id} 
                                    className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                                >
                                    {/* Card Header with Gradient */}
                                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
                                        <h3 className="text-xl font-bold mb-1">{exam.title}</h3>
                                    </div>

                                    {/* Card Body */}
                                    <div className="p-4 space-y-3">
                                        <div className="flex items-center text-gray-700">
                                            <span className="mr-2">📚</span>
                                            <span className="text-sm"><strong>Subject:</strong> {exam.subject}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <span className="mr-2">🏷️</span>
                                            <span className="text-sm"><strong>Category:</strong> {exam.category}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <span className="mr-2">⏱️</span>
                                            <span className="text-sm"><strong>Duration:</strong> {exam.timeLimit} min</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <span className="mr-2">❓</span>
                                            <span className="text-sm"><strong>Questions:</strong> {exam.numQuestions}</span>
                                        </div>
                                        <div className="flex items-center text-gray-700">
                                            <span className="mr-2">🎯</span>
                                            <span className="text-sm"><strong>Total Marks:</strong> {exam.totalMarks}</span>
                                        </div>
                                        
                                        {/* Difficulty Badge */}
                                        <div className="pt-2">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[exam.type] || 'bg-gray-100 text-gray-800 border-gray-300'}`}>
                                                🎓 {exam.type}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="flex gap-2 p-4 pt-0">
                                        <button
                                            onClick={() => navigate(`/exam/start/${exam._id}`)}
                                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105 font-medium"
                                        >
                                            Start Exam →
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exam._id, exam.title)}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 hover:shadow-lg transition-all duration-300 font-medium"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-4">No exams found.</p>
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

export default AdminExamList;
