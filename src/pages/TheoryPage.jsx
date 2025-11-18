import React, { useEffect, useState } from 'react'
import Layout from '../components/Layout'
import { api } from '../components/api'
import { useLangTheme } from '../components/LanguageThemeProvider'

export default function TheoryPage(){
  const { lang } = useLangTheme()
  const [sections, setSections] = useState([])

  useEffect(()=>{
    api('/theory').then(setSections).catch(console.error)
  },[])

  return (
    <Layout>
      <div className="space-y-8">
        {sections.map(sec => (
          <section key={sec._id} className="bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-3">{lang==='it'?sec.title_it:sec.title_en}</h2>
            <article className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
              {lang==='it'?sec.content_it:sec.content_en}
            </article>
          </section>
        ))}
      </div>
    </Layout>
  )
}
