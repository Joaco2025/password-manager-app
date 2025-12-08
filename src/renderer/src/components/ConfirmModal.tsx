import { AlertTriangle, Trash2, X } from 'lucide-react'

interface Props {
  isOpen: boolean
  title: string
  message: string
  onConfirm: () => void
  onCancel: () => void
}

export const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }: Props) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      <div className="w-full max-w-sm bg-[#0f111a] border border-red-500/30 rounded-2xl shadow-2xl shadow-red-900/20 overflow-hidden scale-100 animate-in zoom-in-95 duration-200">
        
        <div className="p-6 text-center">
          <div className="w-12 h-12 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          
          <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            {message}
          </p>

          <div className="flex gap-3">
            <button 
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-sm font-bold shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}