import {
  ACCENT_COLOR_OPTIONS,
  ITempleteProps,
  KeyOfITemplateData,
} from "@/app/(common)/(main)/resume/types";
import { Mail, Phone, MapPin } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Image from "next/image";

const MinimalImageTemplate = ({
  data,
  accentColor,
  setFieldStep,
}: ITempleteProps) => {
  const colorRGB = ACCENT_COLOR_OPTIONS.find(
    (color) => color.name === accentColor
  )?.rgb;

  return (
    <div className="max-w-5xl mx-auto bg-white text-zinc-800">
      <div className="grid grid-cols-3">
        <div
          className="col-span-1  py-10"
          onClick={() => setFieldStep(KeyOfITemplateData.personalInfo)}
        >
          {/* Image */}
          {data.personalInfo?.image &&
          typeof data.personalInfo.image === "string" ? (
            <div className="mb-6 flex justify-center">
              <div
                className="relative w-32 h-32"
                style={{ borderRadius: "50%", overflow: "hidden" }}
              >
                <Image
                  src={data.personalInfo.image}
                  alt="Profile"
                  fill
                  className="object-cover"
                  style={{
                    borderRadius: "50%",
                  }}
                />
                <div
                  className="absolute inset-0 -z-10"
                  style={{ background: colorRGB + "70" }}
                />
              </div>
            </div>
          ) : data.personalInfo?.image &&
            typeof data.personalInfo.image === "object" ? (
            <div className="mb-6 flex justify-center">
              <div
                className="relative w-32 h-32"
                style={{ borderRadius: "50%", overflow: "hidden" }}
              >
                <Image
                  src={URL.createObjectURL(data.personalInfo.image)}
                  alt="Profile"
                  fill
                  className="object-cover"
                  style={{
                    borderRadius: "50%",
                  }}
                  unoptimized
                />
              </div>
            </div>
          ) : null}
        </div>

        {/* Name + Title */}
        <div
          className="col-span-2 flex flex-col justify-center py-10 px-8"
          onClick={() => setFieldStep(KeyOfITemplateData.personalInfo)}
        >
          <h1 className="text-4xl font-bold text-zinc-700 tracking-widest">
            {data.personalInfo?.fullName || "Your Name"}
          </h1>
          <p className="uppercase text-zinc-600 font-medium text-sm tracking-widest">
            {data?.personalInfo?.profession || "Profession"}
          </p>
        </div>

        {/* Left Sidebar */}
        <aside className="col-span-1 border-r border-zinc-400 p-6 pt-0">
          {/* Contact */}
          <section
            className="mb-8"
            onClick={() => setFieldStep(KeyOfITemplateData.personalInfo)}
          >
            <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
              CONTACT
            </h2>
            <div className="space-y-2 text-sm">
              {data.personalInfo?.phone && (
                <div className="flex items-center gap-2">
                  <Phone size={14} style={{ color: colorRGB }} />
                  <span>{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo?.email && (
                <div className="flex items-center gap-2">
                  <Mail size={14} style={{ color: colorRGB }} />
                  <span>{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo?.location && (
                <div className="flex items-center gap-2">
                  <MapPin size={14} style={{ color: colorRGB }} />
                  <span>{data.personalInfo.location}</span>
                </div>
              )}
            </div>
          </section>

          {/* Education */}
          {data.educations && data.educations.length > 0 && (
            <section
              className="mb-8"
              onClick={() => setFieldStep(KeyOfITemplateData.education)}
            >
              <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                EDUCATION
              </h2>
              <div className="space-y-4 text-sm">
                {data.educations.map((edu, index) => (
                  <div key={index}>
                    <p className="font-semibold uppercase">{edu.degree}</p>
                    <p className="text-zinc-600">{edu.institution}</p>
                    <p className="text-xs text-zinc-500">
                      {formatDate(edu.graduationDate)}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {data.skills && data.skills.length > 0 && (
            <section onClick={() => setFieldStep(KeyOfITemplateData.skills)}>
              <h2 className="text-sm font-semibold tracking-widest text-zinc-600 mb-3">
                SKILLS
              </h2>
              <ul className="space-y-1 text-sm">
                {data.skills.map((skill, index) => (
                  <li key={index}>{skill}</li>
                ))}
              </ul>
            </section>
          )}
        </aside>

        {/* Right Content */}
        <main className="col-span-2 p-8 pt-0">
          {/* Summary */}
          {data.professional_summary && (
            <section
              className="mb-8"
              onClick={() =>
                setFieldStep(KeyOfITemplateData.professional_summary)
              }
            >
              <h2
                className="text-sm font-semibold tracking-widest mb-3"
                style={{ color: colorRGB }}
              >
                SUMMARY
              </h2>
              <ul className="text-gray-700 leading-relaxed whitespace-pre-line">
                {data.professional_summary.split("\n").map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Experience */}
          {data.experiences && data.experiences.length > 0 && (
            <section
              onClick={() => setFieldStep(KeyOfITemplateData.experience)}
            >
              <h2
                className="text-sm font-semibold tracking-widest mb-4"
                style={{ color: colorRGB }}
              >
                EXPERIENCE
              </h2>
              <div className="space-y-6 mb-8">
                {data.experiences.map((exp, index) => (
                  <div key={index}>
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-zinc-900">
                        {exp.title}
                      </h3>
                      <span className="text-xs text-zinc-500">
                        {formatDate(exp.startDate)} -{" "}
                        {exp.isCurrent ? "Present" : formatDate(exp.endDate!)}
                      </span>
                    </div>
                    <p className="text-sm mb-2" style={{ color: colorRGB }}>
                      {exp.organization}
                    </p>
                    {exp.description && (
                      <ul className="text-sm text-zinc-700 leading-relaxed space-y-1 overflow-ellipsis overflow-hidden">
                        {exp.description.split("\n").map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section onClick={() => setFieldStep(KeyOfITemplateData.project)}>
              <h2
                className="text-sm uppercase tracking-widest font-semibold"
                style={{ color: colorRGB }}
              >
                PROJECTS
              </h2>
              <div className="space-y-4">
                {data.projects.map((project, index) => (
                  <div key={index}>
                    <h3 className="text-md font-medium text-zinc-800 mt-3">
                      {project.name}
                    </h3>
                    <p className="text-sm mb-1" style={{ color: colorRGB }}>
                      {project.type}
                    </p>
                    {project.description && (
                      <ul className="text-sm text-zinc-700  space-y-1 overflow-ellipsis overflow-hidden">
                        {project.description.split("\n").map((line, i) => (
                          <li key={i}>{line}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
};

export default MinimalImageTemplate;
