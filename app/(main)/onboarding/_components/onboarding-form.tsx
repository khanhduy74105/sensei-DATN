"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { onboardingSchema } from "@/app/lib/schema";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Industry } from "@/data/industries";
import useFetch from "@/hooks/use-fetch";
import { updateUser } from "@/actions/user";
import z from "zod";
import { toast } from "sonner";

interface OnBoardingFormProps {
  industries: Industry[];
}

type OnboardingForm = z.infer<typeof onboardingSchema>;

const OnBoardingForm = ({ industries }: OnBoardingFormProps) => {
  const [selectedIndustry, setSelectedIndustry] = useState<
    Industry | undefined | null
  >(null);
    const router = useRouter();

  const {
    loading: updateLoading,
    fn: updateUserFn,
    error: updateError,
    data: updateResult,
    setData: setUpdateData,
  } = useFetch(updateUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    resolver: zodResolver(onboardingSchema),
  });

  const onSubmit = async (values: OnboardingForm) => {
    try {
      const formatedIndustry = `${values.industry} - ${values.subIndustry}`
        .toLowerCase()
        .replace(/ /g, "-");
      await updateUserFn({
        ...values,
        industry: formatedIndustry,
      });
    } catch (error) {
        console.log(error);
    }
  };

  useEffect(() => {
    if (updateResult?.success && !updateLoading) {
        toast.success("Profile updated successfully!");
        router.push('/dashboard');
        router.refresh();
    }
  }, [updateResult, updateLoading, router]);

  const watchIndustry = watch("industry");
  return (
    <div className="flex items-center justify-center bg-background">
      <Card className="w-full max-w-lg mt-10 mx-2">
        <CardHeader>
          <CardTitle className="gradient-title text-4xl">
            Complete Your Profile
          </CardTitle>
          <CardDescription>
            Select your industry to get personalized career insights and
            recommendations.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Label htmlFor="insdustry">Industry</Label>
              <Select
                onValueChange={(value) => {
                  setValue("industry", value);
                  setSelectedIndustry(
                    industries.find((ind) => ind.id === value)
                  );
                  setValue("subIndustry", "");
                }}
              >
                <SelectTrigger id="insdustry">
                  <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry.id} value={industry.id}>
                      {industry.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && (
                <p className="text-sm text-red-600">
                  {errors.industry.message}
                </p>
              )}
            </div>

            {watchIndustry && (
              <div className="space-y-2">
                <Label htmlFor="subIndustry">Specialization</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("subIndustry", value);
                  }}
                >
                  <SelectTrigger id="subIndustry">
                    <SelectValue placeholder="Select Specialization" />
                  </SelectTrigger>
                  <SelectContent>
                    {selectedIndustry?.subIndustries.map((subInd, index) => (
                      <SelectItem key={index} value={subInd}>
                        {subInd}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subIndustry && (
                  <p className="text-sm text-red-600">
                    {errors.subIndustry.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input
                id="experience"
                type="number"
                placeholder="Enter years of Experience"
                min={0}
                max={50}
                {...register("experience")}
              />

              {errors.experience && (
                <p className="text-sm text-red-600">
                  {errors.experience.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="skills">Skills</Label>
              <Input
                id="skills"
                placeholder="e.g., Python, JavaScript, Project Management"
                {...register("skills")}
              />

              <p className="text-sm text-muted-foreground">
                Separate multiple skills with commas
              </p>

              {errors.skills && (
                <p className="text-sm text-red-600">{errors.skills.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Professional Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell us about your professional background..."
                {...register("bio")}
              />

              {errors.bio && (
                <p className="text-sm text-red-600">{errors.bio.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full">
              Complete profile
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnBoardingForm;
