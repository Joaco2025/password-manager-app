// src/renderer/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import './assets/main.css'
import './assets/base.css' 
import App from './App'
// 1. IMPORTAMOS EL CONTEXTO
import { ToastProvider } from './context/ToastContext'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* 2. ENVOLVEMOS LA APP AQUÍ. 
        Si quitas esto, la app explota porque los componentes no encuentran el contexto. */}
    <ToastProvider>
      <App />
    </ToastProvider>
  </React.StrictMode>
)