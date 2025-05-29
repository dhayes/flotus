// ConnectionManager.tsx
import React, { useState, useEffect } from 'react';
import SvgOverlay from './SvgOverlay';

export type Point = { x: number; y: number };

interface Connection {
  from: string;
  to: string;
}

export const ConnectionContext = React.createContext({
  registerNode: (id: string, ref: HTMLDivElement) => {},
  startConnection: (id: string) => {},
  finishConnection: (id: string) => {},
  updateNodePosition: (id: string, point: Point) => {},
});

const ConnectionManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<Record<string, Point>>({});
  const [connections, setConnections] = useState<Connection[]>([]);
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);

  const registerNode = (id: string, ref: HTMLDivElement) => {
    const rect = ref.getBoundingClientRect();
    updateNodePosition(id, {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  };

  const updateNodePosition = (id: string, point: Point) => {
    setNodes((prev) => ({ ...prev, [id]: point }));
  };

  const startConnection = (id: string) => {
    setPendingFrom(id);
  };

  const finishConnection = (id: string) => {
    if (pendingFrom && pendingFrom !== id) {
      setConnections((prev) => [...prev, { from: pendingFrom, to: id }]);
    }
    setPendingFrom(null);
  };

  return (
    <ConnectionContext.Provider
      value={{ registerNode, startConnection, finishConnection, updateNodePosition }}
    >
      {children}
      <SvgOverlay connections={connections} nodePositions={nodes} />
    </ConnectionContext.Provider>
  );
};

export default ConnectionManager;
