import { industries } from "@/data/industries";
import React from "react";
import OnBoardingForm from "./_components/onboarding-form";
import { getUserOnboardingStatus } from "@/actions/user";
import { redirect } from "next/navigation";

const OnBoardingPage = async () => {
  const { isOnboarded } = await getUserOnboardingStatus();
  if (isOnboarded) {
    redirect("/dashboard");
  }
  return (
    <main>
      <OnBoardingForm industries={industries} />
    </main>
  );
};

export default OnBoardingPage;
