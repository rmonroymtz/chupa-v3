import * as React from "react";

import {
  brandIconLabels,
  brandIcons,
  type BrandIconName,
} from "@/components/icons";
import { Logo, type PaymentLogoName } from "@/components/logos";

/*
  Links, labels and hrefs taken from the live footer at chupaprecios.com.mx.
  A few are absolute and one is relative, exactly as production has them: the
  absolute ones point at pages this app does not serve yet.
*/
/** `external` opens in a new tab, the way production treats the socials. */
type FooterLink = { label: string; href: string; external?: boolean };

const helpLinks: FooterLink[] = [
  {
    label: "Preguntas Frecuentes FAQ",
    href: "https://chupaprecios.com.mx/preguntas-frecuentes",
  },
  { label: "Facturación", href: "/facturacion" },
];

/*
  Production links only Facebook and Instagram; there is no YouTube or X
  account to point at, so the other two glyphs stay in the icon layer unused.
*/
const socialLinks: { name: BrandIconName; href: string }[] = [
  {
    name: "facebook",
    href: "https://www.facebook.com/p/Chupaprecios-100070557248938",
  },
  { name: "instagram", href: "https://www.instagram.com/chupaprecios/" },
];

const aboutLinks: FooterLink[] = [
  {
    label: "Acerca de Chupaprecios",
    href: "https://chupaprecios.com.mx/acerca-de-chupaprecios",
  },
  {
    label: "Términos y Condiciones",
    href: "https://chupaprecios.com.mx/terminos-y-condiciones",
  },
  {
    label: "Política de Privacidad",
    href: "https://chupaprecios.com.mx/aviso-privacidad",
  },
  {
    label: "Propiedad Intelectual",
    href: "https://chupaprecios.com.mx/propiedad-intelectual",
  },
];

const paymentMethods: PaymentLogoName[] = [
  "visa",
  "mastercard",
  "paypal",
  "amex",
  "mercado-pago",
  "kueski",
  "oxxo",
  "spei",
];

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-body-l mb-2 font-bold text-white">{children}</h3>
  );
}

function LinkList({ title, items }: { title: string; items: FooterLink[] }) {
  return (
    <div className="flex flex-col gap-2">
      <ColumnTitle>{title}</ColumnTitle>
      <ul className="flex list-none flex-col gap-2 p-0">
        {items.map(({ label, href, external }) => (
          <li key={label}>
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              className="text-body-m text-neutral-300 no-underline hover:text-white"
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      data-slot="footer"
      className="bg-neutral-800 px-5 pt-10 pb-6 text-neutral-300 lg:px-10 lg:pt-12 lg:pb-8"
    >
      <div className="mx-auto grid max-w-outer grid-cols-1 gap-8 md:grid-cols-2 md:gap-x-10 lg:grid-cols-[1.1fr_1fr_1fr_1.2fr] lg:gap-10">
        <div className="flex flex-col gap-4 md:col-span-2 lg:col-span-1">
          <Logo name="chupaprecios-light" height={34} className="self-start" />
          <div className="flex gap-3">
            {socialLinks.map(({ name, href }) => {
              const BrandGlyph = brandIcons[name];
              return (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={brandIconLabels[name]}
                  /* Board 03: 44x44 white circle, monochrome cutout glyph. */
                  className="flex size-11 items-center justify-center rounded-full bg-white text-neutral-800 no-underline"
                >
                  <BrandGlyph width={20} height={20} />
                </a>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <LinkList title="Centro de ayuda" items={helpLinks} />
          <LinkList
            title="Redes Sociales"
            items={socialLinks.map(({ name, href }) => ({
              label: brandIconLabels[name],
              href,
              external: true,
            }))}
          />
        </div>

        <div className="flex flex-col gap-6">
          <LinkList title="Conócenos" items={aboutLinks} />
          <Logo name="amvo" height={56} className="self-start opacity-90" />
        </div>

        <div className="flex flex-col gap-6">
          {/*
            Production ships both footer variants in one document and lets CSS
            pick one. These are the standard column's hours, not the checkout
            column's — the same variant as the white wordmark and AMVO mark we
            use here.
          */}
          <div className="flex flex-col gap-2">
            <ColumnTitle>Atención a clientes</ColumnTitle>
            <p className="text-body-m m-0">
              Atención telefónica:{" "}
              <span className="font-semibold">(+52) 664 311 9682</span>
            </p>
            <p className="text-body-m m-0 font-semibold">Horario:</p>
            <p className="text-body-m m-0">
              Lunes a Sábados:{" "}
              <span className="font-semibold">08:00 a 17:00</span> (hora del
              Pacífico)
            </p>
            <p className="text-body-m m-0">
              Domingo: <span className="font-semibold">Cerrado</span>
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <ColumnTitle>Oficina central:</ColumnTitle>
            <p className="text-body-m m-0">Calle Centro Comercial 17206</p>
            <p className="text-body-m m-0">Col, Otay Constituyentes</p>
            <p className="text-body-m m-0">C.P 22457 Tijuana, BC.</p>
          </div>

          <div className="flex flex-col gap-2">
            <ColumnTitle>Centro de desarrollo tecnológico:</ColumnTitle>
            <p className="text-body-m m-0">
              Calle Montes Urales - Virreyes 424, Oficina 01A-129 Col.
            </p>
            <p className="text-body-m m-0">
              Lomas de Chapultepec V Sección, Miguel Hidalgo
            </p>
            <p className="text-body-m m-0">
              C.P. 11000, Ciudad de México, CDMX.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <ColumnTitle>Formas de pago:</ColumnTitle>
            {/*
              Footer-only adaptation: the marks are unified into one light-grey
              silhouette on the dark surface. Everywhere else they keep their
              brand colours.

              The filter keeps only the alpha channel, so `mono` swaps in the
              background-free variant for Amex, OXXO and Mercado Pago — those
              three draw their mark as light shapes over a filled background,
              and with the backdrop in place they flatten into a solid block.
            */}
            <div className="mt-1 flex flex-wrap items-center gap-3">
              {paymentMethods.map((name) => (
                <Logo
                  key={name}
                  name={name}
                  height={22}
                  mono
                  className="max-w-[46px] brightness-0 invert-[0.72]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-body-s mx-auto mt-8 max-w-outer pt-5 text-neutral-400">
        Copyright © Chupaprecios all rights reserved. Powered by
        Chupaprecios 2026
      </div>
    </footer>
  );
}
