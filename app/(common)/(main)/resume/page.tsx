import { getAllResumes } from "@/actions/resume";
import ResumeBuilderPre from "./_components/resume-builder-pre";

export default async function ResumePrePage() {
  const resumes = await getAllResumes();
  return (
    <div className="container mx-auto py-6">
        <ResumeBuilderPre resumes={resumes}/>
    </div>
  );
}