// src/App.tsx
import { useState } from 'react'
import { TitleBar } from './components/TitleBar'
import { NewEntryModal } from './components/NewEntryModal' // <--- IMPORTAMOS EL MODAL
import { Search, Plus, Globe, Briefcase, CreditCard, Gamepad2, Copy, MoreVertical, LayoutGrid, Zap } from 'lucide-react'

// === IMPORTACIÓN DE TUS LOGOS ===
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
  { id: 'all', label: 'All', icon: LayoutGrid, color: 'text-white' },
  { id: 'social', label: 'Social', icon: Globe, color: 'text-pink-400' },
  { id: 'work', label: 'Work', icon: Briefcase, color: 'text-sky-400' },
  { id: 'finance', label: 'Finance', icon: CreditCard, color: 'text-emerald-400' },
  { id: 'gaming', label: 'Hobbies', icon: Gamepad2, color: 'text-violet-400' },
]

// MOCK DATA INICIAL
const INITIAL_DATA = [
  { id: 1, service: 'Netflix', user: 'family@home.com', category: 'social', color: 'bg-pink-500' },
  { id: 2, service: 'Spotify', user: 'joako.vibe', category: 'social', color: 'bg-pink-500' },
  { id: 3, service: 'Github', user: 'dev_master', category: 'work', color: 'bg-sky-500' },
]

const BrandIcon = ({ service }: { service: string }) => {
  // Diccionario Maestro de Logos
  const logoMap: Record<string, string> = {
    amazon: amazonImg,
    apple: appleImg,
    appleid: appleImg, // Alias por si acaso
    aws: awsImg,
    bbva: bbvaImg,
    discord: discordImg,
    disney: disneyPlusImg, // Alias
    'disney+': disneyPlusImg,
    disney_plus: disneyPlusImg,
    github: githubImg,
    google: googleImg,
    microsoft: microsoftImg,
    netflix: netflixImg,
    paypal: paypalImg,
    spotify: spotifyImg,
    steam: steamImg,
    ticketmaster: ticketmasterImg,
    twitch: twitchImg,
    unison: unisonImg,
  }

  const key = service.toLowerCase().replace(/\s/g, '').replace(/\+/g, '_plus') // Normalizar nombres raros
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
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  
  // ESTADOS NUEVOS PARA MANEJAR DATOS REALES
  const [passwords, setPasswords] = useState(INITIAL_DATA)
  const [isModalOpen, setIsModalOpen] = useState(false) // Control del Modal

  // Función que recibe los datos del Modal y los agrega a la lista
  const handleSaveEntry = (newData: any) => {
    const newEntry = {
      id: Date.now(), // ID único temporal
      service: newData.service,
      user: newData.username || newData.email, // Si no hay user, usa email
      category: 'all', // Por ahora all
      color: 'bg-indigo-500' // Color por defecto
    }
    setPasswords([newEntry, ...passwords]) // Agrega al principio
  }

  return (
    <div className="h-screen w-screen bg-slate-950 flex flex-col overflow-hidden text-slate-300 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      <TitleBar />
      
      {/* EL MODAL FLOTANTE */}
      <NewEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEntry}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR (Sin cambios) */}
        <aside className="w-64 bg-[#0B1120] border-r border-white/5 flex flex-col py-6 px-3">
          <div className="px-3 mb-8 flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap size={16} className="text-white fill-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-white tracking-wide">MyVault</h1>
              <p className="text-[10px] text-slate-500 font-medium">Personal Edition</p>
            </div>
          </div>
          <div className="mb-2 px-3">
            <h2 className="text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-4">Menu</h2>
            <nav className="space-y-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group relative overflow-hidden
                    ${activeCategory === cat.id 
                      ? 'bg-white/5 text-white shadow-inner' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                >
                  {activeCategory === cat.id && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-r-full"></div>
                  )}
                  <cat.icon size={18} className={`${activeCategory === cat.id ? cat.color : 'text-slate-500 group-hover:text-slate-300'} transition-colors`} />
                  {cat.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 flex flex-col min-w-0 relative bg-slate-950">
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-indigo-900/10 to-transparent pointer-events-none"></div>

          <header className="h-20 flex items-center justify-between px-8 relative z-10">
            <div className="relative w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input 
                type="text"
                placeholder="Search in your vault..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 focus:border-indigo-500/50 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
              />
            </div>

            {/* BOTÓN CONECTADO AL MODAL */}
            <button 
              onClick={() => setIsModalOpen(true)} // <--- AHORA ABRE EL MODAL
              className="group relative px-8 py-2.5 rounded-full overflow-hidden border border-indigo-500/30 bg-indigo-500/10 hover:bg-indigo-500/20 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:border-indigo-400/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-400/10 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
              <div className="relative flex items-center gap-3">
                <Plus size={16} className="text-indigo-200 group-hover:text-white transition-colors" />
                <span className="text-xs font-bold tracking-[0.15em] uppercase text-indigo-100 group-hover:text-white transition-colors">
                  New Entry
                </span>
              </div>
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-8 relative z-10">
            <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-indigo-500 rounded-full"></span>
              All Accounts
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {/* RENDERIZAMOS LA LISTA DINÁMICA 'passwords' EN VEZ DE MOCK_DATA */}
              {passwords.map((item) => (
                <div 
                  key={item.id} 
                  className="group relative bg-slate-900 border border-slate-800 hover:border-indigo-500/30 rounded-2xl p-5 transition-all duration-300 hover:shadow-2xl hover:shadow-black/50 overflow-hidden"
                >
                  <div className={`absolute -right-10 -top-10 w-32 h-32 ${item.color} opacity-0 group-hover:opacity-10 blur-[50px] transition-opacity duration-500`}></div>

                  <div className="flex justify-between items-start mb-4 relative">
                    <BrandIcon service={item.service} />
                    <button className="text-slate-600 hover:text-white transition-colors p-1 hover:bg-white/5 rounded">
                      <MoreVertical size={18} />
                    </button>
                  </div>

                  <div className="relative">
                    <h3 className="text-white font-semibold text-lg mb-0.5">{item.service}</h3>
                    <p className="text-slate-500 text-xs font-medium tracking-wide mb-4 truncate">{item.user}</p>
                    
                    <div className="flex items-center justify-between bg-slate-950/50 rounded-lg px-3 py-2 border border-white/5 group-hover:border-indigo-500/20 transition-colors">
                      <div className="flex gap-1">
                        {[1,2,3,4].map(i => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${i <= 2 ? 'bg-indigo-500' : 'bg-slate-700'}`}></div>
                        ))}
                      </div>
                      <button className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1">
                        <Copy size={12} /> Copy
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App