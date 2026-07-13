import GroupListItem from './GroupListItem';
import styles from './MainPanel.module.css';
import type { Group } from '../../types/group';
import type { SpriteSummary } from '../../types/sprite';

type Props = {
    groups: Group[];
    projectId: string;
    openingSpriteId: number | null;
    onSpriteClick: (sprite: SpriteSummary) => void;
    onGroupDeleted: () => void;
}

export default function GroupList({ groups, projectId, openingSpriteId, onSpriteClick, onGroupDeleted }: Props) {
    if (groups.length === 0) {
        return <span className="placeholder">No groups</span>;
    }

    return (
        <ul className={styles['gallery-group-list']}>
            {groups.map(group => (
                <GroupListItem
                    key={group.id}
                    group={group}
                    projectId={projectId}
                    openingSpriteId={openingSpriteId}
                    onSpriteClick={onSpriteClick}
                    onDeleted={onGroupDeleted}
                />
            ))}
        </ul>
    );
}
