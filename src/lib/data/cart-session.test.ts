import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { readCartId, writeCartId, clearCartId } = vi.hoisted(() => ({
  readCartId: vi.fn(),
  writeCartId: vi.fn(),
  clearCartId: vi.fn(),
}));

const { getCustomerCart, mergeCarts } = vi.hoisted(() => ({
  getCustomerCart: vi.fn(),
  mergeCarts: vi.fn(),
}));

vi.mock("@/lib/data/cookies", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/data/cookies")>(
      "@/lib/data/cookies",
    );

  return { ...actual, readCartId, writeCartId, clearCartId };
});

vi.mock("@/lib/magento/cart", async () => {
  const actual =
    await vi.importActual<typeof import("@/lib/magento/cart")>(
      "@/lib/magento/cart",
    );

  return { ...actual, getCustomerCart, mergeCarts };
});

/*
  Imported after the mocks so the module under test resolves the mocked
  cookies/cart functions rather than the real ones.
*/
const { adoptGuestCart, releaseCustomerCart } = await import(
  "@/lib/data/cart-session"
);

const customerCart = { id: "customer-cart-id" };

beforeEach(() => {
  readCartId.mockReset();
  writeCartId.mockReset();
  clearCartId.mockReset();
  getCustomerCart.mockReset();
  mergeCarts.mockReset();
});

describe("adoptGuestCart", () => {
  it("merges the guest cart into the customer cart, then points the cookie at the customer cart", async () => {
    readCartId.mockResolvedValue("guest-cart-id");
    getCustomerCart.mockResolvedValue(customerCart);
    mergeCarts.mockResolvedValue(customerCart);

    await adoptGuestCart("token-123");

    expect(mergeCarts).toHaveBeenCalledWith({
      sourceCartId: "guest-cart-id",
      destinationCartId: "customer-cart-id",
      token: "token-123",
    });
    expect(writeCartId).toHaveBeenCalledWith("customer-cart-id");
  });

  it("does not merge when there is no guest cart cookie, but still writes the customer cart id", async () => {
    readCartId.mockResolvedValue(null);
    getCustomerCart.mockResolvedValue(customerCart);

    await adoptGuestCart("token-123");

    expect(mergeCarts).not.toHaveBeenCalled();
    expect(writeCartId).toHaveBeenCalledWith("customer-cart-id");
  });

  it("does not merge when the guest cart id already equals the customer cart id", async () => {
    readCartId.mockResolvedValue("customer-cart-id");
    getCustomerCart.mockResolvedValue(customerCart);

    await adoptGuestCart("token-123");

    expect(mergeCarts).not.toHaveBeenCalled();
    expect(writeCartId).toHaveBeenCalledWith("customer-cart-id");
  });

  describe("failure isolation", () => {
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.mocked(console.error).mockRestore();
    });

    it("still writes the customer cart id when mergeCarts rejects (a stale guest cookie must not cost the customer cart)", async () => {
      readCartId.mockResolvedValue("guest-cart-id");
      getCustomerCart.mockResolvedValue(customerCart);
      mergeCarts.mockRejectedValue(new Error("graphql-no-such-entity"));

      await expect(adoptGuestCart("token-123")).resolves.toBeUndefined();

      expect(writeCartId).toHaveBeenCalledWith("customer-cart-id");
    });

    it("never throws and does not write a cart id when getCustomerCart rejects", async () => {
      readCartId.mockResolvedValue("guest-cart-id");
      getCustomerCart.mockRejectedValue(new Error("backend unreachable"));

      await expect(adoptGuestCart("token-123")).resolves.toBeUndefined();

      expect(writeCartId).not.toHaveBeenCalled();
    });
  });
});

describe("releaseCustomerCart", () => {
  it("clears the cart cookie", async () => {
    await releaseCustomerCart();

    expect(clearCartId).toHaveBeenCalled();
  });
});
