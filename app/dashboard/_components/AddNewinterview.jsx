
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
import { Ghost } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";

export default function AddNewinterview() {
    const [openDailog,setOpenDailog]=useState(false)
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
            <form>
              <div>
                <h2>Add Details about your job position/role, Job description and years of experience </h2>
                <div className="mt-7 my-3">
                    <label>Job Role/Job Position</label>
                    <Input placeholder="Ex. Full Stack Developer" required/>
                </div>
                <div className="mt-7 my-3">
                    <label>Job Description/ Tech Stack</label>
                    <Textarea placeholder="Ex. React,Aangular, NodeJs, Mysql etc" required />
                </div>
                <div className="my-3">
                    <label>Years Of Experience</label>
                    <Input placeholder="Ex.5" type='Number'max={100} required/>
                </div>
              </div>
              <div className="flex gap-5 justify-end">
                <Button type="button" variant="ghost" onClick={()=>setOpenDailog(false)}>Cancel</Button>
                <Button type="submit">Start Interview</Button>
              </div>
              </form>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}
