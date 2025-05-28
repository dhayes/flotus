import Node from './Node'
import './App.css'
import Stage from './Stage'

function App() {

  return (
    <Stage>
        <Node name="node1" label="Node 1" description="This is the first node." />
        <Node name="node2" label="Node 2" description="This is the second node." />
    </Stage>
  )
}

export default App
