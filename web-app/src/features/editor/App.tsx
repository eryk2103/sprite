import { useRef, useState } from 'react'
import { useLocation } from 'react-router'
import './App.css'
import ActionPanel from './ActionPanel'
import MainPanel, { type MainPanelHandle } from './MainPanel'
import ProjectPanel from './ProjectPanel'
import UnsavedChangesModal from './UnsavedChangesModal'
import { type ProjectDetail } from './project'
import { type Sprite, getSpriteSize } from './sprite'

type LocationState = {
  project?: ProjectDetail;
  sprite?: Sprite;
} | null;

function App() {
  const location = useLocation();
  const openState = location.state as LocationState;
  const [size, setSize] = useState(() => openState?.sprite ? getSpriteSize(openState.sprite.data, 16) : 16);
  const [color, setColor] = useState('#000000');
  const [tool, setTool] = useState('pencil');
  const [project, setProject] = useState<ProjectDetail|null>(openState?.project ?? null);
  const [sprite, setSprite] = useState<Sprite|null>(openState?.sprite ?? null);
  const [pendingSprite, setPendingSprite] = useState<Sprite|null>(null);
  const [confirmSaving, setConfirmSaving] = useState(false);
  const mainPanelRef = useRef<MainPanelHandle>(null);

  const selectSprite = (newSprite: Sprite) => {
    setSprite(newSprite);
    setSize(getSpriteSize(newSprite.data, size));
  };

  const handleSpriteSelect = (newSprite: Sprite) => {
    if (mainPanelRef.current?.isDirty()) {
      setPendingSprite(newSprite);
    } else {
      selectSprite(newSprite);
    }
  };

  const handleConfirmSave = async () => {
    setConfirmSaving(true);
    const ok = await mainPanelRef.current?.save();
    setConfirmSaving(false);
    if (ok && pendingSprite) selectSprite(pendingSprite);
    setPendingSprite(null);
  };

  const handleConfirmDiscard = () => {
    if (pendingSprite) selectSprite(pendingSprite);
    setPendingSprite(null);
  };

  const handleSpriteRename = (renamed: Sprite) => {
    setSprite(renamed);
    setProject(prev => prev ? {
      ...prev,
      groups: prev.groups.map(g => ({
        ...g,
        sprites: g.sprites.map(s => s.id === renamed.id ? { ...s, name: renamed.name } : s),
      })),
    } : prev);
  };

  const handleSpriteDelete = (deletedId: number) => {
    setSprite(prev => prev?.id === deletedId ? null : prev);
    setProject(prev => prev ? {
      ...prev,
      groups: prev.groups.map(g => ({
        ...g,
        sprites: g.sprites.filter(s => s.id !== deletedId),
      })),
    } : prev);
  };

  return (
    <>
      <div className="panels">
        <ProjectPanel project={project} onProjectChange={setProject} onSpriteSelect={handleSpriteSelect} selectedSpriteId={sprite?.id ?? null}/>
        <MainPanel
          ref={mainPanelRef}
          size={size}
          color={color}
          tool={tool}
          sprite={sprite}
          onSpriteRename={handleSpriteRename}
          onSpriteDelete={handleSpriteDelete}
        />
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
