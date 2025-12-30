// FILE 3: components/forms/referral-request-form.tsx
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
import { referralRequestSchema } from "@/app/lib/schema";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IReferralRequest } from "./type";
import { generateReferralRequest } from "@/actions/cover-letter";

export default function ReferralRequestForm() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(referralRequestSchema),
  });

  const {
    loading: generating,
    fn: generateRequestFn,
    data: generatedRequest,
  } = useFetch(generateReferralRequest);

  useEffect(() => {
    if (generatedRequest) {
      toast.success("Referral request generated successfully!");
      router.push(`/ai-cover-letter/${generatedRequest.id}`);
      reset();
    }
  }, [generatedRequest]);

  const onSubmit = async (data: Partial<IReferralRequest>) => {
    try {
      await generateRequestFn(data);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to generate referral request");
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Referral Request Email</CardTitle>
          <CardDescription>
            Ask a contact (friend, alumni, ex-colleague) to refer you for a job
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  placeholder="Where you want the referral"
                  {...register("companyName")}
                />
                {errors.companyName && (
                  <p className="text-sm text-red-500">
                    {errors.companyName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipientName">Recipient Name *</Label>
                <Input
                  id="recipientName"
                  placeholder='e.g., "David"'
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
              <Label htmlFor="relationship">Relationship *</Label>
              <Input
                id="relationship"
                placeholder='How do you know them? e.g., "Ex-colleague", "University Alumni", "Friend"'
                {...register("relationship")}
              />
              {errors.relationship && (
                <p className="text-sm text-red-500">
                  {errors.relationship.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetJobLink">Target Job Link/ID (Optional)</Label>
              <Input
                id="targetJobLink"
                placeholder="Specific job you want to be referred to"
                {...register("targetJobLink")}
              />
              {errors.targetJobLink && (
                <p className="text-sm text-red-500">
                  {errors.targetJobLink.message}
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
                  "Generate Referral Request"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}