"use client";

import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2, Upload } from "lucide-react";
import { register } from "module";
import React, { useState } from "react";
import { Label } from "recharts";

const UploadResumeTrigger = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="w-44 h-66 min-h-[11rem] rounded-2xl flex items-center justify-center flex-col gap-2 p-6 border border-transparent hover:border-neutral-200"
        >
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="border-2 border-dashed border-neutral-400 rounded-full p-3">
              <Upload className="h-6 w-6" />
            </div>
            <span className="text-m font-semibold tracking-tight">
              Upload Existing
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-gray-200/60" />
      <DialogContent className="sm:max-w-1/2 p-8">
        Upload
      </DialogContent>
    </Dialog>
  );
};

export default UploadResumeTrigger;
