"use client";

import { useEffect, useState } from "react";
import { asset, type Shot } from "@/app/story";

type Kind = "probe" | "video" | "image" | "slate";

const exists = (url: string) =>
  fetch(url, { method: "HEAD" }).then((r) => r.ok, () => false);

// Clip first, then the Stage 1 still, then a labelled placeholder slate.
export function ShotMedia({
  shot,
  onVideo,
}: {
  shot: Shot;
  onVideo: (el: HTMLVideoElement | null) => void;
}) {
  const [kind, setKind] = useState<Kind>("probe");
  const base = asset(`/clips/${shot.file}`);

  useEffect(() => {
    let live = true;
    (async () => {
      const next: Kind = (await exists(`${base}.mp4`))
        ? "video"
        : (await exists(`${base}.jpg`))
          ? "image"
          : "slate";
      if (live) setKind(next);
    })();
    return () => {
      live = false;
    };
  }, [base]);

  if (kind === "video")
    return (
      <video
        ref={onVideo}
        className="media-el"
        src={`${base}.mp4`}
        poster={`${base}.jpg`}
        muted
        playsInline
        preload="auto"
        aria-hidden
      />
    );

  if (kind === "image")
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="media-el" src={`${base}.jpg`} alt="" />;

  if (kind === "probe") return null;

  // No footage yet: lit backdrop following the bible's key light (Story shows the placeholder tag).
  return (
    <div className="ambient" role="img" aria-label={`ממלא מקום לסצנה ${shot.id}: ${shot.brief}`}>
      <span className="ambient-key" />
      <span className="ambient-grain" />
    </div>
  );
}
