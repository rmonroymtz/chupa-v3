import { readCartId, writeCartId, clearCartId } from "@/lib/data/cookies";
import { getCustomerCart, mergeCarts } from "@/lib/magento/cart";

/*
  Cart-session transitions: what happens to the cart cookie when a shopper
  signs in or out.

  Deliberately a plain module, not folded into `@/components/cart/actions.ts`.
  Every export of a `"use server"` file becomes a callable server endpoint —
  the client can invoke it directly, by design. These two functions are
  internal session bookkeeping triggered only from inside `signInAction` and
  `signOutAction`; no client should be able to call them on its own, so they
  get no directive and no place on that boundary.
*/

/**
 * The sign-in transition: adopts whatever guest cart the browser was
 * carrying into the customer's own cart.
 *
 * Must never throw. This runs from `signInAction` after the customer token
 * has already been written, so a failure here would turn a successful
 * authentication into an error message while the shopper is, in fact, signed
 * in. A cart that failed to merge is a bad day; a login that reports failure
 * after succeeding is a broken app. Every failure is logged and swallowed.
 */
export async function adoptGuestCart(token: string): Promise<void> {
  try {
    const guestCartId = await readCartId();
    const customerCart = await getCustomerCart(token);

    if (guestCartId && guestCartId !== customerCart.id) {
      /*
        Isolated on purpose: a stale guest cookie (expired, reaped, already
        merged once) makes Magento throw `graphql-no-such-entity` here. That
        guest cart is already dead either way, so losing it must not cost the
        shopper their own, very much alive, customer cart below.
      */
      try {
        await mergeCarts({
          sourceCartId: guestCartId,
          destinationCartId: customerCart.id,
          token,
        });
      } catch (error) {
        console.error("[cart-session] could not merge the guest cart", error);
      }
    }

    /*
      Always repoint the cookie, whether or not a merge ran or succeeded. The
      signed-in shopper's correct cart is the customer cart regardless of
      what became of the guest one, and leaving the guest id in place would
      point the cookie at a cart Magento just consumed (or never touched).
    */
    await writeCartId(customerCart.id);
  } catch (error) {
    console.error("[cart-session] could not adopt the guest cart", error);
  }
}

/**
 * The sign-out transition: drops the cart cookie.
 *
 * Clearing is mandatory, not optional, because the cookie holds a *customer*
 * cart id and the token that authorized reading it is about to be gone. A
 * guest browser reading a customer cart gets `graphql-authorization` from
 * Magento on every single page load. Clearing the cookie instead makes the
 * next add-to-cart mint a fresh guest cart, which is the correct state for a
 * signed-out visitor.
 */
export async function releaseCustomerCart(): Promise<void> {
  await clearCartId();
}
