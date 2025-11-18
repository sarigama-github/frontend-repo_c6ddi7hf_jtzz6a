import React from 'react'
import { Routes, Route, useParams } from 'react-router-dom'
import LanguageThemeProvider from './components/LanguageThemeProvider'
import TheoryPage from './pages/TheoryPage'
import DrinksPage from './pages/DrinksPage'
import DrinkDetail from './pages/DrinkDetail'
import Exercises from './pages/Exercises'
import Admin from './pages/Admin'
import SharePublic from './pages/SharePublic'

function DrinkDetailRoute(){
  const { id } = useParams()
  return <DrinkDetail id={id} />
}

export default function App(){
  return (
    <LanguageThemeProvider>
      <Routes>
        <Route path="/" element={<TheoryPage />} />
        <Route path="/drinks" element={<DrinksPage />} />
        <Route path="/drinks/:id" element={<DrinkDetailRoute />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/share/:token" element={<SharePublic />} />
      </Routes>
    </LanguageThemeProvider>
  )
}
