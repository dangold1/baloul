import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BALOUL | פיננסים • פנסיה • ביטוח",
    short_name: "BALOUL",
    start_url: "/",
    scope: "/",
    display: "browser",
    lang: "he",
    dir: "rtl",
    background_color: "#ffffff",
    theme_color: "#071a2d",
    icons: [
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/icon-512.webp", sizes: "512x512", type: "image/webp" },
    ],
  };
}
