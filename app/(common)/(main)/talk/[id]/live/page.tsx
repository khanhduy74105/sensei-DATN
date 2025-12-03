import { getLiveMockInterviewById } from "@/actions/interview";
import LiveInterviewPage from "../../_components/live-page";
interface LivePageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params }: LivePageProps) {
  const { id } = await params;

  const liveMockInterView = await getLiveMockInterviewById(id);

  return <LiveInterviewPage mockInterview={liveMockInterView} />;
}