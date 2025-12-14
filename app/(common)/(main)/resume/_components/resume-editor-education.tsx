/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { IResumeEditorContentProps } from "./resume-editor-content";
import { resumeEducationSchema } from "@/app/lib/schema";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { PlusCircle, X, Pencil, GripVertical } from "lucide-react";

const type = "educations";

const SortableEducationCard = ({ item, index, onDelete, onEdit }: any) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
  };

  return (
    <div ref={setNodeRef} style={style}>
      <Card className={isDragging ? "opacity-80" : ""}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <div className="flex items-center gap-2">
            {/* Drag handle ONLY */}
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-muted-foreground" />
            </button>

            <div>
              <CardTitle className="text-sm font-medium">
                {item.field} - {item.degree}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {item.institution}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => onEdit(index)}
            >
              <Pencil className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={() => onDelete(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-muted-foreground">
            Graduation date: {item.graduationDate}
          </p>
          <p className="mt-1 text-sm">GPA: {item.gpa}</p>
        </CardContent>
      </Card>
    </div>
  );
};

/* ---------------------------------- */
/* Main Component                      */
/* ---------------------------------- */

const ResumeEditorEducation = (props: IResumeEditorContentProps) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

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
    const updated = [...(props.formValues.educations || [])];
    updated.splice(index, 1);
    props.setValue("educations", updated);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    reset(props.formValues.educations?.[index]);
  };

  const handleSubmit = () => {
    const list = [...(props.formValues.educations || [])];

    if (editingIndex !== null) {
      list[editingIndex] = {
        ...list[editingIndex],
        ...currentValue,
      };
    } else {
      list.push({
        id: crypto.randomUUID(),
        ...currentValue,
      });
    }

    props.setValue("educations", list);

    reset({
      institution: "",
      degree: "",
      graduationDate: "",
      field: "",
      gpa: "",
    });

    setEditingIndex(null);
  };


  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const items = props.formValues.educations || [];
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    props.setValue("educations", arrayMove(items, oldIndex, newIndex));
  };

  return (
    <div className="space-y-4">
      {/* ---------- Sortable List ---------- */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={(props.formValues.educations || []).map((i, idx) => i.id ?? idx)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {props.formValues.educations?.map((item, index) => (
              <SortableEducationCard
                key={item.id ?? index}
                item={item}
                index={index}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* ---------- Add / Edit Form ---------- */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingIndex !== null ? "Edit education" : `Add ${type}`}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input placeholder="Institution" {...register("institution")} />
              {errors.institution && (
                <p className="text-sm text-red-500">
                  {errors.institution.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Input placeholder="Degree" {...register("degree")} />
              {errors.degree && (
                <p className="text-sm text-red-500">{errors.degree.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input placeholder="Field of study" {...register("field")} />
              {errors.field && (
                <p className="text-sm text-red-500">{errors.field.message}</p>
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

        <CardFooter className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              reset({
                institution: "",
                degree: "",
                graduationDate: "",
                field: "",
                gpa: "",
              });
              setEditingIndex(null);
            }}
          >
            Cancel
          </Button>

          <Button type="button" onClick={handleSubmit}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {editingIndex !== null ? "Update" : "Add"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ResumeEditorEducation;
