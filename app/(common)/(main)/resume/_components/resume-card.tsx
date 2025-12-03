"use client";
import { Button } from "@/components/ui/button";
import { FileEdit, Trash } from "lucide-react";
import React from "react";
import { IResumeContent } from "../types";
import { useRouter } from "next/navigation";

const ResumeCard = ({ resume }: { resume: IResumeContent }) => {
  const router = useRouter();
  return (
    <div className="relative w-44 h-66 min-h-[11rem] rounded-2xl flex items-center justify-center flex-col gap-2 p-2 border border-neutral-200 group cursor-pointer">
      {/* Normal content */}
      <div className="flex flex-col flex-auto items-center justify-center">
        <FileEdit className="h-10 w-10 mb-4 text-neutral-500" />
        <span className="text-sm overflow-ellipsis">{resume.title}</span>
      </div>

      <span className="text-xs">
        {resume.updatedAt.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        })}
      </span>

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
          onClick={() => {}}
        >
          <Trash className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ResumeCard;
