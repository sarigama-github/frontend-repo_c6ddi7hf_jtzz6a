export const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export async function api(path, options={}){
  const res = await fetch(API_BASE + path, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers||{})
    },
    ...options
  })
  if(!res.ok){
    const msg = await res.text()
    throw new Error(msg || res.statusText)
  }
  return res.json()
}

export function authHeader(){
  const token = localStorage.getItem('token')
  return token ? { Authorization: `Bearer ${token}` } : {}
}
