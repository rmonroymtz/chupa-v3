"use client";

import * as React from "react";

import { setCartItemQuantity } from "@/components/cart/actions";
import { MiniCart, type MiniCartLine } from "@/components/cart/mini-cart";
import { Icon } from "@/components/icons";
import { usePanel } from "@/components/ui/panel-group";

/*
  The interactive half of the cart: the trigger, the open/close wiring, and
  the dispatch of Server Actions. It receives already-mapped lines, so the
  Magento endpoint, the cart cookie and the schema never enter the client
  bundle — this file cannot even import them.
*/

export function CartMenu({
  lines,
  onCheckout,
}: {
  lines: MiniCartLine[];
  onCheckout?: () => void;
}) {
  const { isOpen, toggle, close } = usePanel("cart");
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  /*
    The server owns the cart, but a round trip per click on +/- would feel
    broken. The optimistic value renders immediately and is discarded when the
    re-rendered server data arrives — whether it agrees or not, which is what
    makes a rejected update snap back on its own.
  */
  const [optimisticLines, applyOptimistic] = React.useOptimistic(
    lines,
    (current: MiniCartLine[], change: { id: string; quantity: number }) =>
      current
        .map((line) =>
          line.id === change.id ? { ...line, qty: change.quantity } : line,
        )
        .filter((line) => line.qty > 0),
  );

  const count = optimisticLines.reduce((sum, line) => sum + line.qty, 0);

  const changeQty = (id: string, quantity: number) => {
    startTransition(async () => {
      setError(null);
      applyOptimistic({ id, quantity });

      const result = await setCartItemQuantity(id, quantity);

      if (!result.ok) {
        setError(result.message);
      }
    });
  };

  return (
    <>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggle}
        className="text-body-m inline-flex cursor-pointer items-center gap-2 text-foreground"
      >
        <Icon name="shopping-cart" size={20} />
        <span className="hidden lg:inline">Carrito ({count})</span>
      </button>

      {isOpen && (
        <MiniCart
          lines={optimisticLines}
          pending={isPending}
          error={error}
          onQty={changeQty}
          onEdit={close}
          onCheckout={onCheckout ?? close}
          onNavigate={close}
        />
      )}
    </>
  );
}
