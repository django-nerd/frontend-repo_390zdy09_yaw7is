import { useState } from 'react'

export default function DemoHeader({ onLangChange, currentLang }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-slate-900/60 border-b border-slate-700/40">
      <div className="w-full bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-indigo-500/20 border-b border-slate-700/40">
        <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">DEMO MODE</span>
            <span className="text-slate-300 hidden sm:inline">Backend-ul poate fi offline. Datele sunt simulate pentru preview.</span>
          </div>
          <a href="/admin" className="text-blue-300 hover:text-blue-200">Admin</a>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2 text-white font-semibold">
          <span className="inline-flex w-8 h-8 items-center justify-center rounded-md bg-blue-500/20 text-blue-300">🔥</span>
          <span>LuxVote Demo</span>
        </a>
        <div className="flex items-center gap-3">
          <select
            aria-label="Language"
            value={currentLang}
            onChange={(e)=>onLangChange?.(e.target.value)}
            className="bg-slate-800 text-blue-100 border border-slate-700 rounded px-2 py-1"
          >
            <option value="ro">RO</option>
            <option value="en">EN</option>
            <option value="it">IT</option>
          </select>
        </div>
      </div>
    </header>
  )
}
