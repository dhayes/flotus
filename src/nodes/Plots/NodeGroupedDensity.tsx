import React, { JSX, useContext, useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import Draggable, { type DraggableData, type DraggableEvent } from 'react-draggable';
import type { Point } from '@/types';
import { ConnectionContext } from '@/Connections';
import { StageContext } from '@/Stage';
import * as dfd from 'danfojs';
import { BaseRPlot } from './BaseRPlot';

type Input = {
    id: string;
    value: any;
    connected: string | null;
    removeDependencyFunction: ((id: string) => void) | undefined;
    addDependencyFunction: ((id: string, f: (value: any) => void) => void) | undefined;
}

interface NodeSincProps {
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

const NodeSinc: React.FC<NodeSincProps> = ({
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

    const { offsetX, offsetY, scale } = useContext(StageContext);

    const portRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const [plotType, setPlotType] = useState<'density' | 'histogram' | 'hist+density'>('density');

    const [groupColumn, setGroupColumn] = useState<string | null>(null);

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

    const inputsData: Array<Input> = [
        {
            id: useId(),
            value: null,
            connected: null,
            removeDependencyFunction: undefined,
            addDependencyFunction: undefined
        },
    ]

    const [inputs, setInputs] = useState(inputsData)

    const updateInput = (
        index: number,
        changes: Partial<Pick<Input, 'value' | 'connected' | 'addDependencyFunction' | 'removeDependencyFunction'>>
    ) => setInputs(prev => prev.map((inp, i) => i === index ? { ...inp, ...changes } : inp));

    const computeOutput = (a: dfd.DataFrame): dfd.DataFrame => {
        return a;
    }

    const outputID = useId();

    const [output, setOutput] = useState<{
        id: string;
        value: dfd.DataFrame | null;
        connected: string | null;
    }>({
        id: outputID,
        value: null,
        connected: null,
    })

    useEffect(() => {
        const newValue = computeOutput(inputs[0].value);
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

    const makeAddDependencyFunction = () => (id: string, f: (value: any) => void) => addDependency(id, f);

    const removeDependency = (id: string) => {
        setDependencies(previousState => {
            const updatedState = { ...previousState };
            delete updatedState[id];
            return updatedState;
        });
    };

    const makeRemoveDependencyFunction = () => (id: string) => removeDependency(id)

    useEffect(() => {
        Object.values(dependencies).forEach((f) => f(output.value))
    }, [output.value]);

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
        updateAllPortPositions();
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [offsetX, offsetY, scale]);

    const classifyColumn = (series: dfd.Series): 'numeric' | 'categorical' | 'unknown' => {
        const isNumeric = (n: any): boolean => {
            if (n.dtype == 'int32' || n.dtype == 'float32' || n.dtype == 'float64') {
                return !isNaN(n) && isFinite(n);
            }
            if (typeof n === 'number') {
                return !isNaN(n) && isFinite(n);
            }
            if (typeof n === 'string' || n.dtype == 'string') {
                const parsed = parseFloat(n);
                return !isNaN(parsed) && isFinite(parsed);
            }
            return false;
        }
        const valuesRaw = series.dropNa().values;
        const values: (string | number | boolean)[] = Array.isArray(valuesRaw[0])
            ? (valuesRaw as any[]).flat()
            : valuesRaw as (string | number | boolean)[];
        const unique = new Set(values);
        const allNumeric = values.every(v => isNumeric(v) && (typeof v === 'number' ? !isNaN(v) : true));
        if (allNumeric) return unique.size <= 5 ? 'categorical' : (unique.size > 10 ? 'numeric' : 'unknown');
        if (unique.size > 1 && unique.size < 5) return 'categorical';
        return 'unknown';
    };

    const numericColumns = output.value
        ? output.value.columns.filter(
            col => classifyColumn(output.value?.column(col)) === 'numeric'
        )
        : [];

    const categoricalColumns = output.value
        ? output.value.columns.filter(
            col => classifyColumn(output.value?.column(col)) === 'categorical'
        )
        : [];

    const [column, setColumn] = useState<string | null>(null);

    const [data, setData] = useState<dfd.DataFrame | null>(null);

    useEffect(() => {
        if (output.value) {
            setData(output.value?.dropNa());
        } else {
            setData(null);
            setColumn(null);
            setGroupColumn(null);
        }
        console.log('Output value changed:', output.value);
        console.log('Output value changed:', output.value?.dropNa());
    }, [output.value]);

    const generatePlot = () => {
        return (
            <div>
                {column && output.value && output.value.shape[0] > 0 && output.value[column] && data &&
                    <>
                        {groupColumn && data?.columns.includes(groupColumn) ? (
                            (() => {
                                const colValues = data?.column(column)?.values as number[];
                                const groupValues = data?.column(groupColumn)?.values as (string | number)[];

                                const groupedMap = new Map<string, number[]>();
                                colValues?.forEach((v, i) => {
                                    const group = String(groupValues[i]);
                                    if (!groupedMap.has(group)) groupedMap.set(group, []);
                                    groupedMap.get(group)?.push(v);
                                });

                                const groupedData = Array.from(groupedMap.entries()).map(([group, values]) => ({
                                    group,
                                    values,
                                }));

                                return (
                                    <div className='mt-2 mb-2 !mr-2 !p-2 bg-white text-black rounded text-center'>
                                        <BaseRPlot
                                            data={groupedData}
                                            type="density-grouped"
                                            width={280}
                                            height={280}
                                            xLabel={column}
                                            yLabel="Density"
                                        />
                                    </div>
                                );
                            })()
                        ) : (
                            <>
                                <div className=' mt-2 mb-2 bg-white text-black rounded text-center'>
                                    <BaseRPlot
                                        data={data ? data[column]?.values : []}
                                        type={plotType}
                                        width={280}
                                        height={280}
                                        xLabel={column}
                                    />
                                </div>
                            </>
                        )}
                    </>
                }
            </div>
        );
    }

    const [jsx, setJsx] = useState<JSX.Element | null>(null);

    useEffect(() => {
        setJsx(generatePlot());
    }, [column, groupColumn, plotType, data, output.value]);

                                            
    useEffect(() => {
        const handleMouseUp = (e: MouseEvent) => {
            if (!nodeRef.current?.contains(e.target as Node)) {
                setAddDependencyFunction(undefined)
                setRemoveDependencyFunction(undefined)
                setUpdateInputFunction(undefined)
                setSelectedInputId(null)
                setSelectedOutputId(null)
                finishConnection(null)
                updateAllPortPositions();
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
            defaultClassName='inline-block draggable-item absolute'
            nodeRef={nodeRef}
            onDrag={onDragHandler}
            onStop={onDragHandler} // also update positions when drag ends
            cancel='.plotly,button'
        >
            <div ref={nodeRef} style={style}>
                <Card
                    className="bg-[#53585a] overflow-hidden rounded-lg !gap-0 !py-0 !pt-0 !mt-0 !shadow-none !border-none"
                    style={width ? { width: `300px` } : { width: '300px' }}
                >
                    <CardHeader className="bg-[#3b3f42] text-left px-4 text-black !gap-0 !py-1 text-sm font-semibold font-mono select-none !shadow-none">
                        {label}
                    </CardHeader>
                    <CardContent className="mt-2 pt-2 px-0 bg-[#696f72]">
                        <div className='flex flex-col items-stretch gap-4 text-justify'>
                            {
                                inputs.map((input, index) => {
                                    const updateInputFunction = () => (value: number) => {
                                        updateInput(index, { value: value });
                                    };
                                    return (
                                        <div
                                            key={input.id}
                                            className='self-start text-left flex !mr-0 pr-0'
                                        >
                                            <div
                                                className='!ml-0 !px-0 flex items-center'
                                                ref={el => {
                                                    portRefs.current[input.id] = el;
                                                }}
                                            >
                                                <button
                                                    // className={`!mx-2 !mb-[10px] !px-2 !w-4 !aspect-square !rounded-full !p-0 !border-0 !cursor-pointer ${input.connected ? '!bg-gray-400' : '!bg-gray-600'}`} 
                                                    className={`!mx-2 !px-2 !w-4 !aspect-square !rounded-full ${input.connected ? '!bg-gray-400' : '!bg-gray-600'} !p-0 !border-0 !cursor-pointer`}
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
                                                        if (input.removeDependencyFunction && input.addDependencyFunction) {
                                                            input.removeDependencyFunction(input.id)
                                                            input.connected && setRemoveDependencyFunction(() => input.removeDependencyFunction)
                                                            input.connected && setAddDependencyFunction(() => input.addDependencyFunction)
                                                            input.connected && moveEndPoint(input.id);
                                                            updateInput(index, {connected: null})
                                                        }
                                                    }}
                                                ></button>
                                            </div>
                                            {/* <div className='my-1'>
                                                <input
                                                    className='w-1/3 py-0 px-2 bg-white text-black rounded'
                                                    type={input.connected ? 'text' : 'number'}
                                                    readOnly={input.connected ? true : false}
                                                    value={input.value}
                                                    onChange={e => updateInput(index, { value: Number(e.target.value) })}
                                                />
                                            </div> */}
                                        </div>
                                    );
                                })}

                            <div className='flex flex-col !items-left !gap-0 pl-2'>
                                <Select value={column} onValueChange={(value) => setColumn(value)}>
                                    <SelectTrigger className="w-[230px] rounded bg-white !text-black !h-8 !text-sm mb-1">
                                        <SelectValue placeholder="Select a column" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Column</SelectLabel>
                                            {numericColumns.map((col) => (
                                                <SelectItem key={col} value={col}>
                                                    {col}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                <Select value={groupColumn} onValueChange={(value) => setGroupColumn(value)}>
                                    <SelectTrigger className="w-[230px] rounded bg-white !text-black !h-8 !text-sm mt-1 !mb-0">
                                        <SelectValue placeholder="Group by (optional)" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Group Column</SelectLabel>
                                            {categoricalColumns.map((col) => (
                                                <SelectItem key={col} value={col}>
                                                    {col}
                                                </SelectItem>
                                            ))}
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {jsx}


                            </div>

                            {/*                             <div className='self-end text-right flex !ml-0 pl-0'>
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
                                        className={`!mx-2 !px-2 !w-4 !aspect-square !rounded-full !bg-gray-${Object.keys(dependencies).length > 0 ? '600' : '900'} !hover:bg-gray-700 !p-0 !border-0 ! cursor-pointer`}
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
                            </div> /*} */}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Draggable>
    );
};

export default React.memo(NodeSinc);