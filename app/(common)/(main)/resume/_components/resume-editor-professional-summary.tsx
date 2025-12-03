import React, { useEffect } from "react";
import { IResumeEditorContentProps } from "./resume-editor-content";
import { Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2, Sparkles } from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import useFetch from "@/hooks/use-fetch";
import { toast } from "sonner";

const ResumeEditorProfessionalSummary = (props: IResumeEditorContentProps) => {
  const { control, formValues,setValue } = props;
  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  // Add this effect to handle the improvement result
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("professional_summary", improvedContent);
      toast.success("Professional summary improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve summary");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  // Replace handleImproveDescription with this
  const handleImproveDescription = async () => {
    const description = props.formValues.professional_summary;
    if (!description) {
      toast.error("Please enter a summary first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: 'professional summary',
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500">
            Add summary for your resume here
          </p>
        </div>
      </div>
      <div className="mt-6">
        <Controller
          name="professional_summary"
          control={control}
          render={({ field }) => (
            <Textarea
              {...field}
              value={field.value ?? ""}
              rows={7}
              className="w-full min-h-32 p-3 px-4 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-none"
              placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
            />
          )}
        />
        <Button
          className="mt-2"
          type="button"
          variant="ghost"
          size="sm"
          color="purple"
          onClick={handleImproveDescription}
          disabled={isImproving || !formValues.professional_summary}
        >
          {isImproving ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Improving...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Improve with AI
            </>
          )}
        </Button>
        <p className="text-xs text-gray-500 max-w-4/5 mx-auto text-center mt-2">
          Tip: Keep it concise (3-4 sentences) and focus on your most relevant
          achievements and skills.
        </p>
      </div>
    </div>
  );
};

export default ResumeEditorProfessionalSummary;
