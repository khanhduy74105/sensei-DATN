import { getAppUrl } from "@/lib/getAPpURL";
import { SignUp } from "@clerk/nextjs";
import React from "react";

const page = () => {
  return <SignUp forceRedirectUrl={`${getAppUrl()}/onboarding`} />;
};

export default page;
