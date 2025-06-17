import React, { useEffect, useId, useState, type JSX } from 'react';
import SomeNode from './SomeNode';
import { useMousePosition } from './useMousePosition';
import NodePlot from './NodePlot';
import PlotDraggableNode from './PlotDraggableNode';
import Simple3DPlot from './PlotDraggableNode';

interface EngineProps {
    // Define your props here
}

const Engine: React.FC<EngineProps> = (props) => {

    const [addDependencyFunction, setAddDependencyFunction] = useState<(id: string, f: (value: any) => void) => void>();
    const [removeDependencyFunction, setRemoveDependencyFunction] = useState<((id: string) => void) | undefined>(undefined);
    const [updateInputFunction, setUpdateInputFunction] = useState<(value: any) => void>();
    const [selectedInputId, setSelectedInputId] = useState<string | null>(null);
    const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null)

    useEffect(() => {
        if (selectedInputId && addDependencyFunction && updateInputFunction) {
            console.log(`Connecting output → input: ${selectedOutputId} → ${selectedInputId}`);
            addDependencyFunction(selectedInputId, updateInputFunction);
            setSelectedInputId(null);
            setAddDependencyFunction(undefined);
            setRemoveDependencyFunction(undefined);
            setUpdateInputFunction(undefined);
        }
    }, [selectedInputId, addDependencyFunction, updateInputFunction]);

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

    const addNumbers = (a: number, b: number): number => {
        return a + b;
    }

    const g: ((a: number, b: number) => number) = (a, b) => a+b; 

    type ExtractReturn<T> =
  T extends (...args: any[]) => infer R
    ? R
    : never;

    type RT = ExtractReturn<typeof g>;
    const q: RT = 5
    console.log(typeof q);

    return (
        <div>
            <button 
                onClick={addNode}>
                    New Node
            </button>
            {nodes.map(nodeData => (
                <SomeNode
                    key={nodeData.id}
                    label={nodeData.label}
                    setAddDependencyFunction={setAddDependencyFunction}
                    addDependencyFunction={addDependencyFunction}
                    setRemoveDependencyFunction={setRemoveDependencyFunction}
                    removeDependencyFunction={removeDependencyFunction}
                    setUpdateInputFunction={setUpdateInputFunction}
                    setSelectedInputId={setSelectedInputId}
                    setSelectedOutputId={setSelectedOutputId}
                    selectedInputId={selectedInputId}
                    selectedOutputId={selectedOutputId}
                />
            ))}
            {
               <Simple3DPlot/>
            }
        </div>
    );
};

export default Engine;