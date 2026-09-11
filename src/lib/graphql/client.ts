/*
  Vendor-neutral GraphQL transport.

  This file knows about GraphQL-over-HTTP and about the Next 16 data cache.
  It knows NOTHING about Magento, Shopify, or any other backend: no store
  header, no `user_errors`, no schema types. A backend module builds its own
  client with `createGraphQLClient` and keeps its vendor rules to itself, so
  swapping the backend replaces that adapter instead of this transport.

  Next 16 note: caching is opt-in. `fetch` is NOT cached by default and a
  GraphQL request is POST, which is only cached when `cache: "force-cache"` is
  passed explicitly — see node_modules/next/dist/docs/01-app/03-api-reference/
  04-functions/fetch.md. `use cache` is not an option in this repo yet because
  `cacheComponents` is off in next.config.ts.

  Failures arrive in three shapes and each gets its own error type, because a
  caller retries them differently:
    - the request never completed           -> GraphQLTransportError
    - the server answered with an HTTP code -> GraphQLHttpError
    - the server answered 200 with `errors` -> GraphQLResponseError
  A fourth shape never reaches here: backends that report domain failures in
  the payload (Magento's `user_errors`, Shopify's `userErrors`) answer 200 with
  no `errors` at all, so those belong to the backend adapter.
*/

export type GraphQLErrorEntry = {
  message: string;
  path?: (string | number)[];
  extensions?: { category?: string };
};

/** The server answered 200 but reported failures in the `errors` array. */
export class GraphQLResponseError extends Error {
  readonly errors: GraphQLErrorEntry[];

  constructor(errors: GraphQLErrorEntry[]) {
    super(errors.map((error) => error.message).join(" | "));
    this.name = "GraphQLResponseError";
    this.errors = errors;
  }
}

/** The server answered, but not with 2xx. */
export class GraphQLHttpError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(status: number, statusText: string, endpointLabel: string) {
    super(`${endpointLabel} responded ${status} ${statusText}`);
    this.name = "GraphQLHttpError";
    this.status = status;
    this.statusText = statusText;
  }

  /* 429 and 5xx are the server being busy or down, not the request being wrong. */
  get isRetryable(): boolean {
    return this.status === 429 || this.status >= 500;
  }
}

/**
 * The request never produced a usable response: DNS failure, refused
 * connection, TLS error, the timeout firing, or a body that is not JSON.
 * `fetch` rejects with a bare `TypeError` for most of these, which is
 * indistinguishable from a bug in our own code — hence the wrapper.
 */
export class GraphQLTransportError extends Error {
  readonly isTimeout: boolean;

  constructor(
    message: string,
    { isTimeout = false, cause }: { isTimeout?: boolean; cause?: unknown } = {},
  ) {
    super(message, { cause });
    this.name = "GraphQLTransportError";
    this.isTimeout = isTimeout;
  }
}

/*
  A hung upstream must not hang the render. Server Components await these
  requests inline, so without a deadline one slow backend call stalls the whole
  response until the platform's own (much longer) limit kills it.
*/
export const DEFAULT_TIMEOUT_MS = 10_000;

export type GraphQLRequestOptions = {
  query: string;
  variables?: Record<string, unknown>;
  /** Merged over the client's base headers — this is where a per-user token goes. */
  headers?: Record<string, string>;
  /** Seconds. Omit (or pass 0) to skip the Next data cache entirely. */
  revalidate?: number;
  /** Cache tags, so a webhook can call `revalidateTag` after an upstream change. */
  tags?: string[];
  signal?: AbortSignal;
  /** Overrides the client's timeout. Pass 0 to disable the deadline. */
  timeoutMs?: number;
};

export type GraphQLClientConfig = {
  /**
   * Resolved per request, not at module load: reading env eagerly would make
   * importing this module fail during a build that has no backend configured.
   */
  endpoint: () => string;
  /** Base headers, resolved per request so they can read env or context. */
  headers?: () => Record<string, string>;
  /** Names the backend in error messages, e.g. "Magento GraphQL". */
  label?: string;
  timeoutMs?: number;
};

export type GraphQLClient = {
  request<TData>(options: GraphQLRequestOptions): Promise<TData>;
};

export function createGraphQLClient({
  endpoint,
  headers: baseHeaders,
  label = "GraphQL endpoint",
  timeoutMs: defaultTimeoutMs = DEFAULT_TIMEOUT_MS,
}: GraphQLClientConfig): GraphQLClient {
  return {
    async request<TData>({
      query,
      variables,
      headers,
      revalidate,
      tags,
      signal,
      timeoutMs = defaultTimeoutMs,
    }: GraphQLRequestOptions): Promise<TData> {
      const shouldCache = typeof revalidate === "number" && revalidate > 0;

      /*
        The caller's signal and our deadline are both reasons to give up, so
        they are merged rather than one replacing the other. Which one fired
        decides how the failure is reported below.
      */
      const timeoutSignal =
        timeoutMs > 0 ? AbortSignal.timeout(timeoutMs) : undefined;
      const signals = [signal, timeoutSignal].filter(
        (candidate): candidate is AbortSignal => candidate !== undefined,
      );
      const requestSignal = signals.length ? AbortSignal.any(signals) : undefined;

      let response: Response;

      try {
        response = await fetch(endpoint(), {
          method: "POST",
          signal: requestSignal,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            ...baseHeaders?.(),
            ...headers,
          },
          body: JSON.stringify({ query, variables }),
          /*
            Anything per-user must never be cached, so the default branch is
            `no-store`. `force-cache` is what makes a POST cacheable at all;
            `revalidate` alone would not.
          */
          ...(shouldCache
            ? { cache: "force-cache" as const, next: { revalidate, tags } }
            : { cache: "no-store" as const }),
        });
      } catch (cause) {
        /*
          A caller that aborted on purpose (navigation away, its own deadline)
          is not an upstream failure: let that abort propagate untouched so it
          is not logged or retried as an outage.
        */
        if (signal?.aborted) {
          throw cause;
        }

        if (timeoutSignal?.aborted) {
          throw new GraphQLTransportError(
            `${label} did not respond within ${timeoutMs}ms`,
            { isTimeout: true, cause },
          );
        }

        throw new GraphQLTransportError(`${label} could not be reached`, {
          cause,
        });
      }

      if (!response.ok) {
        throw new GraphQLHttpError(response.status, response.statusText, label);
      }

      /*
        A GraphQL server answers 200 even when the operation failed, putting
        the reason in `errors`, so the status check above is not enough.
      */
      let payload: { data?: TData; errors?: GraphQLErrorEntry[] };

      try {
        payload = (await response.json()) as {
          data?: TData;
          errors?: GraphQLErrorEntry[];
        };
      } catch (cause) {
        /*
          Reading the body can fail after a 200: a truncated stream, or an HTML
          error page from a proxy sitting in front of the backend.
        */
        throw new GraphQLTransportError(
          `${label} returned a body that is not valid JSON`,
          { cause },
        );
      }

      if (payload?.errors?.length) {
        throw new GraphQLResponseError(payload.errors);
      }

      if (!payload.data) {
        throw new GraphQLTransportError(
          `${label} returned no data and no errors`,
        );
      }

      return payload.data;
    },
  };
}
