"use client";

import { createResume } from "@/actions/resume";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Label } from "recharts";
import { toast } from "sonner";

const AddNewResumeTrigger = () => {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  const handleCreateResume = async (title: string) => {
    try {
      const resume = await createResume({ title });
      if (resume) {
        toast.success("Resume created successfully");
        router.push(`/resume-pre/${resume?.id}`);
      } else {
        toast.error("Failed to create resume");
      }
    } catch (error) {
      if (error instanceof Error){
        toast.error(error.message);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="w-44 h-66 min-h-[11rem] rounded-2xl flex items-center justify-center flex-col gap-2 p-6 border border-transparent hover:border-neutral-200"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="border-2 border-dashed border-neutral-400 rounded-full p-3">
              <Plus className="h-6 w-6" />
            </div>
            <span className="text-m font-semibold tracking-tight">
              Create Resume
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-gray-200/60" />
      <DialogContent className="sm:max-w-1/2 p-8">
        <form onSubmit={async (e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          const title = formData.get("resume-name") as string;
          await handleCreateResume(title);
          setOpen(false);
        }}>
          <DialogHeader>
            <DialogTitle>Create a resume</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            <Label>Resume name</Label>
            <Input id="resume-name" placeholder="Enter your resume's name" name="resume-name" />
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Create</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewResumeTrigger;
