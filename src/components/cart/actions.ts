"use server";

import { revalidatePath } from "next/cache";

import { readCartId, writeCartId } from "@/lib/data/cookies";
import {
  AddToCartError,
  addProductsToCart,
  createEmptyCart,
  updateCartItems,
} from "@/lib/magento/cart";

/*
  Every cart mutation lives here, and only here.

  This is the one place allowed to write the cart cookie: setting a cookie
  during Server Component rendering is not supported, so `cart-data.tsx` can
  only ever read it. A guest therefore gets a Magento cart lazily, on the
  first add — not on page load — which also means a visitor who never adds
  anything never costs a cart record.
*/

export type CartActionResult =
  | { ok: true }
  | { ok: false; message: string; rejectedSkus?: string[] };

/* The header renders in the root layout, so the whole layout re-renders. */
function refreshCart() {
  revalidatePath("/", "layout");
}

async function requireCartId(): Promise<string> {
  const existing = await readCartId();

  if (existing) return existing;

  const created = await createEmptyCart();
  await writeCartId(created);
  return created;
}

export async function addSkuToCart(
  sku: string,
  quantity = 1,
): Promise<CartActionResult> {
  try {
    const cartId = await requireCartId();

    try {
      await addProductsToCart({ cartId, cartItems: [{ sku, quantity }] });
    } catch (error) {
      /*
        The cookie pointed at a cart Magento no longer has. That is not the
        shopper's problem: mint a fresh cart and replay the add once.
      */
      if (error instanceof AddToCartError && error.isStaleCart) {
        const replacement = await createEmptyCart();
        await writeCartId(replacement);
        await addProductsToCart({
          cartId: replacement,
          cartItems: [{ sku, quantity }],
        });
      } else {
        throw error;
      }
    }

    refreshCart();
    return { ok: true };
  } catch (error) {
    return toResult(error, "No pudimos agregar el producto a tu carrito.");
  }
}

export async function setCartItemQuantity(
  itemUid: string,
  quantity: number,
): Promise<CartActionResult> {
  try {
    const cartId = await readCartId();

    if (!cartId) {
      return { ok: false, message: "Tu carrito ya no está disponible." };
    }

    /* Magento treats 0 as "remove this line", which is exactly what we want. */
    await updateCartItems({
      cartId,
      items: [{ cart_item_uid: itemUid, quantity: Math.max(0, quantity) }],
    });

    refreshCart();
    return { ok: true };
  } catch (error) {
    return toResult(error, "No pudimos actualizar la cantidad.");
  }
}

/*
  Server Actions are a network boundary: whatever is returned crosses to the
  browser. Upstream messages can name SKUs, stock levels and internal
  entities, so only the shopper-facing part is forwarded and the rest is
  logged server-side.
*/
function toResult(error: unknown, fallback: string): CartActionResult {
  if (error instanceof AddToCartError) {
    return {
      ok: false,
      message: fallback,
      rejectedSkus: error.rejectedSkus,
    };
  }

  console.error("[cart] action failed", error);
  return { ok: false, message: fallback };
}
