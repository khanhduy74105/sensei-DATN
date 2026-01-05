
// components/text-with-line-clamp.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TextWithLineClampProps {
  text: string;
  lines?: number;
  className?: string;
}

export function TextWithLineClamp({ 
  text, 
  lines = 2,
  className = "" 
}: TextWithLineClampProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={className}>
      <p 
        className={`text-sm text-muted-foreground max-w-full ${
          isExpanded ? "" : `line-clamp-${lines}`
        }`}
      >
        {text}
      </p>
      <Button
        variant="link"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="h-auto p-0 text-sm"
      >
        {isExpanded ? "See less" : "See more"}
      </Button>
    </div>
  );
}