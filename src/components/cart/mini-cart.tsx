"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Icon } from "@/components/icons";
import { panelAnchor, panelSurface } from "@/components/layout/panel-surface";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/*
  Presentational mini-cart panel. It knows nothing about Magento, cookies, or
  Server Actions — it renders lines and calls back. That is what keeps it
  usable from the header, a checkout drawer, or a Storybook story alike.

  The view model below is deliberately not Magento's `Cart` shape: mapping
  happens once, at the server boundary in `cart-data.tsx`, so a backend swap
  never reaches this file.
*/

export type MiniCartLine = {
  /** `cart_item_uid` upstream — the handle for quantity updates. */
  id: string;
  title: string;
  sku: string;
  price: number;
  qty: number;
  /** Absolute URL, or null when the catalogue has no image for the product. */
  image: string | null;
  /** Product page path, or null when the catalogue gives nothing to link to. */
  href: string | null;
};

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

/*
  Catalogue titles run long — the marketplace feeds routinely produce 90+
  characters — and the panel is a fixed 360px. Cutting at a character count
  rather than with `truncate` keeps every row the same height whatever the
  container does.
*/
const TITLE_MAX_CHARS = 40;

function truncate(text: string, max = TITLE_MAX_CHARS): string {
  /*
    Split by code point, not by `.length`. A string index counts UTF-16 units,
    so slicing there can cut an emoji in half and leave a lone surrogate —
    these titles come from marketplace feeds and do contain them.
  */
  const glyphs = Array.from(text);

  if (glyphs.length <= max) return text;

  /* Trimmed so a cut landing on a space does not render "word …". */
  return `${glyphs.slice(0, max).join("").trimEnd()}\u2026`;
}

export function MiniCart({
  lines,
  pending = false,
  error,
  onQty,
  onEdit,
  onCheckout,
  onNavigate,
}: {
  lines: MiniCartLine[];
  /** A quantity change is in flight; the panel dims rather than jumping. */
  pending?: boolean;
  error?: string | null;
  onQty: (id: string, quantity: number) => void;
  onEdit: () => void;
  onCheckout: () => void;
  /** Fired when a line navigates away, so the panel can close behind it. */
  onNavigate?: () => void;
}) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const count = lines.reduce((sum, line) => sum + line.qty, 0);

  return (
    <div
      aria-label="Carrito"
      aria-busy={pending}
      className={cn(
        panelSurface,
        panelAnchor,
        "right-0 w-[360px] p-4",
        pending && "opacity-60",
      )}
    >
      <div className="flex items-baseline justify-between border-b border-neutral-100 pb-3">
        <span className="text-body-m font-bold tracking-[0.02em] text-foreground">
          CARRITO ({count} artículos)
        </span>
        <button
          type="button"
          onClick={onEdit}
          className="text-body-s cursor-pointer font-semibold text-text-link"
        >
          Editar carrito
        </button>
      </div>

      {error && (
        <p
          role="alert"
          className="text-body-s m-0 border-b border-neutral-100 py-3 text-destructive"
        >
          {error}
        </p>
      )}

      {lines.length === 0 ? (
        <p className="text-body-s m-0 py-8 text-center text-muted-foreground">
          Tu carrito está vacío.
        </p>
      ) : (
        <ul className="m-0 list-none p-0">
          {lines.map((line) => (
            <li
              key={line.id}
              className="flex gap-3 border-b border-neutral-100 py-3"
            >
              {/*
                The alt is empty on purpose: the product name sits right next
                to it as real text, so announcing the image would repeat it.
                A product with no catalogue image keeps the plain block, which
                also holds the layout while the image loads.
              */}
              {line.image ? (
                <Image
                  src={line.image}
                  alt=""
                  width={48}
                  height={48}
                  className="size-12 shrink-0 rounded-sm bg-surface-muted object-contain"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="size-12 shrink-0 rounded-sm bg-surface-muted"
                />
              )}
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                {/*
                  Both attributes, and neither is redundant.

                  A link's accessible name comes from its CONTENT; `title` is
                  only a fallback for when there is none. With the visible text
                  cut to 40 characters, `title` alone would leave a screen
                  reader announcing a name that stops mid-word, so `aria-label`
                  carries the full title and `title` stays for the mouse
                  tooltip. The visible text remains a prefix of the accessible
                  name, which is what WCAG 2.5.3 asks for.

                  A product with no url_key renders as plain text rather than
                  a dead link.
                */}
                {line.href ? (
                  <Link
                    href={line.href}
                    aria-label={line.title}
                    title={line.title}
                    onClick={onNavigate}
                    className="text-body-s leading-[1.3] text-foreground hover:text-brand-anchor hover:underline"
                  >
                    {truncate(line.title)}
                  </Link>
                ) : (
                  <span
                    title={line.title}
                    className="text-body-s leading-[1.3] text-foreground"
                  >
                    {truncate(line.title)}
                  </span>
                )}
                <span className="text-[11px] text-muted-foreground">
                  SKU# {line.sku}
                </span>
                <div className="mt-0.5 inline-flex items-center gap-3 self-start rounded-sm border border-border px-2 py-0.5">
                  {/*
                    Magento replaces the quantity rather than adding to it, so
                    these send the resulting total, never a delta.
                  */}
                  <button
                    type="button"
                    aria-label="Quitar uno"
                    disabled={pending}
                    onClick={() => onQty(line.id, line.qty - 1)}
                    className="inline-flex cursor-pointer text-foreground disabled:cursor-not-allowed"
                  >
                    <Icon name="minus" size={14} />
                  </button>
                  <span className="text-body-s min-w-3.5 text-center">
                    {line.qty}
                  </span>
                  <button
                    type="button"
                    aria-label="Agregar uno"
                    disabled={pending}
                    onClick={() => onQty(line.id, line.qty + 1)}
                    className="inline-flex cursor-pointer text-foreground disabled:cursor-not-allowed"
                  >
                    <Icon name="plus" size={14} />
                  </button>
                </div>
              </div>
              <span className="text-body-m font-semibold whitespace-nowrap text-foreground">
                {mxn.format(line.price)}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="text-body-l flex justify-between pt-3 pb-2 font-bold">
        <span>Subtotal ({count} art.):</span>
        <span>{mxn.format(subtotal)} MXN</span>
      </div>

      <p className="text-caption m-0 mb-3 flex items-center justify-center gap-1 text-success">
        <Icon name="check" size={14} /> Envío gratis en pedidos consolidados
        aplicado
      </p>

      <Button
        size="lg"
        className="w-full"
        disabled={pending || lines.length === 0}
        onClick={onCheckout}
      >
        Ir a pagar
      </Button>
    </div>
  );
}
