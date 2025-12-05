// src/components/TitleBar.tsx
import React from 'react'

export const TitleBar = () => {
  // Funciones helper para limpiar el código del JSX
  // @ts-ignore (Ignoramos TS por ahora hasta configurar la interfaz global)
  const handleMinimize = () => window.api.minimize()
  // @ts-ignore
  const handleMaximize = () => window.api.maximize()
  // @ts-ignore
  const handleClose = () => window.api.close()

  return (
    <div className="h-10 bg-slate-900 flex items-center justify-between px-4 select-none border-b border-slate-800">
      {/* Zona de Arrastre */}
      <div className="flex items-center gap-2 flex-1" style={{ WebkitAppRegion: 'drag' } as any}>
        <span className="text-yellow-500 text-xl">🦉</span>
        <span className="text-gray-200 font-bold text-sm tracking-wide">Bóveda Desktop</span>
      </div>

      {/* Botones de Control (Ahora con onClick) */}
      <div className="flex gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
        {/* Minimizar (Amarillo) */}
        <div 
          onClick={handleMinimize}
          className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer"
          title="Minimizar"
        ></div>
        
        {/* Maximizar (Verde) */}
        <div 
          onClick={handleMaximize}
          className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer"
          title="Maximizar"
        ></div>
        
        {/* Cerrar (Rojo) */}
        <div 
          onClick={handleClose}
          className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer"
          title="Cerrar"
        ></div>
      </div>
    </div>
  )
}