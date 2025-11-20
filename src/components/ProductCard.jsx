import { useCountdown } from '../lib/useCountdown'

export default function ProductCard({ item, t }) {
  const locale = t.locale
  const loc = (item.locales||[]).find(l=>l.locale===locale) || (item.locales||[])[0] || {title:item.title, description:item.description}
  const counts = item.counts || {auction:0,buy_now:0,tokenization:0,raffle:0,not_interested:0}
  const total = Object.values(counts).reduce((a,b)=>a+Number(b||0),0) || 1
  const pct = (k)=> Math.round((Number(counts[k]||0)/total)*100)
  const { hours, minutes, seconds } = useCountdown(72)

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl overflow-hidden hover:border-blue-500/40 transition">
      <div className="relative">
        <div className="aspect-video bg-slate-700/50 flex items-center justify-center text-slate-300">
          {item.images?.[0] ? (
            <img src={item.images[0]} alt={loc.title} className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm">{t('no_image')}</span>
          )}
        </div>
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 text-[10px] uppercase tracking-wide rounded bg-indigo-500/30 text-indigo-200 border border-indigo-400/40">Preview</span>
        </div>
        <div className="absolute top-2 right-2">
          <span className="px-2 py-1 text-[10px] rounded bg-slate-900/70 text-blue-200 border border-slate-700">{String(hours).padStart(2,'0')}:{String(minutes).padStart(2,'0')}:{String(seconds).padStart(2,'0')}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-white font-semibold mb-1">{loc.title}</h3>
        <p className="text-slate-300 text-sm line-clamp-2 mb-3">{loc.description}</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-200">
          <div className="bg-slate-900/40 rounded p-2">{t('auction')}: {pct('auction')}%</div>
          <div className="bg-slate-900/40 rounded p-2">{t('buy_now')}: {pct('buy_now')}%</div>
          <div className="bg-slate-900/40 rounded p-2">{t('tokenization')}: {pct('tokenization')}%</div>
          <div className="bg-slate-900/40 rounded p-2">{t('raffle')}: {pct('raffle')}%</div>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-slate-300">
          <div className="bg-slate-900/40 rounded p-2">Start licitație: <span className="text-blue-200 font-semibold">{item.auction_start_price ?? '-'}</span></div>
          <div className="bg-slate-900/40 rounded p-2">Cumpărare directă: <span className="text-green-300 font-semibold">{item.buy_now_price ?? '-'}</span></div>
          <div className="bg-slate-900/40 rounded p-2">Share: <span className="text-indigo-300 font-semibold">{item.share_price ?? '-'}</span></div>
          <div className="bg-slate-900/40 rounded p-2">Bilet tombolă: <span className="text-pink-300 font-semibold">{item.raffle_ticket_price ?? '-'}</span></div>
        </div>
        <a href={`/products/${item._id}`} className="mt-3 inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2 rounded">
          {t('vote_cta')}
        </a>
      </div>
    </div>
  )
}
