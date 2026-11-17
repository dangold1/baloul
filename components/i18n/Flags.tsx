import { useId } from "react";
import type { Lang } from "@/lib/i18n/languages";

/** Israel. Decorative: the language name is always shown or announced next to it. */
function IsraelFlag() {
  return (
    <svg viewBox="0 0 220 160" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <rect width="220" height="160" fill="#fff" />
      <rect y="15" width="220" height="25" fill="#0038b8" />
      <rect y="120" width="220" height="25" fill="#0038b8" />
      <g fill="none" stroke="#0038b8" strokeWidth="5.5">
        <path d="M110 47 L138.6 96.5 H81.4 Z" />
        <path d="M110 113 L81.4 63.5 H138.6 Z" />
      </g>
    </svg>
  );
}

/** United Kingdom. Clip ids are per instance, since the flag can appear twice on a page. */
function UkFlag() {
  const id = useId();
  const all = `${id}-a`;
  const half = `${id}-h`;
  return (
    <svg viewBox="0 0 60 30" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <clipPath id={all}>
        <path d="M0 0v30h60V0z" />
      </clipPath>
      <clipPath id={half}>
        <path d="M30 15h30v15zv15H0zH0V0zV0h30z" />
      </clipPath>
      <g clipPath={`url(#${all})`}>
        <path d="M0 0v30h60V0z" fill="#012169" />
        <path d="M0 0l60 30m0-30L0 30" stroke="#fff" strokeWidth="6" />
        <path d="M0 0l60 30m0-30L0 30" clipPath={`url(#${half})`} stroke="#c8102e" strokeWidth="4" />
        <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
        <path d="M30 0v30M0 15h60" stroke="#c8102e" strokeWidth="6" />
      </g>
    </svg>
  );
}

export function Flag({ lang }: { lang: Lang }) {
  return <span className="b-flag">{lang === "he" ? <IsraelFlag /> : <UkFlag />}</span>;
}
