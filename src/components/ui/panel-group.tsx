"use client";

import * as React from "react";

/*
  A group of panels where only one is open at a time.

  Nothing here knows about the header, the cart, or any particular panel: the
  keys are plain strings, so a filter bar, a toolbar, or a set of popovers can
  use the same rules. The three behaviours it guarantees are the ones that are
  tedious to get right and easy to forget:

    - opening one panel closes the others
    - Escape closes the open panel
    - a click outside the group closes the open panel

  The provider renders the group's wrapper element rather than a Fragment, and
  that is deliberate. The outside-click test needs a DOM boundary; handing the
  caller a ref to attach would make a forgotten ref fail silently, with the
  panel simply never closing. Pass `as` to choose the tag.
*/

type PanelGroupValue = {
  openPanel: string | null;
  toggle: (panel: string) => void;
  close: () => void;
};

const PanelGroupContext = React.createContext<PanelGroupValue | null>(null);

/**
 * Wires one panel to its group.
 *
 * The key is a plain string to keep the primitive general. Where a fixed set
 * of panels exists, declare a typed alias next to it — one line, and typos
 * become compile errors again:
 *
 *     const useHeaderPanel = (panel: "categories" | "account" | "cart") =>
 *       usePanel(panel);
 */
export function usePanel(panel: string) {
  const context = React.useContext(PanelGroupContext);

  if (!context) {
    throw new Error("usePanel must be used inside <PanelGroup>");
  }

  const { openPanel, toggle, close } = context;

  return React.useMemo(
    () => ({
      isOpen: openPanel === panel,
      toggle: () => toggle(panel),
      close,
    }),
    [openPanel, panel, toggle, close],
  );
}

/*
  Typed as div props because every element this renders in practice — header,
  nav, section, div — shares the same HTML attribute surface. `as` changes the
  tag, not the contract.
*/
type PanelGroupProps = React.ComponentPropsWithoutRef<"div"> & {
  as?: React.ElementType;
};

export function PanelGroup({
  as: Element = "div",
  children,
  ...rest
}: PanelGroupProps) {
  const [openPanel, setOpenPanel] = React.useState<string | null>(null);
  const rootRef = React.useRef<HTMLElement | null>(null);

  const close = React.useCallback(() => setOpenPanel(null), []);
  const toggle = React.useCallback(
    (panel: string) =>
      setOpenPanel((current) => (current === panel ? null : panel)),
    [],
  );

  React.useEffect(() => {
    if (!openPanel) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    /*
      `mousedown` rather than `click`: a click that starts inside the panel and
      ends outside it — a drag over a scrollbar, or selecting text — would
      otherwise close the panel mid-gesture.
    */
    const onDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) close();
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [openPanel, close]);

  const value = React.useMemo(
    () => ({ openPanel, toggle, close }),
    [openPanel, toggle, close],
  );

  return (
    <PanelGroupContext.Provider value={value}>
      <Element ref={rootRef} {...rest}>
        {children}
      </Element>
    </PanelGroupContext.Provider>
  );
}
