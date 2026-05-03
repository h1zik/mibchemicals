import { SolutionSectionInner } from "@/components/solution-section-inner";
import type { SiteConfig } from "@/types/database";

export function SolutionSection({ config }: { config: SiteConfig }) {
  const steps = [
    {
      label: "Masalah",
      title: config.solution_problem_title,
      body: config.solution_problem_body,
    },
    {
      label: "Inovasi",
      title: config.solution_innovation_title,
      body: config.solution_innovation_body,
    },
    {
      label: "Solusi MIB",
      title: config.solution_mib_title,
      body: config.solution_mib_body,
    },
  ];

  return (
    <section
      className="border-y border-neutral-200 bg-white py-16 sm:py-20"
      aria-labelledby="solution-heading"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SolutionSectionInner steps={steps} />
      </div>
    </section>
  );
}
