import { useEffect, useMemo, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import DemoHeader from './components/DemoHeader'
import ProductCard from './components/ProductCard'
import ProductDetail from './components/ProductDetail'

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
  const load = async ()=>{
    const res = await fetch(`${apiBase}/api/products`)
    const data = await res.json()
    setItems(data.data)
  }
  useEffect(()=>{ load() },[])
  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-semibold text-white">{t('feed_title')}</h1>
        <a href="/admin" className="text-blue-300 hover:text-blue-200 text-sm">{t('admin_panel')}</a>
      </div>
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
    const demo = [
      {
        title: 'Rolex Daytona 116500LN',
        description: 'Ceas sport din oțel, cadran alb, ceramica neagră.',
        images: ['https://images.unsplash.com/photo-1524805444758-089113d48a6d?q=80&w=1600&auto=format&fit=crop'],
        auction_start_price: 15000,
        buy_now_price: 27500,
        shares_total: 100,
        share_price: 300,
        raffle_tickets_total: 1000,
        raffle_ticket_price: 25,
      },
      {
        title: 'Ferrari F8 Tributo',
        description: 'Supercar V8 twin-turbo, roșu corsa.',
        images: ['https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1600&auto=format&fit=crop'],
        auction_start_price: 220000,
        buy_now_price: 320000,
        shares_total: 1000,
        share_price: 500,
        raffle_tickets_total: 5000,
        raffle_ticket_price: 50,
      },
      {
        title: 'Vila pe malul lacului',
        description: 'Proprietate exclusivă cu ponton privat.',
        images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1600&auto=format&fit=crop'],
        auction_start_price: 450000,
        buy_now_price: 650000,
        shares_total: 10000,
        share_price: 1500,
        raffle_tickets_total: 20000,
        raffle_ticket_price: 200,
      },
    ]
    for(const d of demo){
      await fetch(`${apiBase}/api/admin/products`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(d) })
    }
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
