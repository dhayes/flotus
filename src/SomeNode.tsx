import React, { useContext, useEffect, useId, useRef, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import type { Point } from './types';
import { ConnectionContext } from './ConnectionManager';

interface SomeNodeProps {
    label: string;
    width?: number;
    setAddDependencyFunction: React.Dispatch<React.SetStateAction<((id: string, f: (value: any) => void) => void) | undefined>>;
    addDependencyFunction: ((id: string, f: (value: any) => void) => void) | undefined;
    setRemoveDependencyFunction: React.Dispatch<React.SetStateAction<((id: string) => void) | undefined>>;
    removeDependencyFunction: ((id: string) => void) | undefined;
    setUpdateInputFunction: (value: any) => void;
    setSelectedInputId: (id: string | null) => void;
    setSelectedOutputId: (id: string | null) => void;
    selectedInputId: string | null;
    selectedOutputId: string | null;
    style?: React.CSSProperties;
}

const SomeNode: React.FC<SomeNodeProps> = ({
    label,
    width,
    setAddDependencyFunction,
    addDependencyFunction,
    setRemoveDependencyFunction,
    removeDependencyFunction,
    setUpdateInputFunction,
    setSelectedInputId,
    setSelectedOutputId,
    selectedInputId,
    selectedOutputId,
    style
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

    type Input = {
        id: string;
        value: any;
        connected: string | null;
        removeDependencyFunction: ((id: string) => void) | undefined;
        addDependencyFunction: ((id: string, f: (value: any) => void) => void) | undefined;
    }

    const inputsData: Array<Input> = [
        {
            id: useId(),
            value: 0,
            connected: null,
            removeDependencyFunction: undefined,
            addDependencyFunction: undefined
        },
        {
            id: useId(),
            value: 0,
            connected: null,
            removeDependencyFunction: undefined,
            addDependencyFunction: undefined
        }
    ]

    const [inputs, setInputs] = useState(inputsData)

    const updateInput = (
        index: number,
        changes: Partial<Pick<Input, 'value' | 'connected' | 'addDependencyFunction' | 'removeDependencyFunction'>>
    ) => setInputs(prev => prev.map((inp, i) => i === index ? { ...inp, ...changes } : inp));

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

    const addDependency = (id: string, f: ((value: any) => void)) => {
        f(output.value);
        setDependencies(previousState => {
            return {
                ...previousState,
                [id]: f
            };
        });
    };

    const makeAddDependencyFunction = () => {
        const f = (id: string, f: (value: any) => void) => {
            addDependency(id, f);
        };
        return f;
    };

    const removeDependency = (id: string) => {
        setDependencies(previousState => {
            const updatedState = { ...previousState };
            delete updatedState[id];
            return updatedState;
        });
    };

    const makeRemoveDependencyFunction = () => {
        const f = (id: string) => {
            removeDependency(id);
        };
        return f;
    };

    useEffect(() => {
        if (dependencies) {
            Object.values(dependencies).forEach((f) => {
                f(output.value);
        });
    }}, [output]);

    useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            if (!nodeRef.current?.contains(e.target as Node)) {
                setAddDependencyFunction(undefined)
                setRemoveDependencyFunction(undefined)
                setUpdateInputFunction(undefined)
                setSelectedInputId(null)
                setSelectedOutputId(null)
            }
        };

        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);


    // Create a ref for the draggable node, which is necessary for react-draggable to function correctly   
    // Todo: switch to different draggable library that doesn't require a ref
    const nodeRef = React.useRef<any>(null);

    return (
        <Draggable
            defaultClassName='inline-block draggable-item'
            nodeRef={nodeRef}
            onDrag={onDragHandler}
            onStop={onDragHandler} // also update positions when drag ends
            cancel='button'
        >
            <div ref={nodeRef} style={style}>
                <Card
                    className="bg-[#53585a] overflow-hidden rounded-lg !gap-0 !py-0 !shadow-none !border-none"
                    style={width ? { width: `${width}px` } : { width: '200px' }}
                >
                    <CardHeader className="bg-[#3b3f42] text-left px-4 text-black !gap-0 !py-1 text-sm font-semibold font-mono select-none !shadow-none">
                        {label} - {selectedOutputId}
                    </CardHeader>
                    <CardContent className="py-4 px-0 bg-[#696f72]">
                        <div className='flex flex-col items-stretch gap-4 text-justify'>
                            {
                                inputs.map((input, index) => {
                                    const updateInputFunction = () => (value: number) => {
                                        updateInput(index, {value: value});
                                    };
                                    return (
                                        <div 
                                            key={input.id} 
                                            className='self-end text-left flex !mr-0 pr-0'
                                        >
                                            <div
                                                className='!ml-0 !px-0'
                                                ref={el => {
                                                    portRefs.current[input.id] = el;
                                                }}
                                            >
                                                <button
                                                    className={`!mx-2 !px-2 !w-4 !aspect-square !rounded-full !bg-gray-${input.connected ? '900' : '600'} !hover:bg-gray-700 !p-0 !border-0 ! cursor-pointer`}
                                                    aria-label="Circle button"
                                                    onMouseUp={() => {
                                                        setSelectedInputId(input.id);
                                                        setUpdateInputFunction(updateInputFunction);
                                                        onMouseUpPort(input.id);
                                                        updateInput(index, {value: input.value});
                                                        updateInput(index, {connected: selectedOutputId});
                                                        if (addDependencyFunction && removeDependencyFunction) {
                                                            updateInput(index, {addDependencyFunction: addDependencyFunction});
                                                            updateInput(index, {removeDependencyFunction: removeDependencyFunction});
                                                        }
                                                    }}
                                                    onMouseDown={() => {
                                                        setSelectedOutputId(input.connected)
                                                        setSelectedInputId(input.id);
                                                        moveEndPoint(input.id);
                                                        if (input.removeDependencyFunction) {
                                                            input.removeDependencyFunction(input.id)
                                                            setRemoveDependencyFunction(() => input.removeDependencyFunction)
                                                            updateInput(index, {connected: null})
                                                        }
                                                        if (input.addDependencyFunction) {
                                                            setAddDependencyFunction(() => input.addDependencyFunction)
                                                        }
                                                    }}
                                                ></button>
                                            </div>
                                            <div className='my-1'>
                                                <input
                                                    className='w-1/3 py-0 px-2 bg-white text-black rounded'
                                                    type='number'
                                                    value={input.value}
                                                    onChange={e => updateInput(index, {value: Number(e.target.value)})}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}


                            <div className='self-end text-right flex !ml-0 pl-0'>
                                <div>
                                    <input
                                        className='w-1/3 py-0 px-2 bg-white text-black rounded'
                                        type='text'
                                        value={output.value}
                                        readOnly
                                    />
                                </div>
                                <div
                                    className='!mr-0 !px-2 flex items-center'
                                    key={output.id}
                                    ref={el => {
                                        portRefs.current[output.id] = el
                                    }}
                                >
                                    <button 
                                        className={`!mx-2 !px-2 !w-4 !aspect-square !rounded-full !bg-gray-${Object.keys(dependencies).length > 0 ? '900' : '600'} !hover:bg-gray-700 !p-0 !border-0 ! cursor-pointer`}
                                        aria-label="Circle button"
                                        onMouseDown={() => {
                                            onMouseDownPort(output.id)
                                            setSelectedOutputId(output.id);
                                            setAddDependencyFunction(makeAddDependencyFunction)
                                            setRemoveDependencyFunction(makeRemoveDependencyFunction)
                                        }}
                                        onMouseUp={() => {
                                            setAddDependencyFunction(undefined)
                                            setRemoveDependencyFunction(undefined)
                                            setUpdateInputFunction(undefined)
                                            setSelectedInputId(null)
                                            setSelectedOutputId(null)
                                        }}
                                    >
                                    </button>
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