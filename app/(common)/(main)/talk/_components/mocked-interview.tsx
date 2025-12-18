"use client";

import React from "react";
import InterviewedCard from "./interviewed-card";
import { ILiveMockInterview } from "@/types";

const MockedInterviews = ({
  mockedInterviews,
}: {
  mockedInterviews: ILiveMockInterview[];
}) => {
  return (
    <>
      {mockedInterviews.map((interview) => (
        <InterviewedCard key={interview.id} interviewData={interview} />
      ))}
    </>
  );
};

export default MockedInterviews;
