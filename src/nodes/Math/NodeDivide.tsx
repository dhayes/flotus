import { createBinaryOpNode } from './BinaryOperationFactory';

const NodeDivide = createBinaryOpNode('Divide', (a, b) => a / b);

export default NodeDivide;