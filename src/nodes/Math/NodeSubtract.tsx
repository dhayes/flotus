import { createBinaryOpNode } from './BinaryOperationFactory';

const NodeSubtract = createBinaryOpNode('Subtract', (a, b) => a - b);

export default NodeSubtract;