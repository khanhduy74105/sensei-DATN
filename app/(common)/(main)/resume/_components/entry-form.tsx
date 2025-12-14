/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { entrySchema } from "@/app/lib/schema";
import {
  Sparkles,
  PlusCircle,
  X,
  Loader2,
  Pencil,
  GripVertical,
} from "lucide-react";
import { improveWithAI } from "@/actions/resume";
import { toast } from "sonner";
import useFetch from "@/hooks/use-fetch";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  closestCenter,
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const formatDisplayDate = (dateString: string | undefined) => {
  if (!dateString) return "";
  return dateString;
};

interface EntryFromProps {
  type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  entries: any[];
  onChange: ([]) => void;
}

const SortableCard = ({ item, index, onDelete, onEdit }: any) => {
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
      <Card key={index}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
            <CardTitle className="text-sm font-medium">
              {item.title} @ {item.organization}
            </CardTitle>
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
            {item.isCurrent
              ? `${formatDisplayDate(item.startDate)} - Present`
              : `${formatDisplayDate(item.startDate)} - ${formatDisplayDate(
                  item.endDate
                )}`}
          </p>
          <p className="mt-2 text-sm whitespace-pre-wrap text-ellipsis overflow-hidden">
            {item.description}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export function EntryForm({ type, entries, onChange }: EntryFromProps) {
  const sensors = useSensors(useSensor(PointerSensor));
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const {
    register,
    handleSubmit: handleValidation,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrent: false,
    },
  });

  const current = watch("isCurrent");

  const onEdit = (index: number) => {
    setEditingIndex(index);
    reset(entries?.[index]);
  };

  const EMPTY_FORM = {
    title: "",
    organization: "",
    startDate: "",
    endDate: "",
    description: "",
    isCurrent: false,
  };

  const handleAdd = handleValidation((data) => {
    const formattedEntry = {
      ...data,
      startDate: formatDisplayDate(data.startDate),
      endDate: data.isCurrent ? "" : formatDisplayDate(data.endDate),
    };

    const list = [...entries];

    if (editingIndex !== null) {
      list[editingIndex] = {
        ...list[editingIndex],
        ...formattedEntry,
      };
    } else {
      list.push({
        id: crypto.randomUUID(),
        ...formattedEntry,
      });
    }

    reset({
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrent: false,
    });
    setEditingIndex(null);
    onChange(list);
  });

  const handleDelete = (index: number) => {
    const updated = [...(entries || [])];
    updated.splice(index, 1);
    onChange(updated);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const items = entries || [];
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);

    onChange(arrayMove(items, oldIndex, newIndex));

    reset({
      title: "",
      organization: "",
      startDate: "",
      endDate: "",
      description: "",
      isCurrent: false,
    });

    setEditingIndex(null);
  };

  const {
    loading: isImproving,
    fn: improveWithAIFn,
    data: improvedContent,
    error: improveError,
  } = useFetch(improveWithAI);

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

  // Replace handleImproveDescription with this
  const handleImproveDescription = async () => {
    const description = watch("description");
    if (!description) {
      toast.error("Please enter a description first");
      return;
    }

    await improveWithAIFn({
      current: description,
      type: type.toLowerCase(),
    });
  };

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={(entries || []).map((i, idx) => i.id ?? idx)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4">
            {entries.map((item, index) => (
              <SortableCard
                key={item.id ?? index}
                item={item}
                index={index}
                onDelete={handleDelete}
                onEdit={onEdit}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {
        <Card>
          <CardHeader>
            <CardTitle>
              {editingIndex === null ? "Add" : "Update"} {type}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input placeholder="Title/Position" {...register("title")} />
                {errors.title && (
                  <p className="text-sm text-red-500">{errors.title.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  placeholder="Organization/Company"
                  {...register("organization")}
                />
                {errors.organization && (
                  <p className="text-sm text-red-500">
                    {errors.organization.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Input type="month" {...register("startDate")} />
                {errors.startDate && (
                  <p className="text-sm text-red-500">
                    {errors.startDate.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Input
                  type="month"
                  {...register("endDate")}
                  disabled={current}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-500">
                    {errors.endDate.message}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isCurrent"
                {...register("isCurrent")}
                onChange={(e) => {
                  setValue("isCurrent", e.target.checked);
                  if (e.target.checked) {
                    setValue("endDate", "");
                  }
                }}
              />
              <label htmlFor="current">Current {type}</label>
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder={`Description of your ${type.toLowerCase()}`}
                className="min-h-32"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              color="purple"
              onClick={handleImproveDescription}
              disabled={isImproving || !watch("description")}
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
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset({
                  title: "",
                  organization: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                  isCurrent: false,
                });
                setEditingIndex(null);
              }}
            >
              Cancel
            </Button>
            <Button type="button" onClick={handleAdd}>
              <PlusCircle className="h-4 w-4 mr-2" />
              {editingIndex !== null ? "Update" : "Add"}
            </Button>
          </CardFooter>
        </Card>
      }
    </div>
  );
}
