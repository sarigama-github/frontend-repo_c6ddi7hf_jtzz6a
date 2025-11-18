import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLangTheme } from './LanguageThemeProvider'

export default function Layout({children}){
  const { t, lang, setLang, theme, setTheme } = useLangTheme()

  const navClass = ({isActive}) => 'px-3 py-2 rounded-md text-sm font-medium ' + (isActive ? 'bg-blue-600 text-white' : 'hover:bg-blue-600/10')

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-40 backdrop-blur bg-white/70 dark:bg-slate-900/70 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <Link to="/" className="font-bold text-lg">{t('appTitle')}</Link>
          <nav className="flex items-center gap-2">
            <NavLink to="/" className={navClass}>{t('theory')}</NavLink>
            <NavLink to="/drinks" className={navClass}>{t('drinks')}</NavLink>
            <NavLink to="/exercises" className={navClass}>{t('exercises')}</NavLink>
            <NavLink to="/admin" className={navClass}>{t('admin')}</NavLink>
            <div className="h-6 w-px bg-slate-300 dark:bg-slate-700 mx-1" />
            <select value={lang} onChange={(e)=>setLang(e.target.value)} className="px-2 py-1 rounded-md bg-transparent border border-slate-300 dark:border-slate-700">
              <option value="en">EN</option>
              <option value="it">IT</option>
            </select>
            <button onClick={()=>setTheme(theme==='dark'?'light':'dark')} className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700">
              {theme==='dark'?t('light'):t('dark')}
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm opacity-70">
        © {new Date().getFullYear()} {t('appTitle')}
      </footer>
    </div>
  )
}
