// src/TopMenuBar.tsx

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import { Button } from "@/components/ui/button";
import { createPortal } from "react-dom";
import { useState } from "react";

import { LoginDialog } from "@/components/auth/LoginDialog";
import { SignupDialog } from "@/components/auth/SignupDialog";
import { ResetPasswordDialog } from "@/components/auth/ResetPasswordDialog";

// ---------------------------------------------------------------------------
// Menu Definitions (inline — no external file needed)
// ---------------------------------------------------------------------------
type MenuShortcut = string;
type MenuAction = () => void;

type MenuEntry =
  | {
    type: "item";
    label: string;
    shortcut?: MenuShortcut;
    action?: MenuAction;
    disabled?: boolean;
  }
  | {
    type: "separator";
  };

interface MenuDefinition {
  label: string;
  items: MenuEntry[];
}

const appMenu: MenuDefinition[] = [
  {
    label: "File",
    items: [
      { type: "item", label: "New Project", shortcut: "⌘N", action: () => console.log("new") },
      { type: "item", label: "Open…", shortcut: "⌘O", action: () => console.log("open") },
      { type: "item", label: "Save", shortcut: "⌘S", action: () => console.log("save") },
      { type: "separator" },
      { type: "item", label: "Export as PNG", action: () => console.log("export png") },
      { type: "item", label: "Export as JSON", action: () => console.log("export json") },
    ],
  },
  {
    label: "Edit",
    items: [
      { type: "item", label: "Undo", shortcut: "⌘Z" },
      { type: "item", label: "Redo", shortcut: "⇧⌘Z" },
      { type: "separator" },
      { type: "item", label: "Cut" },
      { type: "item", label: "Copy" },
      { type: "item", label: "Paste" },
    ],
  },
  {
    label: "View",
    items: [
      { type: "item", label: "Reset Zoom" },
      { type: "item", label: "Center Canvas" },
      { type: "item", label: "Toggle Sidebar" },
    ],
  },
  {
    label: "Help",
    items: [
      { type: "item", label: "Documentation" },
      { type: "item", label: "Keyboard Shortcuts" },
      { type: "item", label: "About" },
    ],
  },
];

// ---------------------------------------------------------------------------
// Top Menu Bar Component
// ---------------------------------------------------------------------------
export function TopMenuBar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const triggerClasses =
    "px-2 py-1 font-medium rounded-none " +
    "!bg-transparent !text-zinc-100 hover:!bg-zinc-800 " +
    "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

  const itemClasses =
    "!bg-transparent text-xs !text-zinc-100 " +
    "hover:!bg-zinc-800 focus:!bg-zinc-800 " +
    "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0";

  return createPortal(
    <>
      {/* MENU BAR */}
      <div className="fixed top-0 left-0 right-0 h-8 z-[999999] flex items-center px-2 border-b border-zinc-800 bg-zinc-900">
        <Menubar className="h-7 border-none bg-transparent p-0 text-xs !text-zinc-100">
          {appMenu.map((menu) => (
            <MenubarMenu key={menu.label}>
              <MenubarTrigger className={triggerClasses}>
                {menu.label}
              </MenubarTrigger>

              <MenubarContent className="z-9999 min-w-[180px] border border-zinc-700 bg-zinc-900 text-zinc-100">
                {menu.items.map((entry, i) =>
                  entry.type === "separator" ? (
                    <MenubarSeparator key={i} className="bg-zinc-700" />
                  ) : (
                    <MenubarItem
                      key={i}
                      className={itemClasses}
                      onClick={entry.action}
                    >
                      {entry.label}
                      {entry.shortcut && (
                        <MenubarShortcut>{entry.shortcut}</MenubarShortcut>
                      )}
                    </MenubarItem>
                  )
                )}
              </MenubarContent>
            </MenubarMenu>
          ))}
        </Menubar>

        {/* RIGHT-SIDE AUTH BUTTONS */}
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            className="h-6 text-xs text-zinc-100 hover:bg-zinc-300"
            onClick={() => setShowLogin(true)}
          >
            Log in
          </Button>

          <Button
            className="h-6 text-xs bg-blue-600 hover:bg-blue-700"
            onClick={() => setShowSignup(true)}
          >
            Sign up
          </Button>
        </div>
      </div>

      {/* AUTH DIALOGS */}
      // inside TopMenuBar()
      <LoginDialog
        open={showLogin}
        onOpenChange={setShowLogin}
        onForgotPassword={() => {
          setShowLogin(false);
          setShowReset(true);
        }}
        onSignup={() => {
          setShowLogin(false);
          setShowSignup(true);
        }}
      />


      <SignupDialog
        open={showSignup}
        onOpenChange={setShowSignup}
      />

      <ResetPasswordDialog
        open={showReset}
        onOpenChange={setShowReset}
        onBackToLogin={() => {
          setShowReset(false);
          setShowLogin(true);
        }}
      />
    </>,
    document.body
  );
}
