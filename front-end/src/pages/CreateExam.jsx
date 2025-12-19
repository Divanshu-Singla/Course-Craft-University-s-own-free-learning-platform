import React, { useState } from "react";
import { useExam } from "../contexts/ExamContext";

const CreateExam = () => {
  const { createExam, addQuestions } = useExam();
  const [examData, setExamData] = useState({
    title: "",
    subject: "",
    category: "",
    timeLimit: "",
    totalMarks: "",
    type: "Beginner",
  });

  const [questions, setQuestions] = useState([
    { text: "", options: ["", "", "", ""], correctAnswer: "a" },
  ]);

  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setExamData({ ...examData, [e.target.name]: e.target.value });
  };

  const handleQuestionChange = (index, field, value) => {
    setQuestions((prevQuestions) =>
      prevQuestions.map((q, i) =>
        i === index
          ? {
              ...q,
              [field]:
                field === "options"
                  ? q.options.map((opt, j) =>
                      j === value.index ? value.text : opt
                    )
                  : value,
            }
          : q
      )
    );
  };

  const addQuestionField = () => {
    setQuestions([
      ...questions,
      { text: "", options: ["", "", "", ""], correctAnswer: "a" },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map correct answer (a, b, c, d) to actual option text
      const updatedQuestions = questions.map((q) => ({
        ...q,
        correctAnswer: q.options[["a", "b", "c", "d"].indexOf(q.correctAnswer)],
      }));

      // Auto-calculate numQuestions from added questions
      const examDataWithQuestions = {
        ...examData,
        numQuestions: questions.length,
      };

      const result = await createExam(examDataWithQuestions);
      if (result && result._id) {
        await addQuestions({ examId: result._id, questions: updatedQuestions });
        setAlert({
          type: "success",
          message: "Exam created and questions added successfully!",
        });
      }
    } catch (error) {
      console.error("Error Creating Exam:", error);
      setAlert({
        type: "error",
        message: "Error creating exam. Please try again later.",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 my-6 bg-white shadow-lg rounded-lg">
      <div className="bg-blue-600 text-white p-4 rounded-lg mb-6">
        <h2 className="text-2xl font-bold">Create a New Exam</h2>
        <p className="text-blue-100 mt-1 text-sm">Fill in the details to create your exam</p>
      </div>

      {/* Alert Message */}
      {alert.message && (
        <div
          className={`p-4 mb-4 text-white rounded-lg ${
            alert.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {alert.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Exam Title</label>
          <input
            className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
            type="text"
            name="title"
            placeholder="e.g., JavaScript Advanced Test"
            value={examData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Subject</label>
            <input
              className="w-full px-3 py-2 rounded border border-gray-300 focus:border-blue-500 focus:outline-none"
              type="text"
              name="subject"
              placeholder="e.g., Computer Science"
              value={examData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Category</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="text"
              name="category"
              placeholder="e.g., Programming, Database"
              value={examData.category}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Difficulty Level</label>
            <select
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              name="type"
              value={examData.type}
              onChange={handleChange}
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Moderate">Moderate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Time Limit (minutes)</label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="number"
              name="timeLimit"
              placeholder="e.g., 60"
              value={examData.timeLimit}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Total Marks</label>
          <input
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              type="number"
              name="totalMarks"
              placeholder="e.g., 100"
              value={examData.totalMarks}
              onChange={handleChange}
              required
            />
        </div>

        <p className="text-sm text-gray-600">
          Number of Questions: <span className="font-semibold">{questions.length}</span>
        </p>

        <div className="border-t pt-4 mt-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3">Exam Questions</h3>

        {questions.map((q, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded border border-gray-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Question {index + 1}
            </label>
            <input
              className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 mb-2"
              type="text"
              placeholder={`Enter question text (e.g., What is Java?)`}
              value={q.text}
              onChange={(e) =>
                handleQuestionChange(index, "text", e.target.value)
              }
              required
            />

            <label className="block text-sm font-semibold text-gray-700 mb-1">Options</label>
            <div className="grid grid-cols-2 gap-2">
              {q.options.map((option, optIndex) => (
                <div key={optIndex}>
                  <label className="block text-xs text-gray-600 mb-1">
                    Option {String.fromCharCode(65 + optIndex)}
                  </label>
                  <input
                    className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    type="text"
                    placeholder={`Enter option ${String.fromCharCode(65 + optIndex)}`}
                    value={option}
                    onChange={(e) =>
                      handleQuestionChange(index, "options", {
                        index: optIndex,
                        text: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              ))}
            </div>

              <label className="block text-sm font-semibold text-gray-700 mt-2 mb-1">Correct Answer</label>
              <select
                className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                value={q.correctAnswer}
                onChange={(e) =>
                  handleQuestionChange(index, "correctAnswer", e.target.value)
                }
                required
              >
                <option value="a">Option A</option>
                <option value="b">Option B</option>
                <option value="c">Option C</option>
                <option value="d">Option D</option>
              </select>
            </div>
          ))}

          <button
            type="button"
            onClick={addQuestionField}
            className="w-full mt-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
          >
            + Add Another Question
          </button>
        </div>

        <button
          type="submit"
          className="w-full mt-6 px-6 py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition"
        >
          Create Exam
        </button>
      </form>
    </div>
  );
};

export default CreateExam;
