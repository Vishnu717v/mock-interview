"use client";

import { Lightbulb, Volume2 } from "lucide-react";
import React from "react";

export default function QuestionsSection({ mockInterviewQuestion, activeQuestionIndex }) {
  if (!mockInterviewQuestion || mockInterviewQuestion.length === 0) {
    return <div className="p-5 border rounded-lg">No questions found.</div>;
  }
  return (
    <div className="p-5 border rounded-lg m-10">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {mockInterviewQuestion.map((question, index) => (
          <div key={index} className="mb-6">
            <h2
              className={`p-2 border rounded-full text-xs md:text-sm text-center cursor-pointer 
                ${activeQuestionIndex === index ? "bg-primary text-white" : ""}`}
            >
              Question #{index + 1}
            </h2>
          </div>
        ))}
      </div>

      <h2 className="my-5 text-md md:text-lg">
        {mockInterviewQuestion[activeQuestionIndex]?.question}
      </h2>

      <div className="border rounded-lg p-5 bg-blue-100 mt-20">
        <h2 className="flex gap-2 items-center text-primary">
          <Lightbulb />
          <strong>Note:</strong>
        </h2>
        <h2 className="text-sm text-primary my-2">
          {process.env.NEXT_PUBLIC_QUESTION_NOTE}
        </h2>
      </div>
    </div>
  );
}
