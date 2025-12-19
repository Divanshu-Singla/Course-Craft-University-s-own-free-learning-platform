import React, { useState } from "react";
import { useExam } from "../contexts/ExamContext";

const CreateExam = () => {
  const { createExam, addQuestions } = useExam();
  const [examData, setExamData] = useState({
    title: "",
    code: "",
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
    <div className="max-w-5xl mx-auto p-8 bg-gradient-to-br from-white to-blue-50 rounded-2xl my-10 shadow-2xl border border-blue-100">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-xl mb-8 shadow-lg">
        <h2 className="text-4xl font-bold">
          Create New Exam
        </h2>
        <p className="text-blue-100 mt-2">Design your exam with custom questions and settings</p>
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

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Exam Details */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Exam Title
            </label>
            <input
              className="input-field px-4 py-3 outline w-full rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="text"
              name="title"
              placeholder="e.g., JavaScript Advanced Test"
              value={examData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Exam Code
            </label>
            <input
              className="input-field px-4 py-3 outline w-full rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="text"
              name="code"
              placeholder="e.g., JBT101"
              value={examData.code}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Subject
            </label>
            <input
              className="input-field px-4 py-3 outline w-full rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="text"
              name="subject"
              placeholder="e.g., Computer Science"
              value={examData.subject}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Category
            </label>
            <input
              className="input-field px-4 py-3 outline w-full rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="text"
              name="category"
              placeholder="e.g., Programming, Database"
              value={examData.category}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Difficulty Level
            </label>
            <select
              className="input-field px-4 py-3 outline w-full rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all bg-white"
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
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Time Limit (minutes)
            </label>
            <input
              className="input-field px-4 py-3 outline w-full rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="number"
              name="timeLimit"
              placeholder="e.g., 60"
              value={examData.timeLimit}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-lg font-semibold text-gray-800 mb-2">
              Total Marks
            </label>
            <input
              className="input-field px-4 py-3 outline w-full rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="number"
              name="totalMarks"
              placeholder="e.g., 100"
              value={examData.totalMarks}
              onChange={handleChange}
              required
            />
          </div>
          <div></div>
        </div>

        {/* Auto-calculated info */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
          <p className="text-blue-800 font-medium">
            Number of Questions: <span className="font-bold text-blue-900">{questions.length}</span> (automatically calculated from added questions)
          </p>
        </div>

        {/* Add Questions Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-xl mt-8 shadow-lg">
          <h3 className="text-2xl font-bold">
            Exam Questions
          </h3>
        </div>

        {questions.map((q, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-lg border-2 border-gray-200 hover:border-blue-400 transition-all"
          >
            <label className="block text-xl font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm">{index + 1}</span>
              Question {index + 1}
            </label>
            <input
              className="input-field w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              type="text"
              placeholder={`Enter question text (e.g., What is Java?)`}
              value={q.text}
              onChange={(e) =>
                handleQuestionChange(index, "text", e.target.value)
              }
              required
            />

            <div className="grid grid-cols-2 gap-4 mt-5">
              {q.options.map((option, optIndex) => (
                <div key={optIndex}>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Option {String.fromCharCode(65 + optIndex)}
                  </label>
                  <input
                    className="input-field px-4 py-2 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all w-full"
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

            {/* Correct Answer Dropdown */}
            <label className="block text-lg font-semibold text-gray-800 mt-5 mb-2">
              Correct Answer
            </label>
            <select
              className="input-field px-4 py-3 rounded-lg border-2 border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all w-full bg-white"
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

        {/* Add Another Question Button */}
        <button
          type="button"
          onClick={addQuestionField}
          className="w-full mt-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold px-6 py-4 rounded-xl hover:from-green-600 hover:to-green-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Add Another Question
        </button>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold px-6 py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
        >
          Create Exam & Add Questions
        </button>
      </form>
    </div>
  );
};

export default CreateExam;
