import React, { useContext, useEffect, useRef, useState } from 'react';
import Checkbox from '@mui/material/Checkbox';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import { ConnectionContext } from './ConnectionManager';
import type { Point } from './types';

interface InputPortProps {
    id: string;
    isDragging: boolean;
    connected: string | null;
    outputId: string | null;
    setNewConnectionInputUpdater: (f: () => (value: any) => void) => void;
    setSelectedOutputId: (value: string | null) => void;
    inputConnectioninFunction: () => (value: any) => void;
    parentPos: Point;
}

const InputPort: React.FC<InputPortProps> = ({
    id,
    isDragging,
    connected,
    outputId,
    setNewConnectionInputUpdater,
    setSelectedOutputId,
    inputConnectioninFunction,
    parentPos
}) => {

    const ref = useRef<HTMLButtonElement | null>(null)

    const {
        updateNodePosition,
        finishConnection
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

    const [pos, setPos] = useState(() => getCurrentPosition())

    useEffect(() => {
        if (isDragging) {
            const newPos = getCurrentPosition();
            if (newPos != pos) {
                updateNodePosition(id, newPos);
                setPos(newPos)
            }
        }
    }, [parentPos])

    return (
        <Checkbox
            ref={ref}
            checked={connected ? true : false}
            icon={<CircleOutlinedIcon />}
            checkedIcon={<CircleIcon />}
            onClick={() => {
                setNewConnectionInputUpdater(inputConnectioninFunction);
                setSelectedOutputId(outputId);
            }}
            onMouseUp={() => {
                updateNodePosition(id, getCurrentPosition());
                finishConnection(id)
            }}
        />
    );
};

export default InputPort;