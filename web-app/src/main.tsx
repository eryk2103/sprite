import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './features/editor/App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Login from './features/auth/Login.tsx'
import Register from './features/auth/Register.tsx'
import AppLayout from './core/AppLayout.tsx'
import { AuthProvider } from './features/auth/authStore.tsx'
import RequireAuth from './features/auth/RequireAuth.tsx'
import Gallery from './features/gallery/Gallery.tsx'
import MainPanel from './features/gallery/MainPanel.tsx'
import CreateProjectPanel from './features/gallery/CreateProjectPanel.tsx'
import CreateGroupPanel from './features/gallery/CreateGroupPanel.tsx'
import EditProjectPanel from './features/gallery/EditProjectPanel.tsx'
import EditGroupPanel from './features/gallery/EditGroupPanel.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout/>}>
            <Route element={<RequireAuth/>}>
              <Route path="/" element={<App/>}/>
              <Route path="/gallery" element={<Gallery/>}>
                <Route index element={<MainPanel/>}/>
                <Route path="new" element={<CreateProjectPanel/>}/>
                <Route path=":projectId/groups/new" element={<CreateGroupPanel/>}/>
                <Route path=":projectId/groups/:groupId/edit" element={<EditGroupPanel/>}/>
                <Route path=":projectId/edit" element={<EditProjectPanel/>}/>
                <Route path=":projectId" element={<MainPanel/>}/>
              </Route>
            </Route>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
