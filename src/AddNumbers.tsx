import React, { useEffect, useId, useRef, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import Draggable from 'react-draggable';
import NodeInputs from './NodeInputs';

interface AddNumbersProps {
    name: string;
    label: string;
    description?: string;
    width?: number;
    setNewConnectionInputUpdater: (value: any) => void;
    setnewConnectionOutputDependencyUpdater: (value: any) => void;
    selectedOutputId: string | null;
    setSelectedOutputId: (value: any) => void; 
}

type Input = {
    id: string;
    value: number;
    connected: string | null;
    label: string;
    setNewConnectionInputUpdater: (value: any) => void;
}

const AddNumbers: React.FC<AddNumbersProps> = ({ 
    name, 
    label, 
    description, 
    width, 
    setNewConnectionInputUpdater, 
    setnewConnectionOutputDependencyUpdater,
    selectedOutputId,
    setSelectedOutputId,
}) => {

    console.log('AddNumbers component rendered');
    const inputsData = [
        {
            id: useId(),
            value: 0,
            connected: null,
            label: 'Input 1',
            setNewConnectionInputUpdater
        },
        {
            id: useId(),
            value: 0,
            connected: null,
            label: 'Input 2',
            setNewConnectionInputUpdater
        }
    ]

    const [inputs, setInputs] = useState<Input[]>(inputsData)

    const updateInput = (index: number, value: number) => {
        console.log(`Updating input at index ${index} with value ${value}`);
        setInputs(prev => {
            console.log('Previous inputs:', prev);
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                value: value
            };
            console.log('Updated inputs:', updated);
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

    return (
        <Draggable nodeRef={nodeRef}>
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
                            <NodeInputs
                                inputs={inputsData.map((input, index) => ({
                                    id: input.id,
                                    value: inputs[index].value,
                                    connected: input.connected,
                                    label: input.label,
                                    setNewConnectionInputUpdater: input.setNewConnectionInputUpdater,
                                    outputId: selectedOutputId,
                                    updateInput: (value: number) => updateInput(index, value),
                                    setSelectedOutputId
                                }))}
                            />
                            {/* {
                                inputs.map((input, index) => {
                                    const inputConnectioninFunction = () => {
                                        const f = (value: any) => {
                                            updateInput(index, value);
                                        }
                                        return f;
                                    };
                                    return (
                                        <div className='self-start'>
                                            <input
                                                id={input.id}
                                                type='checkbox'
                                                className='mr-2 ml-0'
                                                onClick={() => {
                                                    setNewConnectionInputUpdater(inputConnectioninFunction);
                                                    setSelectedOutputId(outputId);
                                                }}
                                            />
                                            <input
                                                className='w-1/3 py-0 px-2 bg-white text-black rounded'
                                                type='number'
                                                value={input.value}
                                                onChange={e => updateInput(index, Number(e.target.value))}
                                            />
                                        </div>
                                    )
                                })
                            } */}
                            <div className='self-end text-right'>
                                <input
                                    className='w-1/3 py-0 px-2 bg-white text-black rounded'
                                    type='text'
                                    value={output}
                                    readOnly
                                /> 
                                <input id='outputCheckbox' type='checkbox' className='mr-0 ml-2' onClick={
                                    () => setnewConnectionOutputDependencyUpdater(addDependencyFunction)
                                } />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Draggable>
    );
};

export default AddNumbers;