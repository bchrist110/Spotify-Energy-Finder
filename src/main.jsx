import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import SpotifyEnergyFinder from './pages/SpotifyEnergyFinder'

const router = createBrowserRouter([
  { path: '/', element: <SpotifyEnergyFinder /> },
])
             
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
