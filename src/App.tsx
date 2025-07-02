//App.tsx
import './App.css'
import Stage from './Stage'
import Engine from './Engine'
import { useState } from 'react'
import Connections from './Connections'

function App() {
  const [offset, setOffset] = useState<{x: number, y: number, scale: number}>({x: 0, y: 0, scale: 1})
  return (
    <Stage setOffset={setOffset}>
      <Connections offset={offset}>
        <Engine />
      </Connections>
    </Stage>
  )
}


export default App
