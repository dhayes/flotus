import React, { useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import NodeInput from './NodeInput';
import type { Point } from './types';
import { ConnectionContext } from './ConnectionManager';
import Checkbox from '@mui/material/Checkbox';
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined';
import CircleIcon from '@mui/icons-material/Circle';
import IconButton from '@mui/material/IconButton';

interface AddNumbersProps {
    name: string;
    label: string;
    description?: string;
    width?: number;
    setNewConnectionInputUpdater: (value: any) => void;
    setNewConnectionOutputDependencyUpdater: (f: (value: any) => void) => void;
    selectedOutputId: string | null;
    setSelectedOutputId: (value: any) => void;
}

// type Input = {
//     id: string;
//     value: number;
//     connected: string | null;
// }

const AddNumbers: React.FC<AddNumbersProps> = ({
    name,
    label,
    description,
    width,
    setNewConnectionInputUpdater,
    setNewConnectionOutputDependencyUpdater,
    selectedOutputId,
    setSelectedOutputId,
}) => {


    const { startConnection, finishConnection, updatePortPosition } =
        useContext(ConnectionContext);

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

    //   const updatePortPosition = (portId: string, p: Point) => {
    //     console.log(`updatPortPosition ${portId} ${p}`)
    //   }

    const inputsData = [
        {
            id: useId(),
            value: 0,
            connected: null,
        },
        {
            id: useId(),
            value: 0,
            connected: null,
        }
    ]

    const [inputs, setInputs] = useState(inputsData)

    const updateInput = (index: number, value: number) => {
        setInputs(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                value: value
            };
            return updated;
        });
    };

    const addNumbers = (a: number, b: number): number => {
        return a + b;
    }

    const outputId = useId();

    const [output, setOutput] = React.useState<number>(addNumbers(inputs[0].value, inputs[1].value));

    useEffect(() => {
        setOutput(addNumbers(inputs[0].value, inputs[1].value));
    }, [inputs]);

    const [dependencies, setDependencies] = useState<Array<(value: any) => void>>([]);

    const addDependency = (f: (value: any) => void) => {
        setDependencies(previousState => {
            return [...previousState, f]
        })
    }
    const addDependencyFunction = () => {
        const f = (value: any) => {
            addDependency(value)
        }
        return f;
    }

    useEffect(() => {
        dependencies.forEach((f) => {
            f(output);
        });
    }, [output]);

    // Create a ref for the draggable node, which is necessary for react-draggable to function correctly   
    // Todo: switch to different draggable library that doesn't require a ref
    const nodeRef = React.useRef<any>(null);

    const [dragDisabled, setDragDisabled] = useState(false);

    return (
        <Draggable
            nodeRef={nodeRef}
            disabled={dragDisabled}
            onDrag={onDragHandler}
            onStop={onDragHandler} // also update positions when drag ends
        >
            <div ref={nodeRef}>
                <Card
                    className="bg-[#53585a] overflow-hidden rounded-lg !gap-0 !py-0 !shadow-none !border-none"
                    style={width ? { width: `${width}px` } : { width: '200px' }}
                >
                    <CardHeader className="bg-[#3b3f42] text-left px-4 text-black !gap-0 !py-1 text-sm font-semibold font-mono select-none !shadow-none">
                        {label}
                    </CardHeader>
                    <CardContent className="py-4 px-0 bg-[#696f72]">
                        <div className='flex flex-col items-stretch gap-4 text-justify'>
                            {
                                inputs.map((input, index) => {
                                    const inputConnectioninFunction = () => {
                                        return (value: any) => {
                                            updateInput(index, value);
                                        };
                                    };
                                    return (
                                        <NodeInput
                                            key={input.id}
                                            ref={el => {
                                                portRefs.current[input.id] = el
                                            }}
                                            onMouseDown={() => onMouseDownPort(input.id)}
                                            onMouseUp={() => onMouseUpPort(input.id)}
                                            id={input.id}
                                            value={input.value}
                                            connected={input.connected}
                                            outputId={outputId}
                                            setNewConnectionInputUpdater={setNewConnectionInputUpdater}
                                            setSelectedOutputId={setSelectedOutputId}
                                            inputConnectioninFunction={inputConnectioninFunction}
                                            updateInput={(v) => updateInput(index, v)}
                                        />
                                    )
                                })
                            }
                            <div className='self-end text-right flex ml-0'
                                onMouseEnter={() => setDragDisabled(true)}
                                onMouseLeave={() => setDragDisabled(false)}
                            >
                                <div>
                                    <input
                                        className='w-1/3 py-0 px-2 bg-white text-black rounded'
                                        type='text'
                                        value={output}
                                        readOnly
                                    />
                                </div>
                                <div
                                    className='!-mr-2 !px-0'
                                    onMouseDown={() => onMouseDownPort(outputId)}
                                    key={outputId}
                                    ref={el => {
                                        portRefs.current[outputId] = el
                                    }}
                                >
                                    <Checkbox
                                        className='!py-0'
                                        icon={<CircleIcon />}
                                        size='small'
                                        checkedIcon={<CircleIcon />}
                                        onMouseDown={
                                            () => setNewConnectionOutputDependencyUpdater(addDependencyFunction)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Draggable>
    );
};

export default AddNumbers;