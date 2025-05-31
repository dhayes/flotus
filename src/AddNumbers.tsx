import React, { useCallback, useEffect, useId, useRef, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import Draggable from 'react-draggable';
import NodeInput from './NodeInput';

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
                                    const inputConnectioninFunction = () => {
                                        return (value: any) => {
                                            updateInput(index, value);
                                        };
                                    };
                                    return (
                                        <NodeInput
                                            key={input.id}
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