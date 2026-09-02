import Link from "next/link";
import { ArrowRightIcon } from "lucide-react";

import { Container } from "@/components/common/container";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <Container className="flex flex-1 flex-col justify-center gap-6 py-20">
      <div className="flex flex-col gap-3">
        <p className="text-overline text-muted-foreground uppercase">
          Chupaprecios
        </p>
        <h1 className="text-h1 font-display text-balance">
          Compara precios en las tiendas más grandes de México
        </h1>
        <p className="text-body-l text-muted-foreground max-w-prose text-pretty">
          El sitio todavía no tiene pantallas. La base de componentes y los
          tokens del Design System v3 ya están listos.
        </p>
      </div>
      <div>
        <Button asChild size="lg">
          <Link href="/design-system">
            Ver el design system
            <ArrowRightIcon data-icon="inline-end" />
          </Link>
        </Button>
      </div>
    </Container>
  );
}
