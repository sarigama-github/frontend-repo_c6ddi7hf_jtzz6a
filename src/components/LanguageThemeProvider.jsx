import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LangThemeContext = createContext()

export function useLangTheme(){
  return useContext(LangThemeContext)
}

const messages = {
  en: {
    appTitle: 'Bartender Academy',
    home: 'Home',
    theory: 'Theory',
    drinks: 'Drinks',
    exercises: 'Exercises',
    admin: 'Admin',
    login: 'Login',
    logout: 'Logout',
    search: 'Search',
    filters: 'Filters',
    theme: 'Theme',
    language: 'Language',
    light: 'Light',
    dark: 'Dark',
    orderManagement: 'Order Management',
    pourManagement: 'Pour Management',
    printRecipe: 'Print Recipe',
    categories: 'Categories',
    methods: 'Methods',
    glassware: 'Glassware',
    baseSpirit: 'Base Spirit',
    certificates: 'Certificates',
  },
  it: {
    appTitle: 'Accademia di Bartender',
    home: 'Home',
    theory: 'Teoria',
    drinks: 'Drink',
    exercises: 'Esercizi',
    admin: 'Admin',
    login: 'Accedi',
    logout: 'Esci',
    search: 'Cerca',
    filters: 'Filtri',
    theme: 'Tema',
    language: 'Lingua',
    light: 'Chiaro',
    dark: 'Scuro',
    orderManagement: 'Gestione Ordini',
    pourManagement: 'Gestione Versate',
    printRecipe: 'Stampa Ricetta',
    categories: 'Categorie',
    methods: 'Metodi',
    glassware: 'Bicchieri',
    baseSpirit: 'Distillato Base',
    certificates: 'Certificati',
  }
}

export default function LanguageThemeProvider({children}){
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'en')
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')

  useEffect(() => {
    localStorage.setItem('lang', lang)
  }, [lang])

  useEffect(() => {
    localStorage.setItem('theme', theme)
    if(theme === 'dark'){
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  const t = useMemo(() => (key) => messages[lang][key] || key, [lang])

  const value = { lang, setLang, theme, setTheme, t }

  return (
    <LangThemeContext.Provider value={value}>
      <div className={theme === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-white text-slate-900'}>
        {children}
      </div>
    </LangThemeContext.Provider>
  )
}
