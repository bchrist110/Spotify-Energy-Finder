const WEB_TRACK_EMBED = 'https://open.spotify.com/embed/track/'

// Normalize base (strip trailing slashes). Define once.
const API_BASE = (import.meta.env.VITE_API_BASE || '').replace(/\/+$/, '')

export async function searchTrack(q) {
  if (!q || !q.trim()) throw new Error('Query required')
  const url = `${API_BASE}/api/spotify/search-track?q=${encodeURIComponent(q.trim())}`
  const res = await fetch(url)
  if (!res.ok) {
    // Try to surface backend error JSON if available
    let detail = 'Search failed'
    try {
      const err = await res.json()
      if (err?.error) detail = err.error
    } catch { /* ignore */ }
    throw new Error(detail)
  }
  return res.json()
}

export function trackEmbedSrc(id) {
  return WEB_TRACK_EMBED + id
}
