import type { Step } from "@/content/journey";

/** The four steps of working with the office, numbered. */
export function StepsList({ steps }: { steps: Step[] }) {
  return (
    <ol className="b-steps">
      {steps.map((s, i) => (
        <li key={i} className="b-step">
          <span className="b-step-num" aria-hidden="true">
            {i + 1}
          </span>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </li>
      ))}
    </ol>
  );
}
