"use client";

import { motion } from "framer-motion";
import { MarkdownBody } from "@/components/markdown-body";

export type SolutionStep = {
  label: string;
  title: string;
  body: string;
};

const ease = [0.22, 1, 0.36, 1] as const;

export function SolutionSectionInner({ steps }: { steps: SolutionStep[] }) {
  return (
    <>
      <motion.h2
        id="solution-heading"
        className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px", amount: 0.2 }}
        transition={{ duration: 0.5, ease }}
      >
        Dari tantangan ke solusi terukur
      </motion.h2>
      <motion.p
        className="mt-3 max-w-2xl text-neutral-600"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px", amount: 0.2 }}
        transition={{ duration: 0.5, delay: 0.06, ease }}
      >
        Pendekatan berbasis solusi: memahami masalah operasional, menerapkan inovasi formulasi,
        lalu mengeksekusi bersama tim Anda.
      </motion.p>
      <motion.ol
        className="mt-12 grid gap-8 md:grid-cols-3"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "0px 0px -8% 0px", amount: 0.15 }}
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.12, delayChildren: 0.1 },
          },
        }}
      >
        {steps.map((step, stepIndex) => (
          <motion.li
            key={step.label}
            className="relative flex flex-col border-l-4 border-mib pl-6"
            variants={{
              hidden: { opacity: 0, x: -16 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.45, ease } },
            }}
          >
            <span className="text-xs font-bold uppercase tracking-wider text-mib">
              {stepIndex + 1}. {step.label}
            </span>
            <h3 className="mt-2 text-xl font-bold text-foreground">{step.title}</h3>
            <div className="mt-3 text-sm text-neutral-700">
              <MarkdownBody content={step.body} className="prose-sm" />
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </>
  );
}
