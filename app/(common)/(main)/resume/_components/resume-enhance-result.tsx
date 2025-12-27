"use client";

import { ITemplateData, ResumeJDAnalysisResult } from "../types";
import FieldSuggestionCard, { SuggestionStatus } from "./field-suggestion";
import CardExperience from "./card-experience";
import CardEducation from "./card-education";
import CardProject from "./card-project";

interface Props {
  result: ResumeJDAnalysisResult;
  currentResume: ITemplateData;
  statuses: Record<string, SuggestionStatus>;
  setStatus: (key: string, status: SuggestionStatus) => void;
}

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

const SkillGroup = ({
  title,
  items,
  variant,
}: {
  title: string;
  items: string[];
  variant: "default" | "success" | "warning" | "danger";
}) => {
  if (!items.length) return null;

  return (
    <div>
      <p className="text-sm font-medium mb-1">{title}</p>
      <div className="flex flex-wrap gap-2">
        {items.map((s) => (
          <Badge key={s} label={s} variant={variant} />
        ))}
      </div>
    </div>
  );
};

const List = ({ title, items }: { title?: string; items: string[] }) => {
  if (!items.length) return null;

  return (
    <div>
      {title && <p className="text-sm font-medium mb-1">{title}</p>}
      <ul className="list-disc list-inside text-sm text-muted-foreground">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
};

export function ResumeMatchResult({
  result,
  currentResume,
  statuses,
  setStatus,
}: Props) {
  const { matchAnalysis, generalSuggestions, fieldSuggestions } = result;

  console.log(result, currentResume);
  

  return (
    <div className="space-y-6">
      {/* Overall match */}
      <section className="max-w-full p-4 border rounded-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Overall Match</h2>
          <Badge
            label={matchAnalysis.verdict.replace("_", " ")}
            variant={
              matchAnalysis.verdict === "strong_match"
                ? "success"
                : matchAnalysis.verdict === "moderate_match"
                ? "warning"
                : "danger"
            }
          />
        </div>

        <div className="mt-2 text-4xl font-bold">
          {matchAnalysis.overallScore}%
        </div>

        <p className="mt-2 text-sm text-muted-foreground">
          {matchAnalysis.notes}
        </p>
      </section>

      {/* Missing Skills */}
      <section className="max-w-full p-4 border rounded-lg space-y-3">
        <h3 className="font-semibold">Missing Skills</h3>

        <SkillGroup
          title="Required"
          items={matchAnalysis.missingSkills.required}
          variant="danger"
        />

        <SkillGroup
          title="Nice to have"
          items={matchAnalysis.missingSkills.niceToHave}
          variant="default"
        />
      </section>

      {/* Missing Experience */}
      {matchAnalysis.missingExperience.length > 0 && (
        <section className="max-w-full p-4 border rounded-lg space-y-2">
          <h3 className="font-semibold">Missing Experience</h3>
          <List items={matchAnalysis.missingExperience} />
        </section>
      )}

      {/* General Suggestions */}
      {generalSuggestions.length > 0 && (
        <section className="max-w-full p-4 border rounded-lg space-y-2">
          <h3 className="font-semibold">General Resume Suggestions</h3>
          <List items={generalSuggestions} />
        </section>
      )}

      {/* AI Field Suggestions */}
      <section className="max-w-full p-4 border rounded-lg space-y-4">
        <h3 className="font-semibold">AI Suggestions (Optional)</h3>

        {/* Professional Summary */}
        {fieldSuggestions.professional_summary && (
          <FieldSuggestionCard
            title="Professional Summary"
            current={
              <span>{fieldSuggestions.professional_summary.current}</span>
            }
            suggested={
              <span>{fieldSuggestions.professional_summary.suggested}</span>
            }
            reason={fieldSuggestions.professional_summary.reason}
            status={statuses["summary"] ?? "pending"}
            onApply={() => {
              // 👉 setValue("professional_summary", suggested)
              setStatus("summary", "applied");
            }}
            onUndo={() => {
              // 👉 restore old summary
              setStatus("summary", "pending");
            }}
            onIgnore={() => setStatus("summary", "ignored")}
          />
        )}

        {/* Experiences */}
        {fieldSuggestions.experiences?.map((item) => {
          const key = `exp-${item.index}`;

          const currentExperience = currentResume.experiences?.[item.index];

          return (
            <FieldSuggestionCard
              key={key}
              title={`Experience #${item.index + 1}`}
              current={<CardExperience item={currentExperience} />}
              suggested={<CardExperience item={item.suggested} />}
              reason={item.reason}
              status={statuses[key] ?? "pending"}
              onApply={() => {
                // 👉 update experience[item.index]
                setStatus(key, "applied");
              }}
              onUndo={() => setStatus(key, "pending")}
              onIgnore={() => setStatus(key, "ignored")}
            />
          );
        })}

        {/* Educations */}
        {fieldSuggestions.educations?.map((item, idx) => {
          const key = `edu-${item.index}`;

          const currentEdutcation = currentResume.educations?.[item.index];

          return (
            <FieldSuggestionCard
              key={key}
              title={`Education #${item.index + 1}`}
              current={<CardEducation item={currentEdutcation} />}
              suggested={<CardEducation item={item.suggested} />}
              reason={item.reason}
              status={statuses[key] ?? "pending"}
              onApply={() => setStatus(key, "applied")}
              onUndo={() => setStatus(key, "pending")}
              onIgnore={() => setStatus(key, "ignored")}
            />
          );
        })}

        {/* Projects */}
        {fieldSuggestions.projects?.map((item) => {
          const key = `project-${item.index}`;

          const currentProject = currentResume.projects?.[item.index];

          return (
            <FieldSuggestionCard
              key={key}
              title={`Project #${item.index + 1}`}
              current={<CardProject item={currentProject} />}
              suggested={<CardProject item={item.suggested} />}
              reason={item.reason}
              status={statuses[key] ?? "pending"}
              onApply={() => setStatus(key, "applied")}
              onUndo={() => setStatus(key, "pending")}
              onIgnore={() => setStatus(key, "ignored")}
            />
          );
        })}

        {/* Skills */}
        {fieldSuggestions.skills && (
          <FieldSuggestionCard
            title="Skills Adjustment"
            current={
              <div className="flex flex-wrap gap-2">
                {currentResume.skills?.map((skill: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            }
            suggested={
              <div className="flex flex-wrap gap-2">
                {fieldSuggestions.skills.suggested
                  ?.map((skill: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
                    >
                      {skill}
                    </div>
                  ))}
              </div>
            }
            reason={fieldSuggestions.skills.reason}
            status={statuses["skills"] ?? "pending"}
            onApply={() => {
              setStatus("skills", "applied");
            }}
            onUndo={() => setStatus("skills", "pending")}
            onIgnore={() => setStatus("skills", "ignored")}
          />
        )}
      </section>
    </div>
  );
}
