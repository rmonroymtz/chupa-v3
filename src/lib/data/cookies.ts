import { cookies } from "next/headers";

/*
  Guest cart session.

  The masked cart id Magento hands back IS the session: whoever holds it can
  read and modify that cart. So it lives in an httpOnly cookie — unreachable
  from JavaScript, and therefore from an XSS payload. localStorage would put
  it one `document` read away from any injected script.
*/

export const CART_ID_COOKIE = "cp_cart_id";

const CART_ID_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export async function readCartId(): Promise<string | null> {
  const store = await cookies();
  return store.get(CART_ID_COOKIE)?.value ?? null;
}

/**
 * Only callable from a Server Function or Route Handler — setting cookies
 * during Server Component rendering is not supported, because the response
 * headers are already on their way out. See
 * node_modules/next/dist/docs/01-app/03-api-reference/04-functions/cookies.md.
 */
export async function writeCartId(cartId: string): Promise<void> {
  const store = await cookies();

  store.set(CART_ID_COOKIE, cartId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CART_ID_MAX_AGE_SECONDS,
  });
}

export async function clearCartId(): Promise<void> {
  const store = await cookies();
  store.delete(CART_ID_COOKIE);
}
