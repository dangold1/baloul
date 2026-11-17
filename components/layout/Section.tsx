"use client";

import { useRef } from "react";
import type { SectionId, StepId } from "@/content/sections";
import { useActiveSection, useRegisterStep } from "./ActiveSection";

/** A part of the home page that counts as a step but is not a Section (the hero). The DOM id stays with the caller. */
export function StepRegion({
  step,
  label,
  className,
  labelledBy,
  children,
}: {
  step: StepId;
  label: string;
  className?: string;
  labelledBy: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useRegisterStep(step, label, ref);
  return (
    <section ref={ref} className={className} aria-labelledby={labelledBy} data-step={step}>
      {children}
    </section>
  );
}

/** A home page <section>: a step in the stepper, and active when clicked anywhere inside it. Links inside keep working. */
export function Section({
  id,
  step,
  className,
  labelledBy,
  children,
}: {
  id: SectionId;
  /** The section's name in the stepper. */
  step: string;
  className?: string;
  labelledBy: string;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  useRegisterStep(id, step, ref);
  const { activeId, setActive } = useActiveSection();
  return (
    <section
      ref={ref}
      id={id}
      className={className}
      aria-labelledby={labelledBy}
      data-step={id}
      data-active={activeId === id ? "" : undefined}
      onClick={() => setActive(id)}
    >
      {children}
    </section>
  );
}
