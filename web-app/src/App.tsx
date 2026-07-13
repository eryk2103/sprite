import { useRef, useState } from 'react'
import './App.css'
import ActionPanel from './features/editor/ActionPanel'
import MainPanel, { type MainPanelHandle } from './features/editor/MainPanel'
import ProjectPanel from './features/editor/ProjectPanel'
import UnsavedChangesModal from './features/editor/UnsavedChangesModal'
import { type ProjectDetail } from './features/editor/project'
import { type Sprite } from './features/editor/sprite'

function App() {
  const [size, setSize] = useState(16);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState('pencil');
  const [project, setProject] = useState<ProjectDetail|null>(null);
  const [sprite, setSprite] = useState<Sprite|null>(null);
  const [pendingSprite, setPendingSprite] = useState<Sprite|null>(null);
  const [confirmSaving, setConfirmSaving] = useState(false);
  const mainPanelRef = useRef<MainPanelHandle>(null);

  const handleSpriteSelect = (newSprite: Sprite) => {
    if (mainPanelRef.current?.isDirty()) {
      setPendingSprite(newSprite);
    } else {
      setSprite(newSprite);
    }
  };

  const handleConfirmSave = async () => {
    setConfirmSaving(true);
    const ok = await mainPanelRef.current?.save();
    setConfirmSaving(false);
    if (ok && pendingSprite) setSprite(pendingSprite);
    setPendingSprite(null);
  };

  const handleConfirmDiscard = () => {
    if (pendingSprite) setSprite(pendingSprite);
    setPendingSprite(null);
  };

  return (
    <>
      <div className="panels">
        <ProjectPanel project={project} onProjectChange={setProject} onSpriteSelect={handleSpriteSelect} selectedSpriteId={sprite?.id ?? null}/>
        <MainPanel ref={mainPanelRef} size={size} color={color} tool={tool} sprite={sprite}/>
        <ActionPanel color={color} onColorChange={setColor} tool={tool} onToolChange={setTool} size={size} onSizeChange={setSize}/>
      </div>
      <UnsavedChangesModal
        isOpen={pendingSprite !== null}
        saving={confirmSaving}
        onSave={handleConfirmSave}
        onDiscard={handleConfirmDiscard}
        onCancel={() => setPendingSprite(null)}
      />
    </>
  )
}

export default App
