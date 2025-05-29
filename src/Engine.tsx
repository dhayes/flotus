import React, { useState } from 'react';
import AddNumbers from './AddNumbers';

interface EngineProps {
    // Define your props here
}

const Engine: React.FC<EngineProps> = (props) => {

    const [newConnectionInputUpdater, setNewConnectionInputUpdater] = useState<((value: any) => void)>();

    const [newConnectionOutputDependencyUpdater, setNewConnectionOutputDependencyUpdater] = useState<((value: any) => void)>()
    
    const [selectedOutputId, setSelectedOutputId] = useState<string|null>(null)
    
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
        setNewConnectionInputUpdater={setNewConnectionInputUpdater}
        setnewConnectionOutputDependencyUpdater={setNewConnectionOutputDependencyUpdater}
    />
    const testNode2 = <AddNumbers 
        name='test2' 
        label='test2' 
        setNewConnectionInputUpdater={setNewConnectionInputUpdater}
        setnewConnectionOutputDependencyUpdater={setNewConnectionOutputDependencyUpdater}
    />

    return (
        <div>
            { testNode1 }
            { testNode2 }
            <button onClick={() => {
                console.log("clicked")   
                console.log(newConnectionInputUpdater)   
                newConnectionInputUpdater && newConnectionInputUpdater(7)} 
            } 
            /> 
            <button 
                onClick={() => {
                    if (newConnectionInputUpdater && newConnectionOutputDependencyUpdater) {
                        createConnection(newConnectionInputUpdater, newConnectionOutputDependencyUpdater);
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