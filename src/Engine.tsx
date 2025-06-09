import React, { useEffect, useId, useState, type JSX } from 'react';
import AddNumbers from './AddNumbers';
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

    useEffect(() => {
        // This effect runs once when the component mounts
        // You can initialize any state or perform side effects here
        if (selectedInputId && addDependencyFunction && updateInputFunction) {
                        addDependencyFunction(selectedInputId, updateInputFunction);
                        setSelectedOutputId(null);
                        setSelectedInputId(null);
        }
        console.log('Engine component mounted');
    }
    , [selectedInputId, selectedOutputId, addDependencyFunction, removeDependencyFunction, updateInputFunction]);

    const a = [0, 2, 3].map((i) =>// {
               // return ( 
                    <SomeNode
                        key={i}
                        name={`test${i}`}
                        label={`test${i}`}
                        setAddDependencyFunction={setAddDependencyFunction}
                        setRemoveDependencyFunction={setRemoveDependencyFunction}
                        removeDependencyFunction={removeDependencyFunction}
                        setUpdateInputFunction={setUpdateInputFunction}
                        setSelectInputId={setSelectedInputId}
                        setSelectOutputId={setSelectedOutputId}
                        selectedInputId={selectedInputId}
                        selectedOutputId={selectedOutputId}
                    />
              //  )
        //    }
        )
   const i = 5; 
   const [nodes, setNodes] = useState<JSX.Element[]>(a);
   const position = useMousePosition();
   console.log('Mouse position:', position);
        const b = <SomeNode
                        key={useId()}
                        name={`test${i}`}
                        label={`test${i}`}
                        setAddDependencyFunction={setAddDependencyFunction}
                        setRemoveDependencyFunction={setRemoveDependencyFunction}
                        removeDependencyFunction={removeDependencyFunction}
                        setUpdateInputFunction={setUpdateInputFunction}
                        setSelectInputId={setSelectedInputId}
                        setSelectOutputId={setSelectedOutputId}
                        selectedInputId={selectedInputId}
                        selectedOutputId={selectedOutputId}
                        style={{ position: 'absolute', top: `${position.y}px`, left: `${position.x}px` }}
                    />
    return (
        <div>
            
            <button 
                onClick={() => {
                  setNodes([...nodes, b]);
                }}>
                    New Connection
            </button>
             {nodes}

        </div>
    );
};

export default Engine;