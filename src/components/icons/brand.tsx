import * as React from "react";

/*
  Brand glyphs. Lucide dropped third-party logos, so these are the only icons
  in the system drawn by hand. Same 24x24 grid as the rest of the set; they are
  solid marks, so they use fill=currentColor instead of a stroke.

  Board 03 of the v4 revision specifies these as a monochrome cutout inside a
  44x44 white circle, with no brand colours. It documents the spec only — the
  glyphs themselves live in Figma and are ported on demand, so these are still
  drawn here. That board also renames Twitter to X, hence `twitter-x`.
*/
type BrandIconProps = React.ComponentProps<"svg"> & {
  /** Accessible name. Without it the mark is hidden from assistive tech. */
  title?: string;
};

function BrandGlyph({
  title,
  children,
  width = 18,
  height = 18,
  ...props
}: BrandIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={width}
      height={height}
      fill="currentColor"
      data-slot="brand-icon"
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {children}
    </svg>
  );
}

export function FacebookIcon(props: BrandIconProps) {
  return (
    <BrandGlyph {...props}>
      <path d="M13.5 21v-7.5H16l.5-3h-3V8.5c0-.9.3-1.5 1.6-1.5H16.6V4.3c-.3 0-1.3-.2-2.4-.2-2.3 0-3.9 1.4-3.9 4v2.4H7.8v3h2.5V21z" />
    </BrandGlyph>
  );
}

export function InstagramIcon(props: BrandIconProps) {
  return (
    <BrandGlyph {...props}>
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="17" cy="7" r="1.2" />
    </BrandGlyph>
  );
}

export function YoutubeIcon(props: BrandIconProps) {
  return (
    <BrandGlyph {...props}>
      <rect
        x="2"
        y="5"
        width="20"
        height="14"
        rx="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path d="M10 9l5 3-5 3z" />
    </BrandGlyph>
  );
}

export function TwitterXIcon(props: BrandIconProps) {
  return (
    <BrandGlyph {...props}>
      <path d="M17.2 3h2.9l-6.4 7.3L21.3 21h-5.9l-4.6-6-5.3 6H2.6l6.8-7.8L2 3h6l4.2 5.5L17.2 3zm-1 16.3h1.6L8.1 4.6H6.4l9.8 14.7z" />
    </BrandGlyph>
  );
}

export const brandIcons = {
  facebook: FacebookIcon,
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  "twitter-x": TwitterXIcon,
} as const;

/** The brand's own spelling, for link text and accessible names. */
export const brandIconLabels = {
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "YouTube",
  "twitter-x": "X (Twitter)",
} as const satisfies Record<keyof typeof brandIcons, string>;

export type BrandIconName = keyof typeof brandIcons;
