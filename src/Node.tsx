import React from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

interface NodeProps {
    name: string;
    label: string;
    description?: string;
}

const Node: React.FC<NodeProps> = (props: NodeProps) => {
    return (

    <Card className="bg-[#53585a] overflow-hidden rounded-lg !gap-0 !py-1 shadow-lg">
        <CardHeader className="bg-[#3b3f42] text-left px-4 text-black py-1 font-semibold">
            {props.label}
        </CardHeader>
      <CardContent className="p-4 bg-[#696f72]">
        This is the main card content. You can add text, buttons, etc.
      </CardContent>
    </Card>

    );
};

export default Node;