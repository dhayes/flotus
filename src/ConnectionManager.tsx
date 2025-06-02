// ConnectionManager.tsx
import React, { createContext, useState } from 'react';
import SvgOverlay from './SvgOverlay';

export type Point = { x: number; y: number };

export interface Connection {
  fromPortId: string;
  toPortId: string;
}

export const ConnectionContext = createContext({
  startConnection: (portId: string) => {},
  finishConnection: (portId: string) => {},
  updatePortPosition: (portId: string, p: Point) => {},
});

interface ManagerProps {
  children: React.ReactNode;
}

const ConnectionManager: React.FC<ManagerProps> = ({ children }) => {
  // Map each portId → its current center {x,y}
  const [portPositions, setPortPositions] = useState<Record<string, Point>>({});

  // List of finalized connections (fromPortId → toPortId)
  const [connections, setConnections] = useState<Connection[]>([]);

  // Which port are we currently dragging from?
  const [pendingFromPort, setPendingFromPort] = useState<string | null>(null);

  // Called by <Node> whenever a port’s center changes
  const updatePortPosition = (portId: string, point: Point) => {
    setPortPositions(prev => ({ ...prev, [portId]: point }));
  };

  // Called onMouseDown of a port
  const startConnection = (portId: string) => {
    console.log(`startconnection ${portId}`);
    setPendingFromPort(portId);
  };

  // Called onMouseUp of a port
  const finishConnection = (portId: string) => {
    if (pendingFromPort && pendingFromPort !== portId) {
      setConnections(prev => [
        ...prev,
        { fromPortId: pendingFromPort, toPortId: portId },
      ]);
    }
    setPendingFromPort(null);
  };

  return (
    <ConnectionContext.Provider
      value={{ startConnection, finishConnection, updatePortPosition }}
    >
      {children}

      {/* Draw all the finalized connections here */}
      <SvgOverlay
        connections={connections}
        portPositions={portPositions}
      />
    </ConnectionContext.Provider>
  );
};

export default ConnectionManager;
