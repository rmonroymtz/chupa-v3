import * as React from "react";

import { brandIcons, type BrandIconName } from "@/components/icons";
import { Logo, type PaymentLogoName } from "@/components/logos";

const helpLinks = [
  "Preguntas Frecuentes (FAQs)",
  "Devoluciones y reembolsos",
  "Política de Calidad",
  "Información de aduanas",
];

const socialLinks: BrandIconName[] = [
  "Facebook",
  "Instagram",
  "Youtube",
  "Twitter",
];

const aboutLinks = [
  "¿Qué es CHUPAPRECIOS?",
  "Información corporativa",
  "Acerca de Chupaprecios",
  "Términos y Condiciones",
  "Aviso de Privacidad",
  "Propiedad Intelectual",
];

const paymentMethods: PaymentLogoName[] = [
  "visa",
  "mastercard",
  "paypal",
  "oxxo",
  "amex",
  "spei",
];

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-body-l mb-2 font-bold text-white">{children}</h3>
  );
}

function LinkList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="flex flex-col gap-2">
      <ColumnTitle>{title}</ColumnTitle>
      <ul className="flex list-none flex-col gap-2 p-0">
        {items.map((item) => (
          <li key={item}>
            <a
              href="#"
              className="text-body-m text-neutral-300 no-underline hover:text-white"
            >
              {item}
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
            {socialLinks.map((name) => {
              const BrandGlyph = brandIcons[name];
              return (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className="flex size-[34px] items-center justify-center rounded-full bg-white text-neutral-800 no-underline"
                >
                  <BrandGlyph />
                </a>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <LinkList title="Centro de ayuda" items={helpLinks} />
          <LinkList title="Redes sociales" items={socialLinks} />
        </div>

        <div className="flex flex-col gap-6">
          <LinkList title="Conócenos" items={aboutLinks} />
          <Logo name="amvo" height={56} className="self-start opacity-90" />
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <ColumnTitle>Atención a clientes</ColumnTitle>
            <p className="text-body-m m-0">
              Atención telefónica: (+52) 664 311 9682
            </p>
            <p className="text-body-m m-0">
              Lunes a Sábados de 09:00hs a 18:00hs
            </p>
            <p className="text-body-m m-0">Domingos de 10:00hs a 16:00hs</p>
          </div>

          <div className="flex flex-col gap-2">
            <ColumnTitle>Dirección:</ColumnTitle>
            <p className="text-body-m m-0">Calle Centro Comercial 17206</p>
            <p className="text-body-m m-0">Col, Otay Constituyentes</p>
            <p className="text-body-m m-0">C.P 22457 Tijuana, BC.</p>
          </div>

          <div className="flex flex-col gap-2">
            <ColumnTitle>Formas de pago:</ColumnTitle>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              {paymentMethods.map((name) => (
                <Logo
                  key={name}
                  name={name}
                  height={22}
                  /* Footer-only adaptation: the marks are unified into one
                     light-grey silhouette on the dark surface. Everywhere else
                     they keep their brand colours. */
                  className="max-w-[46px] brightness-0 invert-[0.72]"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-body-s mx-auto mt-8 max-w-outer pt-5 text-neutral-400">
        Copyright © Chupaprecios all rights reserved.
      </div>
    </footer>
  );
}
