// ...existing code...
"use client";
import { saveLiveInterviewResult } from "@/actions/interview";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { ILiveMockInterview, ILiveQuizQuestion } from "@/types";
import { DialogDescription, DialogTitle } from "@radix-ui/react-dialog";
import { CheckCircle, LightbulbIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface LiveInterviewPageProps {
  mockInterview: ILiveMockInterview;
}
const LiveInterviewPage = ({ mockInterview }: LiveInterviewPageProps) => {
  const [questions] = useState<ILiveQuizQuestion[]>(mockInterview.questions);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recording, setRecording] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userAnswers, setUserAnswers] = useState<string[]>(
    Array(questions.length).fill("")
  );
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const router = useRouter();

  const goPrevious = () => setSelectedIndex((i) => Math.max(0, i - 1));
  const goNext = () => {
    setSelectedIndex((i) => Math.min(questions.length - 1, i + 1));
    if (selectedIndex === questions.length - 1) {
      setShowConfirmDialog(true);
    }
  };

  const onSubmitAnswers = async () => {
    setShowConfirmDialog(false);
    const results = questions.map((q, idx) => ({
      ...q,
      userAnswer: userAnswers[idx],
    }));
    const mockInterviewResults = {
      ...mockInterview,
      questions: results,
    };
    try {
      await saveLiveInterviewResult(mockInterviewResults);
      toast.success("Interview results saved successfully!");
      router.push(`/talk/${mockInterview.id}/feedback`);
    } catch (error) {
      toast.error("Failed to save interview results.");
    }
  };

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = true;
    recognition.lang = "en-US";
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join("");
      userAnswers[selectedIndex] = transcript;
      setUserAnswers([...userAnswers]);
    };

    recognition.onend = () => setRecording(false);

    recognitionRef.current = recognition;
  }, []);

  return (
    <div className="flex flex-col p-6 gap-6 bg-muted">
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm</DialogTitle>
            <DialogDescription>
              Are you sure to submit your answer?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowConfirmDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={onSubmitAnswers}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex-1 flex gap-6">
        <aside className="w-full md:w-1/2 lg:w-1/3 bg-card border border-border rounded-md p-6 flex flex-col shadow-sm">
          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
            {questions.map((_, idx) => {
              const selected = idx === selectedIndex;
              return (
                <Button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={
                    "px-3 py-1 rounded-full text-sm font-medium transition-colors border " +
                    (selected
                      ? "bg-accent/10 border-accent text-accent-foreground"
                      : "bg-transparent border-border text-muted-foreground hover:bg-muted/30")
                  }
                  aria-pressed={selected}
                  variant={"outline"}
                >
                  {`Question #${idx + 1}`}
                  {userAnswers[idx] ? (
                    <CheckCircle
                      className="inline-block w-3 h-3 bg-green-500 rounded-full"
                      aria-label="Answered"
                    />
                  ) : null}
                </Button>
              );
            })}
          </div>

          {/* Selected question content */}
          <div className="mb-5 p-4 rounded-md border border-border bg-muted/50">
            <div className="text-sm text-muted-foreground font-medium mb-2">
              {`Q${selectedIndex + 1}`}
            </div>
            <div className="text-base text-foreground">
              {questions.at(selectedIndex)?.question}
            </div>
          </div>

          {/* Note area (now a highlighted div with icon) */}
          <div className="mt-auto bg-muted" aria-hidden>
            <div
              role="note"
              className="p-4 rounded-lg border-2 border-accent/30 bg-accent/6 text-accent-foreground flex items-start gap-3 shadow-sm"
            >
              <LightbulbIcon
                className="h-6 w-6 text-accent-foreground flex-shrink-0 mt-0.5"
                aria-hidden
              />
              <div className="flex-1">
                <div className="text-sm font-semibold">Notes</div>
                <div className="text-sm opacity-90 mt-1">
                  {`Click "Start Recording Answer" to record the candidate's
                  response. At the end you'll get feedback and a comparison
                  between the expected answer and the candidate's answer.`}
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right column: camera + record control */}
        <main className="flex-1 md:1/2 bg-card border border-border rounded-md p-6 flex flex-col items-center shadow-sm">
          <h2 className="text-lg font-semibold mb-4 text-muted-foreground">
            Live Camera
          </h2>

          <div className="w-full h-80 bg-muted rounded-md flex items-center justify-center border border-dashed border-border">
            {/* Replace this placeholder with actual video/camera element */}
            <div className="text-center text-muted-foreground">
              <div className="mb-2 font-medium">Camera Preview</div>
              <div className="text-xs opacity-80">(camera feed goes here)</div>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3">
            <Button
              onClick={() => {
                if (recording) {
                  recognitionRef.current?.stop();
                  setRecording(false);
                } else {
                  recognitionRef.current?.start();
                  setRecording(true);
                  userAnswers[selectedIndex] = "";
                  setUserAnswers([...userAnswers]);
                }
              }}
              className={
                "px-4 py-2 rounded-md text-sm font-medium transition-colors " +
                (recording
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : "bg-primary/10 text-primary hover:bg-primary/20")
              }
            >
              {recording ? "Stop Recording Answer" : "Start Recording Answer"}
            </Button>

            <div className="flex items-center text-sm text-muted-foreground">
              <span
                className={
                  "inline-block w-3 h-3 rounded-full mr-2 " +
                  (recording ? "bg-destructive" : "bg-green-400")
                }
                aria-hidden
              />
              {recording ? "Recording" : "Idle"}
            </div>
          </div>
        </main>
      </div>

      {/* Bottom controls */}
      <footer className="flex gap-2 justify-end items-center">
        <div className="text-sm text-muted-foreground">
          Question {selectedIndex + 1} of {questions.length}
        </div>
        <Button
          onClick={goPrevious}
          variant={"secondary"}
          className="px-4 py-2 bg-muted/50 border border-border rounded-md hover:bg-muted/60"
        >
          Previous
        </Button>

        <Button
          onClick={goNext}
          variant={"secondary"}
          className="px-4 py-2 bg-muted/50 border border-border rounded-md hover:bg-muted/60"
        >
          {selectedIndex === questions.length - 1 ? "End Interview" : "Next"}
        </Button>
      </footer>
    </div>
  );
};

export default LiveInterviewPage;
// ...existing code...
