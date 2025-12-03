import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2Icon,
  CheckIcon,
  LayoutTemplate,
  SunMoon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ACCENT_COLOR_OPTIONS,
  TEMPLATE_TYPE_OPTIONS,
  TemplateTypes,
} from "../types";

interface IProps {
  isLastStep: boolean;
  goNext: () => void;
  goPrevious: () => void;
  currentIndex: number;
  setAccentColor?: (color: string) => void;
  accentColor?: string;
  setTemplateType?: (type: TemplateTypes) => void;
  templateType?: string;
}

const ResumeEditorHeader = ({
  isLastStep,
  goNext,
  goPrevious,
  currentIndex,
  accentColor,
  setAccentColor,
  setTemplateType,
  templateType,
}: IProps) => {
  return (
    <CardHeader className="w-full text-lg font-semibold flex items-center justify-between">
      <div className="flex items-center justify-start gap-2">
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant={"secondary"} color="blue">
              <LayoutTemplate />
              Template
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="p-2 max-w-[360px]">
            {TEMPLATE_TYPE_OPTIONS.map((template) => (
              <DropdownMenuItem
                key={template.key}
                onClick={() => {
                  setTemplateType?.(template.key);
                }}
              >
                <div
                  className={`relative p-3 border rounded-md cursor-pointer transition-all border-gray-300 hover:bg-gray-700 ${
                    template.key === templateType ? "bg-gray-500" : ""
                  }`}
                >
                  <div className="space-y-1">
                    <h4 className="text-xl flex items-center justify-between">
                      {template.name}
                      {template.key === templateType ? (
                        <CheckCircle2Icon color="blue" />
                      ) : null}
                    </h4>
                    <div className="mt-2 p-2  rounded text-xs text-gray-200 bg-gray-600 italic">
                      {template.des}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant={"secondary"} color="red">
              <SunMoon />
              Accent
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={"start"}
            className="grid grid-cols-4 w-60 gap-2 absolute top-full left-0 right-0 p-3 mt-2 z-10 rounded-md border border-gray-200 shadow-sm max-w-[300px]"
          >
            {ACCENT_COLOR_OPTIONS.map((color) => (
              <DropdownMenuItem
                className="p-2 flex-col gap-2 flex items-center justify-center cursor-pointer"
                key={color.name}
                onClick={() => {
                  setAccentColor?.(color.name);
                }}
              >
                <div
                  className={`rounded-full h-12 w-12 flex items-center justify-center color`}
                  style={{
                    backgroundColor: color.rgb,
                  }}
                >
                  {accentColor === color.rgb && (
                    <CheckIcon size={50} width={30} height={30} />
                  )}
                </div>
                <span>{color.name}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex gap-2 items-center">
        {/* Previous Button */}
        {currentIndex > 0 && (
          <Button variant="default" onClick={goPrevious}>
            <ArrowLeft /> Previous
          </Button>
        )}

        {/* Next / End Button */}
        <Button variant="default" onClick={goNext}>
          {isLastStep ? "End" : "Next"}
          <ArrowRight />
        </Button>
      </div>
    </CardHeader>
  );
};

export default ResumeEditorHeader;
