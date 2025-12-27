import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { IResumeEditorContentProps } from "./resume-editor-content";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, PlusCircle, Pencil, Sparkles, Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeProjectSchema } from "@/app/lib/schema";
import { z } from "zod";
import type { FieldPath } from "react-hook-form";
import useFetch from "@/hooks/use-fetch";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";

const ResumeEditorProject = (props: IResumeEditorContentProps) => {
  const type = "projects";

  type ProjectForm = z.infer<typeof resumeProjectSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
    reset,
    setValue,
  } = useForm<ProjectForm>({
    resolver: zodResolver(resumeProjectSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
    },
  });
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

  const formValues = watch();

  // Add this effect to handle the improvement result
  useEffect(() => {
    if (improvedContent && !isImproving) {
      setValue("description", improvedContent);
      toast.success("Description improved successfully!");
    }
    if (improveError) {
      toast.error(improveError.message || "Failed to improve description");
    }
  }, [improvedContent, improveError, isImproving, setValue]);

  const handleDelete = (index: number) => {
    const newEntries = props.formValues.projects?.filter((_, i) => i !== index);
    props.setValue("projects", newEntries || []);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    reset(props.formValues.projects?.[index]);
  };

  const onSubmitProject = (data: ProjectForm) => {
    const parsed = resumeProjectSchema.safeParse(data);
    if (!parsed.success) {
      // map zod errors to react-hook-form
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as string | undefined;
        if (field)
          setError(field as FieldPath<ProjectForm>, {
            type: "manual",
            message: issue.message,
          });
      });
      return;
    }

    const list = [...(props.formValues.projects || [])];

    if (editingIndex !== null) {
      list[editingIndex] = {
        ...list[editingIndex],
        ...parsed.data,
      };
    } else {
      list.push({
        id: crypto.randomUUID(),
        ...parsed.data,
      });
    }

    props.setValue("projects", list);

    reset({ name: "", type: "", description: "" });
    setEditingIndex(null);
  };

  const handleImproveDescription = async () => {
    const description = formValues.description;
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: "professional summary",
    });
  };

  return (
    <div className="space-y-4">
      <div className="space-y-4">
        <div className="space-y-4">
          {props.formValues.projects?.map((item, index) => (
            <Card key={index} className="gap-3">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-sm font-medium">
                    {item.name}
                  </CardTitle>
                  <span className="text-sm font-normal text-neutral-300">
                    {item.type}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => handleEdit(index)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    type="button"
                    onClick={() => handleDelete(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mt-2 text-sm whitespace-pre-wrap text-ellipsis overflow-hidden">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex !== null ? "Edit project" : `Add ${type}`}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input
                  placeholder="Project Name"
                  {...register("name", {
                    required: "Project name is required",
                  })}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Type"
                  {...register("type", { required: "Type is required" })}
                />
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Description"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <Button
              className="mt-2"
              type="button"
              variant="ghost"
              size="sm"
              color="purple"
              onClick={handleImproveDescription}
              disabled={isImproving || !formValues.description}
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
              Tip: Keep it concise (3-4 sentences) and focus on your most
              relevant achievements and skills.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset({ name: "", type: "", description: "" });
                setEditingIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleSubmit(onSubmitProject)}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {editingIndex !== null ? "Update" : "Add Entry"}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ResumeEditorProject;
