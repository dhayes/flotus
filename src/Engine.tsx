import React, { useState } from 'react';
import AddNumbers from './AddNumbers';

interface EngineProps {
    // Define your props here
}

const Engine: React.FC<EngineProps> = (props) => {
    //const [nodes, setNodes] = React.useState<Array<any>>([]);

    const [newConnectionInputUpdater, setNewConnectionInputUpdater] = useState<((value: any) => void)>();
    const setNewConnectionInputUpdaterFun = (value: any) => setNewConnectionInputUpdater(value);

    const [newConnectionOutputDependencyUpdater, setNewConnectionOutputDependencyUpdater] = useState<((value: any) => void)>()
    const setNewConnectionOutputDependencyUpdaterFun = (value: any) => setNewConnectionOutputDependencyUpdater(value)

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
        setNewConnectionInputUpdater={setNewConnectionInputUpdaterFun}
        setnewConnectionOutputDependencyUpdater={setNewConnectionOutputDependencyUpdaterFun}
    />
    const testNode2 = <AddNumbers 
        name='test2' 
        label='test2' 
        setNewConnectionInputUpdater={setNewConnectionInputUpdaterFun}
        setnewConnectionOutputDependencyUpdater={setNewConnectionOutputDependencyUpdaterFun}
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