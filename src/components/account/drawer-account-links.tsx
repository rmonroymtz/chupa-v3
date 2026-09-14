import Link from "next/link";

import { signOutAction } from "@/components/account/actions";
import { defaultDrawerLinks } from "@/components/account/view-model";
import { readCustomerToken } from "@/lib/data/cookies";

/*
  Mobile drawer's account section, session-aware.

  Only reads the cookie — it must NOT run the `customer` query, because the
  drawer needs nothing but the boolean "is there a session". Loading the
  full customer here would duplicate the work `AccountData` already does for
  the desktop trigger, for a query whose result this component never uses.
*/

export async function DrawerAccountLinks() {
  const token = await readCustomerToken();

  if (!token) {
    return (
      <Link
        href="/login"
        className="block py-3 text-left text-base font-semibold text-foreground"
      >
        Iniciar sesión
      </Link>
    );
  }

  return (
    <>
      {defaultDrawerLinks.map((link) => (
        <button
          key={link}
          type="button"
          className="cursor-pointer py-3 text-left text-base font-semibold text-foreground"
        >
          {link}
        </button>
      ))}
      <form action={signOutAction}>
        <button
          type="submit"
          className="cursor-pointer py-3 text-left text-base font-semibold text-text-link"
        >
          Cerrar sesión
        </button>
      </form>
    </>
  );
}
