import * as React from "react";
import type { LucideProps } from "lucide-react";

import { cn } from "@/lib/utils";
import { icons, type IconName } from "./registry";

/*
  Design System v3 renders its icons on a 24x24 grid at 1.5px stroke, and
  lucide defaults to 2px. Going through this component applies the design
  system's defaults and limits callers to the sanctioned roster.
*/
type IconProps = Omit<LucideProps, "ref"> & {
  name: IconName;
  /** Accessible name. Without it the icon is hidden from assistive tech. */
  title?: string;
};

export function Icon({
  name,
  size = 20,
  strokeWidth = 1.5,
  title,
  className,
  ...props
}: IconProps) {
  const Glyph = icons[name];

  return (
    <Glyph
      data-slot="icon"
      size={size}
      strokeWidth={strokeWidth}
      className={cn("shrink-0", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...props}
    />
  );
}
