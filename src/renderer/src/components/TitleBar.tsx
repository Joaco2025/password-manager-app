// src/components/TitleBar.tsx
import { Minus, Square, X } from 'lucide-react'

export const TitleBar = () => {
  // @ts-ignore
  const handleMinimize = () => window.api.minimize()
  // @ts-ignore
  const handleMaximize = () => window.api.maximize()
  // @ts-ignore
  const handleClose = () => window.api.close()

  return (
    // CAMBIO: Fondo slate-950 en lugar de black, y borde más suave
    <div className="h-10 bg-slate-950 flex items-center justify-between px-4 select-none border-b border-white/5">
      <div className="flex items-center gap-3 flex-1 opacity-80" style={{ WebkitAppRegion: 'drag' } as any}>
        {/* CAMBIO: El punto ahora es Indigo para dar color desde arriba */}
        <div className="w-2 h-2 bg-indigo-500 rounded-full shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>
        <span className="text-slate-200 font-medium text-xs tracking-widest uppercase">MyVault</span>
      </div>

      <div className="flex items-center gap-4" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button onClick={handleMinimize} className="text-slate-500 hover:text-white transition-colors"><Minus size={14} /></button>
        <button onClick={handleMaximize} className="text-slate-500 hover:text-white transition-colors"><Square size={12} /></button>
        <button onClick={handleClose} className="text-slate-500 hover:text-rose-500 transition-colors"><X size={14} /></button>
      </div>
    </div>
  )
}