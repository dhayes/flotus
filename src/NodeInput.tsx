import React from 'react';

interface NodeInputProps {
    ref: React.Ref<HTMLDivElement> | undefined
    id: string;
    value: number;
    connected: string | null;
    outputId: string | null;
    setNewConnectionInputUpdater: (f: () => (value: any) => void) => void;
    setSelectedOutputId: (value: string | null) => void;
    inputConnectioninFunction: () => (value: any) => void;
    updateInput: (value: number) => void;
    
    onMouseDown: React.MouseEventHandler<HTMLDivElement> | undefined
    onMouseUp: React.MouseEventHandler<HTMLDivElement> | undefined
}

const NodeInput: React.FC<NodeInputProps> = ({
    ref,
    id,
    value,
    connected,
    outputId,
    setNewConnectionInputUpdater,
    setSelectedOutputId,
    inputConnectioninFunction,
    updateInput,
    onMouseDown,
    onMouseUp
}) => {
    return (
        <div 
            className='self-start flex'
            //onMouseDown={onMouseDown}
        >
            <div
                key={outputId}
                ref={ref}
                onMouseUp={() => {
                        alert('qqq')
                        setNewConnectionInputUpdater(inputConnectioninFunction);
                        setSelectedOutputId(outputId);
                }}
            >
                <input
                    onMouseUp={onMouseUp}
                    id={id}
                    type='checkbox'
                    className='mr-2 ml-0'
                    // onMouseUpCapture={() => {
                    //     alert('qqq')
                    //     setNewConnectionInputUpdater(inputConnectioninFunction);
                    //     setSelectedOutputId(outputId);
                    // }}
                />
            </div>
            <div>
                <input
                    className='w-1/3 py-0 px-2 bg-white text-black rounded'
                    type='number'
                    value={value}
                    onChange={e => updateInput(Number(e.target.value))}
                />
            </div>
        </div>
    );
};

export default NodeInput;