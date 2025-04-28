"use client";

import { Button } from "../../../../../../components/ui/button";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Webcam from "react-webcam";
import useSpeechToText from "react-hook-speech-to-text";
import { Mic } from "lucide-react";
import { toast } from "sonner";
import { chatSession } from "../../../../../../utils/GeminiAIModel.js";
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "../../../../../../utils/db";
import { schema } from "../../../../../../utils/schema"; // ✅ make sure this path is correct for the import

export default function RecordAnswerSection({ mockInterviewQuestion, activeQuestionIndex, interview }) {
  const [userAnswer, setUserAnswer] = useState("");
  const { user } = useUser();
  const [loading, setloading] = useState(false);

  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
    setResults
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false,
  });

  // Append transcripts safely when results change
  useEffect(() => {
    results.map((result) => {
      setUserAnswer((prev) => prev + result?.transcript);
    });
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      if (!isRecording) {
        startSpeechToText();
      }
    }
  };

  const UpdateUserAnswer = async () => {
    console.log("User Answer:", userAnswer);
    console.log("interview:", interview);

    if (!interview?.mockId) {
      console.error("Missing mockId. Cannot insert user answer.");
      toast.error("Error: Missing mock interview ID.");
      return;
    }

    setloading(true);

    try {
      const feedbackPrompt = `Question: ${mockInterviewQuestion[activeQuestionIndex]?.question}, User Answer: ${userAnswer}. Based on this question and answer, give a rating and short feedback (3–5 lines) in JSON format with "rating" and "feedback" fields.`;
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockResponse = (await result.response.text()).replace("```json", "").replace("```", "").trim();

      console.log("Gemini response:", mockResponse);

      const JsonFeedbackResp = JSON.parse(mockResponse);

      const resp = await db.insert(schema.userAnswer).values({
        mockIdRef: interview.mockId,
        question: mockInterviewQuestion[activeQuestionIndex]?.question,
        correctAns: mockInterviewQuestion[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format("DD-MM-YYYY"),
      });

      if (resp) {
        toast.success("User answer recorded successfully!");
        setUserAnswer("");
        setResults([]);
      }
      setResults([]);


      
    } catch (err) {
      console.error("Failed to insert user answer:", err);
      toast.error("Failed to record answer.");
    }

    setloading(false);
  };

  return (
    <div className="flex items-center justify-center flex-col">
      <div className="flex flex-col mt-20 justify-center items-center bg-black rounded-lg p-5">
        <Image
          src="/webcam1.png"
          width={200}
          height={200}
          className="absolute"
          alt="camera"
        />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: "100%",
            zIndex: 10,
          }}
        />
      </div>

      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}
      >
        {isRecording ? (
          <h2 className="text-red-600 flex items-center gap-2">
            <Mic />
            Stop Recording
          </h2>
        ) : (
          "Record Answer"
        )}
      </Button>

      
    </div>
  );
}
