import React from 'react';

interface NodeProps {
    name: string;
    label: string;
    description?: string;
}

const Node: React.FC<NodeProps> = (props: NodeProps) => {
    return (
        <div>
            <h2>{props.label}</h2>
            <p>{props.description}</p>
        </div>
    );
};

export default Node;