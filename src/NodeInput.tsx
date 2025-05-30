import React from 'react';

interface NodeInputProps {
    id: string;
    value: number;
    connected: string | null;
    outputId: string | null;
    setNewConnectionInputUpdater: (value: any) => void;
    setSelectedOutputId: (value: string | null) => void;
    inputConnectioninFunction: (value: any) => void;
    updateInput: (value: number) => void;
}

const NodeInput: React.FC<NodeInputProps> = ({
    id,
    value,
    connected,
    outputId,
    setNewConnectionInputUpdater,
    setSelectedOutputId,
    inputConnectioninFunction,
    updateInput,
}) => {
    return (
        <div className='self-start'>
            <input
                id={id}
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
                value={value}
                onChange={e => updateInput(Number(e.target.value))}
            />
        </div>
    );
};

export default NodeInput;