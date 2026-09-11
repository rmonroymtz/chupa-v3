/*
  Endpoint normalization.

  A backend URL is typed by a human into a `.env` file, so it arrives in every
  shape a human produces: with or without the scheme, with or without the
  trailing slash, with or without the GraphQL path already on it. None of
  those are mistakes worth failing a deploy over, and all of them produce the
  same intended endpoint.

  What this does NOT do is guess past a genuine mistake. A typo'd scheme or a
  URL that cannot be parsed fails loudly, because the alternative is a request
  going somewhere unintended.
*/

/** Matches `https://`, `http://`, and any other explicit scheme. */
const SCHEME = /^[a-z][a-z0-9+.-]*:\/\//i;

export class InvalidEndpointError extends Error {
  constructor(variableName: string, raw: string, reason: string) {
    super(
      `${variableName} is not a usable URL (${reason}). Received: ${JSON.stringify(raw)}`,
    );
    this.name = "InvalidEndpointError";
  }
}

export type NormalizeEndpointOptions = {
  /**
   * Path segment the backend serves GraphQL from, without slashes — e.g.
   * "graphql". Omit to leave the path untouched.
   */
  path?: string;
  /** Name of the setting, used in error messages. */
  variableName?: string;
};

/**
 * Turns a hand-written backend URL into the exact endpoint to POST to.
 *
 * Accepts the base URL or the full endpoint interchangeably, so both of these
 * land on `https://tienda.com/graphql`:
 *
 *     https://tienda.com
 *     https://tienda.com/graphql/
 *
 * A sub-path is preserved, because Magento serves a store view from one:
 * `https://tienda.com/mx` becomes `https://tienda.com/mx/graphql`.
 */
export function normalizeEndpoint(
  raw: string,
  { path, variableName = "The endpoint" }: NormalizeEndpointOptions = {},
): string {
  const trimmed = raw.trim();

  if (!trimmed) {
    throw new InvalidEndpointError(variableName, raw, "it is empty");
  }

  /*
    A bare host has no scheme. Prepending before parsing matters: `new URL`
    reads "localhost:8080" as the scheme "localhost", which parses fine and
    means something entirely different.
  */
  const withScheme = SCHEME.test(trimmed) ? trimmed : `https://${trimmed}`;

  let url: URL;

  try {
    url = new URL(withScheme);
  } catch {
    throw new InvalidEndpointError(variableName, raw, "it cannot be parsed");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new InvalidEndpointError(
      variableName,
      raw,
      `the scheme must be http or https, not "${url.protocol.replace(":", "")}"`,
    );
  }

  if (!url.hostname) {
    throw new InvalidEndpointError(variableName, raw, "it has no host");
  }

  /* A query string or fragment on an API endpoint is always a paste artefact. */
  url.search = "";
  url.hash = "";

  if (path) {
    const base = url.pathname.replace(/\/+$/, "");
    const tail = base.split("/").pop() ?? "";

    /*
      Compared case-insensitively only to avoid appending the path twice. The
      casing the operator wrote is left alone — silently rewriting it would
      hide a real mistake behind a URL that looks right.
    */
    url.pathname =
      tail.toLowerCase() === path.toLowerCase() ? base : `${base}/${path}`;
  }

  return url.toString();
}
