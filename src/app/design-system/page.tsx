import {
  ArrowUpRightIcon,
  InfoIcon,
  SearchIcon,
  TriangleAlertIcon,
} from "lucide-react";

import { Container } from "@/components/common/container";
import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { ThemeToggle } from "@/components/common/theme-toggle";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Section } from "./_components/section";
import {
  DisclosureDemo,
  ErrorStateDemo,
  FormsDemo,
  OverlaysDemo,
} from "./_components/interactive-demos";

export const metadata = {
  title: "Design System · Chupaprecios",
  description:
    "Component library and design tokens for the Chupaprecios Design System v3.",
};

const brandScale = [
  { name: "50", value: "var(--brand-50)" },
  { name: "100", value: "var(--brand-100)" },
  { name: "200", value: "var(--brand-200)" },
  { name: "300", value: "var(--brand-300)" },
  { name: "400", value: "var(--brand-400)" },
  { name: "500", value: "var(--brand-500)" },
  { name: "600 · anchor", value: "var(--brand-600)" },
  { name: "700 · CTA", value: "var(--brand-700)" },
  { name: "800 · hover", value: "var(--brand-800)" },
  { name: "900 · pressed", value: "var(--brand-900)" },
];

const prices = [
  { store: "Walmart", price: "$28.50", change: "-4.2%", trend: "down" },
  { store: "Soriana", price: "$29.90", change: "+1.1%", trend: "up" },
  { store: "Chedraui", price: "$31.00", change: "0.0%", trend: "flat" },
];

export default function Home() {
  return (
    <Container className="flex flex-col gap-10 py-10">
      <PageHeader
        title="Component library"
        description="Chupaprecios Design System v3 applied to the shadcn primitives in src/components/ui and the shared pieces in src/components/common."
        actions={
          <>
            <Badge variant="secondary">Design System v3</Badge>
            <ThemeToggle />
          </>
        }
      />

      <Section
        title="Design tokens"
        description="Brand scale, type scale, elevation and e-commerce colors from the design system."
      >
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-3">
            <p className="text-overline text-muted-foreground uppercase">
              Brand scale
            </p>
            <div className="flex flex-wrap gap-2">
              {brandScale.map((step) => (
                <div key={step.name} className="flex flex-col gap-1.5">
                  <div
                    className="size-16 rounded-lg border"
                    style={{ background: step.value }}
                  />
                  <span className="text-caption text-muted-foreground">
                    {step.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-overline text-muted-foreground uppercase">
              Type scale
            </p>
            <div className="flex flex-col gap-2">
              <p className="text-h1 font-display">Heading 1 · Roboto Flex 32/40</p>
              <p className="text-h2 font-display">Heading 2 · Roboto Flex 24/32</p>
              <p className="text-h3">Heading 3 · Inter 20/28</p>
              <p className="text-body-l">Body L · Inter 16/24</p>
              <p className="text-body-m text-muted-foreground">
                Body M · Inter 14/20
              </p>
              <p className="text-caption text-muted-foreground">
                Caption · Inter 12/16
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-overline text-muted-foreground uppercase">
              Elevation
            </p>
            <div className="flex flex-wrap gap-4">
              {/* Class names are written out: Tailwind cannot see interpolated ones. */}
              <div className="bg-card text-caption flex size-24 items-center justify-center rounded-xl border shadow-e1">
                e1
              </div>
              <div className="bg-card text-caption flex size-24 items-center justify-center rounded-xl border shadow-e2">
                e2
              </div>
              <div className="bg-card text-caption flex size-24 items-center justify-center rounded-xl border shadow-e3">
                e3
              </div>
              <div className="bg-card text-caption flex size-24 items-center justify-center rounded-xl border shadow-e4">
                e4
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-overline text-muted-foreground uppercase">
              Semantic roles
            </p>
            <div className="flex flex-col gap-1.5">
              <p className="text-body-m">
                <span className="text-text-link underline">Inline link</span> and{" "}
                <span className="text-text-error">inline validation error</span>{" "}
                both use brand/700 — the banner error below is a different token.
              </p>
              <div className="border-border-error bg-danger-subtle text-body-s rounded-lg border p-3">
                Field-level error: border and text use brand/700.
              </div>
              <div className="text-danger bg-danger-subtle text-body-s rounded-lg p-3">
                Feedback banner: this red is #EF4444, not the brand red.
              </div>
              <div className="bg-surface-muted text-text-disabled text-body-s rounded-lg p-3">
                Disabled fill and disabled text.
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-overline text-muted-foreground uppercase">
              E-commerce
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-price-sale text-h3 font-semibold">$999</span>
              <span className="text-price-compare text-body-m line-through">
                $1,299
              </span>
              <span className="bg-badge-new rounded-sm px-2 py-0.5 text-xs font-semibold text-white">
                NUEVO
              </span>
              <span className="bg-badge-sale rounded-sm px-2 py-0.5 text-xs font-semibold text-white">
                OFERTA
              </span>
              <span className="bg-badge-shipping rounded-sm px-2 py-0.5 text-xs font-semibold text-white">
                ENVÍO GRATIS
              </span>
              <span className="bg-badge-last-units rounded-sm px-2 py-0.5 text-xs font-semibold text-white">
                ÚLTIMAS UNIDADES
              </span>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="Button"
        description="Variants and sizes. Icons use data-icon to adjust padding."
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="link">Link</Button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="xs">Extra small</Button>
            <Button size="sm">Small</Button>
            <Button>Default</Button>
            <Button size="lg">Large</Button>
            <Button size="icon" aria-label="Search">
              <SearchIcon />
            </Button>
            <Button variant="outline">
              Documentation
              <ArrowUpRightIcon data-icon="inline-end" />
            </Button>
            <Button disabled>Disabled</Button>
          </div>
        </div>
      </Section>

      <Section title="Badge" description="Status and metadata labels.">
        <div className="flex flex-wrap items-center gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="ghost">Ghost</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </Section>

      <Section
        title="Alert"
        description="An svg child switches the layout to a two-column grid."
      >
        <div className="flex flex-col gap-3">
          <Alert>
            <InfoIcon />
            <AlertTitle>Prices updated</AlertTitle>
            <AlertDescription>
              The last run finished 12 minutes ago.
            </AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <TriangleAlertIcon />
            <AlertTitle>Two stores failed to respond</AlertTitle>
            <AlertDescription>
              Their prices may be out of date.
            </AlertDescription>
          </Alert>
        </div>
      </Section>

      <Section
        title="Card and Avatar"
        description="Composition with CardAction and stacked avatars."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Milk 1 L</CardTitle>
              <CardDescription>Tracked across 3 stores</CardDescription>
              <CardAction>
                <Badge variant="secondary">-4.2%</Badge>
              </CardAction>
            </CardHeader>
            <CardContent className="text-muted-foreground text-sm">
              The lowest price today is $28.50 at Walmart.
            </CardContent>
            <CardFooter>
              <Button size="sm" variant="outline">
                View history
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Watchers</CardTitle>
              <CardDescription>People following this product</CardDescription>
            </CardHeader>
            <CardContent>
              <AvatarGroup>
                <Avatar>
                  <AvatarFallback>RM</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>AL</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>JP</AvatarFallback>
                </Avatar>
                <AvatarGroupCount>+8</AvatarGroupCount>
              </AvatarGroup>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section title="Form controls" description="Client island — this block ships JavaScript.">
        <FormsDemo />
      </Section>

      <Section
        title="Overlays"
        description="Dialog, Sheet, Popover, DropdownMenu and Tooltip."
      >
        <OverlaysDemo />
      </Section>

      <Section title="Tabs and Accordion" description="Disclosure patterns.">
        <DisclosureDemo />
      </Section>

      <Section title="Table" description="Static data rendered on the server.">
        <Table>
          <TableCaption>Prices for Milk 1 L, updated today.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Store</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Change</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prices.map((row) => (
              <TableRow key={row.store}>
                <TableCell className="font-medium">{row.store}</TableCell>
                <TableCell>{row.price}</TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant={row.trend === "down" ? "secondary" : "outline"}
                  >
                    {row.change}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>

      <Section
        title="Navigation"
        description="Breadcrumb and Pagination."
      >
        <div className="flex flex-col gap-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">Groceries</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Milk 1 L</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>
                  2
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </Section>

      <Section
        title="Skeleton, Separator and ScrollArea"
        description="Loading and layout helpers."
      >
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <Skeleton className="size-10 rounded-full" />
            <div className="flex flex-1 flex-col gap-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>

          <Separator />

          <ScrollArea className="h-32 rounded-lg border p-4">
            <div className="flex flex-col gap-2 text-sm">
              {Array.from({ length: 12 }, (_, index) => (
                <span key={index}>Scrollable row {index + 1}</span>
              ))}
            </div>
          </ScrollArea>
        </div>
      </Section>

      <Section
        title="Shared states"
        description="EmptyState renders on the server; ErrorState needs a client boundary."
      >
        <div className="grid gap-4 md:grid-cols-2">
          <EmptyState
            title="No tracked products yet"
            description="Add your first product to start comparing prices."
            action={<Button size="sm">Add product</Button>}
          />
          <ErrorStateDemo />
        </div>
      </Section>
    </Container>
  );
}
