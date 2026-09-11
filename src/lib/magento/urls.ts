/*
  Catalogue URLs.

  The path mirrors Magento's own rewrite convention — `url_key` plus
  `url_suffix`, served flat from the root — so the Next routes can keep the
  SEO history of the existing storefront instead of starting over under a
  `/producto/...` prefix.

  Nothing routes these paths yet. Keeping the construction in one function is
  the point: when the product route lands, or the convention changes, this is
  the only line to edit.
*/

export type ProductUrlParts = {
  url_key: string | null;
  url_suffix: string | null;
};

/**
 * Path to a product page, or null when the catalogue gives no key to build
 * one from — a link to nowhere is worse than plain text.
 */
export function productPath({ url_key, url_suffix }: ProductUrlParts): string | null {
  const key = url_key?.trim();

  if (!key) return null;

  /* `url_suffix` is configurable per store and comes back null when empty. */
  return `/${key}${url_suffix ?? ""}`;
}
