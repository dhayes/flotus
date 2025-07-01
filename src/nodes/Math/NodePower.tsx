import { createBinaryOpNode } from './BinaryOperationFactory';

const NodePower = createBinaryOpNode('Power', (a, b) => Math.pow(a, b));

export default NodePower;