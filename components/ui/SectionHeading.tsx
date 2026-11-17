/** Small section label above a heading ("מרכז ידע", "לקוחות מספרים"...). */
export function Eyebrow({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <p className="b-eyebrow" style={style}>
      {children}
    </p>
  );
}

/** Eyebrow, heading and lead paragraph, the same way in every section. */
export function SectionHead({ eyebrow, title, titleId, lead }: { eyebrow: string; title: string; titleId: string; lead?: string }) {
  return (
    <div className="b-section-head">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={titleId}>{title}</h2>
      {lead && <p className="b-lead">{lead}</p>}
    </div>
  );
}
