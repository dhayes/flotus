// ConnectionManager.tsx
import React, { createContext, useEffect, useState } from 'react';
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

  const [mousePosition, setMousePosition] = useState<Point | null>(null)

  useEffect(() => {

    const onMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    const onMouseUp = (e: MouseEvent) => {
      setPortPositions(prev => {
        setConnections(prev => prev.filter(e => e.toPortId != 'mouse'))
        const keyToRemove: string = 'mouse'
        const { [keyToRemove]: position, ...newPositions } = prev
        return newPositions
      })
    }

    const onMouseDown = (e: MouseEvent) => {
      setPortPositions(prev => {
        const keyToRemove: string = 'mouse'
        const { [keyToRemove]: position, ...newPositions } = prev
        return newPositions
      })
    }

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousedown', onMouseDown);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousedown', onMouseDown);
    }
  }, [])

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
    if (pendingFromPort && pendingFromPort !== portId) {
      setConnections(prev => prev.filter(e => e.toPortId != 'mouse'))
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
