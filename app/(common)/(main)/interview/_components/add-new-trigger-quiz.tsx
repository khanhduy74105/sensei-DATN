"use client";
import React from "react";

// ...existing code...
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
// ...existing code...
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { quizInterviewSchema } from "@/app/lib/schema";
import { useForm } from "react-hook-form";
// ...existing code...
// ...existing code...
import { toast } from "sonner";
// ...existing code...

export const AddNewTrigger = ({
  onClick,
}: {
  onClick: (
    entry?:
      | {
          role: string;
          skills: string[];
        }
      | undefined
  ) => Promise<void>;
}) => {
  const [open, setOpen] = React.useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(quizInterviewSchema),
  });

  const onSubmit = async (data: { role: string; skills?: string[] }) => {
    try {
      const entry = {
        ...data,
        skills: data.skills ?? [],
      };
      await onClick(entry);
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Failed to generate questions");
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-1/2 ml-2">Start your specific interview</Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-gray-200/60" />
      <DialogContent className="sm:max-w-1/2 p-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Tell us more about your job interviewing</DialogTitle>
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
              <Label htmlFor="skills">Skills</Label>
              <Input id="skills" {...register("skills")} />
              {errors.skills && (
                <p className="text-sm text-red-600">{errors.skills.message}</p>
              )}
            </div>
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Generate</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
