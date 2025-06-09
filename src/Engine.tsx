import React, { useState } from 'react';
import AddNumbers from './AddNumbers';
import SomeNode from './SomeNode';

interface EngineProps {
    // Define your props here
}

const Engine: React.FC<EngineProps> = (props) => {

    const [addDependencyFunction, setAddDependencyFunction] = useState<(id: string, f: (value: any) => void) => void>();
    const [removeDependencyFunction, setRemoveDependencyFunction] = useState<(value: any) => void>();
    const [updateInputFunction, setUpdateInputFunction] = useState<(value: any) => void>();
    const [selectedInputId, setSelectedInputId] = useState<string | null>(null);
    const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null)

    const testNode1 = <SomeNode
        name='test1' 
        label='test1' 
        setAddDependencyFunction={setAddDependencyFunction}
        setRemoveDependencyFunction={setRemoveDependencyFunction}
        removeDependencyFunction={removeDependencyFunction}
        setUpdateInputFunction={setUpdateInputFunction}
        setSelectInputId={setSelectedInputId}
        setSelectOutputId={setSelectedOutputId}
        selectedInputId={selectedInputId}
        selectedOutputId={selectedOutputId}
    />
    const testNode2 = <SomeNode
        name='test2' 
        label='test2' 
        setAddDependencyFunction={setAddDependencyFunction}
        setRemoveDependencyFunction={setRemoveDependencyFunction}
        removeDependencyFunction={removeDependencyFunction}
        setUpdateInputFunction={setUpdateInputFunction}
        setSelectInputId={setSelectedInputId}
        setSelectOutputId={setSelectedOutputId}
        selectedInputId={selectedInputId}
        selectedOutputId={selectedOutputId}
    />

    return (
        <div>
            { testNode1 }
            { testNode2 }
            { testNode2 }
            { testNode2 }
            <button 
                onClick={() => {
                    if (selectedInputId && addDependencyFunction && updateInputFunction) {
                        addDependencyFunction(selectedInputId, updateInputFunction);
                    }
                }}>
                    New Connection
            </button>
        </div>
    );
};

export default Engine;