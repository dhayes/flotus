import React, { useContext, useEffect, useId, useRef, useState } from 'react';
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
import CircleIcon from '@mui/icons-material/Circle';

interface SomeNodeProps {
    name: string;
    label: string;
    description?: string;
    width?: number;
    setAddDependencyFunction: React.Dispatch<React.SetStateAction<((id: string, f: (value: any) => void) => void) | undefined>>
    setRemoveDependencyFunction: React.Dispatch<React.SetStateAction<((id: string) => void) | undefined>>;
    removeDependencyFunction: ((id: string) => void) | undefined;
    setUpdateInputFunction: (value: any) => void;
    setSelectInputId: (id: string | null) => void;
    setSelectOutputId: (id: string | null) => void;
    selectedInputId: string | null;
    selectedOutputId: string | null;
}

const SomeNode: React.FC<SomeNodeProps> = ({
    name,
    label,
    description,
    width,
    setAddDependencyFunction,
    setRemoveDependencyFunction,
    removeDependencyFunction,
    setUpdateInputFunction,
    setSelectInputId,
    setSelectOutputId,
    selectedInputId,
    selectedOutputId,
}) => {

    const { startConnection, finishConnection, updatePortPosition, deleteConnection, moveEndPoint } =
        useContext(ConnectionContext);

    const portRefs = useRef<Record<string, HTMLDivElement | null>>({});

    useEffect(() => {
        updateAllPortPositions();
    }, []);


    const onDragHandler = (_: DraggableEvent, data: DraggableData) => {
        updateAllPortPositions();
    };

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

    const onMouseDownPort = (portId: string) => {
        startConnection(portId);
    };

    const onMouseUpPort = (portId: string) => {
        finishConnection(portId);
    };

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

    const [output, setOutput] = useState({
        id: useId(),
        value: addNumbers(inputs[0].value, inputs[1].value),
        connected: null,
    })

    useEffect(() => {
        const newValue = addNumbers(inputs[0].value, inputs[1].value);
        setOutput(prev => ({
            ...prev,
            value: newValue
        }));
    }, [inputs]);

    const [dependencies, setDependencies] = useState<Record<string, ((value: any) => void)>>({});

    const addDependency = (id: string, f: (value: any) => void) => {
        //f(output.value);
        setDependencies(previousState => {
            return {
                ...previousState,
                [id]: f
            };
        }
        );
    };

    const addDependencyFunction = () => {
        const f = (id: string, func: (value: any) => void) => {
            addDependency(id, func);
        };
        return f;
    };

    const removeDependency = (id: string) => {
        console.log(`Removing dependency for ${id}`);
        console.log(dependencies);
        if (!dependencies) return;
        setDependencies(previousState => {
            const newState = { ...previousState };
            console.log(`Removing dependency for ${id} from`, previousState);
            console.log(`Removing dependency for ${id} from`, newState);
            delete newState[id];
            console.log(`Removing dependency for ${id} from`, newState);
            return newState;
        });
    };

    useEffect(() => {
       console.log(dependencies);
        // if (removeDependencyFunction) {
        //     setRemoveDependencyFunction(() => (id: string) => {
        //         removeDependency(id);
        //     }
        //     );
        // } else {
        //     setRemoveDependencyFunction(() => undefined);
        // } 
    }, [dependencies, removeDependencyFunction, setRemoveDependencyFunction]);


    // const removeDependencyFunction = () => {
    //     if (!removeDependencyFunction) return;
    //     return (id: string) => {
    //         removeDependency(id);
    //     };
    // };

    useEffect(() => {
        if (dependencies) {
            Object.values(dependencies).forEach((f) => {
                f(output.value);
            });
        }
    }
        , [output]);

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
                                    const updateInputFunction = () => (value: number) => {
                                        updateInput(index, value);
                                    };
                                    return (
                                        <div key={input.id} className="flex items-center">
                                            <div
                                                ref={el => {
                                                    portRefs.current[input.id] = el;
                                                }}
                                                onMouseUp={() => {
                                                    setSelectInputId(input.id);
                                                    setUpdateInputFunction(updateInputFunction);
                                                    onMouseUpPort(input.id);
                                                    console.log('input div mouse up', input.id);
                                                    console.log(dependencies)
                                                }}
                                                onMouseDown={() => {
                                                    removeDependencyFunction?.(input.id);
                                                    setSelectInputId(input.id);
                                                    //deleteConnection(input.id);
                                                    moveEndPoint(input.id);
                                                    setDragDisabled(true)
                                                }}
                                            >
                                                <input
                                                    id={input.id}
                                                    type='checkbox'
                                                    className='mr-2 ml-0'
                                                    onChange={() => {
                                                        console.log('checkbox change', input.id);
                                                        removeDependencyFunction?.(input.id);
                                                    console.log(dependencies)
                                                    }}
                                                // Add any other handlers as needed
                                                />
                                            </div>
                                            <div>
                                                <input
                                                    className='w-1/3 py-0 px-2 bg-white text-black rounded'
                                                    type='number'
                                                    value={input.value}
                                                    onChange={e => updateInput(index, Number(e.target.value))}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}


                            <div className='self-end text-right flex ml-0'
                                onMouseEnter={() => setDragDisabled(true)}
                                onMouseLeave={() => setDragDisabled(false)}
                            >
                                <div>
                                    <input
                                        className='w-1/3 py-0 px-2 bg-white text-black rounded'
                                        type='text'
                                        value={output.value}
                                        readOnly
                                    />
                                </div>
                                <div
                                    className='!-mr-2 !px-0'
                                    onMouseDown={() => onMouseDownPort(output.id)}
                                    key={output.id}
                                    ref={el => {
                                        portRefs.current[output.id] = el
                                    }}
                                >
                                    <Checkbox
                                        className='!py-0'
                                        icon={<CircleIcon />}
                                        size='small'
                                        checkedIcon={<CircleIcon />}
                                        onMouseDown={
                                            () => {
                                                console.log('checkbox mouse down', output.id);
                                                setSelectOutputId(output.id);
                                                setAddDependencyFunction(addDependencyFunction)
                                                setRemoveDependencyFunction(() => (id: string) => {
                                                    removeDependency(id);
                                                });
                                            }
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

export default SomeNode;