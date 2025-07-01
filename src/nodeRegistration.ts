import { registerNode } from './NodeRegistry';

type NodeMeta = {
  type: string;
  category: string;
  label: string;
  component: any;
};

export const nodeCatalog: NodeMeta[] = [];

const modules = import.meta.glob('./nodes/**/Node*.tsx', { eager: true });

for (const path in modules) {
  const mod: any = modules[path];
  const Component = mod.default;

  // Match folder/category and Node name
  const match = path.match(/\.\/nodes\/(.*?)\/Node(.*?)\.tsx$/);
  if (!match) continue;

  const category = match[1]; // e.g. "Math"
  const rawName = match[2];  // e.g. "Add"
  const type = `${category.toLowerCase()}/${rawName.toLowerCase()}`; // e.g. "math/add"

  const label = rawName.replace(/([a-z])([A-Z])/g, '$1 $2'); // Add → "Add", LinePlot → "Line Plot"

  if (Component) {
    registerNode(type, Component);
    nodeCatalog.push({ type, category, label, component: Component });
    console.log(`Registered node: ${label} under ${category}`);
  }
}
