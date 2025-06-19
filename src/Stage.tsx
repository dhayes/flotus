import React, { useEffect, useState } from 'react';
import type { PropsWithChildren } from 'react';
import './Stage.css';
import type { Point } from 'plotly.js';
import type { Connection } from './ConnectionManager';
import { useMousePosition, type MousePosition } from './useMousePosition';

function getMouseTransformCSS(
    currentX: number,
  currentY: number,
    prevX: number,
    prevY: number,
    newX: number,
    newY: number
) {
    const dx = newX - prevX + currentX;
    const dy = newY - prevY + currentY;
    return {
        dx: dx,
        dy: dy,
        string: `translate(${dx}px, ${dy}px)`   
    };
}

const Stage: React.FC<PropsWithChildren<{setOffset}>> = ({ setOffset, children }) => {

  // List of finalized connections (fromPortId → toPortId)

  const [currentX, setCurrentX] = useState(0)
  
  const [currentY, setCurrentY] = useState(0)

  const [transform, setTransform] = useState<string>("translate(0px, 0px)");

  // Which port are we currently dragging from?
  const [isPanning, setIsPanning] = useState<boolean>(false);

  const mousePosition = useMousePosition();
  
  const [initialMousePosition, setInitialMousePosition] = useState<MousePosition>(null)

    const onMouseUp = (e: MouseEvent) => {
        setIsPanning(false)
        if ((e.target as HTMLElement).closest('.draggable-item')) { return };
        const t = getMouseTransformCSS(currentX, currentY, initialMousePosition.x, initialMousePosition.y, mousePosition.x, mousePosition.y)
        setCurrentX(t.dx)
        setCurrentY(t.dy)
        setOffset({x: t.dx, y: t.dy})
    }

    const onMouseDown = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest('.draggable-item')) { return };
        setIsPanning(true)
        setInitialMousePosition(mousePosition)
    }

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mousedown', onMouseDown);

    return () => {
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousedown', onMouseDown);
    }
  }, [isPanning, mousePosition])


  useEffect(() => {
      if (isPanning) {
        const t = getMouseTransformCSS(currentX, currentY, initialMousePosition.x, initialMousePosition.y, mousePosition.x, mousePosition.y)
        setTransform(t.string)
    }

  }, [mousePosition])

  return <div style={{transform: transform}} className="grid-background">{children}</div>;
};

export default Stage;