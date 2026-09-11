import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MiniCart, type MiniCartLine } from "@/components/cart/mini-cart";

const line = (overrides: Partial<MiniCartLine> = {}): MiniCartLine => ({
  id: "MzE2OA==",
  title: "Taladro",
  sku: "DCK271S2",
  price: 100,
  qty: 1,
  image: null,
  href: "/amazon-dck271s2-taladro.html",
  ...overrides,
});

const noop = () => {};
const props = { onQty: noop, onEdit: noop, onCheckout: noop };

describe("MiniCart", () => {
  it("shows an empty state and disables checkout with no lines", () => {
    render(<MiniCart lines={[]} {...props} />);

    expect(screen.getByText(/carrito está vacío/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /ir a pagar/i })).toBeDisabled();
  });

  describe("long titles", () => {
    /* Marketplace feeds routinely produce 90+ characters in a 360px panel. */
    const long =
      "The Aquaponic Farmer: A Complete Guide to Building and Operating a Commercial Aquaponic System";

    it("truncates the visible text to 40 characters plus an ellipsis", () => {
      render(<MiniCart lines={[line({ title: long })]} {...props} />);

      const link = screen.getByRole("link");
      expect(link).toHaveTextContent(
        "The Aquaponic Farmer: A Complete Guide t…",
      );
    });

    /*
      The accessible name must stay complete: the visible text is cut, so
      without the title attribute a screen reader would announce a name that
      stops mid-word.
    */
    it("keeps the full title as the accessible name", () => {
      render(<MiniCart lines={[line({ title: long })]} {...props} />);

      expect(screen.getByRole("link", { name: long })).toBeInTheDocument();
    });

    it("leaves a title of exactly 40 characters alone", () => {
      const exact = "Justo cuarenta caracteres exactos aqui!!";
      expect(exact).toHaveLength(40);

      render(<MiniCart lines={[line({ title: exact })]} {...props} />);

      expect(screen.getByRole("link")).toHaveTextContent(exact);
      expect(screen.queryByText(/…/)).not.toBeInTheDocument();
    });

    /*
      These titles come from marketplace feeds and contain emoji. Slicing by
      string index would cut a surrogate pair in half and render a "�".
    */
    it("never splits an emoji across the cut", () => {
      const emoji = `Producto ${"🔥".repeat(20)} al filo del corte exacto`;

      render(<MiniCart lines={[line({ title: emoji })]} {...props} />);

      const text = screen.getByRole("link").textContent ?? "";
      expect(text).not.toMatch(
        /[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/,
      );
    });
  });

  it("renders a product with no url as plain text, not a dead link", () => {
    render(<MiniCart lines={[line({ href: null })]} {...props} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("Taladro")).toBeInTheDocument();
  });

  /* Magento replaces the quantity, so the panel must send the total. */
  it("sends the resulting total on the stepper, not a delta", async () => {
    const onQty = vi.fn();
    render(<MiniCart lines={[line({ qty: 3 })]} {...props} onQty={onQty} />);

    screen.getByRole("button", { name: /agregar uno/i }).click();
    expect(onQty).toHaveBeenCalledWith("MzE2OA==", 4);

    screen.getByRole("button", { name: /quitar uno/i }).click();
    expect(onQty).toHaveBeenCalledWith("MzE2OA==", 2);
  });

  it("locks the steppers while an update is in flight", () => {
    render(<MiniCart lines={[line()]} {...props} pending />);

    expect(screen.getByRole("button", { name: /agregar uno/i })).toBeDisabled();
    expect(screen.getByLabelText("Carrito")).toHaveAttribute("aria-busy", "true");
  });

  it("announces an error to assistive tech", () => {
    render(<MiniCart lines={[line()]} {...props} error="No se pudo actualizar." />);

    expect(screen.getByRole("alert")).toHaveTextContent("No se pudo actualizar.");
  });
});
