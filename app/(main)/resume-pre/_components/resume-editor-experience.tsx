import React from "react";
import { Controller } from "react-hook-form";
import { IResumeEditorContentProps } from "./resume-editor-content";
import { EntryForm } from "./entry-form";

const ResumeEditorExperience = (props: IResumeEditorContentProps) => {
  return (
    <div className="space-y-4">
      <Controller
        name="experiences"
        control={props.control}
        render={({ field }) => (
          <EntryForm
            type="Experiences"
            entries={field.value ?? []}
            onChange={field.onChange}
          />
        )}
      />
      {props.errors.experiences && (
        <p className="text-sm text-red-500">{props.errors.experiences.message}</p>
      )}
    </div>
  );
};

export default ResumeEditorExperience;
