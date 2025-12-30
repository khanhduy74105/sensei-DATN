// FILE 1: components/forms/application-email-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useFetch from "@/hooks/use-fetch";
import { applicationEmailSchema } from "@/app/lib/schema";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IApplicationEmail } from "./type";
import { generateApplicationEmail } from "@/actions/cover-letter";

export default function ApplicationEmailForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(applicationEmailSchema),
  });

  const {
    loading: generating,
    fn: generateEmailFn,
    data: generatedEmail,
  } = useFetch(generateApplicationEmail);

  useEffect(() => {
    if (generatedEmail) {
      toast.success("Application email generated successfully!");
      router.push(`/ai-cover-letter/${generatedEmail.id}`);
      reset();
    }
  }, [generatedEmail]);

  const onSubmit = async (data: Partial<IApplicationEmail>) => {
    try {
      await generateEmailFn(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to generate application email");
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Email (Traditional Cover Letter)</CardTitle>
          <CardDescription>
            For official job applications where a specific Job Description is available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Enter company name"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title *</Label>
                <Input
                  id="jobTitle"
                  placeholder="Enter job title"
                  {...register("jobTitle")}
                />
                {errors.jobTitle && (
                  <p className="text-sm text-red-500">
                    {errors.jobTitle.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="jobDescription">Job Description *</Label>
              <Textarea
                id="jobDescription"
                placeholder="Paste the full job description here for keyword mapping"
                className="h-32"
                {...register("jobDescription")}
              />
              {errors.jobDescription && (
                <p className="text-sm text-red-500">
                  {errors.jobDescription.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="hiringManager">Hiring Manager (Optional)</Label>
              <Input
                id="hiringManager"
                placeholder='e.g., "Ms. Smith" (defaults to "Hiring Manager" if empty)'
                {...register("hiringManager")}
              />
              {errors.hiringManager && (
                <p className="text-sm text-red-500">
                  {errors.hiringManager.message}
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={generating || false}>
                {generating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Application Email"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}