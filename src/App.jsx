import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import DemoHeader from './components/DemoHeader'
import ProductCard from './components/ProductCard'
import ProductDetail from './components/ProductDetail'
import { getMockProducts } from './lib/mockData'

const dicts = {
  ro: {
    no_image: 'Fără imagine',
    vote_cta: 'Votează',
    auction: 'Licitație',
    buy_now: 'Cumpărare directă',
    tokenization: 'Share / tokenizare',
    raffle: 'Tombolă',
    not_interested: 'Nu e de interes',
    loading: 'Se încarcă',
    auction_start: 'Preț start licitație',
    buy_now_price: 'Preț cumpărare directă',
    tokenization_price: 'Tokenizare',
    raffle_price: 'Tombolă',
    choose_option: 'Alege opțiunea',
    confirm_vote: 'Confirmă votul',
    feed_title: 'Produse în votare',
    admin_panel: 'Panou Admin',
    create_demo: 'Adaugă 3 produse demo',
    desired_shares: 'Număr dorit de acțiuni',
    desired_tickets: 'Număr dorit de bilete',
  },
  en: {
    no_image: 'No image',
    vote_cta: 'Vote',
    auction: 'Auction',
    buy_now: 'Buy now',
    tokenization: 'Shares / tokenization',
    raffle: 'Raffle',
    not_interested: 'Not interested',
    loading: 'Loading',
    auction_start: 'Auction start price',
    buy_now_price: 'Buy now price',
    tokenization_price: 'Tokenization',
    raffle_price: 'Raffle',
    choose_option: 'Choose option',
    confirm_vote: 'Confirm vote',
    feed_title: 'Products in voting',
    admin_panel: 'Admin Panel',
    create_demo: 'Seed 3 demo products',
    desired_shares: 'Desired shares',
    desired_tickets: 'Desired tickets',
  },
  it: {
    no_image: 'Nessuna immagine',
    vote_cta: 'Vota',
    auction: 'Asta',
    buy_now: 'Acquista ora',
    tokenization: 'Azioni / tokenizzazione',
    raffle: 'Lotteria',
    not_interested: 'Non interessato',
    loading: 'Caricamento',
    auction_start: "Prezzo d'asta iniziale",
    buy_now_price: "Prezzo Acquista Ora",
    tokenization_price: 'Tokenizzazione',
    raffle_price: 'Lotteria',
    choose_option: 'Scegli opzione',
    confirm_vote: 'Conferma voto',
    feed_title: 'Prodotti in votazione',
    admin_panel: 'Pannello Admin',
    create_demo: 'Crea 3 prodotti demo',
    desired_shares: 'Azioni desiderate',
    desired_tickets: 'Biglietti desiderati',
  },
}

function useI18n(){
  const [lang, setLang] = useState(localStorage.getItem('lang')||'ro')
  const t = (k)=> (dicts[lang] && dicts[lang][k]) || dicts.en[k] || k
  t.locale = lang
  const set = (l)=>{ setLang(l); localStorage.setItem('lang', l) }
  return { t, set }
}

function Feed({ t, apiBase }){
  const [items, setItems] = useState(null)
  const [fromMock, setFromMock] = useState(false)
  const load = async ()=>{
    try{
      const res = await fetch(`${apiBase}/api/products`, { method: 'GET' })
      if(!res.ok) throw new Error('bad status')
      const data = await res.json()
      if(Array.isArray(data?.data) && data.data.length){
        setItems(data.data)
        setFromMock(false)
        return
      }
      // fallback if empty
      setItems(getMockProducts())
      setFromMock(true)
    }catch{
      setItems(getMockProducts())
      setFromMock(true)
    }
  }
  useEffect(()=>{ load() },[])
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-white">{t('feed_title')}</h1>
        <a href="/admin" className="text-blue-300 hover:text-blue-200 text-sm">{t('admin_panel')}</a>
      </div>
      {fromMock && (
        <div className="mb-3 text-xs text-amber-300">Demo preview: datele sunt simulate local pentru a vedea interfața.</div>
      )}
      {!items && <div className="text-blue-200">{t('loading')}...</div>}
      <div className="grid md:grid-cols-3 gap-4">
        {items?.map(it=> (
          <ProductCard key={it._id} item={it} t={t} />
        ))}
      </div>
      {items?.length===0 && (
        <div className="text-blue-200 text-sm mt-4">No products yet. Use Admin to add demo ones.</div>
      )}
    </div>
  )
}

function Admin({ t, apiBase }){
  const seed = async ()=>{
    const demo = getMockProducts()
    try{
      // Try to seed via API; if it fails, just go home where mock is shown
      for(const d of demo){
        await fetch(`${apiBase}/api/admin/products`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(d) })
      }
    }catch{}
    window.location.href = '/'
  }
  return (
    <div className="max-w-3xl mx-auto p-4 text-blue-100">
      <h1 className="text-2xl font-semibold text-white mb-2">Admin</h1>
      <p className="mb-4 text-slate-300 text-sm">One-click seed for demo data.</p>
      <button onClick={seed} className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded">{t('create_demo')}</button>
      <div className="mt-6">
        <a className="text-blue-300 hover:text-blue-200" href="/">← Back</a>
      </div>
    </div>
  )
}

function RouterViews({ t, apiBase }){
  const location = useLocation()
  const match = location.pathname.match(/^\/products\/(.+)$/)
  if(location.pathname==='/admin') return <Admin t={t} apiBase={apiBase} />
  if(match){
    const id = match[1]
    return <ProductDetail id={id} t={t} apiBase={apiBase} />
    }
  return <Feed t={t} apiBase={apiBase} />
}

function App(){
  const { t, set } = useI18n()
  const apiBase = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950">
      <DemoHeader onLangChange={set} currentLang={t.locale} />
      <RouterViews t={t} apiBase={apiBase} />
    </div>
  )
}

export default App
