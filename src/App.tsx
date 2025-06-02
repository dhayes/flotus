import Node from './Node'
import './App.css'
import Stage from './Stage'
import AddNumbers from './AddNumbers'
import Engine from './Engine'
import ConnectionManager from './ConnectionManager'

function App() {

  const initialNodes = [
    {
      id: 'Node1',
      initialPos: { x: 100, y: 200 },
      inputPortIds: ['Node1-in1', 'Node1-in2', 'Node1-in3'],
      outputPortIds: ['Node1-outA', 'Node1-outB'],
    },
    {
      id: 'Node2',
      initialPos: { x: 400, y: 120 },
      inputPortIds: ['Node2-inX'],
      outputPortIds: ['Node2-outY', 'Node2-outZ', 'Node2-outW'],
    },
    {
      id: 'Node3',
      initialPos: { x: 250, y: 350 },
      inputPortIds: [],
      outputPortIds: ['Node3-outonly'],
    },
  ];

  return (
    <Stage>
      <ConnectionManager>
        <Engine />
      </ConnectionManager>
        {/* <Node name="node1" label="Node 1" description="This is the first node." />
        <Node name="node2" label="Node 2" description="This is the second node." /> */}
        {/* <AddNumbers name="addNumbers" label="Add Numbers" description="This node adds two numbers." width={200} /> */}
    </Stage>
  )

  // <ConnectionManager>
  //     {initialNodes.map(n => (
  //       <Node
  //         key={n.id}
  //         id={n.id}
  //         label={n.id}
  //         initialPos={n.initialPos}
  //         inputPortIds={n.inputPortIds}
  //         outputPortIds={n.outputPortIds}
  //       />
  //     ))}
  //   </ConnectionManager>
  
  // )
}


export default App
