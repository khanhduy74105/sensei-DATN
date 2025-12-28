"use client";
import { Button } from "@/components/ui/button";
import { FileEdit, Trash } from "lucide-react";
import React, { useState } from "react";
import { IResumeContent } from "../types";
import { useRouter } from "next/navigation";
import { deleteResume } from "@/actions/resume";
import { toast } from "sonner";
import Image from "next/image";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ResumeCard = ({ resume }: { resume: IResumeContent }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!resume.id) return;

    setIsDeleting(true);

    try {
      await deleteResume(resume.id);
      toast.success("Resume deleted successfully");
      setOpen(false);
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to delete resume"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="relative overflow-hidden w-44 h-66 rounded-2xl flex items-center justify-center flex-col gap-2 border border-neutral-200 group cursor-pointer">
      <div className="absolute top-0 right-0 left-0 bottom-0">
        <Image
          src={JSON.parse(resume.json || "{}").thumbnail || "/resume.png"}
          width={176}
          height={264}
          alt="resume"
          className="w-full h-full shadow-2xl border mx-auto bg-cover"
          priority
        />
      </div>
      <div className="absolute right-0 left-0 bottom-0 py-4 bg-black/50 flex flex-col items-center justify-center text-white bg-opacity-70 rounded-b-2xl p-2">
        <p className="max-w-full text-sm overflow-hidden overflow-ellipsis">
          {resume.title}
        </p>

        <span className="text-xs">
          Last changed:{" "}
          {resume.updatedAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Hover overlay */}
      <div
        className="
            absolute inset-0 rounded-2xl bg-white/10 backdrop-blur-sm
            flex items-center justify-center gap-3
            opacity-0 group-hover:opacity-100 transition-opacity
        "
      >
        <Button
          className="p-2 rounded-full bg-neutral-800 text-white hover:bg-neutral-700 transition"
          size={"icon"}
          onClick={() => {
            router.push(`/resume/${resume.id}`);
          }}
        >
          <FileEdit className="w-4 h-4" />
        </Button>

        {/* Delete Button with Confirm Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
              size={"icon"}
            >
              <Trash className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Resume</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete &quot;{resume.title}&quot;? This
                action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isDeleting}>
                  Cancel
                </Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ResumeCard;
