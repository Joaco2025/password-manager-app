// src/renderer/src/components/SetupScreen.tsx
import { useState } from 'react'
import { ShieldCheck, ArrowRight, Loader2, User, Key } from 'lucide-react'
import appLogo from '../assets/logos/MyVault-Logo.png'

interface Props {
  onComplete: (username: string) => void
}

export const SetupScreen = ({ onComplete }: Props) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    
    if (password !== confirmPass) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      // @ts-ignore
      await window.api.createMaster({ username, password })
      onComplete(username)
    } catch (err) {
      console.error(err)
      setError('Error creating vault. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-[#02040a] flex items-center justify-center relative font-sans overflow-hidden">
      
      <div className="w-full max-w-md p-8 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-10">
          {/* NUEVO LOGO */}
          <img src={appLogo} alt="MyVault Logo" className="w-16 h-16 mx-auto mb-6 drop-shadow-2xl" />
          
          <h1 className="text-2xl font-bold text-white mb-2 tracking-tight">Welcome to MyVault</h1>
          <p className="text-slate-400 text-sm">Set up your secure identity to get started.</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-5">
          
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <User size={14} /> Master Username
            </label>
            <input 
              type="text" 
              placeholder="e.g. JoakoAdmin"
              className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900/80 transition-all"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Key size={14} /> Master Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900/80 transition-all"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 flex items-center gap-1.5">
              <Key size={14} /> Confirm Password
            </label>
            <input 
              type="password" 
              placeholder="••••••••••••"
              className="w-full bg-slate-900 border border-white/5 rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900/80 transition-all"
              value={confirmPass}
              onChange={e => setConfirmPass(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Create Vault <ArrowRight size={18} /></>}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-2 text-slate-600 text-xs">
          <ShieldCheck size={14} />
          <span>Your data is encrypted locally.</span>
        </div>
      </div>
    </div>
  )
}