import { Industry } from "@/data/industries";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function entriesToMarkdown(entries: any[], type: string) {
  if (!entries?.length) return "";

  return (
    `## ${type}\n\n` +
    entries
      .map((entry) => {
        const dateRange = entry.current
          ? `${entry.startDate} - Present`
          : `${entry.startDate} - ${entry.endDate}`;
        return `### ${entry.title} @ ${entry.organization}\n${dateRange}\n\n${entry.description}`;
      })
      .join("\n\n")
  );
}

export function toCapitalCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(' ');
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[/]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function parseIndustryLabel(
  value: string,
  industries: Industry[]
): string {
  if (!value) return "";

  const [parentId, subKey] = value.split("---");
  if (!parentId || !subKey) return value;

  const parent = industries.find(i => i.id === parentId);
  if (!parent) return value;

  const subLabel = parent.subIndustries.find(
    s => slugify(s) === subKey
  );

  if (!subLabel) return parent.name;

  return `${parent.name} - ${subLabel}`;
}