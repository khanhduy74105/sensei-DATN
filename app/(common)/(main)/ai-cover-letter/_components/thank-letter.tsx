// FILE 4: components/forms/thank-you-email-form.tsx
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
import useFetch from "@/hooks/use-fetch";
import { thankYouEmailSchema } from "@/app/lib/schema";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IThankYouEmail } from "./type";
import { generateThankYouEmail } from "@/actions/cover-letter";

export default function ThankYouEmailForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(thankYouEmailSchema),
  });

  const {
    loading: generating,
    fn: generateEmailFn,
    data: generatedEmail,
  } = useFetch(generateThankYouEmail);

  useEffect(() => {
    if (generatedEmail) {
      toast.success("Thank you email generated successfully!");
      router.push(`/ai-cover-letter/${generatedEmail.id}`);
      reset();
    }
  }, [generatedEmail]);

  const onSubmit = async (data: Partial<IThankYouEmail>) => {
    try {
      await generateEmailFn(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to generate thank you email");
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Thank You Email (Post-Interview)</CardTitle>
          <CardDescription>
            Follow up after an interview to leave a lasting positive impression
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Company you interviewed with"
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
                  placeholder="Position you interviewed for"
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
              <Label htmlFor="interviewerName">Interviewer Name *</Label>
              <Input
                id="interviewerName"
                placeholder="Name of the person who interviewed you"
                {...register("interviewerName")}
              />
              {errors.interviewerName && (
                <p className="text-sm text-red-500">
                  {errors.interviewerName.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="discussionTopic">Discussion Topic (Optional)</Label>
              <Input
                id="discussionTopic"
                placeholder='A memorable topic discussed, e.g., "Microservices architecture"'
                {...register("discussionTopic")}
              />
              {errors.discussionTopic && (
                <p className="text-sm text-red-500">
                  {errors.discussionTopic.message}
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
                  "Generate Thank You Email"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}