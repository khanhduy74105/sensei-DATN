"use client";

import React, { useRef, useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Button } from "@/components/ui/button";
import { updateCoverLetter } from "@/actions/cover-letter";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { ICoverLetter } from "@/types";

const CoverLetterPreview = ({
  coverLetter,
}: {
  coverLetter: ICoverLetter | null;
}) => {
  const [value, setValue] = useState(coverLetter?.content ?? "");
  const [loading, setLoading] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const updateContentCoverLetter = async () => {
    setLoading(true);
    if (coverLetter?.id) {
      await updateCoverLetter(coverLetter.id, value);
      toast.success("Saved");
    }
    setLoading(false);
  };

  const copyToClipboard = async () => {
    try {
      if (!previewRef.current) return;

      const html = previewRef.current.innerHTML;

      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([value], { type: "text/plain" }),
        }),
      ]);

      toast.success("Copied (Gmail ready)");
    } catch (err) {
      toast.error("Copy failed");
    }
  };

  return (
    <div className="py-4" data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(val) => setValue(val || "")}
        height={700}
      />
      <div className="hidden">
        <div ref={previewRef}>
          <MarkdownPreview source={value} />
        </div>
      </div>

      <div className="pt-2 gap-2 flex justify-end items-center">
        <Button onClick={copyToClipboard}>Copy</Button>

        <Button onClick={updateContentCoverLetter} disabled={loading}>
          Save
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        </Button>
      </div>
    </div>
  );
};

export default CoverLetterPreview;
