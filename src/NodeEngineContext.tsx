// NodeEngineContext.tsx
import React, { createContext, useContext, useState } from "react";
import { getNodeComponent } from "./NodeRegistry";

type NodeInstance = {
  id: string;
  type: string;
  label: string;
  x: number;
  y: number;
};

interface NodeEngineContextType {
  nodes: NodeInstance[];
  createNode: (type: string, pos: { x: number; y: number }) => void;
  removeNode: (id: string) => void;
}

const NodeEngineContext = createContext<NodeEngineContextType | null>(null);

export const NodeEngineProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<NodeInstance[]>([]);

  const createNode = (type: string, pos: { x: number; y: number }) => {
    const Component = getNodeComponent(type);
    if (!Component) return;

    setNodes((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        type,
        label: type.split("/").pop() || type,
        x: pos.x,
        y: pos.y,
      },
    ]);
  };

  const removeNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <NodeEngineContext.Provider value={{ nodes, createNode, removeNode }}>
      {children}
    </NodeEngineContext.Provider>
  );
};

export const useNodeEngine = (): NodeEngineContextType => {
  const ctx = useContext(NodeEngineContext);
  if (!ctx) throw new Error("useNodeEngine must be used within a NodeEngineProvider");
  return ctx;
};
