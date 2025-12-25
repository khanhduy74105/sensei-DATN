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
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "sonner";

const AddNewResumeTrigger = () => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleCreateResume = async (title: string) => {
    // Validate title
    const trimmedTitle = title.trim();
    
    if (!trimmedTitle) {
      setError("Resume name is required");
      return;
    }

    if (trimmedTitle.length < 3) {
      setError("Resume name must be at least 3 characters");
      return;
    }

    if (trimmedTitle.length > 100) {
      setError("Resume name must be less than 100 characters");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const resume = await createResume({ title: trimmedTitle });
      if (resume) {
        toast.success("Resume created successfully");
        setOpen(false);
        setTitle("");
        router.push(`/resume/${resume?.id}`);
      } else {
        toast.error("Failed to create resume");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      // Reset form khi đóng dialog
      setTitle("");
      setError("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await handleCreateResume(title);
          }}
        >
          <DialogHeader>
            <DialogTitle>Create a resume</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 mt-4">
            <Label htmlFor="resume-name">Resume name</Label>
            <Input
              id="resume-name"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                // Clear error khi user bắt đầu gõ
                if (error) setError("");
              }}
              placeholder="Enter your resume's name"
              name="resume-name"
              disabled={isLoading}
              className={error ? "border-red-500" : ""}
            />
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>
          <DialogFooter className="pt-2">
            <DialogClose asChild>
              <Button variant="outline" type="button" disabled={isLoading}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewResumeTrigger;