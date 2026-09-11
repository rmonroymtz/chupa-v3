import { describe, expect, it } from "vitest";

import { InvalidEndpointError, normalizeEndpoint } from "@/lib/graphql/endpoint";

const opts = { path: "graphql", variableName: "MAGENTO_BACKEND_URL" };

describe("normalizeEndpoint", () => {
  it.each([
    ["a bare base URL", "https://tienda.com", "https://tienda.com/graphql"],
    ["a trailing slash", "https://tienda.com/", "https://tienda.com/graphql"],
    ["repeated slashes", "https://tienda.com///", "https://tienda.com/graphql"],
    ["the full endpoint", "https://tienda.com/graphql", "https://tienda.com/graphql"],
    ["the endpoint with a slash", "https://tienda.com/graphql/", "https://tienda.com/graphql"],
    ["surrounding whitespace", "  https://tienda.com  ", "https://tienda.com/graphql"],
    ["no scheme", "tienda.com", "https://tienda.com/graphql"],
    ["no scheme, with path", "tienda.com/graphql", "https://tienda.com/graphql"],
    ["an explicit port", "http://localhost:8080", "http://localhost:8080/graphql"],
    ["a store-view sub-path", "https://tienda.com/mx", "https://tienda.com/mx/graphql"],
    ["an uppercase scheme", "HTTPS://TIENDA.COM", "https://tienda.com/graphql"],
  ])("accepts %s", (_label, input, expected) => {
    expect(normalizeEndpoint(input, opts)).toBe(expected);
  });

  /*
    `new URL("localhost:8080")` does NOT throw — it reads "localhost" as the
    scheme. This is the case that forced scheme detection by regex instead of
    a try/catch around the parser, so it is pinned here.
  */
  it("treats a host:port with no scheme as a host, not a scheme", () => {
    expect(normalizeEndpoint("localhost:8080", opts)).toBe(
      "https://localhost:8080/graphql",
    );
  });

  it("drops a query string and fragment", () => {
    expect(normalizeEndpoint("https://tienda.com/graphql?a=1", opts)).toBe(
      "https://tienda.com/graphql",
    );
    expect(normalizeEndpoint("https://tienda.com/graphql#x", opts)).toBe(
      "https://tienda.com/graphql",
    );
  });

  /* Magento Cloud environments are sometimes behind basic auth. */
  it("keeps credentials", () => {
    expect(normalizeEndpoint("https://user:pw@tienda.com", opts)).toBe(
      "https://user:pw@tienda.com/graphql",
    );
  });

  /*
    Detected case-insensitively so the path is not appended twice, but the
    operator's casing is left alone rather than silently corrected.
  */
  it("does not double the path, and does not rewrite its casing", () => {
    expect(normalizeEndpoint("https://tienda.com/GraphQL", opts)).toBe(
      "https://tienda.com/GraphQL",
    );
  });

  /*
    Without `path` the function is a validator, not a rewriter: the trailing
    slash survives, because trimming it is part of appending a segment.
  */
  it("leaves the path untouched when no path option is given", () => {
    expect(normalizeEndpoint("https://tienda.com/anything/")).toBe(
      "https://tienda.com/anything/",
    );
  });

  it.each([
    ["an empty value", ""],
    ["only whitespace", "   "],
    ["a non-http scheme", "ftp://tienda.com"],
    ["a scheme with no host", "https://"],
    ["prose", "not a url at all"],
  ])("rejects %s", (_label, input) => {
    expect(() => normalizeEndpoint(input, opts)).toThrow(InvalidEndpointError);
  });

  it("names the setting in the error so the fix is obvious", () => {
    expect(() => normalizeEndpoint("ftp://tienda.com", opts)).toThrow(
      /MAGENTO_BACKEND_URL/,
    );
  });
});
