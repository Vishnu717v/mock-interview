
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
import moment from "moment/moment";
import { db } from "../../../utils/db";
import { useRouter } from "next/navigation";

export default function AddNewinterview() {
    const [openDailog,setOpenDailog]=useState(false)
    const [jobPosition,setjobPosition]=useState();
    const [jobDescripton,setjobDescription]=useState();
    const [jobExperience,setjobExperience]=useState();
    const [loading, setloading] = useState(false);
    const [jsonResponse, setjsonResponse] = useState([])
    const {user}=useUser();
    const router=useRouter();

    const onSubmit=async(e)=>{
      setloading(true);
      e.preventDefault();
      console.log(jobPosition,jobDescripton,jobExperience);
      const questionCount = process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT || 5;
      const InputPrompt = `job Position :${jobPosition}, job Description:${jobDescripton}, Years of Experience :${jobExperience}. Based on this info, give me ${questionCount} interview questions with answers in JSON format.`;
            const result=await chatSession.sendMessage(InputPrompt);
            const mockResponse=(result.response.text()).replace("```json"," ").replace("```"," ");
      console.log(JSON.parse(mockResponse));
      setjsonResponse(mockResponse);
      if(mockResponse)
        {
      const resp=await db.insert(MockInterview).values({
        mockId:uuidv4(),
        jsonMockResp:mockResponse,
        jobPosition:jobPosition,
        jobDesc:jobDescripton,
        jobExperience:jobExperience,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD-MM-yyyy')
      }).returning({mockid:MockInterview.mockId});
      console.log("Inserted Id:",resp);
      if(resp){
        setOpenDailog(false);
        router.push('/dashboard/interview/'+resp[0]?.mockId)

      }
    }else{
      console.log("error");
    }
      setloading(false);
      
    }

  return (
    <div>
      <div className="p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all"
      onClick={()=>setOpenDailog(true)}>
        <h2 className="text-lg text-center ">+ Add New</h2>
      </div>
      <Dialog open={openDailog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className='font-bold text-2xl'>Tell us more about your job interviewing</DialogTitle>
            <DialogDescription>
            </DialogDescription>
            <form onSubmit={onSubmit}>
              <div>
                <h2>Add Details about your job position/role, Job description and years of experience </h2>
                <div className="mt-7 my-3">
                    <label>Job Role/Job Position</label>
                    <Input placeholder="Ex. Full Stack Developer" required
                      onChange={(event)=>setjobPosition(event.target.value)}
                    />
                </div>
                <div className="mt-7 my-3">
                    <label>Job Description/ Tech Stack</label>
                    <Textarea placeholder="Ex. React,Angular, NodeJs, Mysql etc" required
                    onChange={(event)=>setjobDescription(event.target.value)} />
                </div>
                <div className="my-3">
                    <label>Years Of Experience</label>
                    <Input placeholder="Ex.5" type='Number'max={100} required
                      onChange={(event)=>setjobExperience(event.target.value)}
                    />
                </div>
              </div>
              <div className="flex gap-5 justify-end">
                <Button type="button" variant="ghost" onClick={()=>setOpenDailog(false)}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                  {loading?<>
                    <LoaderCircle className="animate-spin"/>Generating from AI
                  </>:'Start Interview'}
                  </Button>
                
              </div>
              </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
