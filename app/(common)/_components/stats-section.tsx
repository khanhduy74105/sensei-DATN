// components/stats-section.tsx
import { getHeroStats } from "@/actions/dashboard";
import { industries } from "@/data/industries";

export default async function StatsSection() {
  const stats = await getHeroStats();

  return (
    <div className="container mx-auto px-4 md:px-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
        <StatItem
          value={`${industries.length}+`}
          label="Industries Covered"
        />
        <StatItem
          value={`${stats.mockInterviewCount}+`}
          label="Interviews Conducted"
        />
        <StatItem
          value={`${stats.questionCount + stats.quizCount * 10}+`}
          label="Interview Questions"
        />
        <StatItem value={"24/7"} label="AI Support" />
      </div>
    </div>
  );
}

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center justify-center space-y-2">
      <h3 className="text-4xl font-bold">{value}</h3>
      <p className="text-muted-foreground">{label}</p>
    </div>
  );
}
