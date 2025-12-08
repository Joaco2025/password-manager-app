import { useState } from 'react'
import { ArrowRight, Loader2 } from 'lucide-react'
import appLogo from '../assets/logos/MyVault-Logo.png'
import { useToast } from '../context/ToastContext' // <--- IMPORTAR HOOK

interface Props {
  onUnlock: () => void
  username: string
}

export const LoginScreen = ({ onUnlock, username }: Props) => {
  const { showToast } = useToast() // <--- INICIALIZAR
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    try {
      // @ts-ignore
      const success = await window.api.login(password)
      
      if (success) {
        onUnlock()
        showToast(`Welcome back, ${username}`, 'success') // <--- SALUDO DE ÉXITO
      } else {
        setError(true)
        setPassword('')
        showToast('Incorrect Master Password', 'error') // <--- ALERTA DE ERROR
      }
    } catch (err) {
      console.error(err)
      setError(true)
      showToast('System Error', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-[#02040a] flex items-center justify-center relative font-sans overflow-hidden">
      
      <div className="w-full max-w-sm p-6 relative z-10 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="text-center mb-8">
          <img src={appLogo} alt="Logo" className="w-14 h-14 mx-auto mb-6 drop-shadow-xl" />

          <h2 className="text-xl font-bold text-white tracking-tight">Vault Locked</h2>
          
          <p className="text-slate-500 text-sm mt-2">
            Welcome back, <span className="text-indigo-300 font-medium">{username}</span>.
            <br />Please enter your master password.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative group">
            <input 
              type="password" 
              placeholder="Master Password"
              className={`w-full bg-slate-900 border ${error ? 'border-red-500/50' : 'border-white/5'} rounded-xl px-4 py-3 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-900/80 transition-all text-center tracking-widest`}
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center animate-pulse">Incorrect password</p>
          )}

          <button 
            disabled={loading || !password}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : <>Unlock <ArrowRight size={18} /></>}
          </button>
        </form>
      </div>
    </div>
  )
}