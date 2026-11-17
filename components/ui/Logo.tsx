import { site } from "../../content/site";

/** `lazy` is for logos below the fold. */
export function Logo({ alt, className, lazy }: { alt: string; className?: string; lazy?: boolean }) {
  const { src, width, height } = site.images.logo;
  return (
    <img alt={alt} className={className} src={src} width={width} height={height} {...(lazy ? { loading: "lazy", decoding: "async" } : {})} />
  );
}
