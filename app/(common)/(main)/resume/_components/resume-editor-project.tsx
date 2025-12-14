import React from "react";
import { useForm } from "react-hook-form";
import { IResumeEditorContentProps } from "./resume-editor-content";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, PlusCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { resumeProjectSchema } from "@/app/lib/schema";

const ResumeEditorProject = (props: IResumeEditorContentProps) => {
  const type = "projects";

  const {
    register,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    resolver: zodResolver(resumeProjectSchema),
    defaultValues: {
      name: "",
      type: "",
      description: "",
    },
  });

  const currentValue = watch();

  const handleDelete = (index: number) => {
    const newEntries = props.formValues.projects?.filter((_, i) => i !== index);
    props.setValue("projects", newEntries || []);
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
                  <span className="text-sm font-normal text-neutral-300">{item.type}</span>
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
                <p className="mt-2 text-sm whitespace-pre-wrap text-ellipsis overflow-hidden">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Add {type}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input placeholder="Project Name" {...register("name", { required: "Project name is required" })} />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input placeholder="Type" {...register("type", { required: "Type is required" })} />
                {errors.type && (
                  <p className="text-sm text-red-500">{errors.type.message}</p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Textarea placeholder="Description" {...register("description", { required: "Description is required" })} />
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description.message}</p>
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
                props.setValue("projects", [
                  ...(props.formValues.projects || []),
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

        <Button className="w-full" variant="outline">
          <PlusCircle className="h-4 w-4 mr-2" />
          Add {type}
        </Button>
      </div>
    </div>
  );
};

export default ResumeEditorProject;
