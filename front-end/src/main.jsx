import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AuthProvider } from "./contexts/AuthContext";
import { UserProvider } from "./contexts/UserContext";
import { CourseProvider } from "./contexts/CourseContext";
import { ExamProvider } from "./contexts/ExamContext";
import { AdminProvider } from "./contexts/AdminContext";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <UserProvider>
        <CourseProvider>
          <ExamProvider>
            <AdminProvider>
              <App />
            </AdminProvider>
          </ExamProvider>
        </CourseProvider>
      </UserProvider>
    </AuthProvider>
  </StrictMode>,
)
