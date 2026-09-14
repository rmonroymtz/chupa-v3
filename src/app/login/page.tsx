import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/account/login-form";
import { Container } from "@/components/layout/container";
import { readCustomerToken } from "@/lib/data/cookies";

export const metadata: Metadata = { title: "Iniciar sesión · Chupaprecios" };

export default async function LoginPage() {
  const token = await readCustomerToken();

  /* An already-signed-in visitor has no business on the login screen. */
  if (token) {
    redirect("/");
  }

  return (
    /*
      `min-h` rather than `flex-1`: <main> in the root layout is a plain block,
      so a flex-grow on one of its children is inert. Reserving the height
      here is what actually lets the form sit centred on the screen.
    */
    <Container
      size="shell"
      className="flex min-h-[60vh] items-center justify-center py-16"
    >
      <div className="w-full max-w-sm">
        <h1 className="text-h2 font-display mb-6 text-center text-balance">
          Iniciar sesión
        </h1>
        <LoginForm />
      </div>
    </Container>
  );
}
