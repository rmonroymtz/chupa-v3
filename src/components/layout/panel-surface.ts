/*
  Shared panel surface: DS radius lg (16px) on surface.subtle with elevation 3.
  Lives on its own so the header's three panels — categories, account, cart —
  can be split across files without any of them owning the token.
*/
export const panelSurface =
  "absolute z-50 rounded-xl border border-neutral-100 bg-card shadow-e3";

/** Anchors a panel under the header row it drops from. */
export const panelAnchor = "top-[calc(100%+var(--spacing)*3)]";
