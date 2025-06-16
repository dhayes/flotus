import React, { useEffect, useId, useState, type JSX } from 'react';
import SomeNode from './SomeNode';
import { useMousePosition } from './useMousePosition';

interface EngineProps {
    // Define your props here
}

const Engine: React.FC<EngineProps> = (props) => {

    const [addDependencyFunction, setAddDependencyFunction] = useState<(id: string, f: (value: any) => void) => void>();
    const [removeDependencyFunction, setRemoveDependencyFunction] = useState<(value: any) => void>();
    const [updateInputFunction, setUpdateInputFunction] = useState<(value: any) => void>();
    const [selectedInputId, setSelectedInputId] = useState<string | null>(null);
    const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null)

    useEffect(() => {
        // This effect runs once when the component mounts
        // You can initialize any state or perform side effects here
        if (selectedInputId && addDependencyFunction && updateInputFunction) {
                        addDependencyFunction(selectedInputId, updateInputFunction);
        }
        console.log('Engine component mounted');
    }
    , [updateInputFunction]);

    type NodeData = { id: string; name: string; label: string; };

    const [nodes, setNodes] = useState<NodeData[]>([
        { id: crypto.randomUUID(), name: 'test0', label: 'test0' },
        { id: crypto.randomUUID(), name: 'test2', label: 'test2' },
        { id: crypto.randomUUID(), name: 'test3', label: 'test3' },
    ]);

    const addNode = () => {
        setNodes(prev => [
            ...prev,
            { id: crypto.randomUUID(), name: `test${prev.length}`, label: `test${prev.length}` },
        ]);
    }
   
   const position = useMousePosition();
    
    return (
        <div>
            <button 
                onClick={addNode}>
                    New Node
            </button>
            {nodes.map(nodeData => (
                <SomeNode
                    key={nodeData.id}
                    name={nodeData.name}
                    label={nodeData.label}
                    setAddDependencyFunction={setAddDependencyFunction}
                    setRemoveDependencyFunction={setRemoveDependencyFunction}
                    removeDependencyFunction={removeDependencyFunction}
                    setUpdateInputFunction={setUpdateInputFunction}
                    setSelectedInputId={setSelectedInputId}
                    setSelectedOutputId={setSelectedOutputId}
                    selectedInputId={selectedInputId}
                    selectedOutputId={selectedOutputId}
                />
            ))}
        </div>
    );
};

export default Engine;