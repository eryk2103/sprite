import { useRef, useState } from 'react'
import { useLocation } from 'react-router'
import './App.css'
import ActionPanel from './ActionPanel'
import MainPanel, { type MainPanelHandle } from './MainPanel'
import ProjectPanel from './ProjectPanel'
import UnsavedChangesModal from './UnsavedChangesModal'
import { type ProjectDetail } from './project'
import { type Sprite } from './sprite'

type LocationState = {
  project?: ProjectDetail;
  sprite?: Sprite;
} | null;

function App() {
  const location = useLocation();
  const openState = location.state as LocationState;
  const [size, setSize] = useState(16);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState('pencil');
  const [project, setProject] = useState<ProjectDetail|null>(openState?.project ?? null);
  const [sprite, setSprite] = useState<Sprite|null>(openState?.sprite ?? null);
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
