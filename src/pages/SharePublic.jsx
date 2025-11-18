import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Layout from '../components/Layout'
import { api } from '../components/api'

export default function SharePublic(){
  const { token } = useParams()
  const [data, setData] = useState(null)

  useEffect(()=>{ api('/share/'+token).then(setData).catch(()=>setData({error:true})) }, [token])

  if(!data) return <Layout><div>Loading…</div></Layout>
  if(data.error) return <Layout><div>Invalid or expired link</div></Layout>

  return (
    <Layout>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.certificates?.map(c => (
          <div key={c._id} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
            <img src={c.image_url || 'https://picsum.photos/seed/'+encodeURIComponent(c.title_en)+'/600/400'} alt="" className="w-full aspect-video object-cover" />
            <div className="p-4">
              <div className="font-semibold">{c.title_en}</div>
              {c.date && <div className="text-sm opacity-70">{c.date}</div>}
              {c.description_en && <div className="text-sm mt-2">{c.description_en}</div>}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  )
}
