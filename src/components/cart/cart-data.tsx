import { CartMenu } from "@/components/cart/cart-menu";
import { Icon } from "@/components/icons";
import type { MiniCartLine } from "@/components/cart/mini-cart";
import { readCartId } from "@/lib/data/cookies";
import { getCart } from "@/lib/magento/cart";
import { productPath } from "@/lib/magento/urls";
import type { Cart } from "@/lib/magento/types";

/*
  Server half of the cart. No "use client" here on purpose.

  Everything that identifies the backend — the endpoint, the store header, the
  cart cookie, the schema — is read in this module and never leaves it. What
  crosses to the browser is a plain array of lines, so the client bundle has
  no way to reach Magento even if someone tries.

  It is rendered as a slot from the root layout rather than imported by the
  header: a Client Component cannot import a Server Component, but it can
  render one that was handed to it as an element.
*/

function toLines(cart: Cart | null): MiniCartLine[] {
  const items = cart?.itemsV2?.items ?? [];

  return items.map((item) => {
    const rowTotal = item.prices?.row_total_including_tax.value ?? 0;

    return {
      id: item.uid,
      title: item.product.name,
      sku: item.product.sku,
      /*
        The panel prints a unit price beside the stepper and multiplies it back
        out for the subtotal, so the row total has to be divided down. Magento
        has no unit-price field that already includes tax.
      */
      price: item.quantity > 0 ? rowTotal / item.quantity : rowTotal,
      qty: item.quantity,
      image: item.product.thumbnail?.url ?? null,
      href: productPath(item.product),
    };
  });
}

export async function CartData() {
  const cartId = await readCartId();

  /*
    A visitor with no cart yet costs nothing: no cookie means no cart exists
    upstream, so there is nothing to fetch. The cart is minted lazily by the
    add-to-cart action.
  */
  if (!cartId) {
    return <CartMenu lines={[]} />;
  }

  let cart: Cart | null = null;

  try {
    cart = await getCart(cartId);
  } catch (error) {
    /*
      This renders in the root layout, so a Magento outage would otherwise
      take down every page on the site. An empty cart icon is a far better
      failure than a 500 on the homepage.
    */
    console.error("[cart] could not load the cart", error);
  }

  return <CartMenu lines={toLines(cart)} />;
}

/*
  Shown while the cart resolves. It renders the same trigger at the same size
  so the header does not shift when the real one arrives.

  Note what the surrounding <Suspense> does and does not buy: it streams the
  rest of the document without waiting on Magento, but it does NOT restore
  static prerendering — reading the cart cookie is a request-time API, and
  with `cacheComponents` off that makes every route dynamic. Verified against
  `next build`: the routes report ƒ with this mounted and ○ without it.
*/
export function CartMenuSkeleton() {
  return (
    <span
      aria-hidden="true"
      className="text-body-m inline-flex items-center gap-2 text-foreground opacity-50"
    >
      <Icon name="shopping-cart" size={20} />
      <span className="hidden lg:inline">Carrito</span>
    </span>
  );
}
