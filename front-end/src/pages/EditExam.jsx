import React, { useState, useEffect } from "react";
import { useExam } from "../contexts/ExamContext";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify"

const EditExamPage = () => {
  const { examId } = useParams(); // Get exam ID from URL
  const navigate = useNavigate();

  const { exams, loading, error, fetchExams, updateExam, updateQuestion, addQuestions } = useExam();

  // ✅ State for exam details
  const [examData, setExamData] = useState({
    title: "",
    subject: "",
    category: "",
    timeLimit: "",
    numQuestions: "",
    totalMarks: "",
    type: "Beginner",
  });

  // ✅ State for questions
  const [questions, setQuestions] = useState([]);

  // ✅ Fetch exam and questions on load
  useEffect(() => {
    if (!exams.length) {
      fetchExams();
    } else {
      const selectedExam = exams.find((exam) => exam._id === examId);
      if (selectedExam) {
        setExamData({
          title: selectedExam.title || "",
          duration: selectedExam.duration || 0,
          description: selectedExam.description || "",
          subject: selectedExam.subject || "",
          category: selectedExam.category || "",
          timeLimit: selectedExam.timeLimit || "",
          numQuestions: selectedExam.numQuestions || "",
          totalMarks: selectedExam.totalMarks || "",
          type:selectedExam.type || "Beginner",
        });
        setQuestions(selectedExam.questions || []);
      }
    }
  }, [exams, examId, fetchExams]);
  

  // ✅ Handle input changes for exam
  const handleExamChange = (e) => {
    setExamData({ ...examData, [e.target.name]: e.target.value });
  };

  // ✅ Handle question input changes
  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = {
      ...updatedQuestions[index],
      [field]: value || (field === "options" ? ["", "", "", ""] : ""),
    };
    setQuestions(updatedQuestions);
  };
  
  

  // ✅ Add new question
  const addNewQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionId: "",
        text: "",
        options: ["", "", "", ""],
        correctOption: 0,
      },
    ]);
  };
  

  // ✅ Remove question
  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ Update Exam Details
      await updateExam({ examId, updatedData: examData });

      // ✅ Update or Add Questions
      const updatedQuestions = questions.filter((q) => q.text.trim() !== "");

      if (updatedQuestions.length) {
        const existingQuestions = updatedQuestions.filter((q) => q.questionId);
        const newQuestions = updatedQuestions.filter((q) => !q.questionId);

        // ✅ Update existing questions
        for (const question of existingQuestions) {
          await updateQuestion({
            questionId: question.questionId,
            updatedData: question,
          });
        }

        // ✅ Add new questions
        if (newQuestions.length) {
          await addQuestions({ examId, questions: newQuestions });
        }
      }

      toast.success("Exam and questions updated successfully!");
      navigate("/exams"); // Redirect to exams list
    } catch (error) {
      toast.error("Error updating exam: " + error.message);
    }
  };

  if (loading) return <p>Loading exam details...</p>;
  if (error) {
    const errorMessage =
      typeof error === "string" ? error : JSON.stringify(error);
    return <p>Error: {errorMessage}</p>;
  }
  

  return (
    <div className="max-w-3xl mx-auto p-6 my-6 bg-white shadow-lg rounded-lg">
      {/* Header Section */}
      <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold">Edit Exam</h2>
        <p className="text-blue-100 mt-1 text-sm">Update exam details and questions</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Exam Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Exam Title</label>
          <input
            type="text"
            name="title"
            value={examData.title}
            onChange={handleExamChange}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
            placeholder="Enter exam title"
            required
          />
        </div>

        {/* Subject and Category */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Subject
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
              type="text"
              name="subject"
              placeholder="Enter the subject (e.g., Computer Science)"
              value={examData.subject}
              onChange={handleExamChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Category
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
              type="text"
              name="category"
              placeholder="Specify the category (e.g., Beginner, Intermediate)"
              value={examData.category}
              onChange={handleExamChange}
              required
            />
          </div>
        </div>
        {/* Time, Questions, and Marks */}
        <div className="grid md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Time Limit (minutes)
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
              type="number"
              name="timeLimit"
              placeholder="Set time limit (e.g., 60)"
              value={examData.timeLimit}
              onChange={handleExamChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Number of Questions
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
              type="number"
              name="numQuestions"
              placeholder="Enter number of questions (e.g., 20)"
              value={examData.numQuestions}
              onChange={handleExamChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Total Marks
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
              type="number"
              name="totalMarks"
              placeholder="Enter total marks (e.g., 100)"
              value={examData.totalMarks}
              onChange={handleExamChange}
              required
            />
          </div>
        </div>

        {/* Difficulty Level */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Difficulty Level
          </label>
          <select
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition"
            name="type"
            value={examData.type}
            onChange={handleExamChange}
          >
            <option value="Beginner">Beginner</option>
            <option value="Moderate">Moderate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>

        {/* Questions Section */}
        <div className="border-t pt-4 mt-4">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Questions</h3>
          {questions.map((question, index) => (
            <div key={index} className="p-4 bg-purple-50 border border-purple-200 rounded-lg mb-3">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-semibold text-purple-800">Question {index + 1}</h4>
                <button
                  type="button"
                  onClick={() => removeQuestion(index)}
                  className="text-red-600 hover:text-red-800 text-sm font-semibold transition"
                >
                  Remove
                </button>
              </div>
              
              <input
                type="text"
                placeholder="Enter question text"
                value={question.text}
                onChange={(e) =>
                  handleQuestionChange(index, "text", e.target.value)
                }
                className="w-full px-3 py-2 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition mb-2"
                required
              />
              
              <div className="space-y-1 mb-2">
                {question.options.map((option, optIndex) => (
                  <input
                    key={optIndex}
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    value={option}
                    onChange={(e) => {
                      const updatedOptions = [...question.options];
                      updatedOptions[optIndex] = e.target.value;
                      handleQuestionChange(index, "options", updatedOptions);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition"
                    required
                  />
                ))}
              </div>
              
              <label className="block text-sm font-semibold text-gray-700 mb-1">Correct Option</label>
              <select
                value={question.correctOption ?? 0}
                onChange={(e) =>
                  handleQuestionChange(index, "correctOption", parseInt(e.target.value, 10))
                }
                className="w-full px-3 py-2 rounded-lg border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 focus:outline-none transition"
              >
                {question.options?.map((option, optIndex) => (
                  <option key={optIndex} value={optIndex}>
                    {option || `Option ${optIndex + 1}`}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={addNewQuestion}
            className="px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
          >
            Add Question
          </button>

          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition flex-1"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditExamPage;
