import './App.css'
import Stage from './Stage'
import Engine from './Engine'
import ConnectionManager from './ConnectionManager'
import { useState } from 'react'
import type { Point } from './types'
import Connections from './Connections'

function App() {
  const [offset, setOffset] = useState<Point>({x: 0, y: 0})
  return (
    <Stage setOffset={setOffset}>
      <Connections>
        <Engine />
      </Connections>
    </Stage>
  )
}


export default App
