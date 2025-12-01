"use client";

import React, { useState } from "react";
import {
  Control,
  FieldErrors,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";
import { IResumePersonalData, ITemplateData } from "../types";
import Image from "next/image";

interface IResumeEditorPersonalInfoProps {
  register: UseFormRegister<ITemplateData>;
  control: Control<ITemplateData>;
  formValues: ITemplateData;
  setValue: UseFormSetValue<ITemplateData>;
  errors: FieldErrors<ITemplateData>;
}

export type PersonalInfoFieldKey = keyof Omit<IResumePersonalData, "image">;

export interface PersonalInfoFieldConfig {
  key: PersonalInfoFieldKey;
  label: string;
  placeholder: string;
  type: "text" | "email" | "tel" | "url";
  required?: boolean;
  icon: React.ReactNode;
}

const personalInfoFields: PersonalInfoFieldConfig[] = [
  {
    key: "fullName",
    label: "Full Name",
    placeholder: "Enter your full name",
    type: "text",
    required: true,
    icon: (
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
        className="lucide lucide-user size-4"
        aria-hidden="true"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
  },
  {
    key: "email",
    label: "Email Address",
    placeholder: "Enter your email",
    type: "email",
    required: true,
    icon: (
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
        className="lucide lucide-mail size-4"
        aria-hidden="true"
      >
        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7"></path>
        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
      </svg>
    ),
  },
  {
    key: "phone",
    label: "Phone Number",
    placeholder: "Enter your phone number",
    type: "tel",
    icon: (
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
        className="lucide lucide-phone size-4"
        aria-hidden="true"
      >
        <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
      </svg>
    ),
  },
  {
    key: "location",
    label: "Location",
    placeholder: "Enter your location",
    type: "text",
    icon: (
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
        className="lucide lucide-map-pin size-4"
        aria-hidden="true"
      >
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path>
        <circle cx="12" cy="10" r="3"></circle>
      </svg>
    ),
  },
  {
    key: "profession",
    label: "Profession",
    placeholder: "Enter your profession",
    type: "text",
    icon: (
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
        className="lucide lucide-briefcase-business size-4"
        aria-hidden="true"
      >
        <path d="M12 12h.01"></path>
        <path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
        <path d="M22 13a18.15 18.15 0 0 1-20 0"></path>
        <rect width="20" height="14" x="2" y="6" rx="2"></rect>
      </svg>
    ),
  },
  {
    key: "linkedin",
    label: "LinkedIn Profile",
    placeholder: "Enter your LinkedIn URL",
    type: "url",
    icon: (
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
        className="lucide lucide-linkedin size-4"
        aria-hidden="true"
      >
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
        <rect width="4" height="12" x="2" y="9"></rect>
        <circle cx="4" cy="4" r="2"></circle>
      </svg>
    ),
  },
  {
    key: "website",
    label: "Personal Website",
    placeholder: "Enter your website",
    type: "url",
    icon: (
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
        className="lucide lucide-globe size-4"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"></path>
        <path d="M2 12h20"></path>
      </svg>
    ),
  },
];

const ResumeEditorPersonalInfo = ({
  setValue,
  errors,
  register,
  formValues,
}: IResumeEditorPersonalInfoProps) => {

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setValue("personalInfo.image", url);
  };

  console.log(formValues.personalInfo?.image);
  

  return (
    <div className="space-y-5">
      <p className="text-sm text-gray-600">
        Get Started with the personal information
      </p>

      {/* IMAGE UPLOAD */}
      <div className="flex items-center gap-2">
        <label className="cursor-pointer">
          {formValues.personalInfo?.image ? (
            <Image
              alt="avatar"
              height={`100`}
              width={`100`}
              className="w-16 h-16 rounded-full object-cover ring ring-slate-300 hover:opacity-80"
              src={formValues.personalInfo?.image}
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-200 ring ring-slate-300" />
          )}

          <input
            type="file"
            accept="image/jpeg, image/png"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        <div className="flex flex-col gap-1 pl-4 text-sm">
          <p>Update resume image</p>
        </div>
      </div>

      {/* TEXT FIELDS */}
      {personalInfoFields.map(
        ({ key, label, type, placeholder, required, icon }) => (
          <div key={key} className="space-y-1">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
              {icon}
              {label}
              {required && <span className="text-red-500">*</span>}
            </label>

            <input
              {...register(`personalInfo.${key}`)}
              type={type}
              placeholder={placeholder}
              defaultValue={formValues.personalInfo?.[key] ?? ""}
              className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg
              focus:ring focus:ring-blue-500 focus:border-blue-500 outline-none 
              transition-colors text-sm"
            />

            {errors.personalInfo?.[key] && (
              <p className="text-red-500 text-xs">
                {errors.personalInfo?.[key]?.message as string}
              </p>
            )}
          </div>
        )
      )}
    </div>
  );
};

export default ResumeEditorPersonalInfo;
