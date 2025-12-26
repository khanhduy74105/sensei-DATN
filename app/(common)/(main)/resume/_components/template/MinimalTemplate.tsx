import {
  ACCENT_COLOR_OPTIONS,
  ITempleteProps,
} from "@/app/(common)/(main)/resume/types";
import { formatDate } from "@/lib/utils";

const MinimalTemplate = ({ data, accentColor }: ITempleteProps) => {
  const colorRGB = ACCENT_COLOR_OPTIONS.find(
    (color) => color.name === accentColor
  )?.rgb;

  return (
    <div className="max-w-4xl mx-auto p-8 bg-white text-gray-900 font-light">
      {/* Header */}
      <header className="mb-10">
        <h1 className="text-4xl font-thin mb-4 tracking-wide">
          {data.personalInfo?.fullName || "Your Name"}
        </h1>

        <div className="flex flex-wrap gap-6 text-sm text-gray-600">
          {data.personalInfo?.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo?.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo?.location && (
            <span>{data.personalInfo.location}</span>
          )}
          {data.personalInfo?.linkedin && (
            <span className="break-all">{data.personalInfo.linkedin}</span>
          )}
          {data.personalInfo?.website && (
            <span className="break-all">{data.personalInfo.website}</span>
          )}
        </div>
      </header>

      {/* Professional Summary */}
      {data.professional_summary && (
        <section className="mb-10">
          <p className=" text-gray-700">{data.professional_summary}</p>
        </section>
      )}

      {/* Experience */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: colorRGB }}
          >
            Experience
          </h2>

          <div className="space-y-6">
            {data.experiences.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-lg font-medium">{exp.title}</h3>
                  <span className="text-sm text-gray-500">
                    {formatDate(exp.startDate)} -{" "}
                    {exp.isCurrent ? "Present" : formatDate(exp.endDate!)}
                  </span>
                </div>
                <p className="text-gray-600 mb-2">{exp.organization}</p>
                {exp.description && (
                  <div className="text-gray-700 leading-relaxed whitespace-pre-line overflow-ellipsis overflow-hidden">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: colorRGB }}
          >
            Projects
          </h2>

          <div className="space-y-4">
            {data.projects.map((proj, index) => (
              <div
                key={index}
                className="max-w-full flex flex-col gap-2 justify-between items-baseline"
              >
                <h3 className="text-lg font-medium ">{proj.name} - {proj.type}</h3>
                <p className="text-gray-600 max-w-full text-ellipsis overflow-hidden">{proj.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Education */}
      {data.educations && data.educations.length > 0 && (
        <section className="mb-10">
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: colorRGB }}
          >
            Education
          </h2>

          <div className="space-y-4">
            {data.educations.map((edu, index) => (
              <div key={index} className="flex justify-between items-baseline">
                <div>
                  <h3 className="font-medium">
                    {edu.degree} {edu.field && `in ${edu.field}`}
                  </h3>
                  <p className="text-gray-600">{edu.institution}</p>
                  {edu.gpa && (
                    <p className="text-sm text-gray-500">GPA: {edu.gpa}</p>
                  )}
                </div>
                <span className="text-sm text-gray-500">
                  {formatDate(edu.graduationDate)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Skills */}
      {data.skills && data.skills.length > 0 && (
        <section>
          <h2
            className="text-sm uppercase tracking-widest mb-6 font-medium"
            style={{ color: colorRGB }}
          >
            Skills
          </h2>

          <div className="text-gray-700">{data.skills.join(" • ")}</div>
        </section>
      )}
    </div>
  );
};

export default MinimalTemplate;
