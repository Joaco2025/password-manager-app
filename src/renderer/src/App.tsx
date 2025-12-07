// ... (imports anteriores se mantienen)
import { useState, useEffect } from 'react'
import { TitleBar } from './components/TitleBar'
import { NewEntryModal } from './components/NewEntryModal'
import { EntryDetailModal } from './components/EntryDetailModal'
import { SetupScreen } from './components/SetupScreen'
import { LoginScreen } from './components/LoginScreen'
import { HowItWorksScreen } from './components/HowItWorksScreen'
import { Search, Plus, Globe, Briefcase, CreditCard, Gamepad2, Copy, MoreVertical, LayoutGrid, Zap, Loader2, HelpCircle } from 'lucide-react'

// ... (tus imports de logos aqui) ...
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
      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-inner border border-white/5 overflow-hidden group-hover:scale-110 transition-transform duration-300">
        <img src={imageSrc} alt={service} className="w-full h-full object-cover" />
      </div>
    )
  }
  return (
    <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-white text-lg font-bold shadow-inner border border-white/5 group-hover:scale-110 transition-transform duration-300">
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

  // FUNCION DE ELIMINAR
  const handleDeleteEntry = async (id: number) => {
    try {
      // @ts-ignore
      await window.api.deleteEntry(id)
      
      // Actualizamos la lista local inmediatamente
      const updatedPasswords = passwords.filter(p => p.id !== id)
      setPasswords(updatedPasswords)

      // Actualizamos el grupo seleccionado si está abierto
      if (selectedGroup) {
        const updatedGroup = updatedPasswords.filter((p: any) => 
          (p.service_id === 'custom' ? p.service_name : p.service_id) === 
          (selectedGroup[0].service_id === 'custom' ? selectedGroup[0].service_name : selectedGroup[0].service_id)
        )
        
        if (updatedGroup.length === 0) {
          setSelectedGroup(null) // Se borró la última, cerramos modal
        } else {
          setSelectedGroup(updatedGroup) // Actualizamos el modal con las que quedan
        }
      }
    } catch (e) {
      console.error("Error deleting:", e)
    }
  }

  const groupedPasswords = passwords.reduce((acc: any, entry: any) => {
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
    <div className="h-screen bg-slate-950 flex flex-col overflow-hidden text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <TitleBar />
      <NewEntryModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleSaveEntry} />
      
      {/* Modal con Borrado Conectado */}
      <EntryDetailModal
        isOpen={!!selectedGroup}
        onClose={() => setSelectedGroup(null)}
        entries={selectedGroup || []}
        BrandIcon={BrandIcon}
        onDelete={handleDeleteEntry} // <-- PASAMOS LA FUNCIÓN
      />

      <div className="flex flex-1 overflow-hidden">
        <aside className="w-64 bg-[#02040a] border-r border-white/5 flex flex-col py-6 px-3">
          <div className="px-3 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">MyVault</h1>
              <p className="text-[10px] text-slate-500 font-medium">Personal Edition</p>
            </div>
          </div>
          <div className="mb-6 px-3 flex-1">
            <h2 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-4">Navigation</h2>
            <nav className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden ${activeCategory === cat.id ? 'bg-white/5 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
                  {activeCategory === cat.id && <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full"></div>}
                  <cat.icon size={18} className={`${activeCategory === cat.id ? cat.color : 'text-slate-500 group-hover:text-slate-300'} transition-colors`} />
                  {cat.label}
                </button>
              ))}
            </nav>
          </div>
          <div className="px-3">
            <button onClick={() => setView('how-it-works')} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-indigo-400 hover:bg-white/5 transition-colors">
              <HelpCircle size={14} />
              <span>How it works?</span>
            </button>
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 relative bg-[#050505]">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none"></div>
          <header className="h-24 flex items-center justify-between px-8 relative z-10">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Welcome to your Vault, <span className="text-indigo-400">{currentUsername}</span>.</h2>
              <p className="text-slate-500 text-sm mt-1">Your digital life, secured.</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
                <input type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-slate-900/80 border border-slate-800 focus:border-indigo-500/50 rounded-xl py-2 pl-9 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm" />
              </div>
              <button onClick={() => setIsModalOpen(true)} className="group relative px-6 py-2 rounded-full overflow-hidden border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all duration-300 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:border-indigo-400/50">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-400/10 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                <div className="relative flex items-center gap-2">
                  <Plus size={16} className="text-indigo-300 group-hover:text-white transition-colors" />
                  <span className="text-xs font-bold tracking-[0.1em] uppercase text-indigo-100 group-hover:text-white transition-colors">New Entry</span>
                </div>
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-8 relative z-10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
              All Accounts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {groupsArray.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center pt-20 text-slate-600">
                   <p className="text-lg font-medium text-slate-500 mb-1">Your vault is empty.</p>
                   <p className="text-sm">Add your first credential using the button above.</p>
                </div>
              ) : (
                groupsArray.map((group: any) => {
                  const firstEntry = group[0]
                  const count = group.length
                  return (
                    <div key={firstEntry.id} onClick={() => setSelectedGroup(group)} className="group relative bg-slate-900/80 border border-slate-800/80 hover:border-indigo-500/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 overflow-hidden backdrop-blur-sm cursor-pointer active:scale-95">
                      <div className={`absolute -right-10 -top-10 w-32 h-32 bg-indigo-500 opacity-0 group-hover:opacity-10 blur-[50px] transition-opacity duration-500`}></div>
                      <div className="flex justify-between items-start mb-4 relative">
                        <BrandIcon service={firstEntry.service_id === 'custom' ? firstEntry.service_name : firstEntry.service_id} />
                        {count > 1 && <div className="bg-indigo-500/20 text-indigo-300 px-2 py-1 rounded-md text-xs font-bold border border-indigo-500/20">{count} Accounts</div>}
                        {count === 1 && <button className="text-slate-600 hover:text-white transition-colors p-1 hover:bg-white/5 rounded"><MoreVertical size={18} /></button>}
                      </div>
                      <div className="relative">
                        <h3 className="text-white font-semibold text-lg mb-0.5">{firstEntry.service_name}</h3>
                        
                        {/* AHORA MOSTRAMOS MÁS DATOS EN LA TARJETA TAMBIÉN */}
                        <div className="mb-4">
                          <p className="text-slate-300 text-xs font-medium truncate">{firstEntry.email}</p>
                          {firstEntry.username && <p className="text-slate-500 text-[10px] tracking-wide truncate mt-0.5">{firstEntry.username}</p>}
                        </div>

                        <div className="flex items-center justify-between bg-slate-950/50 rounded-lg px-3 py-2 border border-white/5 group-hover:border-indigo-500/20 transition-colors">
                          <div className="flex gap-1">
                            {[1,2,3,4].map(i => <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= 2 ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>)}
                          </div>
                          <span className="text-xs text-indigo-400 font-medium">View Details</span>
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