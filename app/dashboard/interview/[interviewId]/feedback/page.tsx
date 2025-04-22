"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../../../../utils/db";
import { userAnswer } from "../../../../../utils/schema";
import { eq } from "drizzle-orm";
import { useParams, useRouter } from "next/navigation";
import { Button } from "../../../../../components/ui/button";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "../../../../../components/ui/collapsible";
import { ChevronsUpDown } from "lucide-react";

export default function Feedback() {
  const { interviewId } = useParams();
  const [feedbackList, setFeedbackList] = useState<any[]>([]);
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getFeedback = async () => {
      if (!interviewId) return;

      const result = await db
        .select()
        .from(userAnswer)
        .where(eq(userAnswer.mockIdRef, interviewId as string))
        .orderBy(userAnswer.id);

      setFeedbackList(result);
      setAverageRating(calculateAverageRating(result));
    };

    getFeedback();
  }, [interviewId]);

  const calculateAverageRating = (list: any[]) => {
    const ratings = list
      .map((item) => parseFloat(item.rating))
      .filter((num) => !isNaN(num));
    if (ratings.length === 0) return null;
    const total = ratings.reduce((a, b) => a + b, 0);
    return parseFloat((total / ratings.length).toFixed(1));
  };

  return (
    <div className="p-10">
      {feedbackList?.length === 0 ? (
        <h2 className="font-bold text-2xl text-lg-500">
          No Interview Feedback is Found
        </h2>
      ) : (
        <>
          <h2 className="text-2xl font-bold text-green-500">Congratulations!</h2>
          <h2 className="font-bold text-2xl">Here is your Interview Feedback</h2>
          <h2 className="text-primary text-lg my-3">
            Your overall interview rating:{" "}
            <strong>{averageRating ?? "N/A"}/10</strong>
          </h2>
          <h2 className="text-sm text-gray-500 mb-4">
            Find below interview questions with correct answers, your answers, and
            feedback for improvement
          </h2>

          {feedbackList.map((item, index) => (
            <Collapsible key={index} className="mt-7">
              <CollapsibleTrigger className="p-2 bg-secondary rounded-lg flex justify-between my-2 text-left gap-7 w-full">
                {item.question}
                <ChevronsUpDown className="h-5 w-5" />
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="flex flex-col gap-2">
                  <h2 className="text-red-500 p-2 border rounded-lg">
                    <strong>Rating:</strong> {item.rating}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-red-50 text-sm text-red-900">
                    <strong>Your Answer:</strong> {item.userAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-green-50 text-sm text-green-900">
                    <strong>Correct Answer:</strong> {item.correctAns}
                  </h2>
                  <h2 className="p-2 border rounded-lg bg-blue-50 text-sm text-blue-900">
                    <strong>{item.feedback}</strong>
                  </h2>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </>
      )}

      <Button
        onClick={() => router.push("/dashboard")}
        variant="default"
        size="default"
        className="mt-6"
      >
        Go Home
      </Button>
    </div>
  );
}
