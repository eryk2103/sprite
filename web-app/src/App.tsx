import { useState } from 'react'
import './App.css'
import ActionPanel from './features/editor/ActionPanel'
import MainPanel from './features/editor/MainPanel'
import ProjectPanel from './features/editor/ProjectPanel'
import { type ProjectDetail } from './features/editor/project'
import { type Sprite } from './features/editor/sprite'

function App() {
  const [size, setSize] = useState(16);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState('pencil');
  const [project, setProject] = useState<ProjectDetail|null>(null);
  const [sprite, setSprite] = useState<Sprite|null>(null);

  return (
    <>
      <div className="panels">
        <ProjectPanel project={project} onProjectChange={setProject} onSpriteSelect={setSprite}/>
        <MainPanel size={size} color={color} tool={tool} sprite={sprite} onSpriteChange={setSprite}/>
        <ActionPanel color={color} onColorChange={setColor} tool={tool} onToolChange={setTool} size={size} onSizeChange={setSize}/>
      </div>
    </>
  )
}

export default App
