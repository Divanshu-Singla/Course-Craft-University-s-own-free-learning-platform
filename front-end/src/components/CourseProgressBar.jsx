import React from "react";

const CourseProgressBar = ({ progressPercentage, completedLessons, totalLessons }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-6 mb-4 overflow-hidden shadow-inner">
      <div
        className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center justify-center text-white text-xs font-semibold transition-all duration-500 ease-out"
        style={{ width: `${progressPercentage}%` }}
      >
        {progressPercentage > 10 && `${progressPercentage}%`}
      </div>
      {progressPercentage <= 10 && progressPercentage > 0 && (
        <span className="ml-2 text-xs font-semibold text-gray-700">
          {progressPercentage}%
        </span>
      )}
    </div>
  );
};

export default CourseProgressBar;
