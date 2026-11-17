export function Stars({ label, as: Tag = "div", className = "b-stars" }: { label: string; as?: "div" | "span"; className?: string }) {
  return (
    <Tag aria-label={label} className={className} role="img">
      ★★★★★
    </Tag>
  );
}
