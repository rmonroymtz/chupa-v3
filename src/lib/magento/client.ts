/*
  Magento 2 / Adobe Commerce adapter over the vendor-neutral GraphQL transport
  in `@/lib/graphql/client`.

  Everything Magento-specific lives here and nowhere else: the endpoint env
  var, the `Store` header, and the bearer-token convention. Swapping the
  backend means writing a sibling adapter, not touching the transport.

  Server-only on purpose: the endpoint, the store code and any customer token
  stay out of the client bundle, and the browser never talks to Magento
  directly (no CORS surface, no exposed backend URL). `MAGENTO_BACKEND_URL`
  carries no NEXT_PUBLIC_ prefix, so importing this from a Client Component
  fails at runtime rather than leaking. Add the `server-only` package and
  import it here to turn that into a build-time error instead.

  Note on error types: the transport's three failure shapes are re-exported
  below under their generic names. Magento's fourth shape — a 200 carrying
  `user_errors` for an out-of-stock or unknown SKU — is not a transport
  concern and is handled in `cart.ts`.
*/

import {
  createGraphQLClient,
  type GraphQLRequestOptions,
} from "@/lib/graphql/client";
import { normalizeEndpoint } from "@/lib/graphql/endpoint";

export {
  DEFAULT_TIMEOUT_MS,
  GraphQLHttpError,
  GraphQLResponseError,
  GraphQLTransportError,
  type GraphQLErrorEntry,
} from "@/lib/graphql/client";

/** Magento serves GraphQL from this path, relative to the store's base URL. */
export const MAGENTO_GRAPHQL_PATH = "graphql";

const client = createGraphQLClient({
  label: "Magento GraphQL",
  endpoint: () => {
    const url = process.env.MAGENTO_BACKEND_URL;

    if (!url) {
      throw new Error(
        "MAGENTO_BACKEND_URL is not set. Point it at the Magento store, " +
          "e.g. https://tienda.example.com",
      );
    }

    /*
      The setting names the store, not the endpoint, so the GraphQL path is
      appended here. Writing the full endpoint works just as well — the
      normalizer accepts either and will not double the path.
    */
    return normalizeEndpoint(url, {
      path: MAGENTO_GRAPHQL_PATH,
      variableName: "MAGENTO_BACKEND_URL",
    });
  },
  /* Magento selects the store view by header; omitting it uses the default. */
  headers: (): Record<string, string> => {
    const storeCode = process.env.MAGENTO_STORE_CODE;
    return storeCode ? { Store: storeCode } : {};
  },
});

type MagentoRequestOptions = Omit<GraphQLRequestOptions, "headers"> & {
  /** Customer bearer token. Omit for guest traffic. */
  token?: string;
};

export async function magentoFetch<TData>({
  token,
  ...options
}: MagentoRequestOptions): Promise<TData> {
  return client.request<TData>({
    ...options,
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  });
}
