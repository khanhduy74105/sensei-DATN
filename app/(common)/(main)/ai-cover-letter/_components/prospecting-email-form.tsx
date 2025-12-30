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
import { prospectingEmailSchema } from "@/app/lib/schema";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IProspectingEmail } from "./type";
import { generateProspectingEmail } from "@/actions/cover-letter";

export default function ProspectingEmailForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(prospectingEmailSchema),
  });

  const {
    loading: generating,
    fn: generateEmailFn,
    data: generatedEmail,
  } = useFetch(generateProspectingEmail);

  useEffect(() => {
    if (generatedEmail) {
      toast.success("Prospecting email generated successfully!");
      router.push(`/ai-cover-letter/${generatedEmail.id}`);
      reset();
    }
  }, [generatedEmail]);

  const onSubmit = async (data: Partial<IProspectingEmail>) => {
    try {
      await generateEmailFn(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to generate prospecting email");
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Prospecting Email (Cold Email)</CardTitle>
          <CardDescription>
            For networking or reaching out to potential employers/clients without a specific job opening
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Enter target company"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name (Optional)</Label>
                <Input
                  id="recipientName"
                  placeholder='e.g., "John Doe - Tech Lead"'
                  {...register("recipientName")}
                />
                {errors.recipientName && (
                  <p className="text-sm text-red-500">
                    {errors.recipientName.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contextReason">Context / Reason *</Label>
              <Textarea
                id="contextReason"
                placeholder='Why are you contacting them? e.g., "Saw your LinkedIn post about X", "Admire your work on Y"'
                className="h-32"
                {...register("contextReason")}
              />
              {errors.contextReason && (
                <p className="text-sm text-red-500">
                  {errors.contextReason.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetRole">Target Role (Optional)</Label>
              <Input
                id="targetRole"
                placeholder='e.g., "Senior Backend Developer"'
                {...register("targetRole")}
              />
              {errors.targetRole && (
                <p className="text-sm text-red-500">
                  {errors.targetRole.message}
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
                  "Generate Prospecting Email"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}