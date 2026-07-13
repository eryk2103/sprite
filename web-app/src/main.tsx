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
import { galleryRoutes } from './features/gallery/routes.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppLayout/>}>
            <Route element={<RequireAuth/>}>
              <Route path="/" element={<App/>}/>
              {galleryRoutes}
            </Route>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
