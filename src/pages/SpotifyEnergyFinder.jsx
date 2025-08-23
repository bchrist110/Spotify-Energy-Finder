import { useEffect, useState } from 'react'
import Header from '../components/Header'
import '../app.css'
import { searchTrack, trackEmbedSrc } from '../lib/spotify'
import { analyzeTrack } from '../lib/ai'

export default function SpotifyEnergyFinder() {
  const [q, setQ] = useState('')
  const [items, setItems] = useState([])
  const [error, setError] = useState('')
  const [analyses, setAnalyses] = useState({}) // { [trackId]: { loading, data, error } }

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setItems([])
    setAnalyses({})
    try {
      const data = await searchTrack(q) // force single track result
      const tracks = data.tracks?.items ?? []
      setItems(tracks)
    } catch (err) {
      setError(String(err.message || err))
    }
  }

  function trackLink(id) {
    return `https://open.spotify.com/track/${id}`
  }

  async function runAnalysis(t) {
    const id = t.id
    setAnalyses((prev) => ({ ...prev, [id]: { loading: true } }))
    try {
      const data = await analyzeTrack({
        trackLink: trackLink(id),
        title: t?.name,
        artist: (t?.artists || []).map((a) => a?.name).filter(Boolean).join(', '),
        durationMs: t?.duration_ms,
        album: t?.album ? { name: t.album.name, release_date: t.album.release_date } : undefined,
        previewUrl: t?.preview_url,
      })
      setAnalyses((prev) => ({ ...prev, [id]: { loading: false, data } }))
    } catch (e) {
      setAnalyses((prev) => ({ ...prev, [id]: { loading: false, error: String(e.message || e) } }))
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="section py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl font-semibold text-gray-900 tracking-tight">
              Spotify Energy Finder
            </h1>
            <p className="mt-4 text-gray-600 text-base">
              Enter a track to get an AI hype score.
            </p>
            <form onSubmit={onSubmit} id="js-form" className="mt-8 flex flex-col sm:flex-row items-center gap-3 justify-center">
              <label htmlFor="search-term" className="sr-only">Search term</label>
              <input
                type="text"
                name="search-term"
                id="js-search-term"
                placeholder="Search track"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-full sm:w-96 rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-black/70"
              />
              <button type="submit" className="btn-primary">Go</button>
            </form>

            {error && <p id="js-error-message" className="mt-3 text-red-600 text-sm">{error}</p>}
          </div>
        </section>

        <section className="bg-gray-50 py-12">
          <div className="section">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Search results</h2>
            <ul id="results-list" className="space-y-4">
              {items.length === 0 ? (
                <div className="resp-container">
                  <li className="resp-iframe centered hide-border">
                    <iframe
                      src="https://giphy.com/embed/8gwgQZR82xB2o"
                      width="480"
                      height="480"
                      frameBorder="0"
                      className="giphy-embed"
                      allowFullScreen
                    ></iframe>
                  </li>
                </div>
              ) : (
                items.map((t) => {
                  const a = analyses[t.id]
                  const title = t?.name || ''
                  const artist = t?.artists?.[0]?.name || ''
                  return (
                    <li className="group flex flex-col gap-3 bg-white rounded-lg border border-gray-200 p-4" key={t.id}>
                      <div className="flex items-center gap-4">
                        <iframe
                          className="item item-double rounded-md flex-1"
                          src={trackEmbedSrc(t.id)}
                          width="100%"
                          height="80"
                          frameBorder="0"
                          allow="encrypted-media"
                        ></iframe>
                        <div className="w-56 shrink-0 text-sm">
                          <div className="font-semibold text-gray-900 truncate">{title}</div>
                          <div className="text-gray-600 truncate">{artist}</div>
                        </div>
                        <button className="btn-secondary" onClick={() => runAnalysis(t)} disabled={!!a?.loading}>
                          {a?.loading ? 'Analyzing…' : 'Analyze'}
                        </button>
                      </div>

                      {a?.error && (
                        <p className="text-sm text-red-600">{a.error}</p>
                      )}

                      {a?.data && (
                        <div className="rounded-md border border-gray-200 p-3 bg-gray-50 text-sm">
                          <div className="font-medium text-gray-900">
                            Track: {a.data.trackTitle || title} – {a.data.artist || artist}
                          </div>
                          <div className="mt-1 font-semibold text-gray-900">Hype Score (1–10): {a.data.hypeScore}</div>
                          <div className="mt-1 text-gray-700">Reasoning: {a.data.reasoning}</div>
                        </div>
                      )}
                    </li>
                  )
                })
              )}
            </ul>
          </div>
        </section>

        <section className="section py-12 text-gray-700">
          <h2 className="text-2xl font-semibold">About Energy</h2>
          <p className="mt-2">Knowing how to move a crowd is a great skill to have for DJing.</p>
          <p className="mt-1">But not knowing the energy of your tracks can cause inconsistency in the crowd</p>
          <p className="mt-1">Only headliners should play energy that's over 7</p>
          <p className="mt-1">Openers should play energies 5-7</p>
          <h3 className="right-text mt-6 text-xl font-semibold">Famous DJ energies:</h3>
          <div className="grid sm:grid-cols-3 gap-6 mt-4 text-sm text-gray-600">
            <div>
              <h4 className="font-medium text-gray-800">Calvin Harris EDC Vegas 2014:</h4>
              <p>9, 9, 9, 9, 8, 9, 9, 8, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 8, 9, 9, 8, 9, 8, 9</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Tiesto EDC Vegas 2019:</h4>
              <p>9, 9, 8, 9, 9, 9, 9, 8, 9, 9, 8, 9, 9, 8, 8, 9, 9, 8, 9, 9, 7, 9, 9, 8, 9, 8, 9, 8, 8, 9</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-800">Illenium EDC Vegas 2019:</h4>
              <p>6, 7, 8, 6, 7, 6, 7, 6, 8, 7, 9, 7, 7, 7, 6, 8, 7, 7, 7, 8, 6, 8, 5, 9, 8, 9</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer className="mt-auto border-t border-black/5">
      <div className="section py-6 text-center text-sm text-gray-500">© Brandon Christianson</div>
    </footer>
  )
}
