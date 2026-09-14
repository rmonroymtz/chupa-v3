/*
  Hand-written slices of the Magento 2.4.x GraphQL schema — only the fields the
  documents in this folder actually select. If the selection set grows, grow
  these with it (or generate them from the live schema later).
*/

export type Money = { value: number; currency: string };

export type PriceRange = {
  minimum_price: {
    regular_price: Money;
    final_price: Money;
    discount: { amount_off: number; percent_off: number };
  };
};

export type StockStatus = "IN_STOCK" | "OUT_OF_STOCK";

/*
  `uid` is the stable opaque identifier; `id` is deprecated in 2.4.x.
  `price` on ProductInterface is deprecated too — `price_range` is the
  supported shape and the only one that reports discounts.
*/
export type MagentoProduct = {
  uid: string;
  sku: string;
  name: string;
  url_key: string | null;
  stock_status: StockStatus | null;
  small_image: { url: string; label: string | null } | null;
  price_range: PriceRange;
};

export type SearchResultPageInfo = {
  current_page: number;
  page_size: number;
  total_pages: number;
};

export type ProductsResult = {
  products: {
    total_count: number;
    items: MagentoProduct[];
    page_info: SearchResultPageInfo;
  };
};

export type SortDirection = "ASC" | "DESC";

/*
  ProductAttributeFilterInput is open-ended — any attribute flagged filterable
  in the admin becomes a key. These are the ones we use today.
*/
export type ProductAttributeFilterInput = {
  sku?: { eq?: string; in?: string[] };
  category_uid?: { eq?: string; in?: string[] };
  name?: { match?: string };
  price?: { from?: string; to?: string };
};

export type ProductAttributeSortInput = Partial<
  Record<"position" | "price" | "name" | "relevance", SortDirection>
>;

// ── Cart ─────────────────────────────────────────────────────────────────────

/** `quantity` is a Float in the schema, not an Int. */
export type CartItemInput = {
  sku: string;
  quantity: number;
  parent_sku?: string;
  selected_options?: string[];
  entered_options?: { uid: string; value: string }[];
};

/*
  CartUserInputErrorType. `CART_ID_INVALID` is the only one that is not about
  the line item itself — it means the masked cart id is gone (expired, or the
  guest session was reaped), which is recoverable by minting a new cart.
*/
export type CartUserInputErrorType =
  | "CART_ID_INVALID"
  | "PRODUCT_NOT_FOUND"
  | "NOT_SALABLE"
  | "INSUFFICIENT_STOCK"
  | "UNDEFINED";

export type CartUserError = {
  code: CartUserInputErrorType;
  message: string;
};

export type ProductImage = { url: string; label: string | null };

export type CartItem = {
  uid: string;
  quantity: number;
  product: Pick<MagentoProduct, "uid" | "sku" | "name" | "url_key"> & {
    url_suffix: string | null;
    thumbnail: ProductImage | null;
  };
  prices: { row_total_including_tax: Money } | null;
};

export type Cart = {
  id: string;
  total_quantity: number;
  itemsV2: {
    total_count: number;
    items: CartItem[];
  } | null;
  prices: {
    subtotal_excluding_tax: Money;
    grand_total: Money | null;
  } | null;
};

export type CreateEmptyCartResult = { createEmptyCart: string };

/*
  `cart` is nullable on purpose. The docs do not guarantee it, and the sibling
  `addProductsToNewCart` demonstrably answers `"cart": null` alongside a
  PRODUCT_NOT_FOUND — so a CART_ID_INVALID here has no cart to return either.
*/
export type AddProductsToCartResult = {
  addProductsToCart: {
    cart: Cart | null;
    user_errors: CartUserError[];
  };
};

export type CartResult = { cart: Cart | null };

/*
  `UpdateCartItemsOutput` carries ONLY `cart` on this backend — no `errors`,
  no `user_errors`. The 2.4.8 reference documents an `errors` field, but
  introspecting the live schema shows it absent, and selecting it fails the
  whole request with "Cannot query field \"errors\"". Confirm against the
  target instance before adding it back.

  Failures therefore arrive as top-level GraphQL errors with
  `updateCartItems: null`, which the transport already turns into a
  GraphQLResponseError.
*/
export type UpdateCartItemsResult = {
  updateCartItems: { cart: Cart } | null;
};

/*
  `customerCart` and `mergeCarts` both resolve to a non-null `Cart!` in the
  schema — unlike `addProductsToCart`, there is no payload wrapper and no
  `user_errors` channel here. A failure on either arrives only as a top-level
  GraphQL error, already turned into a GraphQLResponseError by the transport.
*/
export type CustomerCartResult = { customerCart: Cart };
export type MergeCartsResult = { mergeCarts: Cart };

// ── Customer ─────────────────────────────────────────────────────────────────

export type GenerateCustomerTokenResult = {
  generateCustomerToken: { token: string } | null;
};

export type RevokeCustomerTokenResult = {
  revokeCustomerToken: { result: boolean } | null;
};

/*
  Magento core has no `company` field on Customer itself — company lives on
  the address book, so the default billing address is where a B2B account
  name actually comes from.
*/
export type CustomerAddress = {
  company: string | null;
  default_billing: boolean | null;
};

export type Customer = {
  firstname: string;
  lastname: string;
  email: string;
  addresses: CustomerAddress[] | null;
};

export type CustomerResult = { customer: Customer | null };
