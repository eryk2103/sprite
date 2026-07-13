import { Route } from 'react-router';
import Gallery from './Gallery';
import MainPanel from './MainPanel';
import CreateProjectPanel from './CreateProjectPanel';
import CreateGroupPanel from './CreateGroupPanel';
import EditProjectPanel from './EditProjectPanel';
import EditGroupPanel from './EditGroupPanel';

export const galleryRoutes = (
    <Route path="/gallery" element={<Gallery/>}>
        <Route index element={<MainPanel/>}/>
        <Route path="new" element={<CreateProjectPanel/>}/>
        <Route path=":projectId/groups/new" element={<CreateGroupPanel/>}/>
        <Route path=":projectId/groups/:groupId/edit" element={<EditGroupPanel/>}/>
        <Route path=":projectId/edit" element={<EditProjectPanel/>}/>
        <Route path=":projectId" element={<MainPanel/>}/>
    </Route>
);
