export async function analyzeTrack(input) {
  // Accept either a link string or an object with metadata
  const cfg = typeof input === 'string' ? { trackLink: input } : input || {}
  const { trackLink, title, artist, durationMs, album, previewUrl } = cfg

  if (!trackLink || !title || !artist) {
    throw new Error('trackLink, title, and artist are required for analysis')
  }

  const payload = {
    trackLink,
    title,
    artist,
    durationMs,
    album,
    previewUrl,
  }

  // Allow optional environment override for backend base (e.g. http://localhost:8000)
  const base = import.meta.env.VITE_API_BASE || 'https://handwriter-django.onrender.com'
  const url = base.replace(/\/$/, '') + '/api/analyze'

  const headers = { 'Content-Type': 'application/json' }
  if (import.meta.env.VITE_FRONTEND_SHARED_KEY) {
    headers['X-Frontend-Key'] = import.meta.env.VITE_FRONTEND_SHARED_KEY
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const txt = await res.text().catch(() => '')
    throw new Error(`Backend error ${res.status}: ${txt.slice(0,200)}`)
  }

  // Backend already returns normalized JSON
  return res.json()
}

export function extractTrackIdFromUrl(url) {
  try {
    const u = new URL(url)
    const parts = u.pathname.split('/').filter(Boolean)
    const idx = parts.findIndex((p) => p === 'track')
    if (idx !== -1 && parts[idx + 1]) return parts[idx + 1]
    const maybe = parts[0]
    if (maybe && maybe.includes(':')) return maybe.split(':').pop()
  } catch (_) {}
  return ''
}
