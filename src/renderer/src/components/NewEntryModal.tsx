// src/renderer/src/components/NewEntryModal.tsx
import { useState } from 'react'
import { X, Save, Globe, User, Lock, Link as LinkIcon } from 'lucide-react'

// PRESETS MATCHING YOUR LOGO FILES
const PRESETS = [
  { id: 'custom', name: 'Other (Custom)', url: '' },
  { id: 'amazon', name: 'Amazon', url: 'https://amazon.com' },
  { id: 'apple', name: 'Apple ID', url: 'https://appleid.apple.com' },
  { id: 'aws', name: 'AWS', url: 'https://aws.amazon.com' },
  { id: 'bbva', name: 'BBVA', url: 'https://bbva.mx' },
  { id: 'discord', name: 'Discord', url: 'https://discord.com' },
  { id: 'disney_plus', name: 'Disney+', url: 'https://disneyplus.com' },
  { id: 'github', name: 'GitHub', url: 'https://github.com' },
  { id: 'google', name: 'Google', url: 'https://google.com' },
  { id: 'microsoft', name: 'Microsoft', url: 'https://microsoft.com' },
  { id: 'netflix', name: 'Netflix', url: 'https://netflix.com' },
  { id: 'paypal', name: 'PayPal', url: 'https://paypal.com' },
  { id: 'spotify', name: 'Spotify', url: 'https://spotify.com' },
  { id: 'steam', name: 'Steam', url: 'https://store.steampowered.com' },
  { id: 'ticketmaster', name: 'Ticketmaster', url: 'https://ticketmaster.com' },
  { id: 'twitch', name: 'Twitch', url: 'https://twitch.tv' },
  { id: 'unison', name: 'Unison', url: 'https://alunos.unison.mx' },
]

interface Props {
  isOpen: boolean
  onClose: () => void
  onSave: (data: any) => void
}

export const NewEntryModal = ({ isOpen, onClose, onSave }: Props) => {
  const [selectedPreset, setSelectedPreset] = useState('netflix') // Default
  const [customName, setCustomName] = useState('')
  const [form, setForm] = useState({ email: '', username: '', password: '' })

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // LOGIC: Determine if it's a preset or custom entry
    const isCustom = selectedPreset === 'custom'
    const presetData = PRESETS.find(p => p.id === selectedPreset)

    onSave({
      // Visual Name (e.g. "Netflix")
      service: isCustom ? customName : presetData?.name,
      // Technical ID for Logos (e.g. "netflix" or "custom")
      service_id: isCustom ? 'custom' : selectedPreset, 
      ...form,
      category: 'all',
      url: isCustom ? '' : presetData?.url
    })
    
    // Reset and close
    setForm({ email: '', username: '', password: '' })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      
      <div className="w-full max-w-md bg-[#0f111a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center bg-white/5">
          <h2 className="text-white font-bold tracking-wide flex items-center gap-2">
            <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
            New Credential
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* 1. SERVICE SELECTOR */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Service / Website</label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-400" size={18} />
              <select 
                value={selectedPreset}
                onChange={(e) => setSelectedPreset(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none cursor-pointer hover:bg-slate-800 transition-colors"
              >
                {PRESETS.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Custom Input if "Other" is selected */}
            {selectedPreset === 'custom' && (
              <input 
                type="text" 
                placeholder="Enter service name..."
                className="mt-2 w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl py-3 px-4 focus:border-indigo-500 outline-none"
                value={customName}
                onChange={e => setCustomName(e.target.value)}
                required
              />
            )}
          </div>

          {/* 2. EMAIL */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="email"
                placeholder="name@example.com"
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:border-indigo-500 outline-none focus:bg-slate-800 transition-colors"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
              />
            </div>
          </div>

          {/* 3. USERNAME */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Username</label>
              <span className="text-[10px] text-slate-600 uppercase">Optional</span>
            </div>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
              <input 
                type="text"
                placeholder="e.g. GamerPro123"
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:border-indigo-500 outline-none focus:bg-slate-800 transition-colors"
                value={form.username}
                onChange={e => setForm({...form, username: e.target.value})}
              />
            </div>
          </div>

          {/* 4. PASSWORD */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-rose-400" size={18} />
              <input 
                type="password"
                placeholder="••••••••••••"
                className="w-full bg-slate-900 border border-slate-700 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:border-indigo-500 outline-none focus:bg-slate-800 transition-colors"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 flex gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 hover:text-white hover:bg-slate-800 font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-900/20 flex items-center justify-center gap-2 transition-transform active:scale-95"
            >
              <Save size={18} />
              Save Entry
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}