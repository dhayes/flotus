import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import Draggable from 'react-draggable';

interface AddNumbersProps {
    name: string;
    label: string;
    description?: string;
    width?: number;
    setNewConnectionInputUpdater: (value: any) => void;
    setNewConnectionOutputDependencyUpdater: (value: any) => void;
    selectedOutputId: string | null;
    setSelectedOutputId: (value: any) => void; 
}

type Input = {
    id: string;
    value: number;
    connected: string | null;
    setNewConnectionInputUpdater: (value: any) => void;
}

const AddNumbers: React.FC<AddNumbersProps> = ({ 
    name, 
    label, 
    description, 
    width, 
    setNewConnectionInputUpdater, 
    setNewConnectionOutputDependencyUpdater: setNewConnectionOutputDependencyUpdater,
    selectedOutputId,
    setSelectedOutputId,
}) => {

    const inputsData = [
        {
            id: useId(),
            value: 0,
            connected: null,
            setNewConnectionInputUpdater
        },
        {
            id: useId(),
            value: 0,
            connected: null,
            setNewConnectionInputUpdater
        }
    ]

    const [inputs, setInputs] = useState<Input[]>(inputsData)

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
                            {
                                inputs.map((input, index) => {
                                    const inputConnectioninFunction = useCallback(
                                        () => (value: any) => updateInput(index, value),
                                        [index]
                                    );
                                    return (
                                        <div className='self-start' key={input.id}>
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
                            }
                            <div className='self-end text-right'>
                                <input
                                    className='w-1/3 py-0 px-2 bg-white text-black rounded'
                                    type='text'
                                    value={output}
                                    readOnly
                                /> 
                                <input id='outputCheckbox' type='checkbox' className='mr-0 ml-2' onClick={
                                    () => setNewConnectionOutputDependencyUpdater(addDependencyFunction)
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