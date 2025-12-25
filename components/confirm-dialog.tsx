"use client";

import React, { ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface ConfirmDialogProps {
  children: ReactNode; // Trigger button
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  variant?: "default" | "destructive";
  isLoading?: boolean;
}

export function ConfirmDialog({
  children,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  variant = "default",
  isLoading = false,
}: ConfirmDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const handleConfirm = async (e: React.MouseEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onConfirm();
      setOpen(false);
    } catch (error) {
      console.error("Confirm action failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    setOpen(false);
  };

  const isDisabled = loading || isLoading;

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel} disabled={isDisabled}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isDisabled}
            className={
              variant === "destructive"
                ? "bg-red-500 hover:bg-red-600"
                : ""
            }
          >
            {loading || isLoading ? "Loading..." : confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// ============================================
// USAGE EXAMPLE 1: Simple Delete Confirmation
// ============================================

export function DeleteExample() {
  const handleDelete = async () => {
    // Your delete logic
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Deleted!");
  };

  return (
    <ConfirmDialog
      title="Delete Item"
      description="Are you sure you want to delete this item? This action cannot be undone."
      confirmText="Delete"
      cancelText="Cancel"
      variant="destructive"
      onConfirm={handleDelete}
    >
      <Button variant="destructive">Delete</Button>
    </ConfirmDialog>
  );
}

// ============================================
// USAGE EXAMPLE 2: Custom Trigger
// ============================================

export function CustomTriggerExample() {
  return (
    <ConfirmDialog
      title="Logout"
      description="Are you sure you want to logout?"
      confirmText="Yes, logout"
      onConfirm={async () => {
        console.log("Logging out...");
      }}
    >
      <button className="px-4 py-2 bg-blue-500 text-white rounded">
        Logout
      </button>
    </ConfirmDialog>
  );
}

// ============================================
// USAGE EXAMPLE 3: With Icon Button
// ============================================

import { Trash } from "lucide-react";

export function IconButtonExample() {
  return (
    <ConfirmDialog
      title="Delete Resume"
      description="This will permanently delete your resume."
      confirmText="Delete"
      variant="destructive"
      onConfirm={async () => {
        console.log("Deleting resume...");
      }}
    >
      <Button size="icon" variant="destructive">
        <Trash className="h-4 w-4" />
      </Button>
    </ConfirmDialog>
  );
}

// ============================================
// USAGE EXAMPLE 4: ResumeCard Integration
// ============================================

interface ResumeCardExampleProps {
  resumeId: string;
  resumeTitle: string;
  onDelete: (id: string) => Promise<void>;
}

export function ResumeCardExample({
  resumeId,
  resumeTitle,
  onDelete,
}: ResumeCardExampleProps) {
  return (
    <div className="flex gap-2">
      <ConfirmDialog
        title="Delete Resume"
        description={`Are you sure you want to delete "${resumeTitle}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="destructive"
        onConfirm={() => onDelete(resumeId)}
      >
        <Button
          size="icon"
          className="bg-red-500 hover:bg-red-600"
        >
          <Trash className="h-4 w-4" />
        </Button>
      </ConfirmDialog>
    </div>
  );
}