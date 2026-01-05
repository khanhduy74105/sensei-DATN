"use client";
import React, { useEffect, useState } from "react";

import { Loader2, Plus } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { liveMockInterviewSchema } from "@/app/lib/schema";
import { useForm } from "react-hook-form";
import useFetch from "@/hooks/use-fetch";
import {
  generateInterviewQuestions,
  saveGeneratedInterviewQuestions,
} from "@/actions/interview";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const AddNewTrigger = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [interviewInfo, setInterviewInfo] = useState<{
    role: string;
    description: string;
    yoes: string;
  } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(liveMockInterviewSchema),
  });

  const {
    loading: generating,
    fn: generateQuestionsFn,
    data: generatedQuestions,
  } = useFetch(generateInterviewQuestions);

  const onSubmit = async (data: {
    role: string;
    description: string;
    yoes: string;
  }) => {
    try {
      setInterviewInfo(data);
      await generateQuestionsFn(data);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to generate questions");
      }
    }
  };

  useEffect(() => {
    if (generatedQuestions && interviewInfo) {
      setOpen(false);
      saveGeneratedInterviewQuestions(
        {
          role: interviewInfo?.role || "",
          description: interviewInfo?.description || "",
          yoes: interviewInfo?.yoes.toString() || "",
        },
        generatedQuestions
      )
        .then((id) => {
          toast.success("Interview questions generated successfully!");
          router.push(`/talk/${id}/live`);
        })
        .catch((error) => {
          toast.error(error.message || "Failed to save generated questions");
        });
      setInterviewInfo(null);
    }
  }, [generatedQuestions, router, reset, interviewInfo]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="w-1/3 h-44 min-h-[11rem] rounded-2xl flex items-center justify-center flex-col gap-2 p-6 border border-transparent hover:border-neutral-200"
        >
          <div className="flex items-center justify-center gap-3">
            <Plus className="h-6 w-6" />
            <span className="text-lg font-semibold tracking-tight">
              Add new
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-gray-200/60" />
      <DialogContent className="sm:max-w-1/2 p-8 max-h-full overflow-y-auto">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Tell us more about your job interviwing</DialogTitle>
            <DialogDescription>
              Add details about your job position/role, Job description and
              years of experience
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="grid gap-3">
              <Label htmlFor="role">Job role/ Job position</Label>
              <Input
                id="role"
                placeholder="Fullstack, Data engineer,..."
                {...register("role")}
              />
              {errors.role && (
                <p className="text-sm text-red-600">{errors.role.message}</p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="description">
                Job Description/ Tech stack (In Short)
              </Label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Tell us about your professional background..."
              />
              {errors.description && (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label htmlFor="yoes">Years of experiences</Label>
              <Input
                id="yoes"
                {...register("yoes")}
                type="number"
                placeholder="Years of Experience"
                min={0}
                max={50}
              />
              {errors.yoes && (
                <p className="text-sm text-red-600">{errors.yoes.message}</p>
              )}
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={generating || false}>
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
