import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 header-blur border-b border-black/5">
      <div className="section flex items-center justify-between py-3">
        <h1 className="text-xl font-semibold tracking-wide text-gray-900">Spotify Energy Finder</h1>
      </div>
    </header>
  )
}
