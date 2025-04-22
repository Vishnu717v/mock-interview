"use client"
import React, { useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Ghost, LoaderCircle } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import { chatSession } from "../../../utils/GeminiAIModel.js";
import { MockInterview } from "../../../utils/schema";
import { v4 as uuidv4 } from 'uuid';
import { useUser } from "@clerk/nextjs";
import moment from "moment";
import { db } from "../../../utils/db";
import { useRouter } from "next/navigation";

export default function AddNewinterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobPosition] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobExperience, setJobExperience] = useState("");
  const [loading, setLoading] = useState(false);
  const [jsonResponse, setJsonResponse] = useState([]);
  const { user } = useUser();
  const router = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const questionCount = process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5;
    const inputPrompt = `job Position: ${jobPosition}, job Description: ${jobDescription}, Years of Experience: ${jobExperience}. Based on this info, give me ${questionCount} interview questions with answers in JSON format.`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      let mockResponseText = result.response.text()
        .replace("```json", "")
        .replace("```", "")
        .trim();

      let parsedResponse;
      try {
        parsedResponse = JSON.parse(mockResponseText);
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        setLoading(false);
        return;
      }

      setJsonResponse(parsedResponse);

      const response = await db.insert(MockInterview).values({
        mockId: uuidv4(),
        jsonMockResp: mockResponseText,
        jobPosition,
        jobDesc: jobDescription,
        jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress,
        createdAt: moment().format('DD-MM-yyyy'),
      }).returning({ mockId: MockInterview.mockId });

      if (response && response[0]?.mockId) {
        setOpenDialog(false);
        router.push(`/dashboard/interview/${response[0].mockId}`);
      }
    } catch (error) {
      console.error("Something went wrong:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
        onClick={() => setOpenDialog(true)}
      >
        <h2 className="text-lg text-center">+ Add New</h2>
      </div>

      <Dialog open={openDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-bold text-2xl">
              Tell us more about your job interviewing
            </DialogTitle>
            <DialogDescription />
            <form onSubmit={onSubmit}>
              <div>
                <h2>
                  Add Details about your job position/role, Job description and years of experience
                </h2>
                <div className="mt-7 my-3">
                  <label htmlFor="jobPosition">Job Role/Job Position</label>
                  <Input
                    id="jobPosition"
                    placeholder="Ex. Full Stack Developer"
                    required
                    value={jobPosition}
                    onChange={(e) => setJobPosition(e.target.value)}
                  />
                </div>
                <div className="mt-7 my-3">
                  <label htmlFor="jobDescription">Job Description/ Tech Stack</label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Ex. React, Angular, NodeJs, MySQL, etc"
                    required
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
                <div className="my-3">
                  <label htmlFor="jobExperience">Years Of Experience</label>
                  <Input
                    id="jobExperience"
                    placeholder="Ex. 5"
                    type="number"
                    max={100}
                    required
                    value={jobExperience}
                    onChange={(e) => setJobExperience(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-5 justify-end">
                <Button type="button" variant="ghost" onClick={() => setOpenDialog(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <LoaderCircle className="animate-spin mr-2" />
                      Generating from AI
                    </>
                  ) : (
                    "Start Interview"
                  )}
                </Button>
              </div>
            </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
