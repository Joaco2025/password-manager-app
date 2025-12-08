// src/renderer/src/context/ToastContext.tsx
import React, { createContext, useContext, useState, useCallback } from 'react'
import { Check, AlertTriangle, Info, X, ShieldCheck, XCircle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
    
    // Duración un poco más larga para leer con calma (4s)
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }, [])

  const removeToast = (id: number) => {
    // Animación de salida (opcional si se maneja con librerías, aquí lo quitamos directo)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  // CONFIGURACIÓN DE ESTILOS POR TIPO
  const getToastStyles = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          iconBg: 'bg-emerald-500/20',
          iconColor: 'text-emerald-400',
          borderColor: 'border-emerald-500/20',
          shadow: 'shadow-emerald-900/20',
          icon: <Check size={16} strokeWidth={3} />
        }
      case 'error':
        return {
          iconBg: 'bg-rose-500/20',
          iconColor: 'text-rose-400',
          borderColor: 'border-rose-500/20',
          shadow: 'shadow-rose-900/20',
          icon: <XCircle size={16} strokeWidth={3} />
        }
      default: // info
        return {
          iconBg: 'bg-indigo-500/20',
          iconColor: 'text-indigo-400',
          borderColor: 'border-indigo-500/20',
          shadow: 'shadow-indigo-900/20',
          icon: <Info size={16} strokeWidth={3} />
        }
    }
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* CONTENEDOR FLOTANTE (Bottom-Right) */}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 pointer-events-none">
        {toasts.map((toast) => {
          const style = getToastStyles(toast.type)
          
          return (
            <div 
              key={toast.id}
              className={`
                pointer-events-auto flex items-center gap-4 
                min-w-[320px] max-w-sm
                bg-[#050505]/90 backdrop-blur-2xl 
                border ${style.borderColor} 
                p-4 rounded-2xl 
                shadow-2xl ${style.shadow}
                animate-in slide-in-from-bottom-5 fade-in zoom-in-95 duration-500 ease-out
                group select-none
              `}
            >
              {/* ICONO CON GLOW */}
              <div className={`
                w-10 h-10 rounded-full flex items-center justify-center shrink-0 
                ${style.iconBg} ${style.iconColor} 
                shadow-[0_0_15px_rgba(0,0,0,0.3)]
              `}>
                {style.icon}
              </div>

              {/* TEXTO */}
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-200 tracking-wide leading-tight">
                  {toast.message}
                </p>
                {/* Pequeña marca de tiempo o subtítulo si quisieras */}
                {/* <p className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-wider">Just now</p> */}
              </div>

              {/* BOTÓN CERRAR (Solo visible al hover) */}
              <button 
                onClick={() => removeToast(toast.id)}
                className="text-slate-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100 p-1"
              >
                <X size={14} />
              </button>
              
              {/* BARRA DE PROGRESO DECORATIVA (Opcional, da toque futurista) */}
              <div className={`absolute bottom-0 left-4 right-4 h-[2px] rounded-full overflow-hidden opacity-20`}>
                 <div className={`h-full w-full ${style.iconBg} animate-[shrink_4s_linear_forwards] origin-left bg-current ${style.iconColor}`}></div>
              </div>
            </div>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}