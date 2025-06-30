import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { DropdownMenuGroup, DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from '@/components/ui/dropdown-menu';
import React from 'react';

type ContextMenuItem = {
    onClick: () => void;
    label: string;
    category?: string;
    icon?: React.ReactNode;
};

interface ContextMenuProps {
    isOpen: boolean;
    position: { x: number; y: number };
    onClose: () => void;
    items: Array<ContextMenuItem>;
}

const ContextMenu: React.FC<ContextMenuProps> = (props) => {
    if (!props.isOpen) return null;
    const categories = [...new Set(props.items.map(item => item.category).filter(Boolean))];
    const itemsByCategory = categories.map(category => ({
        category: category,
        items: props.items.filter(item => item.category === category).map(item => ({
            label: item.label,
            onClick: item.onClick,
            icon: item.icon,
        })),
    }));

    const hoverStyle: React.CSSProperties = {
  backgroundColor: '#3f3f46' // zinc-700
};

    return (
        <div style={{ position: 'absolute', zIndex: 1000 }} onMouseLeave={props.onClose}>
            <DropdownMenu open={props.isOpen}
                
            >
                <DropdownMenuContent
                    side="right"
                    align="start"
                    style={{
                        position: "fixed",
                        left: `${props.position.x}px`,
                        top: `${props.position.y}px`,
                        
                    }}
                    className="w-32 !bg-zinc-800 text-white shadow-md dark:hover:bg-zinc-700 hover:bg-zinc-700 !border-none border-zinc-700 rounded-md"
                >
                    {
                        itemsByCategory.map((category, index) => (
                            <DropdownMenuGroup key={index}>
                            <DropdownMenuSub
                                key={index}
                            >
                                <DropdownMenuSubTrigger
                                    className="!border-none !bg-zinc-800 !dark:hover:bg-zinc-700 !hover:bg-zinc-700 !text-white"
                                >{category.category}</DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent 
                                        className="!bg-zinc-600 !border-none dark:hover:bg-zinc-700 !hover:bg-zinc-700 text-white"
                                    >
                                        {category.items.map((item, subIndex) => (
                                            <DropdownMenuItem
                                                key={subIndex}
                                                onClick={() => {
                                                    item.onClick();
                                                    props.onClose();
                                                }}
                                                // style={hoverStyle}
                                                className="cursor-pointer px-1 py-0 dark:hover:bg-zinc-700 hover:bg-zinc-700 !border-none flex items-center"
                                            >
                                                {item.icon && <span className="mr-2">{item.icon}</span>}
                                                {item.label}
                                            </DropdownMenuItem>
                                        ))}
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            </DropdownMenuGroup>
                        ))
                    }
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default ContextMenu;
