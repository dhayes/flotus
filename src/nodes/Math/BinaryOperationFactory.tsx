// BinaryOperationFactory.tsx

import React from 'react';
import NodeBinaryOperation, { NodeProps } from './BinaryOperation'; // reuse prop type

export function createBinaryOpNode(
    label: string,
    operatorFn: (a: number, b: number) => number
): React.FC<Omit<NodeProps, 'label'>> {
    const BinaryOpNode: React.FC<Omit<NodeProps, 'label'>> = (props) => {
        return (
            <NodeBinaryOperation
                {...props}
                label={label}
                computeFn={operatorFn}
            />
        );
    };

    return BinaryOpNode;
}