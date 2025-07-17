// NodeRegistry.ts
import type { ComponentType } from 'react';

type NodeProps = {
  id: string;
  label: string;
  setAddDependencyFunction: React.Dispatch<any>;
  addDependencyFunction?: any;
  setRemoveDependencyFunction: React.Dispatch<any>;
  removeDependencyFunction?: any;
  setUpdateInputFunction: (value: any) => void;
  setSelectedInputId: (id: string | null) => void;
  setSelectedInputType: (id: string | null) => void;
  setSelectedOutputId: (id: string | null) => void;
  setSelectedOutputType: (id: string | null) => void;
  selectedInputId: string | null;
  selectedOutputId: string | null;
  selectedOutputType: string | null;
  openContextMenu: any;
  removeNode: any;
  style: any;
};

const nodeRegistry: Record<string, ComponentType<NodeProps>> = {};

export function registerNode(type: string, component: ComponentType<NodeProps>) {
  nodeRegistry[type] = component;
}

export function getNodeComponent(type: string): ComponentType<NodeProps> | undefined {
  return nodeRegistry[type];
}
