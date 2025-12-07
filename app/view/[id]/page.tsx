import { getResumePublicById } from "@/actions/resume";
import ClassicTemplate from "@/app/(common)/(main)/resume/_components/template/ClassicTemplate";
import MinimalImageTemplate from "@/app/(common)/(main)/resume/_components/template/MinimalImageTemplate";
import MinimalTemplate from "@/app/(common)/(main)/resume/_components/template/MinimalTemplate";
import ModernTemplate from "@/app/(common)/(main)/resume/_components/template/ModernTemplate";
import { ITemplateData } from "@/app/(common)/(main)/resume/types";
import { notFound } from "next/navigation";
import React from "react";

interface TProps {
  params: {
    id: string;
  };
}

export default async function page(props: TProps) {
  const params = await props.params;
  const resume = await getResumePublicById(params.id);
  if (!resume) {
    notFound();
  }
  const templateType = resume?.template || "classic";

  const accentColor = resume?.accentColor || "blue";

  const data = resume as ITemplateData;

  let content = <></>;

  switch (templateType) {
    case "classic":
      content = <ClassicTemplate data={data} accentColor={accentColor} />;
      break;
    case "modern":
      content = <ModernTemplate data={data} accentColor={accentColor} />;
      break;
    case "minimal_image":
      content = <MinimalImageTemplate data={data} accentColor={accentColor} />;
      break;
    case "minimal":
      content = <MinimalTemplate data={data} accentColor={accentColor} />;
      break;
    default:
      content = <ClassicTemplate data={{}} accentColor={accentColor} />;
      break;
  }

  return content;
}
