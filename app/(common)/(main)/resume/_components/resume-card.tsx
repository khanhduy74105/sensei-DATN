"use client";
import { Button } from "@/components/ui/button";
import { FileEdit, Trash } from "lucide-react";
import React from "react";
import { IResumeContent } from "../types";
import { useRouter } from "next/navigation";
import { deleteResume } from "@/actions/resume";
import { toast } from "sonner";
import Image from "next/image";

const ResumeCard = ({ resume }: { resume: IResumeContent }) => {
  const router = useRouter();
  const handleDelete = async () => {
    if (resume.id) {
      await deleteResume(resume.id)
        .then(() => {
          toast.success("Resume deleted successfully");
        })
        .catch((error) => {
          toast.error(error.message || "Failed to delete resume");
        })
        .finally(() => {
          router.refresh();
        });
    }
  };
  return (
    <div className="relative overflow-hidden w-44 h-66 rounded-2xl flex items-center justify-center flex-col gap-2 border border-neutral-200 group cursor-pointer">
      <div className="absolute top-0 right-0 left-0 bottom-0">
        <Image
          src="/resume.png"
          width={176}
          height={264}
          alt="resume"
          className="w-full h-full shadow-2xl border mx-auto"
          priority
        />
      </div>
      <div className="absolute right-0 left-0 bottom-0 py-4 bg-black/50 flex flex-col items-center justify-center text-white bg-opacity-70 rounded-b-2xl p-2">
        <div className="flex flex-col flex-auto items-center justify-center">
          <span className="text-sm overflow-ellipsis">{resume.title}</span>
        </div>

        <span className="text-xs">
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

        <Button
          className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition"
          size={"icon"}
          onClick={() => {
            handleDelete();
          }}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ResumeCard;
