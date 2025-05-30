import React from 'react';
import NodeInput from './NodeInput';

interface NodeInputsProps {
    inputs: Array<{ 
        id: string; 
        label: string; 
        value: number;
        connected: string | null;
        outputId: string | null;
        setNewConnectionInputUpdater: (value: any) => void;
        setSelectedOutputId: (value: string | null) => void;
        updateInput: (index:number, value: number) => void;
    }>;
}

const NodeInputs: React.FC<NodeInputsProps> = ({
   inputs 
 }) => {
    return (
        <>
            {inputs.map((input, index) => {
                const inputConnectioninFunction = (value: any) => {
                    input.updateInput(index, value);
                };
                return (
                    <NodeInput
                        key={input.id}
                        id={input.id}
                        value={input.value}
                        connected={input.connected}
                        outputId={input.outputId}
                        setNewConnectionInputUpdater={input.setNewConnectionInputUpdater}
                        setSelectedOutputId={input.setSelectedOutputId}
                        inputConnectioninFunction={inputConnectioninFunction}
                        updateInput={(value: number) => input.updateInput(index, value)}
                    />
                );
            })}
        </>
    );
}


export default NodeInputs;