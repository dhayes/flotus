import React, { createContext, useState } from 'react';
import type { Point } from './types';
import { useMousePosition } from './useMousePosition';
import { generateSshapedPath } from './lib/utils';
import Engine from './Engine';

export interface Connection {
  fromPortId: string;
  toPortId: string;
}

export const ConnectionContext = createContext({
  startConnection: (portId: string) => {},
  finishConnection: (portId: string) => {},
  updatePortPosition: (portId: string, p: Point) => {},
  deleteConnection: (toPortId: string) => {},
  moveEndPoint: (toPortId: string) => {},
});

interface ConnectionsProps {
  children: React.ReactNode;
}

const Connections: React.FC<ConnectionsProps> = ({children}) => {

  // Map each portId → its current center {x,y}
  const [portPositions, setPortPositions] = useState<Record<string, Point>>({});

  // List of finalized connections (fromPortId → toPortId)
  const [connections, setConnections] = useState<Connection[]>([]);

  // Which port are we currently dragging from?
  const [pendingFromPort, setPendingFromPort] = useState<string | null>(null);

  const mousePosition = useMousePosition();

    return (
        <div>
            {children}
            <svg>
                {
                    connections.map((conn, idx) => {

                        const p1 = portPositions[conn.fromPortId];
                        const p2 = portPositions[conn.toPortId];
                        if (!p1 || !p2) return null;

                        const d = generateSshapedPath(p1.x, p1.y, p2.x, p2.y, 0.2);

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
    );
};

export default Connections;