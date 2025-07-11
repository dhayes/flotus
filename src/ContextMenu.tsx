// ContextMenu.tsx

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";
import React from "react";

type ContextMenuItem = {
  onClick: () => void;
  label: string;
  category?: string; // e.g. "Math/Arithmetic"
  icon?: React.ReactNode;
};

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  items: Array<ContextMenuItem>;
}

// Category tree with optional __items at each node
type CategoryTree = {
  [key: string]: CategoryTree | ContextMenuItem[];
  __items__?: ContextMenuItem[];
};

function buildCategoryTree(items: ContextMenuItem[]): CategoryTree {
  const root: CategoryTree = {};

  for (const item of items) {
    const parts = item.category?.split("/") ?? [];
    let current = root;

    for (const part of parts) {
      if (!current[part]) current[part] = {};
      current = current[part] as CategoryTree;
    }

    if (!current.__items__) current.__items__ = [];
    current.__items__.push(item);
  }

  return root;
}

const renderMenu = (tree: CategoryTree): React.ReactNode[] => {
  return Object.entries(tree).map(([key, value]) => {
    if (key === "__items__") return null; // handled separately

    const node = value as CategoryTree;
    const items = node.__items__ ?? [];

    return (
      <DropdownMenuSub key={key}>
        <DropdownMenuSubTrigger className="hover:bg-zinc-700">
          {key}
        </DropdownMenuSubTrigger>
        <DropdownMenuPortal>
          <DropdownMenuSubContent className="bg-zinc-800 text-white border-none shadow-md rounded-md">
            {items.length > 0 && (
              <DropdownMenuGroup>
                {items.map((item, idx) => (
                  <DropdownMenuItem
                    key={idx}
                    onClick={item.onClick}
                    className="hover:bg-zinc-700 cursor-pointer"
                  >
                    {item.icon && <span className="mr-2">{item.icon}</span>}
                    {item.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            )}
            {renderMenu(node)}
          </DropdownMenuSubContent>
        </DropdownMenuPortal>
      </DropdownMenuSub>
    );
  }).filter(Boolean);
};

const ContextMenu: React.FC<ContextMenuProps> = (props) => {
  if (!props.isOpen) return null;

  const tree = buildCategoryTree(props.items);

  return (
    <div
      style={{ position: "absolute", zIndex: 1000 }}
      onMouseLeave={props.onClose}
    >
      <DropdownMenu open={props.isOpen}>
        <DropdownMenuContent
          side="right"
          align="start"
          style={{
            position: "fixed",
            left: `${props.position.x}px`,
            top: `${props.position.y}px`,
          }}
          className="w-48 !bg-zinc-800 text-white shadow-md dark:hover:bg-zinc-700 hover:bg-zinc-700 !border-none border-zinc-700 rounded-md"
        >
          {renderMenu(tree)}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ContextMenu;
