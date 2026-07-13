import { Outlet } from 'react-router';
import styles from './Gallery.module.css';
import ProjectPanel from "./ProjectPanel";

export default function Gallery() {
    return(
        <div className={styles.panels}>
            <ProjectPanel/>
            <Outlet/>
        </div>
    )
}
