// Engine.tsx

import './nodeRegistration'; // runs side-effect and registers all nodes
import React, { useContext, useEffect, useId, useState, type JSX } from 'react';
import ContextMenu, { ContextMenuItem } from './ContextMenu';
import { getNodeComponent } from './NodeRegistry';
import { nodeCatalog } from './nodeRegistration';
import { useNodeEngine } from './NodeEngineContext';
import { ConnectionContext } from './Connections';

const grouped = nodeCatalog.reduce((acc, node) => {
    if (!acc[node.category]) acc[node.category] = [];
    acc[node.category].push(node);
    return acc;
}, {} as Record<string, typeof nodeCatalog>);


const Engine: React.FC = () => {

    const [addDependencyFunction, setAddDependencyFunction] = useState<(id: string, f: (value: any) => void) => void>();
    const [removeDependencyFunction, setRemoveDependencyFunction] = useState<((id: string) => void) | undefined>(undefined);
    const [updateInputFunction, setUpdateInputFunction] = useState<(value: any) => void>();
    const [selectedInputId, setSelectedInputId] = useState<string | null>(null);
    const [selectedInputType, setSelectedInputType] = useState<string | null>(null);
    const [selectedOutputId, setSelectedOutputId] = useState<string | null>(null)
    const [selectedOutputType, setSelectedOutputType] = useState<string | null>(null)

    const [contextMenuOpen, setContextMenuOpen] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [contextMenuItems, setContextMenuItems] = useState<Array<ContextMenuItem>>([])
    const { startConnection, finishConnection, updatePortPosition, moveEndPoint, deleteConnectons, getConnections   } =
        useContext(ConnectionContext);

    useEffect(() => {
        if (selectedInputId && addDependencyFunction && updateInputFunction) {
            console.log(`Connecting output → input: ${selectedOutputId} → ${selectedInputId}`);
            console.log(selectedInputType, selectedOutputType)
            if (selectedInputType === selectedOutputType) {
                addDependencyFunction(selectedInputId, updateInputFunction);
                setSelectedInputId(null);
                setAddDependencyFunction(undefined);
                setRemoveDependencyFunction(undefined);
                setUpdateInputFunction(undefined);
            }
        }
    }, [selectedInputId, addDependencyFunction, updateInputFunction]);

    const { nodes, createNode, removeNode, selectedNode, setSelectedNode } = useNodeEngine();

    const openContextMenu = (position: { x: number; y: number }, items: Array<ContextMenuItem>) => {
        setContextMenuOpen(true);
        setContextMenuPosition(position);
        setContextMenuItems(items);
    };

    const closeContextMenu = () => {
        setContextMenuOpen(false)
        setContextMenuItems([])
    }

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
                        setSelectedInputType={setSelectedInputType}
                        setSelectedOutputId={setSelectedOutputId}
                        setSelectedOutputType={setSelectedOutputType}
                        setSelectedNode={setSelectedNode}
                        selectedInputId={selectedInputId}
                        selectedOutputId={selectedOutputId}
                        selectedOutputType={selectedOutputType}
                        openContextMenu={openContextMenu}
                        removeNode={() => removeNode(node.id)}
                        style={{ position: "absolute", left: node.x, top: node.y }}
                    />
                );
            })}
            <div style={{ width: '100%', height: '100vh', zIndex: 998 }} onContextMenu={(e) => {
                e.preventDefault();
                console.log(e)
                e.currentTarget.closest('.node') ? false : openContextMenu({ x: e.clientX, y: e.clientY }, nodeCatalog.map((node) => ({
                    label: node.label,
                    category: node.category,
                    onClick: () => {
                        createNode(node.type, { x: e.clientX, y: e.clientY })
                        closeContextMenu();
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