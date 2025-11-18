import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../components/api'
import { useLangTheme } from '../components/LanguageThemeProvider'
import { Link } from 'react-router-dom'

export default function DrinksPage(){
  const { lang, t } = useLangTheme()
  const [drinks, setDrinks] = useState([])
  const [q, setQ] = useState('')
  const [filters, setFilters] = useState({ method:'', base_spirit:'', category:'', glassware:'' })

  useEffect(()=>{
    const params = new URLSearchParams()
    if(q) params.set('q', q)
    Object.entries(filters).forEach(([k,v])=>{ if(v) params.set(k, v) })
    api('/drinks' + (params.toString()?`?${params.toString()}`:''))
      .then(setDrinks)
      .catch(console.error)
  }, [q, filters])

  const options = useMemo(()=>{
    const set = (key)=>Array.from(new Set(drinks.map(d=>d[key]).filter(Boolean))).sort()
    return {
      method: set('method'),
      base_spirit: set('base_spirit'),
      category: set('category'),
      glassware: set('glassware'),
    }
  }, [drinks])

  return (
    <Layout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row gap-3 md:items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-1">{t('search')}</label>
            <input value={q} onChange={(e)=>setQ(e.target.value)} className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900" placeholder="Negroni, Margarita..."/>
          </div>
          {['method','base_spirit','category','glassware'].map(key=> (
            <div key={key}>
              <label className="block text-sm font-medium mb-1">{t(key)}</label>
              <select value={filters[key]} onChange={(e)=>setFilters(f=>({...f, [key]: e.target.value}))} className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900">
                <option value="">—</option>
                {options[key].map(o=> <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {drinks.map(d => (
            <Link key={d._id} to={`/drinks/${d._id}`} className="group border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900 hover:shadow-lg transition">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                <img src={d.image_url || 'https://picsum.photos/seed/'+encodeURIComponent(d.name_en||d.name_it)+'/600/400'} alt="" className="w-full h-full object-cover"/>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{lang==='it'?d.name_it:d.name_en}</h3>
                <p className="text-sm opacity-80">{[d.category, d.method, d.glassware].filter(Boolean).join(' • ')}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}
