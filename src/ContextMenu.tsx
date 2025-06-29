import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import React from 'react';

interface ContextMenuProps {
    isOpen: boolean;
    position: { x: number; y: number };
    onClose: () => void;
    items: Array<{ label: string; onClick: () => void }>;
}

const ContextMenu: React.FC<ContextMenuProps> = (props) => {
    if (!props.isOpen) {
        return null;
    }
    const style: React.CSSProperties = {
        position: 'absolute',
        // top: props.position.y,
        // left: props.position.x,
        // backgroundColor: 'white',
        // border: '1px solid #ccc',
        // boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
    };
    return (
        <div style={style} onMouseLeave={props.onClose}>
            <DropdownMenu open={props.isOpen}>
                <DropdownMenuContent
                    side="right"
                    align="start"
                    style={{
                        position: "fixed",
                        left: `${props.position.x}px`,
                        top: `${props.position.y}px`,
                    }}
                    className="w-32"
                >
                    {props.items.map((item, index) => (
                        <DropdownMenuItem
                            key={index}
                            onClick={() => {
                                item.onClick();
                                props.onClose();
                            }}
                            className="cursor-pointer p-2 hover:bg-gray-100"
                        >
                            {item.label}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default ContextMenu;