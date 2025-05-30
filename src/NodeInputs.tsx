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
        updateInput: () => (value: number) => void;
    }>
}

const NodeInputs: React.FC<NodeInputsProps> = ({
   inputs 
 }) => {
    return (
        <>
            {inputs.map((input) => {
                const inputConnectioninFunction = () => (input: any) => {
                    input.updateInput(input)
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
                        updateInput={input.updateInput}
                    />
                );
            })}
        </>
    );
}


export default NodeInputs;