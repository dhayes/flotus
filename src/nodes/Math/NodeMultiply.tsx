import { createBinaryOpNode } from './BinaryOperationFactory';

const NodeMultiply = createBinaryOpNode('Multiply', (a, b) => a * b);

export default NodeMultiply;