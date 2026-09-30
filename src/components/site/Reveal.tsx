import { motion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Reveal className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <span className="mb-3 inline-block rounded-full bg-primary-soft px-4 py-1.5 text-xs font-bold text-primary">
          {eyebrow}
        </span>
      )}
      <h2 className="text-2xl leading-tight sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-4 text-base leading-8 text-muted-foreground">{subtitle}</p>}
    </Reveal>
  );
}
