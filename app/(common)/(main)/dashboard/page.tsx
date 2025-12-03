import { getIndustryInsight } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { IndustryInsight } from "@prisma/client";
import React from "react";
import DashBoardView from "./_components/dashboard-view";

const IndustryInsightPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  const insights: IndustryInsight = await getIndustryInsight();

  return <div className="container mx-auto">
    <DashBoardView insights={insights}/>
  </div>;
};

export default IndustryInsightPage;
