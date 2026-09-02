import * as React from "react";

type SectionProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

export function Section({ title, description, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-col gap-0.5">
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {description ? (
          <p className="text-muted-foreground text-sm">{description}</p>
        ) : null}
      </div>
      <div className="rounded-xl border p-6">{children}</div>
    </section>
  );
}
