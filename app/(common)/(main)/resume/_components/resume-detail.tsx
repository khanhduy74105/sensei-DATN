"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, Eye, Link, Loader2 } from "lucide-react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { templateDataSchema } from "@/app/lib/schema";
import ClassicTemplate from "./template/ClassicTemplate";
import MinimalImageTemplate from "./template/MinimalImageTemplate";
import ModernTemplate from "./template/ModernTemplate";
import MinimalTemplate from "./template/MinimalTemplate";
import { toast } from "sonner";
import { updateResumeContent } from "@/actions/resume";
import { useRouter } from "next/navigation";

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

  const currentIndex = stepOrder.indexOf(fieldStep);

  const {
    control,
    register,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ITemplateData>({
    resolver: zodResolver(templateDataSchema),
    defaultValues: {
      ...initialData,
      accentColor: initialData.accentColor || "blue",
      template: initialData.template || "classic",
    },
    mode: "onBlur", // 👈 validate on blur
    reValidateMode: "onBlur", // 👈 revalidate also on blur
  });

  const formValues = watch();

  const onSubmit = async (data: Partial<IResumeContent>) => {
    setLoading(true);

    try {
      const updatedResume = await updateResumeContent(initialData.id, {
        ...initialData,
        ...data,
      });
      toast.success("Resume updated successfully");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);

        toast.error(error.message || "Failed to generate cover letter");
      }
    }
    setLoading(false);
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

  const onDownload = () => {
    window.print();
  };

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
          <Button size={"sm"} className="mr-2" color={"blue"}>
            <Link />
            Share
          </Button>
          <Button size={"sm"} className="mr-2" color={"purple"}>
            <Eye />
            Public
          </Button>
          <Button size={"sm"} color="green" onClick={onDownload}>
            <Download />
            Download
          </Button>
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
                  setValue={setValue}
                  formValues={formValues}
                  errors={errors}
                />
              </CardContent>
            </Card>
            <div className="p-4">
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

        <div id="resume-review" className=" flex-1 min-w-[400px]">
          {templateType === "classic" ? (
            <ClassicTemplate data={formValues} accentColor={accentColor} />
          ) : null}
          {templateType === "modern" ? (
            <ModernTemplate data={formValues} accentColor={accentColor} />
          ) : null}
          {templateType === "minimal_image" ? (
            <MinimalImageTemplate data={formValues} accentColor={accentColor} />
          ) : null}
          {templateType === "minimal" ? (
            <MinimalTemplate data={formValues} accentColor={accentColor} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
