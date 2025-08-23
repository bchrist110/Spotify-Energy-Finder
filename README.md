# Spotify Energy Finder (Vite + React)

This project was migrated from a static jQuery app to a React app powered by Vite.

Scripts:
- npm run dev — start dev server
- npm run build — production build
- npm run preview — preview built app

Routing:
- / — Tracks search
- /playlists — Playlist search and selection

Important: The original app embedded the Spotify Client Secret in the browser. That is insecure. For production, replace the token call with a backend that uses the Client Credentials flow and returns an access token to the browser.

A web app to help DJs find the energies of their tracks in order to make their DJ sets flow better.

Users can either search songs/artists in the first page, or navigate to a seperate page where they can search playlists and get the energies of the whole playlist.

Uses HTML, CSS, JavaScript, JQuery, and the Spotify API.

https://bchrist110.github.io/Spotify-Energy-Finder/
