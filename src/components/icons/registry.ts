import {
  ArrowLeftIcon,
  ArrowRightIcon,
  AwardIcon,
  BellIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  CircleCheckIcon,
  CircleXIcon,
  CreditCardIcon,
  DollarSignIcon,
  DropletIcon,
  EyeIcon,
  FileTextIcon,
  FolderIcon,
  Grid3x3Icon,
  HeartIcon,
  HomeIcon,
  InfoIcon,
  KeyIcon,
  LayersIcon,
  ListIcon,
  LoaderIcon,
  LockIcon,
  LogInIcon,
  LogOutIcon,
  type LucideIcon,
  MapPinIcon,
  MenuIcon,
  MinusIcon,
  MousePointerIcon,
  PackageIcon,
  PlusIcon,
  ReceiptIcon,
  RefreshCwIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  ShareIcon,
  ShieldIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  StarIcon,
  TriangleAlertIcon,
  TruckIcon,
  UserIcon,
  UserPlusIcon,
  XIcon,
  ZapIcon,
} from "lucide-react";

/*
  Design System v3 icon roster.

  The design system ships its own 24x24 outline set, but every glyph in it is a
  lucide icon, so this maps the design system's names to lucide components
  instead of duplicating the SVG paths. Keys are the design system names; a few
  lucide exports have since been renamed (check-circle -> CircleCheck), which is
  exactly what this table absorbs.

  `v3Icons` is the roster from the standalone "Iconografía" board. `extraIcons`
  holds glyphs the storefront needs that were not on that board — the design
  system keeps the same split so regenerating the board set never clobbers them.
  Add new icons to `extraIcons`, never inline into a component.
*/
export const v3Icons = {
  home: HomeIcon,
  grid: Grid3x3Icon,
  "shopping-cart": ShoppingCartIcon,
  user: UserIcon,
  search: SearchIcon,
  "shopping-bag": ShoppingBagIcon,
  "user-plus": UserPlusIcon,
  "log-in": LogInIcon,
  key: KeyIcon,
  check: CheckIcon,
  "check-circle": CircleCheckIcon,
  "arrow-right": ArrowRightIcon,
  "file-text": FileTextIcon,
  receipt: ReceiptIcon,
  "map-pin": MapPinIcon,
  send: SendIcon,
  heart: HeartIcon,
  x: XIcon,
  bell: BellIcon,
  menu: MenuIcon,
  loader: LoaderIcon,
  "chevron-right": ChevronRightIcon,
  "x-circle": CircleXIcon,
  "alert-triangle": TriangleAlertIcon,
  info: InfoIcon,
  lock: LockIcon,
  shield: ShieldIcon,
  award: AwardIcon,
  "mouse-pointer": MousePointerIcon,
  "refresh-cw": RefreshCwIcon,
  layers: LayersIcon,
  droplet: DropletIcon,
  zap: ZapIcon,
  "arrow-left": ArrowLeftIcon,
  "chevron-down": ChevronDownIcon,
  "credit-card": CreditCardIcon,
  eye: EyeIcon,
  folder: FolderIcon,
  share: ShareIcon,
  star: StarIcon,
  truck: TruckIcon,
} satisfies Record<string, LucideIcon>;

export const extraIcons = {
  package: PackageIcon,
  "dollar-sign": DollarSignIcon,
  list: ListIcon,
  settings: SettingsIcon,
  "log-out": LogOutIcon,
  minus: MinusIcon,
  plus: PlusIcon,
} satisfies Record<string, LucideIcon>;

export const icons = { ...v3Icons, ...extraIcons };

export type IconName = keyof typeof icons;

export const iconNames = Object.keys(icons) as IconName[];
