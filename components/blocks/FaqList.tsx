import type { Faq } from "@/content/faq";

/** Questions as native <details>. A shared name keeps one open at a time. */
export function FaqList({ faqs, name }: { faqs: Faq[]; name: string }) {
  return (
    <div className="b-faq">
      {faqs.map((f, i) => (
        <details key={i} className="b-faq-item" name={name}>
          <summary>{f.question}</summary>
          <div className="b-faq-answer">
            <p>{f.answer}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
