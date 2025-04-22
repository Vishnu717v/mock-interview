"use client";

import { Lightbulb } from "lucide-react";
import React from "react";

export default function QuestionsSection({
  mockInterviewQuestion,
  activeQuestionIndex,
  setActiveQuestionIndex, // new prop
}) {
  if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) {
    return <div className="p-5 border rounded-lg">No questions found.</div>;
  }

  const note = process.env.NEXT_PUBLIC_QUESTION_NOTE || "Be concise and confident in your response.";

  return (
    <div className="p-5 border rounded-lg m-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveQuestionIndex(index)}
            className={`p-2 border rounded-full text-xs md:text-sm text-center transition 
              ${activeQuestionIndex === index ? "bg-primary text-white" : "hover:bg-muted"}`}
          >
            Question #{index + 1}
          </button>
        ))}
      </div>

      <h2 className="my-5 text-md md:text-lg font-medium">
        {mockInterviewQuestion[activeQuestionIndex]?.question}
      </h2>

      <div className="border rounded-lg p-5 bg-blue-100 mt-20">
        <h2 className="flex gap-2 items-center text-primary font-medium">
          <Lightbulb />
          <span>Note:</span>
        </h2>
        <p className="text-sm text-primary my-2">{note}</p>
      </div>
    </div>
  );
}
