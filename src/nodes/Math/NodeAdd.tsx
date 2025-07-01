import { createBinaryOpNode } from './BinaryOperationFactory';

const NodeAdd = createBinaryOpNode('Add', (a, b) => a + b);

export default NodeAdd;