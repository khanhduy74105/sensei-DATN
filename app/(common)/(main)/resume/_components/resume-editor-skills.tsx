import { Button } from "@/components/ui/button";
import { PlusCircle, X } from "lucide-react";
import React from "react";
import { IResumeEditorContentProps } from "./resume-editor-content";

const ResumeEditorSkills = (props: IResumeEditorContentProps) => {
  const { setValue, formValues } = props;

  const [newSkill, setNewSkill] = React.useState("");

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (!skill) return;

    const current = formValues.skills ?? [];

    setValue("skills", [...current, skill], { shouldValidate: true });
    setNewSkill(""); // clear input
  };

  const handleDeleteSkill = (index: number) => {
    const current = formValues.skills ?? [];
    const updated = current.filter((_, i) => i !== index);

    setValue("skills", updated, { shouldValidate: true });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            Skills
          </h3>
          <p className="text-sm text-gray-500">
            Add your technical and soft skills.
          </p>
        </div>

        {/* ADD SKILL INPUT */}
        <div className="flex gap-2">
          <input
            placeholder="Enter a skill (e.g., JavaScript, Project Management)"
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddSkill();
              }
            }}
          />

          <Button type="button" onClick={handleAddSkill}>
            <PlusCircle className="h-4 w-4 mr-1" />
            Add
          </Button>
        </div>

        {/* LIST OF SKILLS */}
        <div className="flex flex-wrap gap-2">
          {formValues.skills && formValues.skills.length > 0 ? (
            formValues.skills.map((skill: string, index: number) => (
              <div
                key={index}
                className="flex items-center bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 rounded-full"
              >
                {skill}
                <button
                  className="ml-2 text-gray-600 hover:text-red-600"
                  onClick={() => handleDeleteSkill(index)}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No skills added yet.</p>
          )}
        </div>

        {/* OPTIONAL EMPTY STATE */}
        {(!formValues.skills || formValues.skills.length === 0) && (
          <div className="text-center py-6 text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-sparkles w-10 h-10 mx-auto mb-2 text-gray-300"
              aria-hidden="true"
            >
              <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"></path>
              <path d="M20 2v4"></path>
              <path d="M22 4h-4"></path>
              <circle cx="4" cy="20" r="2"></circle>
            </svg>

            <p>No skills added yet.</p>
            <p className="text-sm">Add your technical and soft skills above.</p>
          </div>
        )}

        {/* TIP BOX */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Tip:</strong> Add 8-12 relevant skills. Include both
            technical skills and soft skills.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResumeEditorSkills;
