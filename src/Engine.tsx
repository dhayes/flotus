import React, { useState } from 'react';
import AddNumbers from './AddNumbers';

interface EngineProps {
    // Define your props here
}

const Engine: React.FC<EngineProps> = (props) => {
    //const [nodes, setNodes] = React.useState<Array<any>>([]);

    const [newConnectionInputUpdater, setNewConnectionInputUpdater] = useState<((value: any) => void)>();
    const setNewConnectionInputUpdaterFun = (value: any) => setNewConnectionInputUpdater(value);

    const testNode = <AddNumbers name='test' label='test' setNewConnectionInputUpdater={setNewConnectionInputUpdaterFun} />

    return (
        <div>
            { testNode }
            <button onClick={() => {
                console.log("clicked")   
                console.log(newConnectionInputUpdater)   
                newConnectionInputUpdater && newConnectionInputUpdater(7)} 
            }    
            />
        </div>
    );
};

export default Engine;