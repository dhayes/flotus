import React, { useRef } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import Draggable from 'react-draggable';

interface NodeProps {
    name: string;
    label: string;
    description?: string;
    width?: number;
}

const Node: React.FC<NodeProps> = ({ name, label, description, width }) => {
    // Create a ref for the draggable node, which is necessary for react-draggable to function correctly   
    // Todo: switch to different draggable library that doesn't require a ref
    const nodeRef = React.useRef<any>(null);

    return (
        <Draggable nodeRef={nodeRef}>
            <div ref={nodeRef}>
                <Card 
                    className="bg-[#53585a] overflow-hidden rounded-lg !gap-0 !py-0 !shadow-none !border-none"
                    style={width ? { width: `${width}px` } : { width: '200px' }}
                >
                    <CardHeader className="bg-[#3b3f42] text-left px-4 text-black !gap-0 !py-1 text-sm font-semibold font-mono select-none !shadow-none">
                        {label}
                    </CardHeader>
                    <CardContent className="p-4 bg-[#696f72]">
                        This is the main card content. You can add text, buttons, etc.
                    </CardContent>
                </Card>
            </div>
        </Draggable>
    );
};

export default Node;