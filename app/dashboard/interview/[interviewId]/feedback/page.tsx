"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../../../utils/db";
import { userAnswer } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { useParams } from "next/navigation";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../../../../../components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";

export default function Feedback() {
  const { interviewId } = useParams();
  const [feedbackList, setFeedbackList] = useState([]);

  useEffect(() => {
    const getFeedback = async () => {
      if (!interviewId) return;

      const result = await db
        .select()
        .from(userAnswer)
        .where(eq(userAnswer.mockIdRef, interviewId as string))
        .orderBy(userAnswer.id);

      console.log(result);
      setFeedbackList(result);
    };

    getFeedback();
  }, [interviewId]);

  return (
    <div className="p-10">
      <h2 className="text-2xl font-bold text-green-500">Congratulations!</h2>
      <h2 className="font-bold text-2xl">Here is your Interview Feedback</h2>
      <h2 className="text-primary text-lg my-3">
        Your overall interview rating: <strong>7/10</strong>
      </h2>
      <h2 className="text-sm text-gray-500 mb-4">
        Find below interview questions with correct answers, your answers, and
        feedback for improvement
      </h2>
      {feedbackList &&
        feedbackList.map((item, index) => (
          <Collapsible key={index}>
            <CollapsibleTrigger className="p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7">
              {item.question}<ChevronsUpDown className="h-5 w-5"/>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="flex flex-col gap-2">
                <h2 className="text-red-500 p-2 border rounded-lg"><strong>Rating:</strong>{item.rating}</h2>
                <h2 className= "p-2 border rounded-lg bg-red-50 text-sm text-red-900"><strong>Your Answer :</strong>{item.userAns}</h2>
                <h2 className= "p-2 border rounded-lg bg-green-50 text-sm text-green-900"><strong>Correct Answer :</strong>{item.correctAns}</h2>

              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
    </div>
  );
}
