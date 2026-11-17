"use client";

import { useEffect, useRef } from "react";
import { cx } from "@/lib/cx";
import { useDismiss } from "@/lib/useDismiss";

/** Class names of each dialog look, so each keeps its own CSS (the lead popup fades, the modal does not). */
const SHELLS = {
  modal: { root: "b-modal", backdrop: "b-modal-backdrop", panel: "b-modal-dialog", close: "b-modal-close" },
  leadPop: { root: "b-lead-pop", backdrop: "b-lead-pop-backdrop", panel: "b-lead-pop-card", close: "b-lead-pop-close" },
} as const;

/**
 * A modal dialog: backdrop, panel and × button. Escape, the backdrop and the button close it.
 * Focus moves to the × on open (after `focusDelay` ms, for shells that fade in) and returns to the opener on close.
 * `data-dialog-open` marks it while open, so other overlays can wait (see DOM.openDialog).
 */
export function Dialog({
  variant = "modal",
  id,
  open,
  onClose,
  labelledBy,
  closeLabel,
  focusDelay = 0,
  children,
}: {
  variant?: keyof typeof SHELLS;
  id: string;
  open: boolean;
  onClose: () => void;
  labelledBy: string;
  closeLabel: string;
  focusDelay?: number;
  children: React.ReactNode;
}) {
  const shell = SHELLS[variant];
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  useDismiss(panelRef, open, onClose, { outside: false });

  useEffect(() => {
    if (!open) return;
    const opener = document.activeElement;
    const timer = window.setTimeout(() => closeRef.current?.focus(), focusDelay);
    return () => {
      window.clearTimeout(timer);
      // No scroll: the lead popup opens on scroll, so its "opener" may be far up the page.
      if (opener instanceof HTMLElement && opener !== document.body && opener.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, focusDelay]);

  return (
    <div className={cx(shell.root, open && "open")} id={id} aria-hidden={!open} data-dialog-open={open ? "" : undefined}>
      <div className={shell.backdrop} onClick={onClose} />
      <div ref={panelRef} className={shell.panel} role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
        <button ref={closeRef} type="button" className={shell.close} aria-label={closeLabel} onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
