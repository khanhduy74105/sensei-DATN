import React, { useMemo } from "react";
import { ITemplateData, KeyOfITemplateData } from "../types";
import ResumeEditorPersonalInfo from "./resume-editor-personal-info";
import ResumeEditorProfessionalSummary from "./resume-editor-professional-summary";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import ResumeEditorProject from "./resume-editor-project";
import { EntryForm } from "./entry-form";
import ResumeEditorSkills from "./resume-editor-skills";
import ResumeEditorEducation from "./resume-editor-education";

export interface IResumeEditorContentProps {
  fieldStep: KeyOfITemplateData;
  register: UseFormRegister<ITemplateData>;
  control: Control<ITemplateData>;
  formValues: ITemplateData;
  setValue: UseFormSetValue<ITemplateData>;
  errors: FieldErrors<ITemplateData>;
}

const ResumeEditorContent = (props: IResumeEditorContentProps) => {
  const { fieldStep, register, control, formValues, setValue, errors } = props;

  const content = useMemo(() => {
    switch (fieldStep) {
      case KeyOfITemplateData.personalInfo:
        return (
          <ResumeEditorPersonalInfo
            control={control}
            register={register}
            formValues={formValues}
            setValue={setValue}
            errors={errors}
          />
        );
      case KeyOfITemplateData.professional_summary:
        return <ResumeEditorProfessionalSummary {...props} />;
      case KeyOfITemplateData.project:
        return <ResumeEditorProject {...props} />;
      case KeyOfITemplateData.experience:
        return (
          <div className="space-y-4" key={fieldStep}>
            <Controller
              name="experiences"
              control={props.control}
              render={({ field }) => (
                <EntryForm
                  type="experiences"
                  entries={field.value ?? []}
                  onChange={field.onChange}
                />
              )}
            />
            {props.errors.experiences && (
              <p className="text-sm text-red-500">
                {props.errors.experiences.message}
              </p>
            )}
          </div>
        );
      case KeyOfITemplateData.education:
        return <ResumeEditorEducation {...props} />;
      case KeyOfITemplateData.skills:
        return <ResumeEditorSkills {...props} />;
      default:
        break;
    }
  }, [fieldStep, formValues, control, register]);

  return (
    <div>
      <h3 className="text-lg font-semibold">
        {fieldStep
          .replaceAll("_", " ")
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </h3>

      {content}
    </div>
  );
};

export default ResumeEditorContent;
