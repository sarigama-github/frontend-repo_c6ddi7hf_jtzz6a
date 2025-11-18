import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../components/api'
import { useLangTheme } from '../components/LanguageThemeProvider'

export default function DrinkDetail({id}){
  const { lang, t } = useLangTheme()
  const [drink, setDrink] = useState(null)

  useEffect(()=>{
    api('/drinks/'+id).then(setDrink).catch(console.error)
  }, [id])

  if(!drink) return <Layout><div>Loading...</div></Layout>

  return (
    <Layout>
      <div className="max-w-3xl mx-auto">
        <div className="aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 mb-4">
          <img src={drink.image_url || 'https://picsum.photos/seed/'+encodeURIComponent(drink.name_en||drink.name_it)+'/800/500'} alt="" className="w-full h-full object-cover"/>
        </div>
        <h1 className="text-3xl font-bold mb-2">{lang==='it'?drink.name_it:drink.name_en}</h1>
        <p className="opacity-80 mb-4">{[drink.category, drink.method, drink.base_spirit, drink.glassware].filter(Boolean).join(' • ')}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-semibold mb-2">Ingredients</h2>
            <ul className="list-disc pl-6 space-y-1">
              {drink.ingredients?.map((ing, idx)=> (
                <li key={idx}>{ing.quantity} — {lang==='it'?ing.name_it:ing.name_en}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-2">Garnish</h2>
            <p>{drink.garnish || '-'}</p>
            <h2 className="font-semibold mt-4 mb-2">Glassware</h2>
            <p>{drink.glassware || '-'}</p>
          </div>
        </div>

        <div className="mt-6">
          <h2 className="font-semibold mb-2">Description</h2>
          <p className="whitespace-pre-wrap">{lang==='it'?drink.description_it:drink.description_en}</p>
        </div>

        <button onClick={()=>window.print()} className="mt-6 px-4 py-2 rounded-md bg-blue-600 text-white">{t('printRecipe')}</button>
      </div>
    </Layout>
  )
}
