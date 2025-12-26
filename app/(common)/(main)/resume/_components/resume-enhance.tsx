/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { FileText, Stars, Upload, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { ResumeMatchResult } from "./resume-enhance-result";
import { SuggestionStatus } from "./field-suggestion";

interface Props {
  onSubmit: (jd: string) => Promise<void>;
  currentResume: any;
  currentEnhanced: any;
  onApplyEnhance: (applied: Record<string, SuggestionStatus>) => void;
  loading?: boolean | null;
}

const ResumeEnhanceLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <div className="flex items-center gap-2 text-purple-600">
        <Stars className="animate-pulse" />
        <span className="font-medium">AI is analyzing your resume</span>
      </div>

      <p className="text-sm text-muted-foreground text-center max-w-sm">
        Comparing your resume with the job description, checking skills,
        experience gaps, and preparing tailored suggestions.
      </p>

      <div className="flex gap-2 mt-4">
        <div className="h-2 w-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.3s]" />
        <div className="h-2 w-2 rounded-full bg-purple-400 animate-bounce [animation-delay:-0.15s]" />
        <div className="h-2 w-2 rounded-full bg-purple-400 animate-bounce" />
      </div>
    </div>
  );
};

const ResumeEnhance = ({
  onSubmit,
  currentResume,
  currentEnhanced,
  onApplyEnhance,
  loading,
}: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [jdText, setjdText] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [matchResult, setMatchResult] = useState();
  const [statuses, setStatuses] = useState<Record<string, SuggestionStatus>>(
    {}
  );

  const setStatus = (key: string, status: SuggestionStatus) => {
    setStatuses((prev) => ({ ...prev, [key]: status }));
  };

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
      setjdText(text.trim());
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
    setjdText("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    setMatchResult(currentEnhanced);
  }, [currentEnhanced]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <div className="max-h-2/3">
        <DialogTrigger asChild>
          <Button>
            <Stars />
            Enhance
          </Button>
        </DialogTrigger>
        <DialogContent className="min-w-[600px] md:max-w-2/3 max-h-2/3 overflow-y-scroll">
          <DialogHeader>
            <DialogTitle>AI analysiser</DialogTitle>
            <DialogDescription>
              Improve your resume to match the job description
            </DialogDescription>
          </DialogHeader>
          {!matchResult ? (
            loading ? (
              <ResumeEnhanceLoading />
            ) : (
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Tabs defaultValue="account" className="w-full">
                    <TabsList
                      onChange={() => {
                        setjdText("");
                      }}
                    >
                      <TabsTrigger value="enter">Enter</TabsTrigger>
                      <TabsTrigger value="upload">Upload</TabsTrigger>
                    </TabsList>
                    <TabsContent value="enter">
                      <Label htmlFor="jd-1">Job description</Label>
                      <Textarea
                        id="jd-1"
                        name="jd"
                        className="mt-4"
                        defaultValue=""
                        minLength={5}
                        placeholder="Enter the job description"
                        onChange={(e) => {
                          setjdText(e.target.value);
                        }}
                      />
                    </TabsContent>
                    <TabsContent value="upload">
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
                                  <p className="text-sm font-medium">
                                    {file.name}
                                  </p>
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
                          </div>
                        )}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            )
          ) : (
            <div className="max-h-2/3">
              <ResumeMatchResult
                result={matchResult}
                currentResume={currentResume}
                statuses={statuses}
                setStatus={setStatus}
              />
            </div>
          )}
          <DialogFooter>
            {matchResult ? (
              <Button
                variant="outline"
                onClick={() => {
                  setMatchResult(undefined);
                  setjdText("");
                }}
              >
                New JD
              </Button>
            ) : (
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
            )}
            <Button
              onClick={() => {
                if (matchResult) {
                  const appliedFieldSuggestions = Object.fromEntries(
                    Object.entries(statuses).filter(
                      ([key]) => statuses[key] === "applied"
                    )
                  );
                  onApplyEnhance(appliedFieldSuggestions);
                  setMatchResult(undefined);
                  setStatuses({});
                  setIsOpen(false);
                } else {
                  onSubmit(jdText);
                }
              }}
            >
              {matchResult ? "Apply" : "Improve"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </div>
    </Dialog>
  );
};

export default ResumeEnhance;
