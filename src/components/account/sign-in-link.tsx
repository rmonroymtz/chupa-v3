import Link from "next/link";

import { Icon } from "@/components/icons";

/*
  Signed-out branch of the account trigger. A Server Component and a plain
  link on purpose: a signed-out visitor has no panel to open, so shipping
  the panel's client code (`account-menu.tsx`, `usePanel`) to them would be
  paying for a menu that can never render.
*/

export function SignInLink() {
  return (
    <Link
      href="/login"
      className="text-body-m inline-flex items-center gap-2 text-foreground"
    >
      <Icon name="user" size={20} />
      <span className="hidden lg:inline">Iniciar sesión</span>
    </Link>
  );
}
