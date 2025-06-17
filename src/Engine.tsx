import React, { useEffect, useId, useState, type JSX } from 'react';
import Node from './Node';
import { useMousePosition } from './useMousePosition';
import NodePlot from './NodePlot';
import PlotDraggableNode from './PlotDraggableNode';
import Simple3DPlot from './PlotDraggableNode';
import NodeSlider from './NodeSlider';

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

    return (
        <div>
            <button 
                onClick={addNode}>
                    New Node
            </button>
            {nodes.map(nodeData => (
                <Node
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
                <>
               <NodePlot
                    key={useId()}
                    label="Plot Node"
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
                <NodeSlider
                    key={useId()}
                    label="Plot Node"
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
                </>
            }
        </div>
    );
};

export default Engine;