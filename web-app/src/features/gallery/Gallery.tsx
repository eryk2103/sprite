import { Outlet } from 'react-router';
import './Gallery.css';
import ProjectPanel from "./ProjectPanel";

export default function Gallery() {
    return(
        <div className="panels">
            <ProjectPanel/>
            <Outlet/>
        </div>
    )
}
