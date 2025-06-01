import React, { useContext, useEffect, useRef, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import { ConnectionContext } from './ConnectionManager';
import type { Point } from './types';

interface OutputPortProps {
    id: string;
    isDragging: boolean;
    setNewConnectionOutputDependencyUpdater: (f: (value: any) => void) => void;
    addDependencyFunction: () => (value: any) => void;
}

const OutputPort: React.FC<OutputPortProps> = ({
    id,
    isDragging,
    setNewConnectionOutputDependencyUpdater,
    addDependencyFunction
}) => {

    const ref = useRef<HTMLButtonElement | null>(null)

    const {
        updateNodePosition,
        startConnection
    } = useContext(ConnectionContext);

    const getCurrentPosition = (): Point => {
        if (ref.current) {
            const boundingClientRect = ref.current.getBoundingClientRect();
            return {
                x: boundingClientRect.left + boundingClientRect.width / 2,
                y: boundingClientRect.top + boundingClientRect.height / 2,
            };
        }
        return { x: 0, y: 0 }; // Default fallback value
    }

    const [pos, setPos] = useState(getCurrentPosition())

    useEffect(() => {
        if (isDragging) {
            const newPos = getCurrentPosition();
            if (newPos != pos) {
                updateNodePosition(id, newPos);
                setPos(newPos)
            }
        }
    }, [ref.current])
   
    return (
        <Checkbox
            ref={ref}
            //checked={connected ? true : false}
            icon={<CircleOutlinedIcon />}
            checkedIcon={<CircleIcon />}
            onClick={
                () => setNewConnectionOutputDependencyUpdater(addDependencyFunction)
            }
            onMouseDown={() => {
                updateNodePosition(id, getCurrentPosition())
                startConnection(id)
            }}
        />
    );
};

export default OutputPort;