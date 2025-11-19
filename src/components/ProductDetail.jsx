import { useEffect, useMemo, useRef, useState } from 'react'

const optionKeys = ['auction','buy_now','tokenization','raffle','not_interested']

export default function ProductDetail({ id, t, apiBase }) {
  const [item, setItem] = useState(null)
  const [wsConnected, setWsConnected] = useState(false)
  const wsRef = useRef(null)
  const [selected, setSelected] = useState('auction')
  const [qty, setQty] = useState(1)

  const counts = item?.counts || { auction:0, buy_now:0, tokenization:0, raffle:0, not_interested:0 }
  const total = Object.values(counts).reduce((a,b)=>a+Number(b||0),0)||1
  const pct = (k)=> Math.round((Number(counts[k]||0)/total)*100)

  useEffect(()=>{
    const run = async ()=>{
      const res = await fetch(`${apiBase}/api/products/${id}`)
      const data = await res.json()
      setItem(data.data)
      const wsUrl = (apiBase||'').replace('http','ws') + `/ws/products/${id}`
      const ws = new WebSocket(wsUrl)
      wsRef.current = ws
      ws.onopen = ()=> setWsConnected(true)
      ws.onclose = ()=> setWsConnected(false)
      ws.onmessage = (e)=>{
        try{
          const msg = JSON.parse(e.data)
          if(msg.type==='votes.update'){
            setItem(prev=> prev ? ({...prev, counts: msg.counts}) : prev)
          }
        }catch{}
      }
    }
    run()
    return ()=>{ try{ wsRef.current?.close() }catch{} }
  },[id, apiBase])

  const handleVote = async ()=>{
    const body = { option: selected }
    if(selected==='tokenization') body.desired_shares = qty
    if(selected==='raffle') body.desired_tickets = qty
    const res = await fetch(`${apiBase}/api/products/${id}/vote`,{
      method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)
    })
    const data = await res.json()
    if(data?.data?.counts){
      setItem(prev=> prev ? ({...prev, counts: data.data.counts}) : prev)
    }
  }

  if(!item) return <div className="text-blue-200">{t('loading')}...</div>
  const loc = (item.locales||[]).find(l=>l.locale===t.locale) || (item.locales||[])[0]

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden">
          <div className="aspect-video bg-slate-700/50 flex items-center justify-center text-slate-300">
            {item.images?.[0] ? (
              <img src={item.images[0]} alt={loc.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-sm">{t('no_image')}</span>
            )}
          </div>
          <div className="p-4 text-sm text-slate-300 space-y-1">
            <div>{t('auction_start')}: {item.auction_start_price ?? '-'}</div>
            <div>{t('buy_now_price')}: {item.buy_now_price ?? '-'}</div>
            <div>{t('tokenization_price')}: {item.shares_total ?? 0} @ {item.share_price ?? '-'}</div>
            <div>{t('raffle_price')}: {item.raffle_tickets_total ?? 0} @ {item.raffle_ticket_price ?? '-'}</div>
          </div>
        </div>
        <div>
          <h1 className="text-2xl font-semibold text-white mb-2">{loc.title}</h1>
          <p className="text-slate-300 mb-4">{loc.description}</p>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4 text-xs">
            {optionKeys.map(k=> (
              <div key={k} className="bg-slate-800/60 border border-slate-700 rounded p-2">
                <div className="text-slate-200 capitalize">{t(k)}</div>
                <div className="text-blue-300 font-semibold">{pct(k)}%</div>
              </div>
            ))}
          </div>

          <div className="bg-slate-800/60 border border-slate-700 rounded p-3 mb-3">
            <div className="text-slate-200 mb-2">{t('choose_option')}</div>
            <div className="flex flex-wrap gap-2">
              {optionKeys.map(k=> (
                <button key={k} onClick={()=> setSelected(k)} className={`px-3 py-2 rounded border ${selected===k? 'bg-blue-600 border-blue-500 text-white':'bg-slate-900/40 border-slate-700 text-blue-200'}`}>
                  {t(k)}
                </button>
              ))}
            </div>
            {(selected==='tokenization' || selected==='raffle') && (
              <div className="mt-3 flex items-center gap-2">
                <label className="text-slate-200 text-sm">{selected==='tokenization'? t('desired_shares'): t('desired_tickets')}</label>
                <input type="number" min={1} value={qty} onChange={e=>setQty(Math.max(1, Number(e.target.value||1)))} className="w-24 bg-slate-900 text-blue-100 border border-slate-700 rounded px-2 py-1" />
              </div>
            )}
            <button onClick={handleVote} className="mt-3 inline-flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded">
              {t('confirm_vote')}
            </button>
          </div>
          <div className="text-xs text-blue-300">WS: {wsConnected? 'connected':'disconnected'}</div>
        </div>
      </div>
    </div>
  )
}
