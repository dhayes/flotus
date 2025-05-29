import Node from './Node'
import './App.css'
import Stage from './Stage'
import AddNumbers from './AddNumbers'
import Engine from './Engine'

function App() {

  return (
    <Stage>
        <Node name="node1" label="Node 1" description="This is the first node." />
        <Node name="node2" label="Node 2" description="This is the second node." />
        {/* <AddNumbers name="addNumbers" label="Add Numbers" description="This node adds two numbers." width={200} /> */}
        <Engine />
    </Stage>
  )
}

export default App
