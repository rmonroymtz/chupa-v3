import {
  GraphQLResponseError,
  magentoFetch,
  type GraphQLErrorEntry,
} from "@/lib/magento/client";
import type {
  Customer,
  CustomerResult,
  GenerateCustomerTokenResult,
  RevokeCustomerTokenResult,
} from "@/lib/magento/types";

/*
  Customer identity operations. Unlike the cart, none of this is per-guest —
  every call below carries a customer token, or mints one.
*/

export const GENERATE_CUSTOMER_TOKEN_MUTATION = /* GraphQL */ `
  mutation GenerateCustomerToken($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`;

export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid email or password");
    this.name = "InvalidCredentialsError";
  }
}

/**
 * Exchanges email/password for a customer token.
 *
 * The trap: Magento answers a wrong password with a 200 carrying a
 * top-level GraphQL error in the `graphql-authentication` category — it is
 * not an HTTP 401, so without this classification a mistyped password is
 * indistinguishable from a backend outage. Both would otherwise surface the
 * same generic failure.
 *
 * The raw Magento message is also deliberately vague about whether the
 * account exists at all (it reads "...incorrect or your account is disabled
 * temporarily"), and that vagueness is preserved on purpose here — sharpening
 * it would turn the sign-in form into a user-enumeration oracle.
 */
export async function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<string> {
  try {
    const data = await magentoFetch<GenerateCustomerTokenResult>({
      query: GENERATE_CUSTOMER_TOKEN_MUTATION,
      variables: { email, password },
    });

    const token = data.generateCustomerToken?.token;

    if (!token) {
      throw new Error("Magento reported no token and no error");
    }

    return token;
  } catch (error) {
    if (
      error instanceof GraphQLResponseError &&
      error.errors.some(
        (entry: GraphQLErrorEntry) =>
          entry.extensions?.category === "graphql-authentication",
      )
    ) {
      throw new InvalidCredentialsError();
    }

    throw error;
  }
}

export const CUSTOMER_QUERY = /* GraphQL */ `
  query Customer {
    customer {
      firstname
      lastname
      email
      addresses {
        company
        default_billing
      }
    }
  }
`;

/**
 * Reads the signed-in customer for the given token.
 *
 * Returns null when the token is expired or revoked (`graphql-authorization`)
 * rather than throwing, mirroring how `getCart` treats a stale cart cookie.
 * An expired token is an everyday event — the default Magento lifetime is
 * one hour — and this renders in the root layout, so it must degrade to
 * "signed out" rather than take every page down. Every other failure still
 * propagates.
 */
export async function getCustomer(token: string): Promise<Customer | null> {
  try {
    const data = await magentoFetch<CustomerResult>({
      query: CUSTOMER_QUERY,
      token,
    });

    return data.customer;
  } catch (error) {
    if (
      error instanceof GraphQLResponseError &&
      error.errors.some(
        (entry: GraphQLErrorEntry) =>
          entry.extensions?.category === "graphql-authorization",
      )
    ) {
      return null;
    }

    throw error;
  }
}

export const REVOKE_CUSTOMER_TOKEN_MUTATION = /* GraphQL */ `
  mutation RevokeCustomerToken {
    revokeCustomerToken {
      result
    }
  }
`;

/**
 * Best-effort token revoke. The local cookie is the thing that actually ends
 * the session for this browser, so a failed revoke must never block logout —
 * it is logged and the sign-out proceeds regardless.
 */
export async function signOut(token: string): Promise<void> {
  try {
    await magentoFetch<RevokeCustomerTokenResult>({
      query: REVOKE_CUSTOMER_TOKEN_MUTATION,
      token,
    });
  } catch (error) {
    console.error("[customer] could not revoke the token", error);
  }
}
