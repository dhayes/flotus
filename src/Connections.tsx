// Connections.tsx
import React, { createContext, useCallback, useEffect, useState } from 'react';
import type { Point } from './types';
import { useMousePosition } from './hooks/useMousePosition';
import { generateSshapedPath, transformPoint } from './lib/utils';

export interface Connection {
  fromPortId: string;
  toPortId: string;
}

export const ConnectionContext = createContext({
  startConnection: (portId: string) => { },
  finishConnection: (portId: string) => { },
  updatePortPosition: (portId: string, p: Point) => { },
  deleteConnection: (toPortId: string) => { },
  moveEndPoint: (toPortId: string) => { },
  deleteConnectons: (portIds: string[]) => { },
  getConnections: () => [],
  importConnections: (conns: Connection[]) => { },
});

interface ConnectionsProps {
  children: React.ReactNode;
  offset: { x: number, y: number, scale: number };
}

const Connections: React.FC<ConnectionsProps> = ({ offset, children }) => {

  // Map each portId → its current center {x,y}
  const [portPositions, setPortPositions] = useState<Record<string, Point>>({});

  // List of finalized connections (fromPortId → toPortId)
  const [connections, setConnections] = useState<Connection[]>([]);

  // Which port are we currently dragging from?
  const [pendingFromPort, setPendingFromPort] = useState<string | null>(null);

  const mousePosition = useMousePosition();

  useEffect(() => {
    setPortPositions(prev => (
      mousePosition ? { ...prev, ['mouse']: mousePosition } : prev
    ));
  }, [mousePosition]);

  // Called by <Node> whenever a port’s center changes
  const updatePortPosition = (portId: string, point: Point) => {
    setPortPositions(prev => ({ ...prev, [portId]: point }));
  };

  // Called onMouseDown of a port
  const startConnection = (portId: string) => {
    setPendingFromPort(() => portId);
    setConnections(prev => [
      ...prev,
      { fromPortId: portId, toPortId: 'mouse' },
    ]);
  };

  // Called onMouseUp of a port
  const finishConnection = (portId: string) => {
    setConnections(prev => prev.filter(e => e.toPortId != 'mouse'))
    if (pendingFromPort && pendingFromPort !== portId) {
      setConnections(prev => [
        ...prev,
        { fromPortId: pendingFromPort, toPortId: portId },
      ]);
    }
    setPendingFromPort(null);
  };

  const deleteConnection = (toPortId: string) => {
    setConnections(prev => prev.filter(
      connection => !(connection.toPortId === toPortId)
    ));
  };

  const deleteConnectionFromPort = (portId: string) => {
    setConnections(prev => prev.filter(
      connection => !(connection.toPortId === portId)
    ));
  };

  const deleteConnectons = (portIds: string[]) => {
    portIds.forEach(portId => {
      setConnections(prev => prev.filter(
        connection => ![connection.fromPortId, connection.toPortId].includes(portId)
      ));
    });
  };

  const getOtherPortId = (portId: string) => {
    const connection =
      connections.find(conn => conn.fromPortId === portId) ||
      connections.find(conn => conn.toPortId === portId);

    if (!connection) return null;
    if (connection.fromPortId === portId) {
      return connection.toPortId;
    }
    if (connection.toPortId === portId) {
      return connection.fromPortId;
    }
    return null;
  };

  const moveEndPoint = (toPortId: string) => {
    const otherPortId = getOtherPortId(toPortId);
    deleteConnection(toPortId);
    startConnection(otherPortId || '');
  }

  const getConnections = () => connections;

  const importConnections = (conns: Connection[]) => {
    setConnections(conns);
  };


  return (
    <ConnectionContext.Provider
      value={{ startConnection, finishConnection, updatePortPosition, deleteConnection, moveEndPoint, deleteConnectons, getConnections, importConnections }}
    >
      <div>
        {children}
        <svg
          style={{
            width: '1000vw',
            height: '1000vh',
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 997,
          }}
        >
          {
            connections.map((conn, idx) => {

              const p1 = portPositions[conn.fromPortId];
              const ap1 = transformPoint(p1.x, p1.y, offset.scale, offset.x, offset.y)
              const p2 = portPositions[conn.toPortId];
              const ap2 = transformPoint(p2.x, p2.y, offset.scale, offset.x, offset.y)
              if (!p1 || !p2) return null;

              const d = generateSshapedPath(ap1.x, ap1.y, ap2.x, ap2.y, 0.2);

              return (
                <path
                  key={idx}
                  d={d}
                  stroke="grey"
                  strokeWidth={3}
                  fill="none"
                  style={{ filter: 'drop-shadow(0 0 2px black)' }}
                />
              );
            }
            )}
        </svg>
      </div>
    </ConnectionContext.Provider>
  );
};

export default Connections;