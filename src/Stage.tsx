import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import type { PropsWithChildren } from 'react';
import './Stage.css';
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

export const StageContext = createContext(null);

const Stage: React.FC<PropsWithChildren<{ setOffset }>> = ({ setOffset, children }) => {

    // List of finalized connections (fromPortId → toPortId)
    const [scale, setScale] = useState(1);

    const [currentX, setCurrentX] = useState(0)

    const [currentY, setCurrentY] = useState(0)

    // const [transform, setTransform] = useState<string>("translate(0px, 0px)");

    // Which port are we currently dragging from?
    const [isPanning, setIsPanning] = useState<boolean>(false);
    const [isZooming, setIsZooming] = useState<boolean>(false);

    const mousePosition = useMousePosition();

    const [initialMousePosition, setInitialMousePosition] = useState<MousePosition>()

    const onMouseUp = (e: MouseEvent) => {
        setIsPanning(false)
        if ((e.target as HTMLElement).closest('.draggable-item')) { return };
        const newX = mousePosition.x - initialMousePosition.x + currentX; // getMouseTransformCSS(currentX, currentY, initialMousePosition.x, initialMousePosition.y, mousePosition.x, mousePosition.y)
        const newY = mousePosition.y - initialMousePosition.y + currentY
        setCurrentX(newX)
        setCurrentY(newY)
        setOffset({ x: newX, y: newY, scale: scale })
    }

    const onMouseDown = (e: MouseEvent) => {
        if ((e.target as HTMLElement).closest('.draggable-item')) { return };
        setIsPanning(true)
        setInitialMousePosition(mousePosition)
    }

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
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
        //const t = getMouseTransformCSS(newX, newY, initialMousePosition.x, initialMousePosition.y, mousePosition.x, mousePosition.y)
        // setTransform(t.string)
    };

    useEffect(() => {
        window.addEventListener('mouseup', onMouseUp);
        window.addEventListener('mousedown', onMouseDown);
        // window.addEventListener("wheel", handleWheel);

        return () => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('mousedown', onMouseDown);
            // window.removeEventListener('wheel', handleWheel)
        }
    }, [isPanning, mousePosition, isZooming, scale])


    useEffect(() => {
        if (isPanning) {
            //const t = getMouseTransformCSS(currentX, currentY, initialMousePosition.x, initialMousePosition.y, mousePosition.x, mousePosition.y)
            //setTransform(t.string)
            setInitialMousePosition(mousePosition)
            const newX = mousePosition.x - initialMousePosition.x + currentX; // getMouseTransformCSS(currentX, currentY, initialMousePosition.x, initialMousePosition.y, mousePosition.x, mousePosition.y)
            const newY = mousePosition.y - initialMousePosition.y + currentY
            setCurrentX(newX)
            setCurrentY(newY)
            setOffset({ x: newX, y: newY, scale: scale })
        }
    }, [mousePosition])

    // useEffect(() => {
    //     if (initialMousePosition !== undefined) {
    //         setInitialMousePosition(mousePosition)
    //         const t = getMouseTransformCSS(currentX, currentY, initialMousePosition.x, initialMousePosition.y, mousePosition.x, mousePosition.y)
    //         setCurrentX(t.dx)
    //         setCurrentY(t.dy)
    //         setOffset({ x: t.dx, y: t.dy, scale: scale })
    //         setTransform(t.string)
    //     }
    // }, [scale]);

    const ref = useRef<HTMLDivElement | null>(null)

    return (
        <StageContext value={{offsetX: currentX, offsetY: currentY, scale: scale}}>
        <div style={{ width: '100%', height: '100%', backgroundColor: 'red', overflow: 'hidden' }} onWheel={handleWheel}>
            <div
                ref={ref}
                style={{
                    transform: `translate(${currentX}px, ${currentY}px) scale(${scale})`,
                    transformOrigin: 'top left'
                }}
                className="grid-background"
            >
                {children}
            </div>
        </div>
        </StageContext>
    );
};

export default Stage;