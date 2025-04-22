"use client";

import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { db } from "../../../utils/db";
import { MockInterview } from "../../../utils/schema";
import { desc, eq } from "drizzle-orm";
import { Button } from "../../../components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";


// Define the type for Interview
type Interview = {
  id: number;
  jobPosition: string;
  jobExperience: string;
  createdAt: string;
  mockId: string;
};

export default function InterviewList() {
  const { user, isLoaded } = useUser();
  const [interviewList, setInterviewList] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoaded && user?.primaryEmailAddress?.emailAddress) {
      const email = user.primaryEmailAddress.emailAddress;
      getInterviewList(email);
    }
  }, [isLoaded, user]);

  const getInterviewList = async (email: string) => {
    try {
      const result = await db
        .select()
        .from(MockInterview)
        .where(eq(MockInterview.createdBy, email))
        .orderBy(desc(MockInterview.id));

      console.log("Fetched Interviews:", result);
      setInterviewList(result);
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
    } finally {
      setLoading(false);
    }
  };
  const InterviewItemCard = ({ interview }: { interview: Interview }) => {
    const router=useRouter();
    const onStart=()=>{
      router.push('/dashboard/interview/'+interview?.mockId)
    }
    const OnFeedback=()=>{
      router.push('/dashboard/interview/'+interview.mockId+"/feedback")
    }
    return (
      <div className="border rounded-lg shadow-sm p-3">
        <h2 className="font-bold text-blue-700">
          <strong>Job Position:</strong> {interview.jobPosition}
        </h2>
        <h2 className="text-sm text-gray-600">
          <strong>Experience:</strong> {interview.jobExperience}
        </h2>
        <h2 className="text-xs text-gray-400">
          <strong>Created At:</strong> {interview.createdAt}
        </h2>
        <div className="flex justify-between mt-2 gap-2">
          
          <Button size="sm" variant="outline" className="" onClick={OnFeedback}>
            FeedBack
          </Button>
          
          <Button size="sm" variant="" className="bg-blue-600" onClick={onStart}>
            Start
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Previous Mock Interviews</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3">
        {loading ? (
          <p>Loading...</p>
        ) : interviewList.length === 0 ? (
          <p>No interviews found.</p>
        ) : (
          // Corrected this part: properly return the InterviewItemCard
          interviewList.map((interview, index) => (
            <InterviewItemCard key={index} interview={interview} />
          ))
        )}
      </div>
    </div>
  );
}
