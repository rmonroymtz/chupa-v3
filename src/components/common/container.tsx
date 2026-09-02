import * as React from "react";

import { cn } from "@/lib/utils";

/*
  Design System v3 layout: 1200px of content with side margins of 16 / 24 / 32
  at mobile / tablet (768) / desktop (1024). `max-w-page` caps the outer box at
  1264px because Tailwind uses border-box, so the padding has to fit inside the
  cap for the content to land on 1200.
*/
const containerSizes = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-page",
  full: "max-w-none",
} as const;

type ContainerProps = React.ComponentProps<"div"> & {
  size?: keyof typeof containerSizes;
};

export function Container({
  className,
  size = "lg",
  ...props
}: ContainerProps) {
  return (
    <div
      data-slot="container"
      className={cn(
        "mx-auto w-full px-4 md:px-6 lg:px-8",
        containerSizes[size],
        className,
      )}
      {...props}
    />
  );
}
