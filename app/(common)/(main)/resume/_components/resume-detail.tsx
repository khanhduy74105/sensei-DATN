/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Download,
  Edit,
  Eye,
  EyeOff,
  Link,
  Loader2,
} from "lucide-react";
import React, { useState } from "react";
import ResumeEditorHeader from "./resume-editor-header";
import ResumeEditorContent from "./resume-editor-content";
import {
  IResumeContent,
  ITemplateData,
  KeyOfITemplateData,
  TemplateTypes,
} from "../types";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Path, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { templateDataSchema } from "@/app/lib/schema";
import ClassicTemplate from "./template/ClassicTemplate";
import MinimalImageTemplate from "./template/MinimalImageTemplate";
import ModernTemplate from "./template/ModernTemplate";
import MinimalTemplate from "./template/MinimalTemplate";
import { toast } from "sonner";
import {
  analyzeMatchingResume,
  toggleResumePublicStatus,
  updateResumeContent,
  uploadImage,
} from "@/actions/resume";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import ResumeEnhance from "./resume-enhance";
import useFetch from "@/hooks/use-fetch";
import { SuggestionStatus } from "./field-suggestion";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { generateThumbnail } from "@/app/lib/savePdf";

const stepOrder: KeyOfITemplateData[] = [
  KeyOfITemplateData.personalInfo,
  KeyOfITemplateData.professional_summary,
  KeyOfITemplateData.experience,
  KeyOfITemplateData.education,
  KeyOfITemplateData.project,
  KeyOfITemplateData.skills,
];

export default function ResumeBuilderDetailPage({
  initialData,
}: {
  initialData: IResumeContent;
}) {
  const [fieldStep, setFieldStep] = useState<KeyOfITemplateData>(
    KeyOfITemplateData.personalInfo
  );

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);
  const [isPublic, setIsPublic] = useState<boolean>(
    initialData.isPublic || false
  );

  const currentIndex = stepOrder.indexOf(fieldStep);

  const {
    control,
    register,
    watch,
    reset,
    setValue,
    formState: { errors, isDirty, dirtyFields },
  } = useForm<ITemplateData>({
    resolver: zodResolver(templateDataSchema),
    defaultValues: {
      ...initialData,
      title: initialData.title || "",
      isPublic: initialData.isPublic || false,
      accentColor: initialData.accentColor || "blue",
      template: initialData.template || "classic",
    },
    mode: "onBlur", // 👈 validate on blur
    reValidateMode: "onBlur", // 👈 revalidate also on blur
  });

  const formValues = watch();

  // State for editing title
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  const onSubmit = async (data: Partial<IResumeContent>) => {
    setLoading(true);
    const json = initialData.json ? JSON.parse(initialData.json) : {};
    try {
      await updateResumeContent(initialData.id, {
        ...initialData,
        ...data,
        json: JSON.stringify(json),
      });
      reset({
        ...initialData,
        title: data.title || "",
        isPublic: data.isPublic || false,
        accentColor: data.accentColor || "blue",
        template: data.template || "classic",
        personalInfo: data.personalInfo || {},
        professional_summary: data.professional_summary || "",
        experiences: data.experiences || [],
        educations: data.educations || [],
        projects: data.projects || [],
        skills: data.skills || [],
      });
      toast.success("Resume updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        toast.error(error.message || "Failed to generate cover letter");
      }
    }
    generateThumbnailBackground();
    setLoading(false);
    router.refresh();
  };

  const generateThumbnailBackground = async () => {
    try {
      const json = initialData.json ? JSON.parse(initialData.json) : {};

      const thumbnailResult = await generateThumbnail("resume-preview", {
        format: "jpeg",
        quality: 0.75,
      });

      if (thumbnailResult.success && thumbnailResult.blob) {
        const thumbnailUrl = await uploadImage(thumbnailResult.blob);
        json.thumbnail = thumbnailUrl;

        await updateResumeContent(initialData.id, {
          json: JSON.stringify(json),
        });
      }
    } catch (error) {
      console.error("Background thumbnail generation failed:", error);
    }
  };

  const goPrevious = () => {
    if (currentIndex > 0) {
      setFieldStep(stepOrder[currentIndex - 1]);
    }
  };

  const goNext = async () => {
    if (currentIndex < stepOrder.length - 1) {
      setFieldStep(stepOrder[currentIndex + 1]);
    } else {
      await updateResumeContent(initialData.id, {
        ...initialData,
        ...formValues,
      });
      router.refresh();
    }
  };

  const templateType = formValues.template || "classic";
  const accentColor = formValues.accentColor || "blue";

  const setTemplateType = (type: TemplateTypes) => {
    setValue("template", type);
  };

  const setAccentColor = (color: string) => {
    setValue("accentColor", color);
  };

  const toggleAccessibility = async () => {
    await toggleResumePublicStatus(initialData.id, !isPublic);
    setIsPublic(!isPublic);
  };

  const onShare = () => {
    const shareUrl = `${window.location.origin}/view/${initialData.id}`;
    if (navigator.share) {
      navigator
        .share({
          title: `${initialData.personalInfo?.fullName}'s Resume - ${initialData.title}`,
          url: shareUrl,
        })
        .catch((error) => console.log("Error sharing", error));
    } else {
      toast.info("Sharing is not supported in this browser.");
    }
  };

  const onDownload = async () => {
    window.print();
  };

  const {
    loading: analyzing,
    fn: analyMatchingResume,
    data: analyedMatchingResume,
  } = useFetch(analyzeMatchingResume);

  const setValueDirty = <K extends Path<ITemplateData>>(
    field: K,
    value: any
  ) => {
    setValue(field, value, { shouldDirty: true });
  };

  const onApplyEnhance = (
    appliedContents: Record<string, SuggestionStatus>
  ) => {
    Object.keys(appliedContents).forEach((key) => {
      switch (key) {
        case "summary":
          setValueDirty(
            "professional_summary",
            analyedMatchingResume.fieldSuggestions.professional_summary
              .suggested
          );
          break;
        case "skills":
          setValueDirty(
            "skills",
            analyedMatchingResume.fieldSuggestions.skills.suggested
          );
          break;
        default:
          if (key.startsWith("exp")) {
            const [_, idx] = key.split("-");
            const newExperiencies = formValues.experiences ?? [];
            const index = parseInt(idx);
            newExperiencies[index] = {
              ...newExperiencies[index],
              ...analyedMatchingResume.fieldSuggestions.experiences?.[index]
                ?.suggested,
            };
            setValueDirty("experiences", newExperiencies);
          } else if (key.startsWith("edu")) {
            const [_, idx] = key.split("-");
            const newEdus = formValues.educations ?? [];
            const index = parseInt(idx);
            newEdus[index] = {
              ...newEdus[index],
              ...analyedMatchingResume.fieldSuggestions.educations?.[index]
                ?.suggested,
            };

            setValueDirty("educations", newEdus);
          } else if (key.startsWith("project")) {
            const [_, idx] = key.split("-");
            const newProjects = formValues.projects ?? [];
            const index = parseInt(idx);
            newProjects[index] = {
              ...newProjects[index],
              ...analyedMatchingResume.fieldSuggestions.projects?.[index]
                ?.suggested,
            };
            setValueDirty("projects", newProjects);
          }
          break;
      }
    });
  };

  let previewContent = <></>;

  switch (templateType) {
    case "classic":
      previewContent = (
        <ClassicTemplate
          data={formValues}
          accentColor={accentColor}
          setFieldStep={setFieldStep}
        />
      );
      break;
    case "modern":
      previewContent = (
        <ModernTemplate
          data={formValues}
          accentColor={accentColor}
          setFieldStep={setFieldStep}
        />
      );
      break;
    case "minimal_image":
      previewContent = (
        <MinimalImageTemplate
          data={formValues}
          accentColor={accentColor}
          setFieldStep={setFieldStep}
        />
      );
      break;
    case "minimal":
      previewContent = (
        <MinimalTemplate
          data={formValues}
          accentColor={accentColor}
          setFieldStep={setFieldStep}
        />
      );
      break;
    default:
      previewContent = (
        <ClassicTemplate
          data={formValues}
          accentColor={accentColor}
          setFieldStep={setFieldStep}
        />
      );

      break;
  }
  return (
    <div>
      <div id="resume-actions" className="flex justify-between items-center">
        <Button
          variant="ghost"
          onClick={() => {
            router.push("/resume");
          }}
        >
          <ChevronLeft className="mr-2" />
          Back to Resume Builder
        </Button>

        <div className="">
          {isPublic && (
            <Button
              size={"sm"}
              className="mr-2"
              color={"blue"}
              onClick={onShare}
            >
              <Link />
              Share
            </Button>
          )}
          <Button
            size={"sm"}
            className="mr-2"
            color={"purple"}
            onClick={() => {
              toggleAccessibility();
            }}
          >
            {isPublic ? <Eye /> : <EyeOff />}
            {isPublic ? "Public" : "Private"}
          </Button>
          <Button size={"sm"} color="green" onClick={onDownload}>
            <Download />
            Download
          </Button>
        </div>
      </div>

      <div
        id="resume-title"
        className="mt-4 max-w-full flex items-center justify-between"
      >
        <div className=" flex-1">
          {isEditingTitle ? (
            <div className="flex items-center gap-2">
              <Input
                value={formValues.title}
                onChange={(e) => {
                  setValueDirty("title", e.target.value);
                }}
                className="text-lg"
              />
              <Button
                size={"sm"}
                onClick={async () => {
                  await onSubmit(formValues);
                  setIsEditingTitle(false);
                }}
                disabled={loading || !formValues.title?.trim()}
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : null}
                Save
              </Button>
              <Button
                size={"sm"}
                variant="ghost"
                onClick={() => {
                  setIsEditingTitle(false);
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-m"> {formValues.title} </span>
              <Button
                size={"icon"}
                variant="ghost"
                onClick={() => setIsEditingTitle(true)}
              >
                <Edit />
              </Button>
            </div>
          )}
        </div>

        <div className="flex-1 flex items-center justify-end">
          <ResumeEnhance
            onSubmit={async (jd: string) => {
              analyMatchingResume(jd, formValues);
            }}
            onApplyEnhance={onApplyEnhance}
            currentEnhanced={analyedMatchingResume}
            currentResume={formValues}
            loading={analyzing}
          />
        </div>
      </div>

      <div className="flex flex-wrap w-full mt-6 gap-4">
        <div id="resume-editor" className="flex-1 min-w-[400px]">
          <div className="w-full bg-card border border-border rounded-md flex flex-col shadow-sm relative">
            <Progress
              value={(100 * currentIndex) / (stepOrder.length - 1)}
              className="absolute top-0 right-0 left-0 h-[4px]"
            />
            <Card className="w-full flex items-center justify-center rounded-md">
              <ResumeEditorHeader
                isLastStep={currentIndex === stepOrder.length - 1}
                goPrevious={goPrevious}
                goNext={goNext}
                currentIndex={currentIndex}
                setAccentColor={setAccentColor}
                accentColor={accentColor}
                templateType={templateType}
                setTemplateType={setTemplateType}
              />
              <CardContent className="w-full">
                <ResumeEditorContent
                  fieldStep={fieldStep}
                  register={register}
                  control={control}
                  setValue={setValueDirty}
                  formValues={formValues}
                  errors={errors}
                />
              </CardContent>
            </Card>
            <div className="p-4 flex gap-2 justify-end">
              {isDirty && (
                <ConfirmDialog
                  title="Discard Changes"
                  description="Are you sure you want to discard all changes? This action cannot be undone."
                  confirmText="Discard"
                  variant="destructive"
                  onConfirm={() => {
                    reset();
                  }}
                >
                  <Button
                    className="rounded-b-md"
                    variant="secondary"
                    color="red"
                  >
                    Discard
                  </Button>
                </ConfirmDialog>
              )}
              <Button
                className="rounded-b-md"
                variant="secondary"
                color="green"
                onClick={async () => {
                  await onSubmit(formValues);
                }}
              >
                Save Changes
                {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              </Button>
            </div>
          </div>
        </div>

        <div id="resume-preview" className=" flex-1 min-w-[400px]">
          {previewContent}
        </div>
      </div>
    </div>
  );
}
