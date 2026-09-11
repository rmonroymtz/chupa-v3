import { describe, expect, it } from "vitest";

import { productPath } from "@/lib/magento/urls";

describe("productPath", () => {
  /* The shape this catalogue really returns: store prefix, SKU, .html suffix. */
  it("mirrors the Magento rewrite", () => {
    expect(
      productPath({
        url_key: "amazon-086571858X-the-aquaponic-farmer",
        url_suffix: ".html",
      }),
    ).toBe("/amazon-086571858X-the-aquaponic-farmer.html");
  });

  it("handles a store configured with no suffix", () => {
    expect(productPath({ url_key: "abc", url_suffix: null })).toBe("/abc");
  });

  /* A link to nowhere is worse than plain text, so the caller gets null. */
  it.each([
    ["a missing key", null],
    ["a blank key", "   "],
  ])("returns null for %s", (_label, url_key) => {
    expect(productPath({ url_key, url_suffix: ".html" })).toBeNull();
  });
});
