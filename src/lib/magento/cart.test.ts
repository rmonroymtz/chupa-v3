import { beforeEach, describe, expect, it, vi } from "vitest";

import { GraphQLResponseError } from "@/lib/magento/client";

const { magentoFetch } = vi.hoisted(() => ({ magentoFetch: vi.fn() }));

vi.mock("@/lib/magento/client", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/magento/client")>(
      "@/lib/magento/client",
    );

  return { ...actual, magentoFetch };
});

/*
  Imported after the mock so the module under test resolves the mocked
  `magentoFetch` rather than the real one.
*/
const { getCart, getCustomerCart, mergeCarts } = await import(
  "@/lib/magento/cart"
);

const cart = {
  id: "customer-cart-id",
  total_quantity: 2,
  itemsV2: { total_count: 1, items: [] },
  prices: { subtotal_excluding_tax: { value: 100, currency: "MXN" }, grand_total: null },
};

beforeEach(() => {
  magentoFetch.mockReset();
});

describe("getCustomerCart", () => {
  it("forwards the token and returns the cart", async () => {
    magentoFetch.mockResolvedValue({ customerCart: cart });

    const result = await getCustomerCart("token-123");

    expect(result).toEqual(cart);
    expect(magentoFetch).toHaveBeenCalledWith(
      expect.objectContaining({ token: "token-123" }),
    );
  });
});

describe("mergeCarts", () => {
  it("passes sourceCartId/destinationCartId as variables and forwards the token", async () => {
    magentoFetch.mockResolvedValue({ mergeCarts: cart });

    const result = await mergeCarts({
      sourceCartId: "guest-cart-id",
      destinationCartId: "customer-cart-id",
      token: "token-123",
    });

    expect(result).toEqual(cart);
    expect(magentoFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          sourceCartId: "guest-cart-id",
          destinationCartId: "customer-cart-id",
        },
        token: "token-123",
      }),
    );
  });

  it("propagates a GraphQLResponseError instead of swallowing it", async () => {
    const noSuchEntity = new GraphQLResponseError([
      {
        message: 'Could not find a cart with ID "guest-cart-id"',
        extensions: { category: "graphql-no-such-entity" },
      },
    ]);
    magentoFetch.mockRejectedValue(noSuchEntity);

    await expect(
      mergeCarts({
        sourceCartId: "guest-cart-id",
        destinationCartId: "customer-cart-id",
        token: "token-123",
      }),
    ).rejects.toBe(noSuchEntity);
  });
});

describe("getCart", () => {
  const responseError = (category: string) =>
    new GraphQLResponseError([{ message: "nope", extensions: { category } }]);

  it("returns the cart on success and forwards the token", async () => {
    magentoFetch.mockResolvedValue({ cart });

    expect(await getCart("cart-id", "token-123")).toEqual(cart);
    expect(magentoFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { cartId: "cart-id" },
        token: "token-123",
      }),
    );
  });

  it("returns null when Magento no longer knows the id", async () => {
    magentoFetch.mockRejectedValue(responseError("graphql-no-such-entity"));

    expect(await getCart("cart-id")).toBeNull();
  });

  /*
    The state every signed-in shopper reaches an hour after logging in: the
    token cookie has lapsed, `cp_cart_id` still holds their customer cart, and
    the untokened read comes back unauthorized. It must read as "no cart",
    not as a crash in the root layout.
  */
  it("returns null when a customer cart is read without a token", async () => {
    magentoFetch.mockRejectedValue(responseError("graphql-authorization"));

    expect(await getCart("customer-cart-id")).toBeNull();
  });

  it("propagates any other failure", async () => {
    const outage = responseError("graphql-internal-error");
    magentoFetch.mockRejectedValue(outage);

    await expect(getCart("cart-id")).rejects.toBe(outage);
  });
});
