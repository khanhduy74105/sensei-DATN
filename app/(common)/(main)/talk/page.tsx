import { getLiveMockInterviews } from "@/actions/interview";
import { AddNewTrigger } from "./_components/add-new-trigger";
import MockedInterviews from "./_components/mocked-interview";

export default async function TalkPage() {
  const mockedInterviews = await getLiveMockInterviews();
  
  return (
    <div className="container mx-auto py-6">
      <div>
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-6xl font-bold gradient-title">Interview</h1>
        </div>
        <div className="">
          <h3 className="text-xl font-bold">
            Create and Start your AI Mock Interview
          </h3>
        </div>
        <div className="space-y-6 pt-4">
          <AddNewTrigger />
          <h3 className="text-xl font-bold">Previous interviews</h3>
          <div className="flex justify-start flex-wrap">
            <MockedInterviews mockedInterviews={mockedInterviews}/>
          </div>
        </div>
      </div>
    </div>
  );
}
