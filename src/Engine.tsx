// Engine.tsx

import './nodeRegistration'; // runs side-effect and registers all nodes
import React, { useContext, useEffect, useId, useState, type JSX } from 'react';
import { ConnectionContext } from "@/Connections";
import ContextMenu, { ContextMenuItem } from './ContextMenu';
import { getNodeComponent } from './NodeRegistry';
import { nodeCatalog } from './nodeRegistration';
import { useNodeEngine } from './NodeEngineContext';

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
    const { startConnection, finishConnection, updatePortPosition, deleteConnection, moveEndPoint } =
        useContext(ConnectionContext)

    const [addDependencyFunction, setAddDependencyFunction] = useState<(id: string, f: (value: any) => void) => void>();
    const [removeDependencyFunction, setRemoveDependencyFunction] = useState<((id: string) => void) | undefined>(undefined);
    const [updateInputFunction, setUpdateInputFunction] = useState<(value: any) => void>();
    const [selectedInputId, setSelectedInputId] = useState<string | null>(null);
    const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null)

    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [contextMenuItems, setContextMenuItems] = useState<Array<ContextMenuItem>>([])

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

    //type NodeData = { id: string; type: string; label: string };


    const { nodes, createNode, removeNode } = useNodeEngine();

    // const [nodes, setNodes] = useState<NodeData[]>([]);

    // const addNode = () => {
    //     setNodes(prev => [
    //         ...prev,
    //         { id: crypto.randomUUID(), type: 'math/add', label: 'test0' },
    //     ]);
    // }

    // const removeNode = (id: string) => {
    //     setNodes(prev => prev.filter(node => node.id !== id));
    // }

    const openContextMenu = (position: { x: number; y: number }, items: Array<ContextMenuItem>) => {
        setContextMenuOpen(true);
        setContextMenuPosition(position);
        setContextMenuItems(items);
    };

    return (
        <div>
            {nodes.map((node) => {
                const NodeComponent = getNodeComponent(node.type);
                if (!NodeComponent) return null;

                return (
                    <NodeComponent
                        key={node.id}
                        id={node.id}
                        label={node.label}
                        setAddDependencyFunction={setAddDependencyFunction}
                        addDependencyFunction={addDependencyFunction}
                        setRemoveDependencyFunction={setRemoveDependencyFunction}
                        removeDependencyFunction={removeDependencyFunction}
                        setUpdateInputFunction={setUpdateInputFunction}
                        setSelectedInputId={setSelectedInputId}
                        setSelectedOutputId={setSelectedOutputId}
                        selectedInputId={selectedInputId}
                        selectedOutputId={selectedOutputId}
                        openContextMenu={openContextMenu}
                        removeNode={() => removeNode(node.id)}
                        style={{ position: "absolute", left: node.x, top: node.y }}
                    />
                );
            })}
            <div style={{ width: '100%', height: '100vh', zIndex: 998 }} onContextMenu={(e) => {
                e.preventDefault();
                console.log(e)
                // setContextMenuPosition({ x: e.clientX, y: e.clientY });
                // setContextMenuOpen(true);
                e.currentTarget.closest('.node') ? false : openContextMenu({ x: e.clientX, y: e.clientY }, nodeCatalog.map((node) => ({
                    label: node.label,
                    category: node.category,
                    onClick: () => {
                        // setNodes(prev => [
                        //     ...prev,
                        //     { id: crypto.randomUUID(), type: node.type, label: node.label },
                        // ]);
                       console.log("newnode") 
                       createNode(node.type, {x: e.clientX, y: e.clientY})
                    },
                })));
            }}>
                <ContextMenu
                    isOpen={contextMenuOpen}
                    position={contextMenuPosition}
                    onClose={() => setContextMenuOpen(false)}
                    items={contextMenuItems}
                />
            </div>
        </div>
    );
};

export default Engine;