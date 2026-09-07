import {
  ActivityIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  AwardIcon,
  BellIcon,
  BriefcaseIcon,
  CameraIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  CircleCheckIcon,
  CircleXIcon,
  ClockIcon,
  CoffeeIcon,
  CpuIcon,
  CreditCardIcon,
  DollarSignIcon,
  DropletIcon,
  EyeIcon,
  FileTextIcon,
  FilterIcon,
  FolderIcon,
  Grid3x3Icon,
  HeartIcon,
  HomeIcon,
  InfoIcon,
  KeyIcon,
  LayersIcon,
  Link2Icon,
  ListIcon,
  LoaderIcon,
  LockIcon,
  LogInIcon,
  LogOutIcon,
  type LucideIcon,
  MapPinIcon,
  MessageCircleIcon,
  MenuIcon,
  MinusIcon,
  MousePointerIcon,
  NavigationIcon,
  PackageIcon,
  PhoneCallIcon,
  PlusIcon,
  ReceiptIcon,
  RefreshCwIcon,
  RulerIcon,
  SearchIcon,
  SendIcon,
  SettingsIcon,
  ShareIcon,
  SunIcon,
  ShieldIcon,
  ShoppingBagIcon,
  ShoppingCartIcon,
  StarIcon,
  TagIcon,
  ThermometerIcon,
  TrashIcon,
  TriangleAlertIcon,
  TruckIcon,
  UserIcon,
  UserPlusIcon,
  WrenchIcon,
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

  Three buckets, matching how the boards are split:
    v3Icons          board 02, the 41-glyph catalogue
    additionalIcons  board 04, the 23 added by the v4 revision of 2026-09
    extraIcons       on-demand glyphs that are on no board
  Keeping them apart means a board revision can be re-derived without
  clobbering the on-demand ones. Add new icons to `extraIcons`, never inline
  into a component.
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

/*
  Board 04 "Iconos Adicionales" (23), added by the v4 revision of 2026-09 for
  Home, PLP and the B2B / My Account flows. `tool` is the one name with no
  lucide equivalent left: feather's tool became Wrench.
*/
export const additionalIcons = {
  tool: WrenchIcon,
  package: PackageIcon,
  cpu: CpuIcon,
  coffee: CoffeeIcon,
  briefcase: BriefcaseIcon,
  sun: SunIcon,
  navigation: NavigationIcon,
  trash: TrashIcon,
  activity: ActivityIcon,
  tag: TagIcon,
  clock: ClockIcon,
  "phone-call": PhoneCallIcon,
  "link-2": Link2Icon,
  "message-circle": MessageCircleIcon,
  settings: SettingsIcon,
  "log-out": LogOutIcon,
  "dollar-sign": DollarSignIcon,
  list: ListIcon,
  filter: FilterIcon,
  "chevron-left": ChevronLeftIcon,
  camera: CameraIcon,
  thermometer: ThermometerIcon,
  ruler: RulerIcon,
} satisfies Record<string, LucideIcon>;

/*
  On-demand glyphs the storefront needs that are on no board. Add here, never
  inline into a component, so the next board revision can absorb them.
*/
export const extraIcons = {
  minus: MinusIcon,
  plus: PlusIcon,
} satisfies Record<string, LucideIcon>;

export const icons = { ...v3Icons, ...additionalIcons, ...extraIcons };

export type IconName = keyof typeof icons;

export const iconNames = Object.keys(icons) as IconName[];
