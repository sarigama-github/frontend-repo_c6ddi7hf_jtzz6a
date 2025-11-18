import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../components/Layout'
import { API_BASE, api, authHeader } from '../components/api'

export default function Admin(){
  const [email, setEmail] = useState('admin@example.com')
  const [password, setPassword] = useState('admin123')
  const [name, setName] = useState('Admin')
  const [logged, setLogged] = useState(!!localStorage.getItem('token'))

  const login = async (e) => {
    e.preventDefault()
    try{
      const form = new URLSearchParams()
      form.set('username', email)
      form.set('password', password)
      const res = await fetch(API_BASE + '/auth/token', { method:'POST', body: form })
      const data = await res.json()
      if(data.access_token){
        localStorage.setItem('token', data.access_token)
        setLogged(true)
      } else {
        alert('Login failed')
      }
    } catch(err){
      alert('Login error')
    }
  }

  const register = async (e) => {
    e.preventDefault()
    try{
      const form = new FormData()
      form.set('name', name)
      form.set('email', email)
      form.set('password', password)
      const res = await fetch(API_BASE + '/auth/register', { method:'POST', body: form })
      const data = await res.json()
      if(data.access_token){
        localStorage.setItem('token', data.access_token)
        setLogged(true)
      } else {
        alert('Register failed')
      }
    } catch(err){
      alert('Register error')
    }
  }

  if(!logged){
    return (
      <Layout>
        <div className="max-w-md mx-auto space-y-4">
          <h2 className="text-xl font-semibold">Admin Login</h2>
          <form onSubmit={login} className="space-y-3">
            <input className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700" placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input className="w-full px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} />
            <div className="flex gap-2">
              <button className="px-4 py-2 rounded-md bg-blue-600 text-white">Login</button>
              <button className="px-4 py-2 rounded-md border border-slate-300 dark:border-slate-700" onClick={register} type="button">Register Admin</button>
            </div>
          </form>
        </div>
      </Layout>
    )
  }

  return <AdminPanel />
}

function AdminPanel(){
  const [certs, setCerts] = useState([])
  const [title, setTitle] = useState('')
  const [kind, setKind] = useState('course')
  const [img, setImg] = useState('')
  const [desc, setDesc] = useState('')
  const [tokenResult, setTokenResult] = useState(null)
  const [qr, setQr] = useState(null)
  const [expires, setExpires] = useState('')
  const [oneTime, setOneTime] = useState(false)

  const [drink, setDrink] = useState({ name_it:'', name_en:'', category:'', method:'', base_spirit:'', glassware:'', garnish:'', description_it:'', description_en:'', image_url:'' })
  const [ingredients, setIngredients] = useState([{ name_it:'', name_en:'', quantity:'' }])

  const [uploading, setUploading] = useState(false)

  const load = ()=> api('/certificates').then(setCerts)
  useEffect(()=>{ load() }, [])

  const saveCert = async ()=>{
    await api('/admin/certificates', { method:'POST', headers: { ...authHeader(), 'Content-Type':'application/json' }, body: JSON.stringify({ title_en:title, title_it:title, description_en: desc, description_it: desc, kind, image_url: img }) })
    setTitle(''); setDesc(''); setImg(''); setKind('course'); load()
  }

  const share = async ()=>{
    const ids = certs.map(c=>c._id)
    const body = { certificate_ids: ids, expires_minutes: expires?Number(expires):undefined, one_time: oneTime }
    const res = await api('/admin/certificates/share', { method:'POST', headers: { ...authHeader(), 'Content-Type':'application/json' }, body: JSON.stringify(body) })
    setTokenResult(res)
    const qrRes = await api(`/admin/share/${res.token}/qrcode`, { headers: { ...authHeader() } })
    setQr(qrRes.data_url)
  }

  const addIng = ()=> setIngredients(list=> [...list, { name_it:'', name_en:'', quantity:'' }])
  const updIng = (idx, key, val)=> setIngredients(list=> list.map((it,i)=> i===idx?{...it, [key]:val}:it))
  const delIng = (idx)=> setIngredients(list=> list.filter((_,i)=> i!==idx))

  const saveDrink = async ()=>{
    const payload = { ...drink, ingredients }
    await api('/admin/drinks', { method:'POST', headers:{ ...authHeader(), 'Content-Type':'application/json' }, body: JSON.stringify(payload) })
    alert('Drink saved')
    setDrink({ name_it:'', name_en:'', category:'', method:'', base_spirit:'', glassware:'', garnish:'', description_it:'', description_en:'', image_url:'' })
    setIngredients([{ name_it:'', name_en:'', quantity:'' }])
  }

  const importDocx = async (file)=>{
    try{
      setUploading(true)
      const form = new FormData()
      form.set('file', file)
      const res = await fetch(API_BASE + '/admin/import-docx-upload', { method:'POST', headers: authHeader(), body: form })
      const data = await res.json()
      alert('Imported paragraphs: ' + data.paragraphs)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Layout>
      <div className="space-y-6">
        <section className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Import from Word (.docx)</h3>
          <input type="file" accept=".docx" onChange={(e)=> e.target.files[0] && importDocx(e.target.files[0])} disabled={uploading} />
          {uploading && <div className="text-sm opacity-70 mt-2">Uploading…</div>}
        </section>

        <section className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Create Drink</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <input value={drink.name_it} onChange={e=>setDrink(d=>({...d, name_it: e.target.value}))} placeholder="Name (IT)" className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700" />
            <input value={drink.name_en} onChange={e=>setDrink(d=>({...d, name_en: e.target.value}))} placeholder="Name (EN)" className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700" />
            <input value={drink.category} onChange={e=>setDrink(d=>({...d, category: e.target.value}))} placeholder="Category" className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700" />
            <input value={drink.method} onChange={e=>setDrink(d=>({...d, method: e.target.value}))} placeholder="Method" className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700" />
            <input value={drink.base_spirit} onChange={e=>setDrink(d=>({...d, base_spirit: e.target.value}))} placeholder="Base Spirit" className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700" />
            <input value={drink.glassware} onChange={e=>setDrink(d=>({...d, glassware: e.target.value}))} placeholder="Glassware" className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700" />
            <input value={drink.garnish} onChange={e=>setDrink(d=>({...d, garnish: e.target.value}))} placeholder="Garnish" className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700" />
            <input value={drink.image_url} onChange={e=>setDrink(d=>({...d, image_url: e.target.value}))} placeholder="Image URL (optional)" className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700" />
            <textarea value={drink.description_it} onChange={e=>setDrink(d=>({...d, description_it: e.target.value}))} placeholder="Description (IT)" className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 md:col-span-1" />
            <textarea value={drink.description_en} onChange={e=>setDrink(d=>({...d, description_en: e.target.value}))} placeholder="Description (EN)" className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 md:col-span-1" />
          </div>
          <div className="mt-3">
            <div className="font-medium mb-2">Ingredients</div>
            <div className="space-y-2">
              {ingredients.map((ing, idx)=> (
                <div key={idx} className="grid md:grid-cols-4 gap-2 items-center">
                  <input value={ing.quantity} onChange={e=>updIng(idx,'quantity', e.target.value)} placeholder="Quantity" className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700" />
                  <input value={ing.name_it} onChange={e=>updIng(idx,'name_it', e.target.value)} placeholder="Name (IT)" className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700" />
                  <input value={ing.name_en} onChange={e=>updIng(idx,'name_en', e.target.value)} placeholder="Name (EN)" className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700" />
                  <button onClick={()=>delIng(idx)} className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700">Delete</button>
                </div>
              ))}
              <button onClick={addIng} className="px-3 py-1 rounded-md border border-slate-300 dark:border-slate-700">+ Add ingredient</button>
            </div>
          </div>
          <div className="mt-3">
            <button onClick={saveDrink} className="px-4 py-2 rounded-md bg-blue-600 text-white">Save Drink</button>
          </div>
        </section>

        <section className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <h3 className="font-semibold mb-3">Certificates</h3>
          <div className="grid md:grid-cols-2 gap-3">
            <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700" />
            <select value={kind} onChange={e=>setKind(e.target.value)} className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700">
              <option value="course">Course</option>
              <option value="master">Master</option>
            </select>
            <input value={img} onChange={e=>setImg(e.target.value)} placeholder="Image URL" className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700" />
            <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" className="px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700 col-span-full" />
            <button onClick={saveCert} className="px-4 py-2 rounded-md bg-blue-600 text-white">Save</button>
          </div>
        </section>

        <section className="border border-slate-200 dark:border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Existing</h3>
            <div className="flex gap-2 items-center">
              <input type="number" min="1" placeholder="Expires (min)" value={expires} onChange={e=>setExpires(e.target.value)} className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 w-36" />
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={oneTime} onChange={e=>setOneTime(e.target.checked)} />One-time</label>
              <button onClick={share} className="px-3 py-1 rounded-md bg-blue-600 text-white">Create Share Link</button>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certs.map(c=> (
              <div key={c._id} className="border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
                <img src={c.image_url || 'https://picsum.photos/seed/'+encodeURIComponent(c.title_en)+'/600/400'} alt="" className="w-full aspect-video object-cover" />
                <div className="p-3">
                  <div className="font-medium">{c.title_en}</div>
                  <div className="text-xs opacity-70">{c.kind}</div>
                </div>
              </div>
            ))}
          </div>
          {tokenResult && (
            <div className="mt-4 p-3 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 space-y-2">
              <div>Token: {tokenResult.token}</div>
              <div>Public URL: {window.location.origin + '/share/' + tokenResult.token}</div>
              {qr && (
                <div className="mt-2">
                  <div className="text-sm mb-1">QR Code</div>
                  <img src={qr} alt="QR" className="w-40 h-40"/>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </Layout>
  )
}
