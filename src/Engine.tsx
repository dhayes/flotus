import React, { useState } from 'react';
import AddNumbers from './AddNumbers';

interface EngineProps {
    // Define your props here
}

const Engine: React.FC<EngineProps> = (props) => {

    const [newConnectionInput, setNewConnectionInput] = useState<((value: any) => void)>();

    const [newConnectionOutputDependencyUpdater, setNewConnectionOutputDependencyUpdater] = useState<((value: any) => void)>()

    interface InputSetter {
        (value: any): void;
    }

    interface DependencyUpdater {
        (value: any): void;
    }

    function createConnection(inputSetter: InputSetter, dependencyUpdater: DependencyUpdater): void {
        dependencyUpdater(inputSetter);
    }

    const testNode1 = <AddNumbers 
        name='test1' 
        label='test1' 
        setNewConnectionInput={setNewConnectionInput}
        setnewConnectionOutputDependencyUpdater={setNewConnectionOutputDependencyUpdater}
    />
    const testNode2 = <AddNumbers 
        name='test2' 
        label='test2' 
        setNewConnectionInput={setNewConnectionInput}
        setnewConnectionOutputDependencyUpdater={setNewConnectionOutputDependencyUpdater}
    />

    return (
        <div>
            { testNode1 }
            { testNode2 }
            <button onClick={() => {
                console.log("clicked")   
                console.log(newConnectionInput)   
                newConnectionInput && newConnectionInput(7)} 
            } 
            /> 
            <button 
                onClick={() => {
                    if (newConnectionInput && newConnectionOutputDependencyUpdater) {
                        createConnection(newConnectionInput, newConnectionOutputDependencyUpdater);
                    } else {
                        console.warn("Connection updaters are not set.");
                    }
                }}>
                    New Connection
            </button>
        </div>
    );
};

export default Engine;