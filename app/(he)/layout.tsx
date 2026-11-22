import type { Viewport } from "next";
import { SiteShell } from "@/components/layout/SiteShell";
import { baseMetadata } from "@/lib/seo";

export const metadata = baseMetadata;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f8f6f1",
};

export default function HebrewLayout({ children }: { children: React.ReactNode }) {
  return <SiteShell lang="he">{children}</SiteShell>;
}
