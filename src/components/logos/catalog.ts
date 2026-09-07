/*
  Design System v3 logo catalog — third-party brand assets served from
  /public/logos.

  Usage rule from the "Brand Identity" board: these marks keep their original
  brand colours, with no recolouring and no distortion of proportions. Target's
  red in particular must never be swapped for the Chupaprecios CTA red. The one
  sanctioned exception is the footer, where payment marks are unified into a
  grey silhouette on the dark surface — that treatment is applied by the footer,
  never baked in here.

  `width`/`height` are the asset's intrinsic size, read from the file. `Logo`
  scales them to the requested height so the browser can reserve the right box
  and nothing shifts while the image loads.
*/
export type LogoEntry = {
  /** Accessible name, and the brand's own spelling. */
  label: string;
  src: string;
  width: number;
  height: number;
  /*
    Variant with the full-bleed background removed. Only the marks that draw
    themselves as light shapes over a filled background need one: the footer's
    grey silhouette filter keeps just the alpha channel, so without it they
    flatten into a solid block.
  */
  monoSrc?: string;
};

export const storeLogos = {
  amazon: { label: "Amazon", src: "/logos/amazon.svg", width: 92.67, height: 27.93 },
  ebay: { label: "eBay", src: "/logos/ebay.svg", width: 75.8, height: 30.37 },
  walmart: { label: "Walmart", src: "/logos/walmart.png", width: 1200, height: 285 },
  target: { label: "Target", src: "/logos/target.svg", width: 148, height: 32 },
  acme: { label: "Acme Tools", src: "/logos/acme.svg", width: 148, height: 15 },
} satisfies Record<string, LogoEntry>;

export const paymentLogos = {
  visa: { label: "Visa", src: "/logos/visa.png", width: 1280, height: 416 },
  mastercard: {
    label: "Mastercard",
    src: "/logos/mastercard.svg",
    width: 482.51,
    height: 382.51,
  },
  amex: {
    label: "American Express",
    src: "/logos/amex.svg",
    monoSrc: "/logos/amex-mono.svg",
    width: 58,
    height: 40,
  },
  paypal: { label: "PayPal", src: "/logos/paypal.svg", width: 800, height: 800 },
  "mercado-pago": {
    label: "Mercado Pago",
    src: "/logos/mercado-pago.svg",
    monoSrc: "/logos/mercado-pago-mono.svg",
    width: 111,
    height: 30,
  },
  oxxo: {
    label: "OXXO",
    src: "/logos/oxxo.svg",
    monoSrc: "/logos/oxxo-mono.svg",
    width: 885.83,
    height: 448.9,
  },
  spei: { label: "SPEI", src: "/logos/spei.svg", width: 2500, height: 833 },
  kueski: { label: "Kueski Pay", src: "/logos/kueski.svg", width: 300, height: 60 },
} satisfies Record<string, LogoEntry>;

export const shippingLogos = {
  estafeta: {
    label: "Estafeta",
    src: "/logos/estafeta.svg",
    width: 6834.46,
    height: 1080,
  },
} satisfies Record<string, LogoEntry>;

export const brandLogos = {
  /*
    Own brand, added by the v4 revision: "Chupa" in the identity red #FF0000,
    "Choice" in black. A real asset, not a placeholder — and the black half
    means it needs a light surface.
  */
  chupachoice: {
    label: "ChupaChoice",
    src: "/brand/chupachoice.svg",
    width: 101,
    height: 12,
  },
  chupaprecios: {
    label: "Chupaprecios",
    src: "/brand/chupaprecios.svg",
    width: 394.14,
    height: 36.61,
  },
  "chupaprecios-light": {
    label: "Chupaprecios",
    src: "/brand/chupaprecios-light.svg",
    width: 394.14,
    height: 36.61,
  },
  amvo: { label: "AMVO", src: "/brand/amvo.svg", width: 171.49, height: 102.33 },
} satisfies Record<string, LogoEntry>;

export const logos = {
  ...storeLogos,
  ...paymentLogos,
  ...shippingLogos,
  ...brandLogos,
};

export type LogoName = keyof typeof logos;
export type StoreLogoName = keyof typeof storeLogos;
export type PaymentLogoName = keyof typeof paymentLogos;

export const logoNames = Object.keys(logos) as LogoName[];
