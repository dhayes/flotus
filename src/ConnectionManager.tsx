import React, { createContext, useState } from 'react';
import SvgOverlay from './SvgOverlay';  
import type { Point } from './types';

export interface Connection { from: string; to: string; }

// Context gives us three actions
export const ConnectionContext = createContext({
  startConnection: (id: string) => {},      // begin drag from node `id`
  finishConnection: (id: string) => {},     // release drag on node `id`
  updateNodePosition: (id: string, p: Point) => {}, // node `id` moved to `p`
});

interface ManagerProps {
  initialNodes: { id: string; initialPos: Point }[];
  children: React.ReactNode;
}

const ConnectionManager: React.FC<ManagerProps> = ({ initialNodes, children }) => {
  // — Store each node's current center position
  const [nodePositions, setNodePositions] = useState<Record<string,Point>>(
    () => Object.fromEntries(initialNodes.map(n => [n.id, n.initialPos]))
  );

  // — Store finalized connections as pairs of IDs
  const [connections, setConnections] = useState<Connection[]>([]);

  // — Remember which node we started dragging from (if any)
  const [pendingFrom, setPendingFrom] = useState<string | null>(null);

  // Called when you mousedown on a node
  const startConnection = (id: string) => {
    setPendingFrom(id);
  };

  // Called when you mouseup on a node
  const finishConnection = (id: string) => {
    if (pendingFrom && pendingFrom !== id) {
      setConnections(prev => [...prev, { from: pendingFrom, to: id }]);
    }
    setPendingFrom(null);
  };

  // Called on every drag event to update the node's position
  const updateNodePosition = (id: string, p: Point) => {
    setNodePositions(prev => ({ ...prev, [id]: p }));
  };

  return (
    <ConnectionContext.Provider value={{
      startConnection,
      finishConnection,
      updateNodePosition
    }}>
      {children}

      {/* Draw all the connections on top */}
      <SvgOverlay
        connections={connections}
        nodePositions={nodePositions}
      />
    </ConnectionContext.Provider>
  );
};

export default ConnectionManager;