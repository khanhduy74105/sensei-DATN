"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReactElement } from "react";

export type SuggestionStatus = "pending" | "applied" | "ignored";

const Badge = ({
  label,
  variant = "default",
}: {
  label: string;
  variant?: "default" | "success" | "warning" | "danger";
}) => {
  const map = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-700",
    warning: "bg-yellow-100 text-yellow-700",
    danger: "bg-red-100 text-red-700",
  };

  return (
    <span className={`px-2 py-1 rounded text-xs ${map[variant]}`}>{label}</span>
  );
};

type FieldSuggestionCardProps = {
  title: string;

  /** Current value in resume */
  current?: ReactElement;

  /** AI suggested value */
  suggested: ReactElement;

  /** Why AI suggests this */
  reason: string;

  /** UI state */
  status: SuggestionStatus;

  /** Actions */
  onApply: () => void;
  onUndo?: () => void;
  onIgnore: () => void;
};

export default function FieldSuggestionCard({
  title,
  current,
  suggested,
  reason,
  status,
  onApply,
  onUndo,
  onIgnore,
}: FieldSuggestionCardProps) {
  return (
    <Card className="relative max-w-full">
      {/* Status badge */}
      {status !== "pending" && (
        <div className="absolute top-2 right-2">
          <Badge
            label={status === "applied" ? "Applied" : "Ignored"}
            variant={status === "applied" ? "success" : "warning"}
          ></Badge>
        </div>
      )}

      <CardHeader className="pb-2">
        <h4 className="font-semibold text-sm">{title}</h4>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current content */}
        {current !== undefined && <div>{current}</div>}

        {/* Suggested content */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">AI Suggestion</p>
          {suggested}
        </div>

        {/* Reason */}
        <div>
          <p className="text-xs text-muted-foreground mb-1">Why?</p>
          <p className="text-sm text-muted-foreground">{reason}</p>
        </div>
      </CardContent>

      <CardFooter className="flex justify-end gap-2">
        {status === "pending" && (
          <>
            <Button size="sm" variant="ghost" onClick={onIgnore}>
              Ignore
            </Button>
            <Button size="sm" onClick={onApply}>
              Apply
            </Button>
          </>
        )}

        {(status === "applied" || status === "ignored") && onUndo && (
          <Button size="sm" variant="ghost" onClick={onUndo}>
            Undo
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
