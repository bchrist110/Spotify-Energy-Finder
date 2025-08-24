// (Deprecated) Home page no longer used after simplifying app to single Spotify Energy Finder.
// File retained temporarily; safe to delete.

import React from 'react'
import Header from '../components/Header'
import '../app.css'

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-100">
      <Header />
      <main className="flex-1 section py-20">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-semibold tracking-tight text-gray-900 mb-6">Choose an App</h1>
          <p className="text-gray-600 mb-12 text-lg">Select which tool you want to use.</p>
          <div className="grid gap-10 sm:grid-cols-2">
            <AppCard
              title="Spotify Energy Finder"
              description="Search a track and get an AI-generated hype score with reasoning to plan your DJ set energy curve."
              to="/tracks"
              gradient="from-emerald-500 via-green-500 to-teal-500"
            />
            <AppCard
              title="Check AI UI"
              description="Upload a check image to analyze for potential handwriting or alteration anomalies using AI."
              to="/check"
              gradient="from-sky-500 via-cyan-500 to-fuchsia-500"
            />
          </div>
        </div>
      </main>
      <footer className="mt-auto border-t border-black/5">
        <div className="section py-6 text-center text-sm text-gray-500">© Brandon Christianson</div>
      </footer>
    </div>
  )
}

function AppCard({ title, description, to, gradient }) {
  return (
    <a
      href={to}
      className={`group relative rounded-3xl overflow-hidden border border-black/10 bg-white shadow-sm hover:shadow-xl transition-all duration-300`}
    >
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r ${gradient} mix-blend-multiply`} />
      <div className="relative p-8 h-full flex flex-col">
        <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-white transition-colors mb-3">{title}</h2>
        <p className="text-gray-600 group-hover:text-white/90 text-sm leading-relaxed flex-1">{description}</p>
        <span className="inline-flex items-center gap-2 mt-6 text-sm font-medium text-emerald-600 group-hover:text-white">
          Open <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h4m0 0v4m0-4L10 14" /></svg>
        </span>
      </div>
    </a>
  )
}
