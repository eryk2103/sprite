import styles from './ProjectPanel.module.css';
import type { Group } from '../../types/group';
import type { SpriteSummary } from '../../types/sprite';

type Props = {
    groups: Group[];
    selectedSpriteId: number | null;
    openingSpriteId: number | null;
    onAddSprite: (groupId: number) => void;
    onSpriteClick: (sprite: SpriteSummary) => void;
}

export default function GroupList({ groups, selectedSpriteId, openingSpriteId, onAddSprite, onSpriteClick }: Props) {
    if (groups.length === 0) {
        return <span className="placeholder">No groups</span>;
    }

    return (
        <ul className={styles['group-list']}>
            {groups.map(group => (
                <li key={group.id} className={styles['group-list__item']}>
                    <div>{group.name}</div>
                    <div className={styles['group__items']}>
                        <button
                            className="btn btn--ghost btn--primary btn--sm"
                            onClick={() => onAddSprite(group.id)}
                        >
                            Add sprite
                        </button>
                        {group.sprites.length > 0 && (
                            <ul className={styles['sprite-list']}>
                                {group.sprites.map(sprite => (
                                    <li key={sprite.id}>
                                        <div
                                            className={`card ${styles['sprite-list__item']}${sprite.id === selectedSpriteId ? ' card--selected' : ''}${sprite.id === openingSpriteId ? ' card--loading' : ''}`}
                                            onClick={() => onSpriteClick(sprite)}
                                        >
                                            {sprite.id === openingSpriteId ? 'Loading…' : sprite.name}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </li>
            ))}
        </ul>
    );
}
