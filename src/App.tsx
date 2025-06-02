import './App.css'
import Stage from './Stage'
import Engine from './Engine'
import ConnectionManager from './ConnectionManager'

function App() {
  return (
    <Stage>
      <ConnectionManager>
        <Engine />
      </ConnectionManager>
    </Stage>
  )
}


export default App
