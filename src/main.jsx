import React from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import SpotifyEnergyFinder from './pages/SpotifyEnergyFinder'
import CheckAiUi from './pages/CheckAiUi'

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/tracks', element: <SpotifyEnergyFinder /> },
  { path: '/check', element: <CheckAiUi /> },
])
             
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
