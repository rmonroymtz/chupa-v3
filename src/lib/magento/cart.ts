import {
  GraphQLResponseError,
  magentoFetch,
  type GraphQLErrorEntry,
} from "@/lib/magento/client";
import type {
  AddProductsToCartResult,
  Cart,
  CartItemInput,
  CartResult,
  CartUserError,
  CreateEmptyCartResult,
  UpdateCartItemsResult,
} from "@/lib/magento/types";

/*
  Cart operations are per-shopper and never cached: every call below goes out
  with the transport's default `no-store`.
*/

const CART_FIELDS = /* GraphQL */ `
  fragment CartFields on Cart {
    id
    total_quantity
    itemsV2 {
      total_count
      items {
        uid
        quantity
        product {
          uid
          sku
          name
          url_key
          url_suffix
          # thumbnail is the catalogue's smallest render, the right one for a
          # 48px slot. small_image and image resolve to the same cached file
          # on this backend, only larger.
          thumbnail {
            url
            label
          }
        }
        prices {
          row_total_including_tax {
            value
            currency
          }
        }
      }
    }
    prices {
      subtotal_excluding_tax {
        value
        currency
      }
      grand_total {
        value
        currency
      }
    }
  }
`;

export const CREATE_EMPTY_CART_MUTATION = /* GraphQL */ `
  mutation CreateEmptyCart {
    createEmptyCart
  }
`;

export const ADD_PRODUCTS_TO_CART_MUTATION = /* GraphQL */ `
  mutation AddProductsToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
    addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
      cart {
        ...CartFields
      }
      user_errors {
        code
        message
      }
    }
  }
  ${CART_FIELDS}
`;

/**
 * Returns the masked cart id. For a guest that id IS the session — whoever
 * holds it holds the cart — so store it in an httpOnly cookie, never in
 * localStorage. For a signed-in customer, pass the token and Magento returns
 * that customer's cart id instead.
 */
export async function createEmptyCart(token?: string): Promise<string> {
  const data = await magentoFetch<CreateEmptyCartResult>({
    query: CREATE_EMPTY_CART_MUTATION,
    token,
  });

  return data.createEmptyCart;
}

export class AddToCartError extends Error {
  readonly userErrors: CartUserError[];
  /** The cart as Magento left it — null when the cart id itself was rejected. */
  readonly cart: Cart | null;

  constructor(userErrors: CartUserError[], cart: Cart | null) {
    super(userErrors.map((error) => error.message).join(" | "));
    this.name = "AddToCartError";
    this.userErrors = userErrors;
    this.cart = cart;
  }

  /** The cart id is gone — mint a new one and replay, instead of showing an error. */
  get isStaleCart(): boolean {
    return this.userErrors.some((error) => error.code === "CART_ID_INVALID");
  }

  /** SKUs Magento refused, so the caller can name them in the message. */
  get rejectedSkus(): string[] {
    return this.userErrors
      .filter((error) => error.code !== "CART_ID_INVALID")
      .map((error) => {
        /* Magento only reports the SKU inside the localized message string. */
        const match = error.message.match(/"([^"]+)"/);
        return match?.[1] ?? "";
      })
      .filter(Boolean);
  }
}

/**
 * The important trap: `addProductsToCart` answers 200 with an empty
 * `user_errors` only on full success. A product that is out of stock, has a
 * required option missing, or does not exist comes back as a *partial*
 * success — the other items land in the cart and the failure is reported in
 * `user_errors`, not as a GraphQL error. Ignoring that array silently drops
 * items the shopper thinks they added.
 */
export async function addProductsToCart({
  cartId,
  cartItems,
  token,
}: {
  cartId: string;
  cartItems: CartItemInput[];
  token?: string;
}): Promise<Cart> {
  const data = await magentoFetch<AddProductsToCartResult>({
    query: ADD_PRODUCTS_TO_CART_MUTATION,
    variables: { cartId, cartItems },
    token,
  });

  const { cart, user_errors: userErrors } = data.addProductsToCart;

  if (userErrors.length) {
    throw new AddToCartError(userErrors, cart);
  }

  if (!cart) {
    throw new Error("Magento reported no cart and no user errors");
  }

  return cart;
}

export const CART_QUERY = /* GraphQL */ `
  query Cart($cartId: String!) {
    cart(cart_id: $cartId) {
      ...CartFields
    }
  }
  ${CART_FIELDS}
`;

/**
 * Reads a cart by its masked id.
 *
 * Returns null instead of throwing when Magento no longer knows the id — a
 * stale cookie is an everyday occurrence (carts expire, environments get
 * reset) and it must not take the whole page down with it. Every other
 * failure still propagates.
 */
export async function getCart(
  cartId: string,
  token?: string,
): Promise<Cart | null> {
  try {
    const data = await magentoFetch<CartResult>({
      query: CART_QUERY,
      variables: { cartId },
      token,
    });

    return data.cart;
  } catch (error) {
    if (
      error instanceof GraphQLResponseError &&
      error.errors.some(
        (entry: GraphQLErrorEntry) =>
          entry.extensions?.category === "graphql-no-such-entity",
      )
    ) {
      return null;
    }

    throw error;
  }
}

export const UPDATE_CART_ITEMS_MUTATION = /* GraphQL */ `
  mutation UpdateCartItems($input: UpdateCartItemsInput) {
    updateCartItems(input: $input) {
      cart {
        ...CartFields
      }
    }
  }
  ${CART_FIELDS}
`;

/**
 * Replaces the quantity of the given line items. Magento applies the number
 * verbatim — it does no arithmetic of its own — so callers must send the
 * resulting total, not a delta. A quantity of 0 removes the line.
 */
export async function updateCartItems({
  cartId,
  items,
  token,
}: {
  cartId: string;
  items: { cart_item_uid: string; quantity: number }[];
  token?: string;
}): Promise<Cart> {
  const data = await magentoFetch<UpdateCartItemsResult>({
    query: UPDATE_CART_ITEMS_MUTATION,
    variables: { input: { cart_id: cartId, cart_items: items } },
    token,
  });

  /*
    No `user_errors` channel on this output type: a rejected line item comes
    back as a top-level GraphQL error, which `magentoFetch` has already
    thrown by the time we get here.
  */
  const cart = data.updateCartItems?.cart;

  if (!cart) {
    throw new Error("Magento returned no cart for the quantity update");
  }

  return cart;
}
