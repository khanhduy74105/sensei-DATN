"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, UserPlus, Users, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ApplicationEmailForm from "../_components/application-cover-letter";
import ProspectingEmailForm from "../_components/prospecting-email-form";
import ReferralRequestForm from "../_components/referal-form";
import ThankYouEmailForm from "../_components/thank-letter";

type CoverLetterType = 
  | "application" 
  | "prospecting" 
  | "referral" 
  | "thankyou" 
  | null;

export default function NewCoverLetterPage() {
  const [selectedType, setSelectedType] = useState<CoverLetterType>(null);

  const coverLetterTypes = [
    {
      id: "application" as const,
      title: "Application Email",
      description: "Traditional cover letter for official job applications with a specific JD",
      icon: Mail,
    },
    {
      id: "prospecting" as const,
      title: "Prospecting Email",
      description: "Cold email for networking without a specific job opening",
      icon: UserPlus,
    },
    {
      id: "referral" as const,
      title: "Referral Request",
      description: "Ask a contact to refer you for a job opportunity",
      icon: Users,
    },
    {
      id: "thankyou" as const,
      title: "Thank You Email",
      description: "Post-interview follow-up to leave a positive impression",
      icon: ThumbsUp,
    },
  ];

  const renderForm = () => {
    switch (selectedType) {
      case "application":
        return <ApplicationEmailForm />;
      case "prospecting":
        return <ProspectingEmailForm />;
      case "referral":
        return <ReferralRequestForm />;
      case "thankyou":
        return <ThankYouEmailForm />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col space-y-2">
        <Link href="/ai-cover-letter">
          <Button variant="link" className="gap-2 pl-0">
            <ArrowLeft className="h-4 w-4" />
            Back to Cover Letters
          </Button>
        </Link>

        <div className="pb-6">
          <h1 className="text-6xl font-bold gradient-title">
            Create Cover Letter
          </h1>
          <p className="text-muted-foreground">
            {selectedType 
              ? "Fill in the details below to generate your letter"
              : "Select the type of cover letter you want to create"
            }
          </p>
        </div>
      </div>

      {!selectedType ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {coverLetterTypes.map((type) => {
            const Icon = type.icon;
            return (
              <Card
                key={type.id}
                className="cursor-pointer transition-all hover:shadow-lg hover:border-muted-foreground/50 bg-card"
                onClick={() => setSelectedType(type.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-muted">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {type.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          <Button
            variant="outline"
            onClick={() => setSelectedType(null)}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Change Type
          </Button>
          {renderForm()}
        </div>
      )}
    </div>
  );
}