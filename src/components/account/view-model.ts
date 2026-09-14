import type { IconName } from "@/components/icons";
import type { Customer } from "@/lib/magento/types";

/*
  Pure mapping from the Magento schema to what the account panel renders. No
  Next imports here on purpose, so this stays unit-testable without a DOM or
  a request context.
*/

export type AccountUser = { name: string; company: string | null; initials: string };

export function toAccountUser(customer: Customer): AccountUser {
  const firstname = customer.firstname.trim();
  const lastname = customer.lastname.trim();

  const name = lastname ? `${firstname} ${lastname[0]}.` : firstname;
  const initials = lastname
    ? `${firstname[0]}${lastname[0]}`.toUpperCase()
    : firstname[0]?.toUpperCase();

  return { name, company: companyOf(customer), initials };
}

/*
  Company lives on the address book, not on the customer — the default
  billing address is where a B2B account name comes from. Falling back to
  the first address that has one covers a customer with no billing address
  flagged yet.
*/
function companyOf(customer: Customer): string | null {
  const addresses = customer.addresses ?? [];

  const billing = addresses.find(
    (address) => address.default_billing && address.company?.trim(),
  );
  const fallback = addresses.find((address) => address.company?.trim());
  const company = (billing ?? fallback)?.company;

  return company ? company.trim() : null;
}

export type AccountItem = {
  icon: IconName;
  label: string;
  value?: string;
  tone?: "brand" | "success";
};

/*
  Placeholders until the corresponding Magento queries exist (orders,
  quotes, credit limit): the labels are real, but the values are not yet
  wired to anything.
*/
export const defaultAccountItems: AccountItem[] = [
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

export const defaultDrawerLinks = [
  "Mi Cuenta",
  "Mis Pedidos",
  "Mis Direcciones",
  "Mis Tarjetas",
  "Mis Cotizaciones",
];
