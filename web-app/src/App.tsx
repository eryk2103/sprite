import { useState } from 'react'
import './App.css'
import ActionPanel from './features/editor/ActionPanel'
import MainPanel from './features/editor/MainPanel'
import ProjectPanel from './features/editor/ProjectPanel'

function App() {
  const [size, setSize] = useState(16)
  const [color, setColor] = useState('#000000')
  const [tool, setTool] = useState('pencil')

  return (
    <>
      <div className="panels">
        <ProjectPanel/>
        <MainPanel size={size} color={color} tool={tool}/>
        <ActionPanel color={color} onColorChange={setColor} tool={tool} onToolChange={setTool} size={size} onSizeChange={setSize}/>
      </div>
    </>
  )
}

export default App
