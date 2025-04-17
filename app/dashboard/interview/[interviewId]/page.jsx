"use client";
import { MockInterview } from "../../../../utils/schema";
import { db } from "../../../../utils/db";
import { eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import { use } from "react";
import Webcam from "react-webcam";
import { WebcamIcon } from "lucide-react";
import { Button } from "../../../../components/ui/button";


export default function Interview({ params }) {
  const { interviewId } = use(params); // ✅ unwrap params using use()
  const [interview, setInterview] = useState(null);
  const [webcam, setWebcam] = useState(false);

  const GetInterviewDetails = async () => {
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));
    console.log(result);
    setInterview(result[0]); // optional: save to state
  };

  useEffect(() => {
    if (interviewId) {
      console.log(interviewId);
      GetInterviewDetails();
    }
  }, [interviewId]);

  return (
    <div className='my-10 flex justify-center flex-col items-center'>
    <h2 className="font-bold text-2xl">Let's Get Started</h2>
    {webcam?<Webcam
    onUserMedia={()=>setWebcam(true)}
    onUserMediaError={()=>setWebcam(false)}
    mirrored={true}
    style={
      {
        height:300,
        width:300,
      }
    } />
    :
    <>
    <WebcamIcon className="h-72 w-full my-7 p-20 bg-secondary rounded-lg border"/>
    <Button onClick={()=>setWebcam(true)}>Enable Web Cam and Microphone</Button>
    </>
    }
    </div>
  ); 
}
