import React from "react";
import AddNewResumeTrigger from "./add-new-resume-trigger";
import UploadResumeTrigger from "./upload-resume-trigger";
import ResumeCard from "./resume-card";
import { IResumeContent } from "../types";

const ResumeBuilderPre = ({ resumes }: { resumes: IResumeContent[] }) => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-bold gradient-title text-5xl md:text-6xl">
        Resume Builder Premium
      </h1>
      <h3 className="text-xl font-bold">
        Create or upload your resume with advanced features
      </h3>
      <div className="flex gap-2 items-center justify-start">
        <AddNewResumeTrigger />
        <UploadResumeTrigger />
      </div>

      <div className="w-full h-[1px] bg-neutral-500"></div>

      <h3 className="text-xl font-bold">Your Previous Resumes</h3>
      <div className="flex justify-start flex-wrap gap-2">
        {resumes.map((resume, i) => (
          <ResumeCard key={i} resume={resume} />
        ))}
      </div>
    </div>
  );
};

export default ResumeBuilderPre;
