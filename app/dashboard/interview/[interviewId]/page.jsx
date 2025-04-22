"use client";

import React, { useEffect, useState } from "react";
import Webcam from "react-webcam";
import { Lightbulb, WebcamIcon } from "lucide-react";
import { Button } from "../../../../components/ui/button";
import Link from "next/link";
import { db } from "../../../../utils/db";
import { MockInterview } from "../../../../utils/schema";
import { eq } from "drizzle-orm";

export default function Interview({ params }) {
  const interviewId = params.interviewId;
  const [interview, setInterview] = useState(null);
  const [webcam, setWebcam] = useState(false);

  const getInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));
    setInterview(result[0]);
  };

  useEffect(() => {
    if (interviewId) {
      getInterviewDetails();
    }
  }, [interviewId]);

  if (!interview) {
    return <div className="text-center mt-10">Loading interview...</div>;
  }

  return (
    <div className="my-10">
      <h2 className="font-bold text-2xl">Let's Get Started</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Interview Details */}
        <div className="flex flex-col my-5 gap-5">
          <div className="flex flex-col p-5 rounded-lg border">
            <h2 className="text-lg">
              <strong>Job Role/Position:</strong> {interview.jobPosition}
            </h2>
            <h2 className="text-lg">
              <strong>Tech Stack:</strong> {interview.jobDesc}
            </h2>
            <h2 className="text-lg">
              <strong>Experience:</strong> {interview.jobExperience} years
            </h2>
          </div>

          <div className="p-5 border rounded-lg border-yellow-300 bg-yellow-100">
            <h2 className="flex gap-2 items-center text-yellow-500 font-semibold">
              <Lightbulb />
              <span>Information</span>
            </h2>
            <p className="mt-3 text-yellow-500 text-sm">
              {process.env.NEXT_PUBLIC_INFORMATION || "Make sure your camera and mic are working properly."}
            </p>
          </div>
        </div>

        {/* Webcam Section */}
        <div>
          {webcam ? (
            <Webcam
              onUserMedia={() => setWebcam(true)}
              onUserMediaError={() => setWebcam(false)}
              mirrored
              style={{
                height: 300,
                width: 300,
              }}
            />
          ) : (
            <>
              <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border" />
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => setWebcam(true)}
              >
                Enable Webcam & Microphone
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Start Button */}
      <div className="flex justify-end mt-10">
        <Link href={`/dashboard/interview/${interview.mockId}/start`}>
          <Button>Start Interview</Button>
        </Link>
      </div>
    </div>
  );
}
