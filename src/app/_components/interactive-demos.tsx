"use client";

import * as React from "react";
import {
  BellIcon,
  EllipsisVerticalIcon,
  PanelRightIcon,
  SettingsIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ErrorState } from "@/components/common/error-state";

export function FormsDemo() {
  return (
    <form
      className="grid gap-6 sm:grid-cols-2"
      onSubmit={(event) => {
        event.preventDefault();
        toast.success("Form submitted", {
          description: "This demo does not send anything anywhere.",
        });
      }}
    >
      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-product">Product</Label>
        <Input id="demo-product" placeholder="Milk 1 L" />
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="demo-store">Store</Label>
        <Select>
          <SelectTrigger id="demo-store">
            <SelectValue placeholder="Select a store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="walmart">Walmart</SelectItem>
            <SelectItem value="soriana">Soriana</SelectItem>
            <SelectItem value="chedraui">Chedraui</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2 sm:col-span-2">
        <Label htmlFor="demo-notes">Notes</Label>
        <Textarea id="demo-notes" placeholder="Anything worth remembering…" />
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium">Frequency</span>
        <RadioGroup defaultValue="daily" className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <RadioGroupItem value="daily" id="freq-daily" />
            <Label htmlFor="freq-daily" className="font-normal">
              Daily
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <RadioGroupItem value="weekly" id="freq-weekly" />
            <Label htmlFor="freq-weekly" className="font-normal">
              Weekly
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm font-medium">Preferences</span>
        <div className="flex items-center gap-2">
          <Checkbox id="pref-offers" defaultChecked />
          <Label htmlFor="pref-offers" className="font-normal">
            Only show offers
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch id="pref-alerts" />
          <Label htmlFor="pref-alerts" className="font-normal">
            Price drop alerts
          </Label>
        </div>
      </div>

      <div className="flex gap-2 sm:col-span-2">
        <Button type="submit">Save</Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => toast("Nothing was saved.")}
        >
          <BellIcon data-icon="inline-start" />
          Send a toast
        </Button>
      </div>
    </form>
  );
}

export function OverlaysDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Open dialog</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete tracked product</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Its price history will be removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button variant="destructive">Delete</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">
            <PanelRightIcon data-icon="inline-start" />
            Open sheet
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Filters</SheetTitle>
            <SheetDescription>
              Side panels are useful for filters and secondary forms.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Open popover</Button>
        </PopoverTrigger>
        <PopoverContent className="w-72">
          <PopoverHeader>
            <PopoverTitle>Price range</PopoverTitle>
            <PopoverDescription>
              Anchored content that does not block the page.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" aria-label="Open menu">
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Settings">
            <SettingsIcon />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Settings</TooltipContent>
      </Tooltip>
    </div>
  );
}

export function DisclosureDemo() {
  return (
    <div className="flex flex-col gap-8">
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="stores">Stores</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="text-muted-foreground text-sm">
          Default tabs variant.
        </TabsContent>
        <TabsContent value="history" className="text-muted-foreground text-sm">
          Each panel only mounts its own content.
        </TabsContent>
        <TabsContent value="stores" className="text-muted-foreground text-sm">
          Keyboard navigation comes from Radix.
        </TabsContent>
      </Tabs>

      <Tabs defaultValue="day">
        <TabsList variant="line">
          <TabsTrigger value="day">Day</TabsTrigger>
          <TabsTrigger value="week">Week</TabsTrigger>
          <TabsTrigger value="month">Month</TabsTrigger>
        </TabsList>
        <TabsContent value="day" className="text-muted-foreground text-sm">
          The <code className="font-mono">line</code> variant of the same
          component.
        </TabsContent>
        <TabsContent value="week" className="text-muted-foreground text-sm">
          Week panel.
        </TabsContent>
        <TabsContent value="month" className="text-muted-foreground text-sm">
          Month panel.
        </TabsContent>
      </Tabs>

      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger>How often are prices updated?</AccordionTrigger>
          <AccordionContent>
            Accordion content is collapsible and keyboard accessible.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Can I compare across stores?</AccordionTrigger>
          <AccordionContent>
            Yes — this is only a visual placeholder.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export function ErrorStateDemo() {
  return (
    <ErrorState
      onRetry={() => toast.info("Retry handler fired.")}
      description="ErrorState is a client component because it takes an onRetry callback."
    />
  );
}
