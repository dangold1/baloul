import type { Metadata, Viewport } from "next";
import { Frank_Ruhl_Libre, Heebo } from "next/font/google";
import "./globals.css";

const display = Frank_Ruhl_Libre({
  variable: "--font-display",
  subsets: ["hebrew", "latin"],
  weight: ["500", "700"],
});

const text = Heebo({
  variable: "--font-text",
  subsets: ["hebrew", "latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "BALOUL · בית פיננסי",
  description: "הסיפור של תרנגול אחד: מהמטבע הראשון, דרך הקופה ושוק ההון, ועד לול משלו. ניהול הון וביטוח.",
};

export const viewport: Viewport = {
  themeColor: "#050C1A",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="he" dir="rtl" className={`${display.variable} ${text.variable}`}>
      <body>{children}</body>
    </html>
  );
}
