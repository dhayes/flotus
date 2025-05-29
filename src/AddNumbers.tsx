import React, { useEffect, useRef, useState } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card";
import Draggable from 'react-draggable';
import { Checkbox } from '@radix-ui/react-checkbox';

interface AddNumbersProps {
    name: string;
    label: string;
    description?: string;
    width?: number;
    setNewConnectionInputUpdater: (value: any) => void;
}

const AddNumbers: React.FC<AddNumbersProps> = ({ name, label, description, width, setNewConnectionInputUpdater }) => {

    const addNumbers = (a: number, b: number): number => {
        return a + b;
    }

    const [input1, setInput1] = React.useState<number>(0);
    const [input2, setInput2] = React.useState<number>(0);
    const [output, setOutput] = React.useState<number>(addNumbers(input1, input2));

    const inputs: Array<[any, (value: any) => void]> = [input1, input2].map((input) => {
        return React.useState<number>(input);
    });

    const updateInputFunctions: Array<(value: number) => void> = inputs.map((input) => {
        const [_, setInputValue] = input;
        const f = (value: any) => {
            setInputValue(value);
        };
        return f;
    } );

    //const [outputs, setOutputs] = React.useState<number[]>([output]);

    const input1ConnectioninFunction = () => {
        const f = (value: any) => {
            setInput1(value);
        }
        return f;
    };
    const input2ConnectioninFunction = () => {
        const f = (value: any) => {
            setInput2(value);
        }
        return f;
    };

    useEffect(() => {
        setOutput(addNumbers(input1, input2));
    }, [input1, input2]);

    //demo fun, to be deleted
    const outputConnectioninFunction = (value: number) => {
        console.log(`Output connection function called with value: ${value}`);
    }

    // const dependencies: Array<(value: any) => void> = [
    //     outputConnectioninFunction
    // ];

    const [dependencies, setDependencies] = useState<Array<(value: any) => void>>([]);

    const addDependency = (f: (value: any) => void) => {
        setDependencies(previousState => {
            return [...previousState, f]
        })
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
                            <div className='self-start'>
                                <input 
                                    id='input1Checkbox' 
                                    type='checkbox' 
                                    className='mr-2 ml-0' 
                                    onClick={() => setNewConnectionInputUpdater(input1ConnectioninFunction)} 
                                />
                                <input 
                                    className='w-1/3 py-0 px-2 bg-white text-black rounded'
                                    type='number' 
                                    value={input1} 
                                    onChange={e => setInput1(Number(e.target.value))} 
                                />
                            </div>
                            <div className='self-start'>
                                <input 
                                    id='input2Checkbox' 
                                    type='checkbox' 
                                    className='mr-2 ml-0' 
                                    onClick={() => setNewConnectionInputUpdater(input2ConnectioninFunction)} 
                                />
                                <input 
                                    className='w-1/3 py-0 px-2 bg-white text-black rounded'
                                    type='number' 
                                    value={input2} 
                                    onChange={e => setInput2(Number(e.target.value))} 
                                />
                            </div>
                            <div className='self-end text-right'>
                                <input
                                    className='w-1/3 py-0 px-2 bg-white text-black rounded'
                                    type='text'
                                    value={output}
                                    readOnly
                                /> 
                                <input id='outputCheckbox' type='checkbox' className='mr-0 ml-2' />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </Draggable>
    );
};

export default AddNumbers;