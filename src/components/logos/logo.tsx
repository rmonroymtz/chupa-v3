/* eslint-disable @next/next/no-img-element -- Next's image optimizer rejects
   SVG with a 400 unless dangerouslyAllowSVG is on, and 11 of these 14 assets
   are SVG. A plain img with explicit width/height keeps them all on one code
   path and still reserves the box, so there is no layout shift. */
import * as React from "react";

import { cn } from "@/lib/utils";
import { logos, type LogoName } from "./catalog";

type LogoProps = Omit<
  React.ComponentProps<"img">,
  "src" | "alt" | "width" | "height"
> & {
  name: LogoName;
  /** Rendered height in px; width follows the asset's own proportions. */
  height?: number;
  /** Overrides the brand's own spelling. Pass "" for a decorative mark. */
  alt?: string;
};

export function Logo({
  name,
  height = 32,
  alt,
  className,
  ...props
}: LogoProps) {
  const logo = logos[name];
  const width = Math.round((logo.width / logo.height) * height);

  return (
    <img
      data-slot="logo"
      src={logo.src}
      alt={alt ?? logo.label}
      width={width}
      height={height}
      className={cn("block w-auto max-w-full object-contain", className)}
      style={{ height }}
      {...props}
    />
  );
}
