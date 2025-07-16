import { registerNode } from './NodeRegistry';

type NodeMeta = {
  type: string;
  category: string;
  label: string;
  component: any;
  description?: string;
};

export const nodeCatalog: NodeMeta[] = [];

const modules = import.meta.glob('./nodes/**/Node*.tsx', { eager: true });

for (const path in modules) {
  const mod: any = modules[path];
  const Component = mod.default;

  // Extract relative path parts
  const match = path.match(/^\.\/nodes\/(.*)\/Node(.*?)\.tsx$/);
  if (!match) continue;

  const folderPath = match[1]; // full relative path e.g. "Math/Arithmetic"
  const rawName = match[2];    // e.g. "Add" from "NodeAdd"

  const type = `${folderPath}/${rawName}`.toLowerCase(); // e.g. "math/arithmetic/add"
  const label = rawName.replace(/([a-z])([A-Z])/g, '$1 $2'); // "FooBar" -> "Foo Bar"
  const category = folderPath; // preserve category path for now

  if (Component) {
    registerNode(type, Component);
    nodeCatalog.push({ type, category, label, component: Component });
    console.log(`Registered node: ${label} under ${category}`);
  }
}
