// src/renderer/src/components/HowItWorksScreen.tsx
import { Shield, Key, Database, ArrowLeft } from 'lucide-react'

interface Props {
  onBack: () => void
}

export const HowItWorksScreen = ({ onBack }: Props) => {
  return (
    // CLAVE AQUÍ: 'overflow-y-auto' activa el scrollbar elegante
    <div className="h-full flex flex-col bg-[#02040a] text-slate-300 overflow-y-auto font-sans relative">
      
      {/* Fondo estático sutil */}
      <div className="fixed top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none"></div>

      <div className="p-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <h1 className="text-2xl font-bold text-white tracking-wide">How MyVault Works</h1>
        </div>

        <div className="max-w-3xl mx-auto space-y-12 pb-10">
          
          <section className="prose prose-invert">
            <p className="text-lg text-slate-400 leading-relaxed">
              MyVault is designed around a <strong className="text-indigo-400">"zero-knowledge"</strong> architecture stored locally on your device. This means we don't know your master password, and your data never leaves your computer in a readable format.
            </p>
          </section>

          {/* STEP 1 */}
          <div className="flex gap-6 p-6 rounded-2xl bg-slate-900/30 border border-white/5 hover:border-indigo-500/20 transition-colors">
            <div className="w-12 h-12 shrink-0 bg-indigo-900/20 border border-indigo-500/20 rounded-xl flex items-center justify-center">
              <Key size={24} className="text-indigo-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">1. Your Master Password (The Key)</h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                Your Master Password is the only key to your vault. We never store it. Instead, we use a process called **Key Derivation (PBKDF2)**.
              </p>
              <ul className="list-disc list-inside text-slate-500 space-y-2 text-sm pl-2 marker:text-indigo-500">
                <li>Your password is mixed with a unique random "salt".</li>
                <li>It's mathematically processed 100,000 times.</li>
                <li>The result is a 256-bit cryptographic key used ONLY in RAM.</li>
              </ul>
            </div>
          </div>

          {/* STEP 2 */}
          <div className="flex gap-6 p-6 rounded-2xl bg-slate-900/30 border border-white/5 hover:border-emerald-500/20 transition-colors">
            <div className="w-12 h-12 shrink-0 bg-emerald-900/20 border border-emerald-500/20 rounded-xl flex items-center justify-center">
              <Shield size={24} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">2. Encryption (The Lock)</h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                Every time you save a password, it is encrypted using **AES-256-GCM**, the industry standard for securing sensitive data.
              </p>
              <ul className="list-disc list-inside text-slate-500 space-y-2 text-sm pl-2 marker:text-emerald-500">
                <li>Unique Initialization Vector (IV) for every entry.</li>
                <li>Authentication tags prevent database tampering.</li>
              </ul>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="flex gap-6 p-6 rounded-2xl bg-slate-900/30 border border-white/5 hover:border-sky-500/20 transition-colors">
            <div className="w-12 h-12 shrink-0 bg-sky-900/20 border border-sky-500/20 rounded-xl flex items-center justify-center">
              <Database size={24} className="text-sky-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-3">3. Local Storage (The Vault)</h3>
              <p className="text-slate-400 leading-relaxed mb-4">
                Your encrypted data is stored in a high-performance **SQLite database** deep within your system.
              </p>
              <div className="text-xs text-indigo-300 bg-indigo-500/10 p-3 rounded-lg border border-indigo-500/20 font-mono">
                Encrypted File Location: %APPDATA%/myvault.db
              </div>
            </div>
          </div>

        </div>
      </div>
      
    </div>
  )
}