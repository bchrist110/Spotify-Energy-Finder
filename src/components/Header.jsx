import { Link } from 'react-router-dom'

export default function Header() {
  return (
    <header className="sticky top-0 z-50 header-blur border-b border-black/5">
      <div className="section flex items-center justify-between py-3">
        <h1 className="text-xl font-semibold tracking-wide text-gray-900">Brandon Christianson Apps</h1>
        <nav>
          <ul id="menu" className="flex items-center gap-6 text-sm text-gray-800">
            <li>
              <Link className="hover:opacity-70" to="/">Home</Link>
            </li>
            <li>
              <Link className="hover:opacity-70" to="/tracks">Spotify Energy</Link>
            </li>
            <li>
              <Link className="hover:opacity-70" to="/check">Check AI</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
