"use client";

import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { SectionId, StepId } from "@/content/sections";
import { toSectionId } from "@/content/sections";
import { DOM } from "@/lib/dom";
import { readingLine, resolveStep } from "@/lib/steps";

/** A part of the home page that announced itself as a step: its id, its name in the stepper, and its element. */
export type RegisteredStep = { id: StepId; label: string; el: HTMLElement };

type StepsState = {
  steps: RegisteredStep[];
  currentStep: StepId | null;
  register: (step: RegisteredStep) => () => void;
  /** Mark a step as chosen by the visitor (a click). Scrolling does not override it until the scroll that follows has ended. */
  choose: (id: StepId) => void;
};

type ActiveSectionState = {
  activeId: SectionId | null;
  /** On a click: the scroll-spy does not override the choice while the page scrolls there. */
  setActive: (id: SectionId | null) => void;
};

/** If a click causes no scroll (the target is already in view), the lock ends after this long. */
const CLICK_LOCK_FALLBACK_MS = 1500;
/** A scrollend this soon after a click belongs to a scroll that started before it, so it does not end the lock. */
const STALE_SCROLLEND_MS = 150;
/** Fired on window for every change of step, for code outside React (analytics, scripts): detail { id, prev }. */
export const STEP_EVENT = "baloul:step";

const noop = () => {};
const StepsContext = createContext<StepsState>({
  steps: [],
  currentStep: null,
  register: () => noop,
  choose: noop,
});

const byDocumentOrder = (a: RegisteredStep, b: RegisteredStep) =>
  a.el.compareDocumentPosition(b.el) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

/**
 * The single scroll-spy of the home page (rebuilt 2026-11-10 for the stepper). Every part of the page registers
 * itself (Section, StepRegion in ./Section). On each scroll frame the current step is the last part whose top has passed
 * the reading line under the header (lib/steps.ts), so the answer depends on position only, never on the order
 * scroll events arrive in. The stepper, the top menu (aria-current) and the section tint all read this one value.
 */
export function ActiveSectionProvider({ children }: { children: React.ReactNode }) {
  const [currentStep, setCurrentStep] = useState<StepId | null>(null);
  const [steps, setSteps] = useState<RegisteredStep[]>([]);
  const registry = useRef(new Map<StepId, RegisteredStep>());
  const locked = useRef(false);
  const lockedAt = useRef(0);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const prevStep = useRef<StepId | null>(null);
  const measureRef = useRef<() => void>(noop);

  const register = useCallback((step: RegisteredStep) => {
    registry.current.set(step.id, step);
    setSteps([...registry.current.values()].sort(byDocumentOrder));
    measureRef.current();
    return () => {
      if (registry.current.get(step.id) === step) registry.current.delete(step.id);
      setSteps([...registry.current.values()].sort(byDocumentOrder));
    };
  }, []);

  const lock = useCallback(() => {
    locked.current = true;
    lockedAt.current = Date.now();
    clearTimeout(lockTimer.current);
    // No scroll followed: release quietly and keep the chosen step until the visitor scrolls.
    lockTimer.current = setTimeout(() => (locked.current = false), CLICK_LOCK_FALLBACK_MS);
  }, []);

  const choose = useCallback(
    (id: StepId) => {
      lock();
      setCurrentStep(id);
    },
    [lock],
  );

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      if (locked.current || registry.current.size === 0) return;
      const header = document.querySelector(DOM.header)?.getBoundingClientRect().bottom ?? 0;
      const boxes = [...registry.current.values()].map((s) => ({ id: s.id, top: s.el.getBoundingClientRect().top }));
      const doc = document.documentElement;
      const atBottom = scrollY > 0 && scrollY + innerHeight >= doc.scrollHeight - 2;
      const next = resolveStep(boxes, readingLine(Math.max(0, header), innerHeight), atBottom);
      if (next) setCurrentStep(next);
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure);
    };
    // The scroll a click started has landed on the chosen part. Unlock, and let the next scroll decide again.
    const onScrollEnd = () => {
      if (!locked.current || Date.now() - lockedAt.current < STALE_SCROLLEND_MS) return;
      clearTimeout(lockTimer.current);
      locked.current = false;
    };
    measureRef.current = schedule;

    // Deep links such as baloul.co.il/#process start with that step, while the browser scrolls there.
    const fromHash = toSectionId(location.hash);
    if (fromHash) choose(fromHash);
    else schedule();

    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    addEventListener("scrollend", onScrollEnd);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(lockTimer.current);
      measureRef.current = noop;
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
      removeEventListener("scrollend", onScrollEnd);
    };
  }, [choose]);

  // One window event per real change.
  useEffect(() => {
    if (currentStep === null || currentStep === prevStep.current) return;
    const prev = prevStep.current;
    prevStep.current = currentStep;
    dispatchEvent(new CustomEvent(STEP_EVENT, { detail: { id: currentStep, prev } }));
  }, [currentStep]);

  const value = useMemo(() => ({ steps, currentStep, register, choose }), [steps, currentStep, register, choose]);
  return <StepsContext.Provider value={value}>{children}</StepsContext.Provider>;
}

/** The registered steps in page order, the current one, and goTo for a click on a step link (the link itself scrolls). */
export function useSteps(): { steps: RegisteredStep[]; currentStep: StepId | null; goTo: (id: StepId) => void } {
  const { steps, currentStep, choose } = useContext(StepsContext);
  return { steps, currentStep, goTo: choose };
}

/** Announce a part of the page as a step. The label is what the stepper shows. */
export function useRegisterStep(id: StepId, label: string, ref: React.RefObject<HTMLElement | null>): void {
  const { register } = useContext(StepsContext);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    return register({ id, label, el });
  }, [id, label, ref, register]);
}

/** Safe outside the provider (service and legal pages): nothing is active and setActive does nothing. */
export function useActiveSection(): ActiveSectionState {
  const { currentStep, choose } = useContext(StepsContext);
  return useMemo(
    () => ({
      activeId: currentStep === null || currentStep === "top" ? null : currentStep,
      setActive: (id: SectionId | null) => choose(id ?? "top"),
    }),
    [currentStep, choose],
  );
}
