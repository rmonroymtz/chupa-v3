"use client";

import Link from "next/link";
import * as React from "react";

import { Icon, type IconName } from "@/components/icons";
import { Logo, type StoreLogoName } from "@/components/logos";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
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

const mxn = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
});

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

export type CartItem = {
  id: string;
  title: string;
  sku: string;
  price: number;
  qty: number;
};

const defaultCart: CartItem[] = [
  {
    id: "dck271s2",
    title: "DEWALT Kit de perforación 20 MAX",
    sku: "DCK271S2",
    price: 4278,
    qty: 1,
  },
  {
    id: "gks55-27",
    title: 'Bosch Sierra circular 7-1/4"',
    sku: "GKS55-27",
    price: 2149.5,
    qty: 1,
  },
  {
    id: "06-9100",
    title: "3M Careta de soldar 9100 con casco",
    sku: "06-9100-30SW",
    price: 9840,
    qty: 1,
  },
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

/*
  Shared panel surface: DS radius lg (16px) on surface.subtle with elevation 3.
*/
const panelSurface =
  "absolute z-50 rounded-xl border border-neutral-100 bg-card shadow-e3";

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
        "top-[calc(100%+var(--spacing)*3)] left-0 hidden min-w-[420px] grid-flow-col grid-cols-2 grid-rows-6 gap-x-8 gap-y-1 p-4 lg:grid",
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
        "top-[calc(100%+var(--spacing)*3)] right-0 w-[300px] overflow-hidden pb-2",
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

function MiniCart({
  items,
  onQty,
  onEdit,
  onCheckout,
}: {
  items: CartItem[];
  onQty: (id: string, delta: number) => void;
  onEdit: () => void;
  onCheckout: () => void;
}) {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
  const count = items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <div
      aria-label="Carrito"
      className={cn(
        panelSurface,
        "top-[calc(100%+var(--spacing)*3)] right-0 w-[360px] p-4",
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

      <ul className="m-0 list-none p-0">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-3 border-b border-neutral-100 py-3"
          >
            <span
              aria-hidden="true"
              className="size-12 shrink-0 rounded-sm bg-surface-muted"
            />
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <span className="text-body-s leading-[1.3] text-foreground">
                {item.title}
              </span>
              <span className="text-[11px] text-muted-foreground">
                SKU# {item.sku}
              </span>
              <div className="mt-0.5 inline-flex items-center gap-3 self-start rounded-sm border border-border px-2 py-0.5">
                <button
                  type="button"
                  aria-label="Quitar uno"
                  onClick={() => onQty(item.id, -1)}
                  className="inline-flex cursor-pointer text-foreground"
                >
                  <Icon name="minus" size={14} />
                </button>
                <span className="text-body-s min-w-3.5 text-center">
                  {item.qty}
                </span>
                <button
                  type="button"
                  aria-label="Agregar uno"
                  onClick={() => onQty(item.id, 1)}
                  className="inline-flex cursor-pointer text-foreground"
                >
                  <Icon name="plus" size={14} />
                </button>
              </div>
            </div>
            <span className="text-body-m font-semibold whitespace-nowrap text-foreground">
              {mxn.format(item.price)}
            </span>
          </li>
        ))}
      </ul>

      <div className="text-body-l flex justify-between pt-3 pb-2 font-bold">
        <span>Subtotal ({count} art.):</span>
        <span>{mxn.format(subtotal)} MXN</span>
      </div>

      <p className="text-caption m-0 mb-3 flex items-center justify-center gap-1 text-success">
        <Icon name="check" size={14} /> Envío gratis en pedidos consolidados
        aplicado
      </p>

      <Button size="lg" className="w-full" onClick={onCheckout}>
        Ir a pagar
      </Button>
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

type Panel = "categories" | "account" | "cart";

type HeaderProps = {
  categories?: string[];
  user?: HeaderUser;
  accountItems?: AccountItem[];
  drawerLinks?: string[];
  cartItems?: CartItem[];
  /** Mark drawn inside a pill — the store currently being compared against. */
  activeStore?: StoreMark["name"];
  onSearch?: (query: string) => void;
  onSelectCategory?: (category: string) => void;
  onCheckout?: () => void;
};

export function Header({
  categories = defaultCategories,
  user = defaultUser,
  accountItems = defaultAccountItems,
  drawerLinks = defaultDrawerLinks,
  cartItems = defaultCart,
  activeStore = "amazon",
  onSearch,
  onSelectCategory,
  onCheckout,
}: HeaderProps) {
  const [openPanel, setOpenPanel] = React.useState<Panel | null>(null);
  const [query, setQuery] = React.useState("");
  const [cart, setCart] = React.useState(cartItems);
  const rootRef = React.useRef<HTMLElement>(null);

  const cartCount = React.useMemo(
    () => cart.reduce((sum, i) => sum + i.qty, 0),
    [cart],
  );

  const close = React.useCallback(() => setOpenPanel(null), []);
  const toggle = (panel: Panel) =>
    setOpenPanel((current) => (current === panel ? null : panel));

  /* One panel at a time: Escape and any click outside the header close it. */
  React.useEffect(() => {
    if (!openPanel) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
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

  const submitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    onSearch?.(query);
  };

  const selectCategory = (category: string) => {
    onSelectCategory?.(category);
    close();
  };

  const changeQty = (id: string, delta: number) =>
    setCart((items) =>
      items.map((i) =>
        i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i,
      ),
    );

  return (
    <header
      ref={rootRef}
      data-slot="header"
      className="relative border-b border-border bg-background text-foreground"
    >
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
            aria-expanded={openPanel === "categories"}
            onClick={() => toggle("categories")}
            className="text-body-l inline-flex cursor-pointer items-center gap-2 font-semibold text-foreground"
          >
            <Icon name="menu" size={22} />
            <span className="hidden lg:inline">Categorías</span>
          </button>
          {openPanel === "categories" && (
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
            aria-expanded={openPanel === "account"}
            onClick={() => toggle("account")}
            className="text-body-m inline-flex cursor-pointer items-center gap-2 text-foreground"
          >
            <Icon name="user" size={20} />
            <span className="hidden lg:inline">Mi cuenta</span>
          </button>
          <button
            type="button"
            aria-haspopup="menu"
            aria-expanded={openPanel === "cart"}
            onClick={() => toggle("cart")}
            className="text-body-m inline-flex cursor-pointer items-center gap-2 text-foreground"
          >
            <Icon name="shopping-cart" size={20} />
            <span className="hidden lg:inline">Carrito ({cartCount})</span>
          </button>

          {openPanel === "account" && (
            <AccountMenu
              user={user}
              items={accountItems}
              onSelect={close}
              onLogout={close}
            />
          )}
          {openPanel === "cart" && (
            <MiniCart
              items={cart}
              onQty={changeQty}
              onEdit={close}
              onCheckout={onCheckout ?? close}
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

      {openPanel === "categories" && (
        <MobileDrawer
          categories={categories}
          accountLinks={drawerLinks}
          onSelect={selectCategory}
          onLogout={close}
          onClose={close}
        />
      )}
    </header>
  );
}
