// Stage.tsx

import React, { createContext, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import './Stage.css';
import { useMousePosition, type MousePosition } from './hooks/useMousePosition';
import { useDrop } from 'react-dnd';
import { useNodeEngine } from "./NodeEngineContext";

export const StageContext = createContext(null);


const Stage: React.FC<PropsWithChildren<{ setOffset }>> = ({ setOffset, children }) => {

    const { createNode } = useNodeEngine();

    const [scale, setScale] = useState(1);

    const [currentX, setCurrentX] = useState(0)

    const [currentY, setCurrentY] = useState(0)

    const [isPanning, setIsPanning] = useState<boolean>(false);

    const mousePosition = useMousePosition();

    const [initialMousePosition, setInitialMousePosition] = useState<MousePosition>()

    const [, dropRef] = useDrop({
        accept: "NODE",
        drop: (item: { type: string }, monitor) => {
            const clientOffset = monitor.getClientOffset();
            if (!clientOffset || !ref.current) return;

            const rect = ref.current.getBoundingClientRect();
            const x = (clientOffset.x - rect.left - currentX) / scale;
            const y = (clientOffset.y - rect.top - currentY) / scale;

            console.log("Drop node", item.type, { x, y });
            // Call your real node-creation logic here
            // e.g. createNode(item.type, { x, y });
            createNode(item.type, { x, y });
            setIsPanning(false)
        },
    });

    const onMouseUp = (e: MouseEvent) => {
        setIsPanning(false)
        if ((e.target as HTMLElement).closest('.draggable-item')) { return };
        // const newX = mousePosition.x - initialMousePosition.x + currentX;
        // const newY = mousePosition.y - initialMousePosition.y + currentY
        // setCurrentX(newX)
        // setCurrentY(newY)
        // setOffset({ x: newX, y: newY, scale: scale })
    }

    const onMouseDown = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest('.draggable-item')) { return };
        setIsPanning(true)
        setInitialMousePosition(mousePosition)
    }

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
        if ((e.target as HTMLElement).closest('.draggable-item')) { return };
        e.preventDefault();
        const zoomIntensity = 0.001;
        const delta = -e.deltaY;
        const oldScale = scale;
        const newScale = Math.max(0.1, oldScale + delta * zoomIntensity);

        if (!ref.current) return;

        const rect = ref.current.getBoundingClientRect();

        // Mouse position relative to the div (screen space)
        const mouseX = e.clientX;
        const mouseY = e.clientY;

        // Convert screen coords → local coords (before zoom)
        const localX = (mouseX - currentX);
        const localY = (mouseY - currentY);

        const dx = localX * (newScale / oldScale - 1);
        const dy = localY * (newScale / oldScale - 1);

        const newX = currentX - dx;
        const newY = currentY - dy;

        setScale(newScale);
        setCurrentX(newX);
        setCurrentY(newY);
        setOffset({ x: newX, y: newY, scale: newScale });
    };

    useEffect(() => {
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousedown', onMouseDown);

        return () => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousedown', onMouseDown);
        }
    }, [isPanning, mousePosition, scale])


    useEffect(() => {
        if (isPanning) {
            setInitialMousePosition(mousePosition)
            const newX = mousePosition.x - initialMousePosition.x + currentX;
            const newY = mousePosition.y - initialMousePosition.y + currentY;
            setCurrentX(newX)
            setCurrentY(newY)
            setOffset({ x: newX, y: newY, scale: scale })
        }
    }, [mousePosition])

    const ref = useRef<HTMLDivElement | null>(null)

    return (
        <StageContext value={{ offsetX: currentX, offsetY: currentY, scale: scale }}>
            <div ref={(el) => {
                ref.current = el;
                dropRef(el); // attach drop target
            }} style={{ width: '100vw', height: '100%', overflow: 'hidden' }} onWheel={handleWheel} className='grid-background'>
                <div
                    ref={ref}
                    style={{
                        transform: `translate(${currentX}px, ${currentY}px) scale(${scale})`,
                        transformOrigin: 'top left'
                    }}
                >
                    {children}
                </div>
            </div>
        </StageContext>
    );
};

export default Stage;