import { AccountMenu } from "@/components/account/account-menu";
import { SignInLink } from "@/components/account/sign-in-link";
import { defaultAccountItems, toAccountUser } from "@/components/account/view-model";
import { Icon } from "@/components/icons";
import { readCustomerToken } from "@/lib/data/cookies";
import { getCustomer } from "@/lib/magento/customer";

/*
  Server half of the account. No "use client" here on purpose.

  Everything that identifies the backend — the endpoint, the customer token,
  the schema — is read in this module and never leaves it. What crosses to
  the browser is a plain view model, so the client bundle has no way to
  reach Magento even if someone tries.

  It is rendered as a slot from the root layout rather than imported by the
  header: a Client Component cannot import a Server Component, but it can
  render one that was handed to it as an element.
*/

export async function AccountData() {
  const token = await readCustomerToken();

  if (!token) {
    return <SignInLink />;
  }

  let customer = null;

  try {
    customer = await getCustomer(token);
  } catch (error) {
    /*
      This renders in the root layout, so a Magento outage would otherwise
      take down every page on the site. A sign-in link is a far better
      failure than a 500 on the homepage.
    */
    console.error("[account] could not load the customer", error);
  }

  /*
    `getCustomer` returns null for an expired or revoked token, and falling
    back to the signed-out link is the honest rendering of that: the cookie
    is stale, and the next thing this visitor needs is the login screen.

    The cookie itself cannot be cleared here — setting cookies during
    Server Component rendering is unsupported, the same constraint
    `cart-data.tsx` documents — but that is fine: it expires on its own
    (see the 1-hour max age in `cookies.ts`), and the signed-out UI is
    correct in the meantime regardless of whether the cookie is still there.
  */
  if (!customer) {
    return <SignInLink />;
  }

  return <AccountMenu user={toAccountUser(customer)} items={defaultAccountItems} />;
}

/*
  Shown while the account resolves. It renders the same trigger at the same
  size so the header does not shift when the real one arrives — see
  `CartMenuSkeleton` for the same reasoning, including the note that
  <Suspense> streams the document without restoring static prerendering.
*/
export function AccountMenuSkeleton() {
  return (
    <span
      aria-hidden="true"
      className="text-body-m inline-flex items-center gap-2 text-foreground opacity-50"
    >
      <Icon name="user" size={20} />
      <span className="hidden lg:inline">Mi cuenta</span>
    </span>
  );
}
