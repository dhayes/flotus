// Node.tsx
import React, { useContext, useEffect, useRef, type JSX } from 'react';
import Draggable from 'react-draggable';
import type { DraggableData, DraggableEvent } from 'react-draggable';
import { ConnectionContext } from './ConnectionManager';
import type { Point } from './types';

interface NodeProps {
  id: string;                   // unique node‐ID
  label: string;                // text inside the node
  initialPos: Point;            // starting center of the node
  inputPortIds: string[];       // any number of “input” port IDs
  outputPortIds: string[];      // any number of “output” port IDs
  width?: number;               // node dimensions
  height?: number;
}

const Node: React.FC<NodeProps> = ({
  id,
  label,
  initialPos,
  inputPortIds,
  outputPortIds,
  width = 140,
  height = 60,
}) => {
  const { startConnection, finishConnection, updatePortPosition } =
    useContext(ConnectionContext);

  // We’ll store refs for **all** ports (inputs + outputs) in a single object.
  const portRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // On mount, report each port’s initial center to ConnectionManager:
  useEffect(() => {
    // We know the node’s starting top‐left is (initialPos.x - width/2, initialPos.y - height/2).
    // But to be safe, we’ll call updateAllPortPositions() after mounting so getBoundingClientRect()
    // is accurate for each port.
    updateAllPortPositions();
    // eslint‐disable‐line react-hooks/exhaustive-deps
  }, []);

  // Called on each drag event; recalculate **every** port’s absolute center:
  const onDragHandler = (_: DraggableEvent, data: DraggableData) => {
    // data.x/data.y = new top-left corner of this node container
    updateAllPortPositions();
  };

  // Loop over every ref in portRefs.current and call updatePortPosition(portId, center).
  const updateAllPortPositions = () => {
    Object.entries(portRefs.current).forEach(([portId, el]) => {
      if (el) {
        const rect = el.getBoundingClientRect();
        const center: Point = {
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        };
        updatePortPosition(portId, center);
      }
    });
  };

  // When user mouses down on a port, begin a new connection from that port
  const onMouseDownPort = (portId: string) => {
    startConnection(portId);
  };

  // When user releases mouse on a port, finish connection to that port
  const onMouseUpPort = (portId: string) => {
    finishConnection(portId);
  };

  // Helpers to position ports evenly along left/right edges
  const layoutPorts = (
    portIds: string[],
    side: 'left' | 'right'
  ): JSX.Element[] => {
    const gap = height / (portIds.length + 1); // vertical spacing
    return portIds.map((portId, idx) => {
      // y‐offset = (idx+1) * gap, relative to node top
      const yOffset = gap * (idx + 1);
      const leftStyle = side === 'left' ? -8 : undefined;
      const rightStyle = side === 'right' ? -8 : undefined;

      return (
        <div
          key={portId}
          ref={el => {
            portRefs.current[portId] = el;
          }}
          onMouseDown={() => onMouseDownPort(portId)}
          onMouseUp={() => onMouseUpPort(portId)}
          style={{
            position: 'absolute',
            top: yOffset - 8,        // center the 16px circle on that y
            left: leftStyle,         // 8px outside on left
            right: rightStyle,       // 8px outside on right
            width: 16,
            height: 16,
            background: 'white',
            border: '2px solid #333',
            borderRadius: '50%',
            cursor: 'pointer',
          }}
        />
      );
    });
  };

  const nodeRef = React.useRef<any>(null);

  return (
    <Draggable
      defaultPosition={{
        x: initialPos.x - width / 2,
        y: initialPos.y - height / 2,
      }}
      onDrag={onDragHandler}
      onStop={onDragHandler} // also update positions when drag ends
      nodeRef={nodeRef}
    >
      <div
        ref={nodeRef}
        style={{
          position: 'absolute',
          width,
          height,
          background: '#53585a',
          borderRadius: 6,
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          userSelect: 'none',
          cursor: 'grab',
        }}
      >
        {label}

        {/* Render all input ports on the left edge */}
        {layoutPorts(inputPortIds, 'left')}

        {/* Render all output ports on the right edge */}
        {layoutPorts(outputPortIds, 'right')}
      </div>
    </Draggable>
  );
};

export default Node;
