"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { adoptGuestCart, releaseCustomerCart } from "@/lib/data/cart-session";
import { clearCustomerToken, readCustomerToken, writeCustomerToken } from "@/lib/data/cookies";
import { InvalidCredentialsError, signIn, signOut } from "@/lib/magento/customer";

/*
  Every customer-session mutation lives here, and only here — the same split
  `cart/actions.ts` uses, for the same reason: this is the one place allowed
  to write the customer-token cookie.
*/

export type SignInState = { ok: true } | { ok: false; message: string } | null;

/* The header renders in the root layout, so the whole layout re-renders. */
function refreshAccount() {
  revalidatePath("/", "layout");
}

export async function signInAction(
  _prevState: SignInState,
  formData: FormData,
): Promise<SignInState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { ok: false, message: "Escribe tu correo y tu contraseña." };
  }

  let token: string;

  try {
    token = await signIn({ email, password });
    await writeCustomerToken(token);
    /*
      Has to happen here, inside the Server Action, while there is still a
      response to attach a Set-Cookie header to — repointing the cart cookie
      is a cookie write, and cookies can only be written from a Server
      Action or Route Handler, never from a Server Component render.
    */
    await adoptGuestCart(token);
    refreshAccount();
  } catch (error) {
    if (error instanceof InvalidCredentialsError) {
      return { ok: false, message: "El correo o la contraseña no son correctos." };
    }

    /*
      A Server Action's return value crosses to the browser, so upstream
      messages never get forwarded verbatim — same reasoning as
      `cart/actions.ts`'s `toResult`. Only the shopper-facing part is
      returned, and the rest is logged server-side.
    */
    console.error("[account] sign-in failed", error);
    return { ok: false, message: "No pudimos iniciar sesión. Intenta de nuevo." };
  }

  /*
    `redirect` throws a NEXT_REDIRECT control-flow error, so it must be
    called outside the try/catch above — a catch block would swallow it and
    turn a successful login into a generic failure message. See
    node_modules/next/dist/docs/01-app/03-api-reference/04-functions/redirect.md
    ("redirect should be called outside the try block").
  */
  redirect("/");
}

export async function signOutAction(): Promise<void> {
  const token = await readCustomerToken();

  if (token) {
    await signOut(token);
  }

  await clearCustomerToken();
  await releaseCustomerCart();
  refreshAccount();
  redirect("/");
}
