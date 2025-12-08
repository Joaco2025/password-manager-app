import { useState, useEffect } from 'react'
import { TitleBar } from './components/TitleBar'
import { NewEntryModal } from './components/NewEntryModal'
import { EntryDetailModal } from './components/EntryDetailModal'
import { SetupScreen } from './components/SetupScreen'
import { LoginScreen } from './components/LoginScreen'
import { HowItWorksScreen } from './components/HowItWorksScreen'
import { Search, Plus, Globe, Briefcase, CreditCard, Gamepad2, Copy, MoreVertical, LayoutGrid, Zap, Loader2, HelpCircle, Shield, Inbox, ArrowRight, Mail, User, ChevronRight } from 'lucide-react'
import appLogo from './assets/logos/MyVault-Logo.png'

// === IMPORTS DE LOGOS ===
import amazonImg from './assets/logos/amazon.png'
import appleImg from './assets/logos/apple.png'
import awsImg from './assets/logos/aws.png'
import bbvaImg from './assets/logos/bbva.png'
import discordImg from './assets/logos/discord.png'
import disneyPlusImg from './assets/logos/disney_plus.png'
import githubImg from './assets/logos/github.png'
import googleImg from './assets/logos/google.png'
import microsoftImg from './assets/logos/microsoft.png'
import netflixImg from './assets/logos/netflix.png'
import paypalImg from './assets/logos/paypal.png'
import spotifyImg from './assets/logos/spotify.png'
import steamImg from './assets/logos/steam.png'
import ticketmasterImg from './assets/logos/ticketmaster.png'
import twitchImg from './assets/logos/twitch.png'
import unisonImg from './assets/logos/unison.png'

const CATEGORIES = [
  { id: 'all', label: 'All Items', icon: LayoutGrid, color: 'text-white' },
  { id: 'social', label: 'Social', icon: Globe, color: 'text-pink-400' },
  { id: 'work', label: 'Work & Biz', icon: Briefcase, color: 'text-sky-400' },
  { id: 'finance', label: 'Finance', icon: CreditCard, color: 'text-emerald-400' },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2, color: 'text-violet-400' },
]

const BrandIcon = ({ service }: { service: string }) => {
  const logoMap: Record<string, string> = {
    amazon: amazonImg, apple: appleImg, appleid: appleImg, aws: awsImg,
    bbva: bbvaImg, discord: discordImg, disney: disneyPlusImg, 'disney+': disneyPlusImg, disney_plus: disneyPlusImg,
    github: githubImg, google: googleImg, microsoft: microsoftImg, netflix: netflixImg,
    paypal: paypalImg, spotify: spotifyImg, steam: steamImg, ticketmaster: ticketmasterImg,
    twitch: twitchImg, unison: unisonImg
  }
  const key = service.toLowerCase().replace(/\s/g, '').replace(/\+/g, '_plus')
  const imageSrc = logoMap[key]

  if (imageSrc) {
    return (
      <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner border border-white/10 overflow-hidden group-hover:scale-110 transition-transform duration-500">
        <img src={imageSrc} alt={service} className="w-full h-full object-cover" />
      </div>
    )
  }
  return (
    <div className="w-12 h-12 bg-slate-800/50 backdrop-blur-md rounded-2xl flex items-center justify-center text-white text-lg font-bold shadow-inner border border-white/10 group-hover:scale-110 transition-transform duration-500">
      {service[0]?.toUpperCase()}
    </div>
  )
}

function App() {
  const [view, setView] = useState<'loading' | 'setup' | 'login' | 'dashboard' | 'how-it-works'>('loading')
  const [currentUsername, setCurrentUsername] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [passwords, setPasswords] = useState<any[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<any[] | null>(null)

  useEffect(() => { checkAuthStatus() }, [])

  const checkAuthStatus = async () => {
    try {
      // @ts-ignore
      const usernameOrNull = await window.api.checkHasAccount()
      if (usernameOrNull) {
        setCurrentUsername(usernameOrNull)
        setView('login')
      } else {
        setView('setup')
      }
    } catch (e) { console.error("Error checking auth:", e) }
  }

  const loadVaultData = async () => {
    try {
      // @ts-ignore
      const data = await window.api.getEntries()
      setPasswords(data)
    } catch (e) { console.error("Error loading vault:", e) }
  }

  const handleSaveEntry = async (newData: any) => {
    try {
      // @ts-ignore
      await window.api.addEntry(newData)
      loadVaultData()
    } catch (e) { console.error(e) }
  }

  const handleDeleteEntry = async (id: number) => {
    try {
      // @ts-ignore
      await window.api.deleteEntry(id)
      const updatedPasswords = passwords.filter(p => p.id !== id)
      setPasswords(updatedPasswords)
      if (selectedGroup) {
        const updatedGroup = updatedPasswords.filter((p: any) => 
          (p.service_id === 'custom' ? p.service_name : p.service_id) === 
          (selectedGroup[0].service_id === 'custom' ? selectedGroup[0].service_name : selectedGroup[0].service_id)
        )
        setSelectedGroup(updatedGroup.length === 0 ? null : updatedGroup)
      }
    } catch (e) { console.error("Error deleting:", e) }
  }

  // === LÓGICA DE FILTRADO Y AGRUPACIÓN ===
  const filteredPasswords = passwords.filter((entry) => {
    const matchesCategory = activeCategory === 'all' || entry.category === activeCategory
    const searchLower = searchTerm.toLowerCase()
    const matchesSearch = 
      entry.service_name.toLowerCase().includes(searchLower) || 
      entry.email.toLowerCase().includes(searchLower) ||
      (entry.username && entry.username.toLowerCase().includes(searchLower))

    return matchesCategory && matchesSearch
  })

  const groupedPasswords = filteredPasswords.reduce((acc: any, entry: any) => {
    const key = entry.service_id === 'custom' ? entry.service_name : entry.service_id
    if (!acc[key]) acc[key] = []
    acc[key].push(entry)
    return acc
  }, {})
  
  const groupsArray = Object.values(groupedPasswords)

  if (view === 'loading') return <div className="h-screen bg-slate-950 flex items-center justify-center text-indigo-500"><TitleBar /><Loader2 className="animate-spin" size={32} /></div>
  if (view === 'setup') return <><TitleBar /><SetupScreen onComplete={(newUsername) => { setCurrentUsername(newUsername); setView('login') }} /></>
  if (view === 'login') return <><TitleBar /><LoginScreen username={currentUsername || 'User'} onUnlock={() => { setView('dashboard'); loadVaultData() }} /></>
  if (view === 'how-it-works') return <><TitleBar /><HowItWorksScreen onBack={() => setView('dashboard')} /></>

  return (
    <div className="h-screen bg-[#050505] flex flex-col overflow-hidden text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <TitleBar />
      <NewEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveEntry} />
      <EntryDetailModal
        isOpen={!!selectedGroup}
        onClose={() => setSelectedGroup(null)}
        entries={selectedGroup || []}
        BrandIcon={BrandIcon}
        onDelete={handleDeleteEntry}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-[#080a12]/50 backdrop-blur-xl border-r border-white/5 flex flex-col py-6 px-3">
          <div className="px-3 mb-8 flex items-center gap-3">
            <img src={appLogo} alt="MyVault" className="w-10 h-10 drop-shadow-[0_0_20px_rgba(99,102,241,0.4)]" />
            <div>
              <h1 className="text-sm font-bold text-white tracking-widest uppercase">MyVault</h1>
              <p className="text-[10px] text-indigo-400 font-medium tracking-wide">Personal Edition</p>
            </div>
          </div>
          <div className="mb-6 px-3 flex-1">
            <h2 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Navigation</h2>
            <nav className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 group relative overflow-hidden ${activeCategory === cat.id ? 'bg-indigo-500/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)] border border-indigo-500/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  {activeCategory === cat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-full shadow-[0_0_10px_#6366f1]"></div>}
                  <cat.icon size={16} className={`${activeCategory === cat.id ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'} transition-colors`} />
                  {cat.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="px-3">
            <button onClick={() => setView('how-it-works')} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-500 hover:text-indigo-400 hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
              <HelpCircle size={14} />
              <span>How it works</span>
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col min-w-0 relative bg-[#050505]">
          {/* Fondo Ambiental Sutil */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/10 via-[#050505] to-[#050505] pointer-events-none"></div>

          <header className="h-24 flex items-center justify-between px-8 relative z-10">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Welcome back, <span className="text-indigo-400 drop-shadow-[0_0_10px_rgba(99,102,241,0.3)]">{currentUsername}</span></h2>
              <p className="text-slate-500 text-sm mt-1">Your secure vault is active.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900/50 backdrop-blur-sm border border-slate-800 focus:border-indigo-500/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 transition-all shadow-sm" />
              </div>
              <button onClick={() => setIsModalOpen(true)} className="group relative px-6 py-2.5 rounded-xl overflow-hidden bg-indigo-600 hover:bg-indigo-500 transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.2)] hover:shadow-[0_0_30px_rgba(99,102,241,0.4)] border border-indigo-400/20">
                <div className="relative flex items-center gap-2 text-white">
                  <Plus size={16} strokeWidth={3} />
                  <span className="text-xs font-bold tracking-widest uppercase">New Entry</span>
                </div>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 relative z-10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-3">
              <Shield size={20} className="text-indigo-500" />
              <span className="tracking-tight">Vault Contents</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {groupsArray.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center pt-32 text-slate-600 opacity-50 select-none animate-in fade-in zoom-in duration-700">
                   <Inbox size={64} className="mb-4 text-slate-800" />
                   <p className="text-lg font-medium text-slate-500 mb-1">Your vault is empty</p>
                   <p className="text-sm">Time to secure your digital life.</p>
                </div>
              ) : (
                groupsArray.map((group: any) => {
                  const firstEntry = group[0]
                  const count = group.length
                  
                  return (
                    <div 
                      key={firstEntry.id} 
                      onClick={() => setSelectedGroup(group)}
                      className="
                        group relative 
                        bg-[#0B0C15]/80 backdrop-blur-md /* Fondo Glass oscuro */
                        border border-white/5 
                        hover:border-indigo-500/40 /* Borde brilla al hover */
                        rounded-2xl p-5 
                        transition-all duration-500 ease-out 
                        hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.2)] /* Glow Indigo */
                        hover:-translate-y-1 
                        cursor-pointer 
                        overflow-hidden
                      "
                    >
                      {/* LUZ AMBIENTAL INTERNA (Mágico) */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                      
                      <div className="relative z-10 flex flex-col h-full justify-between">
                        
                        {/* HEADER */}
                        <div className="flex justify-between items-start mb-5">
                          <BrandIcon service={firstEntry.service_id === 'custom' ? firstEntry.service_name : firstEntry.service_id} />
                          
                          {count > 1 ? (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
                              <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse shadow-[0_0_8px_currentColor]"></span>
                              <span className="text-[10px] font-bold text-indigo-300 tracking-wide">{count} ACCOUNTS</span>
                            </div>
                          ) : (
                            <button className="text-slate-600 hover:text-white transition-colors p-1 hover:bg-white/5 rounded-lg">
                              <MoreVertical size={16} />
                            </button>
                          )}
                        </div>

                        {/* INFO */}
                        <div className="space-y-1">
                          <h3 className="text-white font-semibold text-lg tracking-tight group-hover:text-indigo-100 transition-colors duration-300">
                            {firstEntry.service_name}
                          </h3>
                          
                          <div className="space-y-1 pt-1">
                            <div className="flex items-center gap-2 text-slate-400 text-xs font-medium">
                              <Mail size={12} className="text-slate-600" />
                              <span className="truncate">{firstEntry.email}</span>
                            </div>
                            {firstEntry.username && (
                              <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono tracking-wide uppercase group-hover:text-indigo-400/80 transition-colors">
                                <User size={12} />
                                <span className="truncate">{firstEntry.username}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* FOOTER */}
                        <div className="mt-5 pt-3 border-t border-white/5 flex items-center justify-between group-hover:border-indigo-500/20 transition-colors duration-500">
                          <span className="text-[10px] text-slate-600 group-hover:text-indigo-300/50 uppercase tracking-widest font-bold transition-colors">
                            {firstEntry.category}
                          </span>
                          <div className="flex items-center gap-1 text-slate-600 group-hover:text-white transition-colors duration-300 text-[10px] font-bold tracking-widest uppercase opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0">
                            <span>Open</span>
                            <ChevronRight size={12} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App