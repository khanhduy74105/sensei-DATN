"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ReactElement } from "react";

export type SuggestionStatus = "pending" | "applied" | "ignored";

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
          <Badge variant={status === "applied" ? "default" : "secondary"}>
            {status === "applied" ? "Applied" : "Ignored"}
          </Badge>
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

        {status === "applied" && onUndo && (
          <Button size="sm" variant="ghost" onClick={onUndo}>
            Undo
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
