import { getIndustryInsight } from "@/actions/dashboard";
import { getUser, getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";
import { IndustryInsight, User } from "@prisma/client";
import React from "react";
import DashBoardView from "./_components/dashboard-view";

const IndustryInsightPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (!isOnboarded) {
    redirect("/onboarding");
  }
  const insights: IndustryInsight = await getIndustryInsight();
  const user: User = await getUser();

  return <div className="container mx-auto">
    <DashBoardView insights={insights} user={user}/>
  </div>;
};

export default IndustryInsightPage;
