import { useEffect, useState } from 'react';

export interface MousePosition {
    x: number;
    y: number;
}

export function useMousePosition(): MousePosition {
    const [position, setPosition] = useState<MousePosition>({ x: 0, y: 0 });

    useEffect(() => {
        function handleMouseMove(event: MouseEvent) {
            setPosition({ x: event.clientX, y: event.clientY });
        }

        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return position;
}