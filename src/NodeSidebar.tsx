// NodeSidebar.tsx

import React, { useMemo, useState } from "react";
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarFooter,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { nodeCatalog } from "./nodeRegistration";
import { cn } from "@/lib/utils";
import { useDrag } from "react-dnd";
import { ChevronDown, ChevronRight, ChartNetwork } from "lucide-react";

interface TreeNode {
    name: string;
    children?: TreeNode[];
    node?: (typeof nodeCatalog)[0];
}

function buildTree(catalog = nodeCatalog): TreeNode[] {
    const root: Record<string, TreeNode> = {};

    for (const node of catalog) {
        const parts = node.category.split("/");
        let current = root;

        for (let i = 0; i < parts.length; i++) {
            const part = parts[i];
            if (!current[part]) current[part] = { name: part };
            if (i === parts.length - 1) {
                if (!current[part].children) current[part].children = [];
                current[part].children.push({ name: node.label, node });
            } else {
                if (!current[part].children) current[part].children = [];
                const next = current[part].children.find((c) => c.name === parts[i + 1]);
                if (!next) {
                    const nextNode = { name: parts[i + 1] };
                    current[part].children.push(nextNode);
                }
                current = Object.fromEntries(
                    current[part].children.map((c) => [c.name, c])
                );
            }
        }
    }

    return Object.values(root);
}

const TreeNodeItem: React.FC<{ node: TreeNode; depth?: number }> = ({ node, depth = 0 }) => {
    const [expanded, setExpanded] = useState(true);
    const isBranch = !!node.children && node.children.length > 0;

    const [{ isDragging }, dragRef] = useDrag(() => ({
        type: "NODE",
        item: { type: node.node?.type },
        canDrag: !!node.node,
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }), [node]);

    return (
        <div className={cn("ml-1", depth > 0 && "border-l border-zinc-700 pl-1")}>
            <div className="flex items-center gap-1 cursor-pointer">
                {isBranch ? (
                    <button className="!bg-zinc-900 !border-none !pl-2" onClick={() => setExpanded(!expanded)}>
                        {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                ) : (
                    <span className="w-[16px]" />
                )}
                {node.node ? (
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <div
                                ref={(el) => { if (el) dragRef(el); }}
                                className={cn("text-sm text-white p-1 hover:bg-zinc-700 rounded", isDragging && "opacity-50")}
                            >
                                {node.name}
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>{node.node.description ?? "No description"}</TooltipContent>
                    </Tooltip>
                ) : (
                    <span className="text-sm text-zinc-300 font-semibold">{node.name}</span>
                )}
            </div>
            {expanded && isBranch && (
                <div className="pl-3">
                    {node.children!.map((child, i) => (
                        <TreeNodeItem key={i} node={child} depth={depth + 1} />
                    ))}
                </div>
            )}
        </div>
    );
};

const NodeSidebar: React.FC = () => {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(true);

    const tree = useMemo(() => buildTree(
        nodeCatalog.filter((n) =>
            n.label.toLowerCase().includes(search.toLowerCase()) ||
            n.category.toLowerCase().includes(search.toLowerCase())
        )
    ), [search]);
    if (!open) {
        return (
            <div className="flex-none !p-2 !pt-5 !border-none !bg-zinc-900 !text-white">
                <SidebarTrigger className="!text-white hover:!bg-zinc-700 !border-none" onClick={() => setOpen(v => !v)}>Toggle</SidebarTrigger>
            </div>
        )
    } 
    return (
        <Sidebar side="left" variant="sidebar" collapsible="offcanvas" className="bg-zinc-900 text-white h-full !border-r-zinc-700">
            <SidebarHeader className="p-3 border-b !border-none bg-zinc-900">
                <div className="flex items-center">
                    <div className="flex-none">
                        <ChartNetwork />
                    </div>
                    <div className="flex-none px-2">
                        Flotix
                    </div>
                    <div className="flex-grow text-end !p-2 !border-none !text-white !hover:text-white">
                        <SidebarTrigger className="!text-white hover:!bg-zinc-700 !border-none" onClick={() => setOpen(v => !v)}>Toggle</SidebarTrigger>
                    </div>
                </div>
                <div>
                        <Input
                            placeholder="Search nodes..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-zinc-800 text-white p-2"
                        />
                </div>
            </SidebarHeader>
            <SidebarContent className="overflow-y-auto px-2 bg-zinc-900">
                {tree.map((node, i) => (
                    <TreeNodeItem key={i} node={node} />
                ))}
            </SidebarContent>
        </Sidebar>
    );
};

export default NodeSidebar;
