import { getIndustryInsight } from "@/actions/dashboard";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { IndustryInsight } from "@prisma/client";
import React from "react";
import DashBoardView from "./_components/dashboard-view";

const IndustryInsightPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  const insights: IndustryInsight = await getIndustryInsight();
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  return <div className="container mx-auto">
    <DashBoardView insights={insights}/>
  </div>;
};

export default IndustryInsightPage;
