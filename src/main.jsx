import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { Analytics } from '@vercel/analytics/react'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { TournamentProvider } from './context/TournamentContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import { AdminAuthProvider } from './context/AdminAuthContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <DataProvider>
          <AdminAuthProvider>
            <ToastProvider>
              <TournamentProvider>
                <App />
                <Analytics />
              </TournamentProvider>
            </ToastProvider>
          </AdminAuthProvider>
        </DataProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>,
)