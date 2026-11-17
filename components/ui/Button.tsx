import type { AnchorHTMLAttributes, ReactNode } from "react";
import { cx } from "../../lib/cx";

type Props = { href: string; variant?: "primary" | "secondary"; className?: string; children: ReactNode } & Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "href" | "className"
>;

export function ButtonLink({ href, variant, className, children, ...rest }: Props) {
  return (
    <a className={cx("b-btn", `b-btn-${variant ?? "primary"}`, className)} href={href} {...rest}>
      {children}
    </a>
  );
}
