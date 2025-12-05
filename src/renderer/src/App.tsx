// src/App.tsx
import { TitleBar } from './components/TitleBar'

function App() {
  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden">
      {/* 1. Tu barra personalizada arriba */}
      <TitleBar />

      {/* 2. El contenido de la app abajo */}
      <main className="flex-1 p-8 text-white overflow-y-auto">
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Bienvenido a tu Bóveda
        </h1>
        <p className="text-gray-400">
          Ya tenemos Tailwind, Electron y React funcionando en armonía.
        </p>
        
        {/* Aquí pondremos tu lista de contraseñas pronto */}
        <div className="mt-8 p-6 bg-slate-900 rounded-xl border border-slate-800">
          <p className="text-sm text-gray-500">Base de datos: Pendiente...</p>
        </div>
      </main>
    </div>
  )
}

export default App