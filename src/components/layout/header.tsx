"use client";

import Link from "next/link";
import * as React from "react";

import { Icon, type IconName } from "@/components/icons";
import { Logo, type StoreLogoName } from "@/components/logos";
import { Container } from "@/components/layout/container";
import {
  panelAnchor,
  panelSurface,
} from "@/components/layout/panel-surface";
import { PanelGroup, usePanel } from "@/components/ui/panel-group";
import { cn } from "@/lib/utils";

/*
  Design System v3 · Header (organism), ported from
  chupaprecios-design-system/designSystem/organisms/Header to Tailwind.

  Self-contained the way the canonical organism is: one panel open at a time,
  closing on Escape and on an outside click, controlled search, and a local
  cart-quantity demo. Every dataset below is a default that real usage
  replaces through props.

  Red boundary rule: the checkout CTA and the text links go through the
  interactive red (--primary / --text-link). #FF0000 stays inside the wordmark
  asset and never reaches this file.
*/

export const defaultCategories = [
  "Electrodomésticos",
  "Hogar",
  "Electrónica",
  "Herramientas",
  "Deportes",
  "Juguetes",
  "Moda",
  "Mascotas",
  "Jardín",
  "Videojuegos",
  "Industria",
];

export type HeaderUser = { name: string; company: string; initials: string };

const defaultUser: HeaderUser = {
  name: "Carlos M.",
  company: "Empresa ABC S.A. de C.V.",
  initials: "CM",
};

export type AccountItem = {
  icon: IconName;
  label: string;
  value?: string;
  tone?: "brand" | "success";
};

const defaultAccountItems: AccountItem[] = [
  { icon: "package", label: "Órdenes y Facturación" },
  { icon: "file-text", label: "Cotizaciones activas", value: "4", tone: "brand" },
  {
    icon: "dollar-sign",
    label: "Límite de crédito",
    value: "$32,900.00",
    tone: "success",
  },
  { icon: "map-pin", label: "Direcciones de envío" },
  { icon: "credit-card", label: "Tarjetas de pago" },
  { icon: "list", label: "Mis Listas de compra" },
  { icon: "settings", label: "Perfil de usuario" },
];

const defaultDrawerLinks = [
  "Mi Cuenta",
  "Mis Pedidos",
  "Mis Direcciones",
  "Mis Tarjetas",
  "Mis Cotizaciones",
];

/*
  Store strip of the v4 revision: ChupaChoice leads and Walmart is not in it,
  which is what separates this list from the canonical `stores` catalogue.

  Each mark carries its own height because the aspect ratios run from 3:1
  (eBay) to 10:1 (Acme Tools) — one shared height would leave the wide
  wordmarks several times wider than the compact marks. Each height is measured,
  not guessed: the ink width the reference composition renders at a 1440
  viewport, divided back through the asset's own aspect ratio.
*/
type StoreMark = { name: "chupachoice" | StoreLogoName; height: number };

const storeStrip: StoreMark[] = [
  { name: "chupachoice", height: 8.5 },
  { name: "amazon", height: 18 },
  { name: "ebay", height: 16 },
  { name: "target", height: 16 },
  { name: "acme", height: 10 },
];

// ── Panels ───────────────────────────────────────────────────────────────────

function CategoriesDropdown({
  categories,
  onSelect,
}: {
  categories: string[];
  onSelect: (category: string) => void;
}) {
  return (
    <div
      role="menu"
      aria-label="Categorías"
      /*
        Column-wise fill (top to bottom, then the next column) so the first
        six categories make up the left column, exactly as the board lays it
        out. Desktop only — mobile opens the drawer instead.
      */
      className={cn(
        panelSurface,
        panelAnchor,
        "left-0 hidden min-w-[420px] grid-flow-col grid-cols-2 grid-rows-6 gap-x-8 gap-y-1 p-4 lg:grid",
      )}
    >
      {categories.map((category) => (
        <button
          key={category}
          type="button"
          role="menuitem"
          onClick={() => onSelect(category)}
          className="text-body-l cursor-pointer rounded-sm px-3 py-2 text-left whitespace-nowrap text-foreground hover:bg-muted hover:text-brand-anchor"
        >
          {category}
        </button>
      ))}
    </div>
  );
}

function AccountMenu({
  user,
  items,
  onSelect,
  onLogout,
}: {
  user: HeaderUser;
  items: AccountItem[];
  onSelect: (item: AccountItem) => void;
  onLogout: () => void;
}) {
  return (
    <div
      role="menu"
      aria-label="Mi cuenta"
      className={cn(
        panelSurface,
        panelAnchor,
        "right-0 w-[300px] overflow-hidden pb-2",
      )}
    >
      <div className="flex items-center gap-3 border-b border-neutral-100 p-4">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-anchor text-body-m font-bold text-primary-foreground"
        >
          {user.initials}
        </span>
        <span>
          <span className="block text-body-m font-bold text-foreground">
            Bienvenido, {user.name}
          </span>
          <span className="block text-caption text-muted-foreground">
            {user.company}
          </span>
        </span>
      </div>

      <ul className="m-0 list-none py-1">
        {items.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              role="menuitem"
              onClick={() => onSelect(item)}
              className="text-body-m flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-foreground hover:bg-muted"
            >
              <Icon
                name={item.icon}
                size={18}
                className="shrink-0 text-muted-foreground"
              />
              <span className="flex-1">{item.label}</span>
              {item.value && (
                <span
                  className={cn(
                    "font-bold",
                    item.tone === "success"
                      ? "text-success"
                      : "text-brand-anchor",
                  )}
                >
                  {item.value}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onLogout}
        className="text-body-m mt-1 flex w-full cursor-pointer items-center gap-3 border-t border-neutral-100 px-4 py-3 text-left font-semibold text-text-link hover:bg-muted"
      >
        <Icon name="log-out" size={18} />
        Cerrar sesión
      </button>
    </div>
  );
}

function MobileDrawer({
  categories,
  accountLinks,
  onSelect,
  onLogout,
  onClose,
}: {
  categories: string[];
  accountLinks: string[];
  onSelect: (label: string) => void;
  onLogout: () => void;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[60] flex bg-overlay lg:hidden"
    >
      <div
        role="dialog"
        aria-label="Menú"
        onClick={(event) => event.stopPropagation()}
        className="h-full w-[84vw] max-w-[340px] overflow-y-auto bg-background px-5 py-4 shadow-e4"
      >
        <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
          <Logo name="chupaprecios" height={20} />
          <button
            type="button"
            aria-label="Cerrar"
            onClick={onClose}
            className="inline-flex cursor-pointer text-foreground"
          >
            <Icon name="x" size={22} />
          </button>
        </div>

        <nav className="flex flex-col py-2">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className="cursor-pointer py-3 text-left text-base text-foreground"
            >
              {category}
            </button>
          ))}
        </nav>

        <div className="my-2 border-t border-neutral-100" />

        <nav className="flex flex-col py-2">
          {accountLinks.map((link) => (
            <button
              key={link}
              type="button"
              onClick={() => onSelect(link)}
              className="cursor-pointer py-3 text-left text-base font-semibold text-foreground"
            >
              {link}
            </button>
          ))}
          <button
            type="button"
            onClick={onLogout}
            className="cursor-pointer py-3 text-left text-base font-semibold text-text-link"
          >
            Cerrar sesión
          </button>
        </nav>
      </div>
    </div>
  );
}

// ── Header ───────────────────────────────────────────────────────────────────

/*
  The panel keys the header owns. `usePanel` takes any string to stay general,
  so this alias is what keeps a typo a compile error rather than a panel that
  silently never opens.
*/
type HeaderPanel = "categories" | "account" | "cart";

const useHeaderPanel = (panel: HeaderPanel) => usePanel(panel);

type HeaderProps = {
  categories?: string[];
  user?: HeaderUser;
  accountItems?: AccountItem[];
  drawerLinks?: string[];
  /** Mark drawn inside a pill — the store currently being compared against. */
  activeStore?: StoreMark["name"];
  /**
   * The cart, rendered elsewhere and handed in as an element.
   *
   * It arrives as a slot rather than an import because this file is a Client
   * Component: importing the Server Component that loads the cart would drag
   * the Magento endpoint and the cart cookie into the client bundle, which is
   * exactly what the split exists to prevent. Already-rendered output, on the
   * other hand, is just serializable data and crosses the boundary freely.
   */
  cartSlot?: React.ReactNode;
  onSearch?: (query: string) => void;
  onSelectCategory?: (category: string) => void;
};

export function Header(props: HeaderProps) {
  /*
    The panel rules (one open at a time, Escape, outside click) come from the
    generic PanelGroup, which also renders the <header> element so the
    outside-click boundary cannot drift from the markup. The body is a
    separate component so it can read that context with hooks.
  */
  return (
    <PanelGroup
      as="header"
      data-slot="header"
      className="relative border-b border-border bg-background text-foreground"
    >
      <HeaderBody {...props} />
    </PanelGroup>
  );
}

function HeaderBody({
  categories = defaultCategories,
  user = defaultUser,
  accountItems = defaultAccountItems,
  drawerLinks = defaultDrawerLinks,
  activeStore = "amazon",
  cartSlot,
  onSearch,
  onSelectCategory,
}: HeaderProps) {
  const [query, setQuery] = React.useState("");
  const categoriesPanel = useHeaderPanel("categories");
  const accountPanel = useHeaderPanel("account");

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch?.(query);
  };

  const selectCategory = (category: string) => {
    onSelectCategory?.(category);
    categoriesPanel.close();
  };

  return (
    <>
      <div className="text-body-s border-b border-neutral-100 px-4 py-2 text-center text-muted-foreground">
        Envío gratis en compra mínima de $1,500* · Promoción válida sólo para
        México
      </div>

      {/*
        Mobile keeps the canonical flex arrangement — menu / centred wordmark /
        actions, with the store strip wrapping onto its own row.

        From 1024px the bar sits on the shell's 12-column grid — fragments of
        90px separated by 15px gutters (--container-shell) — split 3 / 6 / 3.
        That split is what the reference composition measures out to: the
        actions cluster ends flush with the last fragment, the wordmark starts
        on the first, and the store strip lands dead on the page centre.

        Inside each cell the items stay on flex, because their spacing is a gap
        rather than a fragment boundary — Categorías sits one gutter after the
        wordmark, on no track of its own.
      */}
      <Container
        size="shell"
        className="relative flex flex-wrap items-center gap-3 py-3 lg:grid lg:grid-cols-12 lg:gap-[15px] lg:py-4"
      >
        {/*
          `contents` keeps the wordmark and Categorías as direct children of the
          mobile flex row, so their order still interleaves with the actions;
          at 1024px the wrapper materialises as the first grid cell.
        */}
        <div className="contents lg:col-span-3 lg:flex lg:items-center lg:gap-6">
          <Link
            href="/"
            aria-label="Chupaprecios"
            className="order-2 flex flex-1 items-center justify-center lg:order-none lg:flex-none lg:justify-start"
          >
            {/*
              The wordmark occupies a fixed 134x24 slot, so the bar reserves the
              same box whatever the asset does.

              134x24 is not the asset's own ratio — at 394.14x36.61 it is
              10.77:1, so 134 of width comes to 12.45 of height — and stretching
              the mark to fill the slot would distort it, which the Brand
              Identity board forbids. The mark therefore keeps its proportions at
              12px tall and the slot pads around it.

              The padding is centring rather than a literal px value: `Logo`
              renders with `w-auto`, so the browser derives the width from the
              SVG's intrinsic ratio (129.17) instead of the rounded `width`
              attribute (129). A hard-coded 2.5 each side lands the box on
              134.17; sizing the slot and centring inside it lands it on 134.
            */}
            <span className="flex h-6 w-[134px] items-center justify-center">
              <Logo name="chupaprecios" height={12} alt="" />
            </span>
          </Link>

          <div className="relative order-1 lg:order-none">
            <button
              type="button"
              aria-label="Categorías"
              aria-haspopup="menu"
              aria-expanded={categoriesPanel.isOpen}
              onClick={categoriesPanel.toggle}
              className="text-body-l inline-flex cursor-pointer items-center gap-2 font-semibold text-foreground"
            >
              <Icon name="menu" size={22} />
              <span className="hidden lg:inline">Categorías</span>
            </button>
            {categoriesPanel.isOpen && (
              <CategoriesDropdown
                categories={categories}
                onSelect={selectCategory}
              />
            )}
          </div>
        </div>

        <div
          aria-label="Tiendas disponibles"
          className="order-4 flex basis-full flex-wrap items-center justify-center gap-5 pt-2 lg:order-none lg:col-span-6 lg:basis-auto lg:flex-nowrap lg:gap-6 lg:pt-0"
        >
          {storeStrip.map(({ name, height }) =>
            name === activeStore ? (
              <span
                key={name}
                className="inline-flex items-center rounded-pill border border-border px-3 py-1"
              >
                <Logo name={name} height={height} />
              </span>
            ) : (
              <Logo key={name} name={name} height={height} />
            ),
          )}
        </div>

        <nav
          aria-label="Cuenta y carrito"
          className="relative order-3 flex items-center gap-4 lg:order-none lg:col-span-3 lg:justify-end lg:gap-6"
        >
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={accountPanel.isOpen}
            onClick={accountPanel.toggle}
            className="text-body-m inline-flex cursor-pointer items-center gap-2 text-foreground"
          >
            <Icon name="user" size={20} />
            <span className="hidden lg:inline">Mi cuenta</span>
          </button>

          {/*
            The slot sits inside this <nav> so the cart panel anchors to the
            same positioned ancestor the account menu does.
          */}
          {cartSlot}

          {accountPanel.isOpen && (
            <AccountMenu
              user={user}
              items={accountItems}
              onSelect={accountPanel.close}
              onLogout={accountPanel.close}
            />
          )}
        </nav>
      </Container>

      {/* Forma board: search is the one input on radius-pill, not radius-lg. */}
      <Container size="shell" className="pb-4 lg:pb-5">
        <form onSubmit={submitSearch} role="search">
          <label className="flex h-12 w-full items-center gap-3 rounded-pill border border-border bg-muted px-5 focus-within:border-ring focus-within:bg-background">
            <Icon name="search" size={18} className="shrink-0 text-neutral-400" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Ingresa ASIN, SKU, Nombre o URL del producto"
              aria-label="Buscar productos"
              className="text-body-l flex-1 border-none bg-transparent text-foreground outline-none placeholder:text-neutral-400"
            />
          </label>
        </form>
      </Container>

      {categoriesPanel.isOpen && (
        <MobileDrawer
          categories={categories}
          accountLinks={drawerLinks}
          onSelect={selectCategory}
          onLogout={categoriesPanel.close}
          onClose={categoriesPanel.close}
        />
      )}
    </>
  );
}
