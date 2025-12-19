"use client";

import { convertExtractedTextToResumeData } from "@/actions/resume";
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
import { Upload, FileText, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useRef } from "react";
import { toast } from "sonner";

const UploadResumeTrigger = () => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [resumeTitle, setResumeTitle] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const router = useRouter();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.type !== "application/pdf") {
      alert("Please select your resume");
      return;
    }

    setFile(selectedFile);
    setIsProcessing(true);

    try {
      const { default: pdfToText } = await import("react-pdftotext");
      const text = await pdfToText(selectedFile);
      setExtractedText(text.trim());
      setResumeTitle(selectedFile.name);
    } catch (error) {
      console.error("Failed when extract PDF:", error);
      alert("Failed when extract PDF");
      handleRemoveFile();
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setExtractedText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onNextStep = async () => {
    setLoading(true);
    try {
      const resume = await convertExtractedTextToResumeData(
        resumeTitle,
        extractedText
      );
      if (resume) {
        router.push(`/resume/${resume?.id}`);
      }
      toast.success("Created extracted resume!");
    } catch (error) {
      toast.error("Error when extracted resume, please try again");
    }
    setLoading(false);
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
              <Upload className="h-6 w-6" />
            </div>
            <span className="text-m font-semibold tracking-tight">
              Enhance Existing resume
            </span>
          </div>
        </Button>
      </DialogTrigger>
      <DialogOverlay className="fixed inset-0 bg-gray-200/60" />
      <DialogContent className="sm:max-w-1/2 p-8">
        <DialogHeader>
          <DialogTitle>Upload Your Resume</DialogTitle>
          <DialogDescription>
            Upload your PDF resume to extract and enhance
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {!file ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="pdf-upload"
              />
              <label
                htmlFor="pdf-upload"
                className="cursor-pointer flex flex-col items-center gap-3"
              >
                <div className="bg-gray-100 rounded-full p-4">
                  <Upload className="h-8 w-8 text-gray-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Click to upload PDF
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum file size: 10MB
                  </p>
                </div>
              </label>
            </div>
          ) : (
            <div className="border border-gray-300 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-100 rounded p-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{file.name}</p>
                    <p className="text-xs text-gray-500">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRemoveFile}
                  disabled={isProcessing}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {isProcessing && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Processing..</span>
                </div>
              )}

              {!isProcessing && extractedText && (
                <div className="mt-3 p-3 bg-green-50 rounded text-sm text-green-700">
                  ✓ Extracted your resume
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button
            disabled={!extractedText || isProcessing}
            onClick={() => {
              onNextStep();
            }}
          >
            Continue
            {loading && <Loader2 />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UploadResumeTrigger;
