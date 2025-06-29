import './nodeRegistration'; // runs side-effect and registers all nodes
import React, { useEffect, useId, useState, type JSX } from 'react';
import ContextMenu from './ContextMenu';
import { getNodeComponent } from './NodeRegistry';
import { nodeCatalog } from './nodeRegistration';

const grouped = nodeCatalog.reduce((acc, node) => {
  if (!acc[node.category]) acc[node.category] = [];
  acc[node.category].push(node);
  return acc;
}, {} as Record<string, typeof nodeCatalog>);

console.log('Node Catalog:', nodeCatalog);
console.log('Node Catalog:', grouped);
console.log('Node Catalog:', Object.entries(grouped).map(([category, nodes]) => ({ category, nodes: nodes.map(n => n.label) })));   

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

    type NodeData = { id: string; type: string; label: string };


    const [nodes, setNodes] = useState<NodeData[]>([
        { id: crypto.randomUUID(), type: 'math/add', label: 'test0' },
        { id: crypto.randomUUID(), type: 'basicnode', label: 'test2' },
        { id: crypto.randomUUID(), type: 'basicnode', label: 'test3' },
    ]);

    const addNode = () => {
        setNodes(prev => [
            ...prev,
        { id: crypto.randomUUID(), type: 'math/add', label: 'test0' },
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
                items={nodeCatalog.map((node) => ({
                    label: node.label,
                    category: node.category,
                    onClick: () => {
                        setNodes(prev => [
                            ...prev,
                            { id: crypto.randomUUID(), type: node.type, label: node.label },
                        ]);
                    },
                }))}
            />
            {nodes.map((nodeData) => {
                const NodeComponent = getNodeComponent(nodeData.type);
                if (!NodeComponent) return null;

                return (
                    <NodeComponent
                        key={nodeData.id}
                        id={nodeData.id}
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
                );
            })}
        </div>
    );
};

export default Engine;