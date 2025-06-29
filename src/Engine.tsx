import React, { useEffect, useId, useState, type JSX } from 'react';
import Node from './Node';
import { useMousePosition } from './useMousePosition';
import NodePlot from './NodePlot';
import NodeSlider from './NodeSlider';
import ContextMenu from './ContextMenu';

interface EngineProps {
    // Define your props here
}

const Engine: React.FC<EngineProps> = (props) => {

    const [addDependencyFunction, setAddDependencyFunction] = useState<(id: string, f: (value: any) => void) => void>();
    const [removeDependencyFunction, setRemoveDependencyFunction] = useState<((id: string) => void) | undefined>(undefined);
    const [updateInputFunction, setUpdateInputFunction] = useState<(value: any) => void>();
    const [selectedInputId, setSelectedInputId] = useState<string | null>(null);
    const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null)

    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

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

    return (
        <div style={{ width: '100%', height: '100vh' }} onContextMenu={(e) => {
            e.preventDefault();
            setContextMenuPosition({ x: e.clientX, y: e.clientY });
            setContextMenuOpen(true);
        }}>
            <button
                onClick={addNode}>
                New Node
            </button>
            <ContextMenu
                isOpen={contextMenuOpen}
                position={contextMenuPosition}
                onClose={() => setContextMenuOpen(false)}
                items={[
                    {
                        label: 'Add Node',
                        onClick: () => {
                            addNode();
                            setContextMenuOpen(false);
                        },
                    },
                    {
                        label: 'Remove Node',
                        onClick: () => {
                            // Implement remove node logic here
                            setContextMenuOpen(false);
                        },
                    },
                ]}
            />
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