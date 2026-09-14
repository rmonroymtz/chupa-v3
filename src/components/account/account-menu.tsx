"use client";

import * as React from "react";

import { AccountPanel } from "@/components/account/account-panel";
import { signOutAction } from "@/components/account/actions";
import type { AccountItem, AccountUser } from "@/components/account/view-model";
import { Icon } from "@/components/icons";
import { usePanel } from "@/components/ui/panel-group";

/*
  The interactive half of the account menu, mirroring `cart-menu.tsx`: the
  trigger, the open/close wiring, and the dispatch of the Server Action. It
  only renders once a customer is confirmed signed in — `account-data.tsx`
  is the one that decides whether this or `SignInLink` mounts.
*/

export function AccountMenu({
  user,
  items,
}: {
  user: AccountUser;
  items: AccountItem[];
}) {
  const { isOpen, toggle, close } = usePanel("account");
  const [, startTransition] = React.useTransition();

  const signOut = () => {
    startTransition(async () => {
      await signOutAction();
    });
    close();
  };

  return (
    <>
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={toggle}
        className="text-body-m inline-flex cursor-pointer items-center gap-2 text-foreground"
      >
        <Icon name="user" size={20} />
        <span className="hidden lg:inline">Mi cuenta</span>
      </button>

      {isOpen && (
        <AccountPanel
          user={user}
          items={items}
          onSelect={close}
          onSignOut={signOut}
        />
      )}
    </>
  );
}
