"use client";

import { Icon } from "@/components/icons";
import { panelAnchor, panelSurface } from "@/components/layout/panel-surface";
import type { AccountItem, AccountUser } from "@/components/account/view-model";
import { cn } from "@/lib/utils";

/*
  Presentational half of the account menu, moved out of `header.tsx`
  unchanged apart from `user.company` now being nullable — a guest-turned-
  customer with no billing address yet has no company to show.
*/

export function AccountPanel({
  user,
  items,
  onSelect,
  onSignOut,
}: {
  user: AccountUser;
  items: AccountItem[];
  onSelect: (item: AccountItem) => void;
  onSignOut: () => void;
}) {
  return (
    <div
      role="menu"
      aria-label="Mi cuenta"
      className={cn(
        panelSurface,
        panelAnchor,
        "right-0 w-[300px] overflow-hidden pb-2",
      )}
    >
      <div className="flex items-center gap-3 border-b border-neutral-100 p-4">
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-anchor text-body-m font-bold text-primary-foreground"
        >
          {user.initials}
        </span>
        <span>
          <span className="block text-body-m font-bold text-foreground">
            Bienvenido, {user.name}
          </span>
          {user.company && (
            <span className="block text-caption text-muted-foreground">
              {user.company}
            </span>
          )}
        </span>
      </div>

      <ul className="m-0 list-none py-1">
        {items.map((item) => (
          <li key={item.label}>
            <button
              type="button"
              role="menuitem"
              onClick={() => onSelect(item)}
              className="text-body-m flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left text-foreground hover:bg-muted"
            >
              <Icon
                name={item.icon}
                size={18}
                className="shrink-0 text-muted-foreground"
              />
              <span className="flex-1">{item.label}</span>
              {item.value && (
                <span
                  className={cn(
                    "font-bold",
                    item.tone === "success"
                      ? "text-success"
                      : "text-brand-anchor",
                  )}
                >
                  {item.value}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onSignOut}
        className="text-body-m mt-1 flex w-full cursor-pointer items-center gap-3 border-t border-neutral-100 px-4 py-3 text-left font-semibold text-text-link hover:bg-muted"
      >
        <Icon name="log-out" size={18} />
        Cerrar sesión
      </button>
    </div>
  );
}
