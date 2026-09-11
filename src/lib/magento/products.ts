import { magentoFetch } from "@/lib/magento/client";
import type {
  ProductAttributeFilterInput,
  ProductAttributeSortInput,
  ProductsResult,
} from "@/lib/magento/types";

/*
  Catalogue is public and slow-moving, so it is the one thing here worth
  caching. The tag lets a Magento webhook drop it with `revalidateTag`.
*/
const PRODUCTS_REVALIDATE_SECONDS = 300;
export const PRODUCTS_CACHE_TAG = "magento:products";

const PRODUCT_FIELDS = /* GraphQL */ `
  fragment ProductFields on ProductInterface {
    uid
    sku
    name
    url_key
    stock_status
    small_image {
      url
      label
    }
    price_range {
      minimum_price {
        regular_price {
          value
          currency
        }
        final_price {
          value
          currency
        }
        discount {
          amount_off
          percent_off
        }
      }
    }
  }
`;

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products(
    $search: String
    $filter: ProductAttributeFilterInput
    $pageSize: Int
    $currentPage: Int
    $sort: ProductAttributeSortInput
  ) {
    products(
      search: $search
      filter: $filter
      pageSize: $pageSize
      currentPage: $currentPage
      sort: $sort
    ) {
      total_count
      items {
        ...ProductFields
      }
      page_info {
        current_page
        page_size
        total_pages
      }
    }
  }
  ${PRODUCT_FIELDS}
`;

export type GetProductsArgs = {
  search?: string;
  filter?: ProductAttributeFilterInput;
  pageSize?: number;
  currentPage?: number;
  sort?: ProductAttributeSortInput;
};

export async function getProducts({
  search,
  filter,
  pageSize = 20,
  currentPage = 1,
  sort,
}: GetProductsArgs): Promise<ProductsResult["products"]> {
  /*
    Magento rejects a `products` query that carries neither `search` nor
    `filter`. Failing here keeps that from surfacing as an opaque 200-with-
    errors response from the server.
  */
  if (!search && !filter) {
    throw new Error(
      "getProducts requires `search`, `filter`, or both — Magento rejects a " +
        "products query with neither.",
    );
  }

  const data = await magentoFetch<ProductsResult>({
    query: PRODUCTS_QUERY,
    variables: { search, filter, pageSize, currentPage, sort },
    revalidate: PRODUCTS_REVALIDATE_SECONDS,
    tags: [PRODUCTS_CACHE_TAG],
  });

  return data.products;
}

/** Single product by SKU — `products` with an exact filter, not a `product` query. */
export async function getProductBySku(sku: string) {
  const { items } = await getProducts({ filter: { sku: { eq: sku } }, pageSize: 1 });
  return items[0] ?? null;
}
