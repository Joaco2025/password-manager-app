import { useState, useEffect } from 'react'
import { X, Copy, Eye, EyeOff, ChevronLeft, ChevronRight, Globe, User, Key, Mail, Trash2 } from 'lucide-react'

interface Entry {
  id: number
  service_name: string
  service_id: string
  email: string
  username: string
  password?: string
  website_url?: string
}

interface Props {
  isOpen: boolean
  onClose: () => void
  entries: Entry[]
  BrandIcon: any
  onDelete: (id: number) => void // NUEVO PROP
}

export const EntryDetailModal = ({ isOpen, onClose, entries, BrandIcon, onDelete }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [copiedField, setCopiedField] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0)
      setShowPassword(false)
    }
  }, [isOpen])

  // Protección si se borra la última entrada del grupo
  if (!isOpen || entries.length === 0) return null
  
  // Asegurarnos de que el índice sea válido
  const safeIndex = currentIndex >= entries.length ? 0 : currentIndex
  const currentEntry = entries[safeIndex]
  const hasMultiple = entries.length > 1

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % entries.length)
    setShowPassword(false)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + entries.length) % entries.length)
    setShowPassword(false)
  }

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  const handleDelete = () => {
    if (confirm('Are you sure you want to delete this credential?')) {
      onDelete(currentEntry.id)
      // Si era la última del grupo, cerramos el modal desde el padre
      // Si quedan más, ajustamos el índice
      if (entries.length > 1) {
        setCurrentIndex(0)
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      <div className="w-full max-w-md bg-[#0f111a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        
        {/* HEADER */}
        <div className="px-6 py-6 bg-slate-900/50 border-b border-white/5 flex flex-col items-center relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>

          {/* Botón de Borrar (Izquierda) */}
          <button 
            onClick={handleDelete}
            className="absolute top-4 left-4 text-slate-600 hover:text-red-500 transition-colors p-1"
            title="Delete Entry"
          >
            <Trash2 size={18} />
          </button>

          <div className="scale-125 mb-4">
            <BrandIcon service={currentEntry.service_id === 'custom' ? currentEntry.service_name : currentEntry.service_id} />
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">{currentEntry.service_name}</h2>
          
          {hasMultiple && (
            <div className="flex gap-1.5 mt-3">
              {entries.map((_, idx) => (
                <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === safeIndex ? 'bg-indigo-500' : 'bg-slate-700'}`} />
              ))}
            </div>
          )}
        </div>

        {/* BODY */}
        <div className="p-6 space-y-5 relative">
          
          {hasMultiple && (
            <>
              <button onClick={prevSlide} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                <ChevronLeft size={24} />
              </button>
              <button onClick={nextSlide} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-full transition-colors">
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* CAMPO 1: EMAIL */}
          <div className="space-y-1.5 px-6">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Address</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-900 border border-white/5 rounded-lg px-3 py-2.5 text-slate-200 text-sm flex items-center gap-3">
                <Mail size={16} className="text-slate-500" />
                <span className="truncate">{currentEntry.email}</span>
              </div>
              <button 
                onClick={() => handleCopy(currentEntry.email, 'email')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors border border-white/5"
              >
                {copiedField === 'email' ? <span className="text-xs font-bold text-green-400">OK</span> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {/* CAMPO 2: USERNAME (Solo si existe) */}
          {currentEntry.username && (
            <div className="space-y-1.5 px-6">
              <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Username</label>
              <div className="flex gap-2">
                <div className="flex-1 bg-slate-900 border border-white/5 rounded-lg px-3 py-2.5 text-slate-200 text-sm flex items-center gap-3">
                  <User size={16} className="text-slate-500" />
                  <span className="truncate">{currentEntry.username}</span>
                </div>
                <button 
                  onClick={() => handleCopy(currentEntry.username, 'user')}
                  className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors border border-white/5"
                >
                  {copiedField === 'user' ? <span className="text-xs font-bold text-green-400">OK</span> : <Copy size={16} />}
                </button>
              </div>
            </div>
          )}

          {/* CAMPO 3: PASSWORD */}
          <div className="space-y-1.5 px-6">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Password</label>
            <div className="flex gap-2">
              <div className="flex-1 bg-slate-900 border border-white/5 rounded-lg px-3 py-2.5 text-slate-200 text-sm flex items-center gap-3 relative overflow-hidden group">
                <Key size={16} className="text-indigo-400" />
                <span className={`font-mono tracking-wider truncate ${showPassword ? '' : 'blur-[4px] select-none'}`}>
                  {showPassword ? currentEntry.password : '••••••••••••••••'}
                </span>
                {!showPassword && <div className="absolute inset-0 bg-transparent group-hover:bg-white/5 transition-colors" />}
              </div>
              
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors border border-white/5"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
              
              <button 
                onClick={() => handleCopy(currentEntry.password || '', 'pass')}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors border border-white/5"
              >
                {copiedField === 'pass' ? <span className="text-xs font-bold text-green-400">OK</span> : <Copy size={16} />}
              </button>
            </div>
          </div>

          {currentEntry.website_url && (
            <div className="px-6 pt-2">
              <a 
                href={currentEntry.website_url} 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 hover:underline justify-center"
              >
                <Globe size={12} />
                Open Website
              </a>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}