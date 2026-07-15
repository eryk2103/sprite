import { useRef, useState } from 'react'
import { useLocation } from 'react-router'
import styles from './App.module.css'
import ActionPanel from './ActionPanel'
import MainPanel, { type MainPanelHandle } from './MainPanel'
import ProjectPanel from './ProjectPanel'
import UnsavedChangesModal from './UnsavedChangesModal'
import { renameSpriteInProject, removeSpriteFromProject } from './projectUpdates'
import { type ProjectDetail } from '../../types/project'
import { type Sprite, getSpriteSize } from '../../types/sprite'

type LocationState = {
  project?: ProjectDetail;
  sprite?: Sprite;
} | null;

function App() {
  const location = useLocation();
  const openState = location.state as LocationState;
  const [size, setSize] = useState(() => openState?.sprite ? getSpriteSize(openState.sprite.data, 16) : 16);
  const [color, setColor] = useState('#000000');
  const [recentColors, setRecentColors] = useState<string[]>([]);
  const [tool, setTool] = useState('pencil');
  const [project, setProject] = useState<ProjectDetail|null>(openState?.project ?? null);
  const [sprite, setSprite] = useState<Sprite|null>(openState?.sprite ?? null);
  const [pendingSprite, setPendingSprite] = useState<Sprite|null>(null);
  const [confirmSaving, setConfirmSaving] = useState(false);
  const mainPanelRef = useRef<MainPanelHandle>(null);

  const handleColorUse = (usedColor: string) => {
    setRecentColors(prev => [usedColor, ...prev.filter(c => c !== usedColor)].slice(0, 10));
  };

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
    setProject(prev => prev ? renameSpriteInProject(prev, renamed) : prev);
  };

  const handleSpriteDelete = (deletedId: number) => {
    setSprite(prev => prev?.id === deletedId ? null : prev);
    setProject(prev => prev ? removeSpriteFromProject(prev, deletedId) : prev);
  };

  return (
    <>
      <div className={styles.panels}>
        <ProjectPanel project={project} onProjectChange={setProject} onSpriteSelect={handleSpriteSelect} selectedSpriteId={sprite?.id ?? null}/>
        <MainPanel
          ref={mainPanelRef}
          size={size}
          color={color}
          tool={tool}
          sprite={sprite}
          onSpriteRename={handleSpriteRename}
          onSpriteDelete={handleSpriteDelete}
          onColorPick={setColor}
          onColorUse={handleColorUse}
        />
        <ActionPanel color={color} onColorChange={setColor} recentColors={recentColors} tool={tool} onToolChange={setTool} size={size} onSizeChange={setSize}/>
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
