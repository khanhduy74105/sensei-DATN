import React from "react";
import { Controller, useForm } from "react-hook-form";
import { IResumeEditorContentProps } from "./resume-editor-content";
import { Loader2, PlusCircle, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { watch } from "fs";
import { register } from "module";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeEducationSchema } from "@/app/lib/schema";

const ResumeEditorEducation = (props: IResumeEditorContentProps) => {
  const type = "educations";

  const {
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(resumeEducationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      graduationDate: "",
      field: "",
      gpa: "",
    },
  });

  const currentValue = watch();

  const handleDelete = (index: number) => {
    const newEntries = props.formValues.educations?.filter(
      (_, i) => i !== index
    );
    props.setValue("educations", newEntries || []);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-4">
          {props.formValues.educations?.map((item, index) => (
            <Card key={index} className="gap-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div className="">
                  <CardTitle className="text-sm font-medium">
                    {item.field} - {item.degree}
                  </CardTitle>
                  <p className="text-m text-muted-foreground">
                    {item.institution}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  type="button"
                  onClick={() => handleDelete(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Graduation date: {item.graduationDate}
                </p>
                <p className="mt-2 text-sm whitespace-pre-wrap">
                  GPA: {item.gpa}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {
          <Card>
            <CardHeader>
              <CardTitle>Add {type}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input
                    placeholder="Institution"
                    {...register("institution")}
                  />
                  {errors.institution && (
                    <p className="text-sm text-red-500">
                      {errors.institution.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input placeholder="Degree" {...register("degree")} />
                  {errors.degree && (
                    <p className="text-sm text-red-500">
                      {errors.degree.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Input placeholder="Field of study" {...register("field")} />
                  {errors.field && (
                    <p className="text-sm text-red-500">
                      {errors.field.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="month"
                    placeholder="Graduate date (expected)"
                    {...register("graduationDate")}
                  />
                  {errors.graduationDate && (
                    <p className="text-sm text-red-500">
                      {errors.graduationDate.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Input placeholder={`GPA`} {...register("gpa")} />
                {errors.gpa && (
                  <p className="text-sm text-red-500">{errors.gpa.message}</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={() => {
                  props.setValue("educations", [
                    ...(props.formValues.educations || []),
                    {
                      id: crypto.randomUUID(),
                      ...currentValue
                    },
                  ]);
                  reset();
                }}
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Entry
              </Button>
            </CardFooter>
          </Card>
        }

        {
          <Button className="w-full" variant="outline">
            <PlusCircle className="h-4 w-4 mr-2" />
            Add {type}
          </Button>
        }
      </div>
    </div>
  );
};

export default ResumeEditorEducation;
