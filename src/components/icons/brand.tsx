import * as React from "react";

/*
  Brand glyphs. Lucide dropped third-party logos, so these are the only icons
  in the system drawn by hand. Same 24x24 grid as the rest of the set; they are
  solid marks, so they use fill=currentColor instead of a stroke.
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

export function TwitterIcon(props: BrandIconProps) {
  return (
    <BrandGlyph {...props}>
      <path d="M22 5.9c-.7.3-1.5.5-2.3.6.8-.5 1.5-1.3 1.8-2.3-.8.5-1.7.8-2.6 1a4 4 0 0 0-6.9 3.7A11.3 11.3 0 0 1 3.7 4.6a4 4 0 0 0 1.2 5.3c-.6 0-1.2-.2-1.8-.5a4 4 0 0 0 3.2 3.9c-.5.1-1.1.2-1.7.1a4 4 0 0 0 3.7 2.8A8 8 0 0 1 2 17.9a11.3 11.3 0 0 0 6.1 1.8c7.4 0 11.4-6.1 11.4-11.4v-.5c.8-.6 1.5-1.3 2-2.1z" />
    </BrandGlyph>
  );
}

export const brandIcons = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
  Youtube: YoutubeIcon,
  Twitter: TwitterIcon,
} as const;

export type BrandIconName = keyof typeof brandIcons;
