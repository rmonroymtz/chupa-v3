import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { AccountPanel } from "@/components/account/account-panel";
import type { AccountItem, AccountUser } from "@/components/account/view-model";

const user = (overrides: Partial<AccountUser> = {}): AccountUser => ({
  name: "Carlos M.",
  company: "Comercializadora ABC",
  initials: "CM",
  ...overrides,
});

const items: AccountItem[] = [
  { icon: "package", label: "Órdenes y Facturación" },
  { icon: "file-text", label: "Cotizaciones activas", value: "4", tone: "brand" },
];

const noop = () => {};

describe("AccountPanel", () => {
  it("renders the greeting with the name and the initials", () => {
    render(<AccountPanel user={user()} items={items} onSelect={noop} onSignOut={noop} />);

    expect(screen.getByText(/Bienvenido, Carlos M\./)).toBeInTheDocument();
    expect(screen.getByText("CM")).toBeInTheDocument();
  });

  it("renders the company when present", () => {
    render(<AccountPanel user={user()} items={items} onSelect={noop} onSignOut={noop} />);

    expect(screen.getByText("Comercializadora ABC")).toBeInTheDocument();
  });

  it("omits the company line when it is null", () => {
    render(
      <AccountPanel
        user={user({ company: null })}
        items={items}
        onSelect={noop}
        onSignOut={noop}
      />,
    );

    expect(screen.queryByText("Comercializadora ABC")).not.toBeInTheDocument();
  });

  it("renders every item label, and an item's value when it has one", () => {
    render(<AccountPanel user={user()} items={items} onSelect={noop} onSignOut={noop} />);

    expect(screen.getByText("Órdenes y Facturación")).toBeInTheDocument();
    expect(screen.getByText("Cotizaciones activas")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });

  it("calls onSelect with the clicked item", () => {
    const onSelect = vi.fn();
    render(<AccountPanel user={user()} items={items} onSelect={onSelect} onSignOut={noop} />);

    screen.getByRole("menuitem", { name: /Órdenes y Facturación/ }).click();

    expect(onSelect).toHaveBeenCalledWith(items[0]);
  });

  it("calls onSignOut when Cerrar sesión is clicked", () => {
    const onSignOut = vi.fn();
    render(<AccountPanel user={user()} items={items} onSelect={noop} onSignOut={onSignOut} />);

    screen.getByRole("button", { name: /Cerrar sesión/ }).click();

    expect(onSignOut).toHaveBeenCalled();
  });
});
