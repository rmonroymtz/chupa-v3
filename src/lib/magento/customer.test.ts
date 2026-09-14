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
const { getCustomer, InvalidCredentialsError, signIn, signOut } = await import(
  "@/lib/magento/customer"
);

const authError = () =>
  new GraphQLResponseError([
    {
      message: "The account sign-in was incorrect or your account is disabled temporarily.",
      extensions: { category: "graphql-authentication" },
    },
  ]);

const authorizationError = () =>
  new GraphQLResponseError([
    {
      message: "The current customer isn't authorized.",
      extensions: { category: "graphql-authorization" },
    },
  ]);

beforeEach(() => {
  magentoFetch.mockReset();
});

describe("signIn", () => {
  it("returns the token on success and passes email/password as variables", async () => {
    magentoFetch.mockResolvedValue({
      generateCustomerToken: { token: "abc123" },
    });

    const token = await signIn({
      email: "carlos@example.com",
      password: "hunter2",
    });

    expect(token).toBe("abc123");
    expect(magentoFetch).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: { email: "carlos@example.com", password: "hunter2" },
      }),
    );
  });

  it("throws InvalidCredentialsError when the error carries graphql-authentication", async () => {
    magentoFetch.mockRejectedValue(authError());

    await expect(
      signIn({ email: "carlos@example.com", password: "wrong" }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError);
  });

  it("rethrows an unrelated GraphQLResponseError untouched", async () => {
    const outage = new GraphQLResponseError([
      { message: "Internal server error", extensions: { category: "graphql-internal" } },
    ]);
    magentoFetch.mockRejectedValue(outage);

    await expect(
      signIn({ email: "carlos@example.com", password: "hunter2" }),
    ).rejects.toBe(outage);
  });

  it("throws when generateCustomerToken is null", async () => {
    magentoFetch.mockResolvedValue({ generateCustomerToken: null });

    await expect(
      signIn({ email: "carlos@example.com", password: "hunter2" }),
    ).rejects.toThrow();
  });
});

describe("getCustomer", () => {
  it("returns the customer and forwards the token", async () => {
    const customer = {
      firstname: "Carlos",
      lastname: "Mendoza",
      email: "carlos@example.com",
      addresses: null,
    };
    magentoFetch.mockResolvedValue({ customer });

    const result = await getCustomer("token-123");

    expect(result).toEqual(customer);
    expect(magentoFetch).toHaveBeenCalledWith(
      expect.objectContaining({ token: "token-123" }),
    );
  });

  it("returns null on graphql-authorization", async () => {
    magentoFetch.mockRejectedValue(authorizationError());

    await expect(getCustomer("expired-token")).resolves.toBeNull();
  });

  it("rethrows any other error", async () => {
    const outage = new Error("network down");
    magentoFetch.mockRejectedValue(outage);

    await expect(getCustomer("token-123")).rejects.toBe(outage);
  });
});

describe("signOut", () => {
  it("swallows a revoke failure and does not throw", async () => {
    magentoFetch.mockRejectedValue(new Error("backend unreachable"));

    await expect(signOut("token-123")).resolves.toBeUndefined();
  });
});
