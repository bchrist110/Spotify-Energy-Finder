# Spotify Backend Integration

This document describes moving all Spotify API interaction (token + search) from the frontend to the Django backend so no client secret is exposed.

---
## Goals
- Remove hard‑coded `client_id:client_secret` (currently Base64 in `BASIC_AUTH`).
- Centralize token acquisition & caching on the server.
- Provide a minimal, rate‑limited REST endpoint the React app can call.
- Lay groundwork for future upgrade to Authorization Code (user context).

---
## Environment Variables
Add to your backend environment (e.g. `.env` not committed):
```
SPOTIFY_CLIENT_ID=xxxxxxxxxxxxxxxxxxxx
SPOTIFY_CLIENT_SECRET=xxxxxxxxxxxxxxxxxxxxxxxx
SPOTIFY_APP_NAME=spotify-energy-finder (optional)
```
Never expose these to the frontend build.

---
## Endpoints (Phase 1: App-Only Context)
| Method | Path | Query | Purpose | Auth |
|--------|------|-------|---------|------|
| GET | /api/spotify/search-track | `q` (string, required) | Returns up to 1 matching track (adjustable) | None (public, but can rate limit) |

(Playlists removed from product scope. Add similar endpoint later if needed.)

### Response Examples
Success (HTTP 200):
```json
{
  "tracks": {
    "items": [ { "id": "3n3Ppam7vgaVa1iaRUc9Lp", "name": "Mr. Brightside", ... } ],
    "limit": 1,
    "total": 3812
  }
}
```
Error (HTTP 400):
```json
{"error":"q required"}
```
Upstream failure (HTTP 502):
```json
{"error":"spotify_upstream_error","detail":"Bad Gateway"}
```

---
## Server Token Caching Strategy
1. Store an in‑memory singleton token + expiry timestamp.
2. On each request: reuse if `now < expires - 30s`; else fetch new.
3. Fetch: `POST https://accounts.spotify.com/api/token` body `grant_type=client_credentials` using HTTP Basic (requests `auth=(id, secret)`).
4. Cache `access_token`, `expires_in`.
5. Optional: Add Redis for multi‑process / multi‑instance deployment.

---
## Django Implementation Sketch
Create an app (e.g. `spotifyapi`). In `views.py`:
```python
import os, time, requests
from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.views.decorators.csrf import csrf_exempt

_SPOTIFY_TOKEN = None
_SPOTIFY_EXP = 0

class SpotifyError(Exception):
    pass

def _get_app_token():
    global _SPOTIFY_TOKEN, _SPOTIFY_EXP
    if _SPOTIFY_TOKEN and time.time() < _SPOTIFY_EXP - 30:
        return _SPOTIFY_TOKEN
    r = requests.post(
        'https://accounts.spotify.com/api/token',
        data={'grant_type': 'client_credentials'},
        auth=(os.environ['SPOTIFY_CLIENT_ID'], os.environ['SPOTIFY_CLIENT_SECRET']),
        timeout=10,
    )
    if r.status_code != 200:
        raise SpotifyError(f"token_error:{r.status_code}")
    data = r.json()
    _SPOTIFY_TOKEN = data['access_token']
    _SPOTIFY_EXP = time.time() + data['expires_in']
    return _SPOTIFY_TOKEN

@require_GET
@csrf_exempt  # (GET usually exempt; explicit for clarity)
def search_track(request):
    q = (request.GET.get('q') or '').strip()
    if not q:
        return JsonResponse({'error': 'q required'}, status=400)
    if len(q) > 120:
        return JsonResponse({'error': 'query_too_long'}, status=400)
    try:
        token = _get_app_token()
        r = requests.get(
            'https://api.spotify.com/v1/search',
            params={'q': q, 'type': 'track', 'limit': 1},
            headers={'Authorization': f'Bearer {token}'},
            timeout=10,
        )
    except SpotifyError as e:
        return JsonResponse({'error': 'token_fetch_failed', 'detail': str(e)}, status=502)
    except requests.Timeout:
        return JsonResponse({'error': 'spotify_timeout'}, status=504)
    except Exception as e:
        return JsonResponse({'error': 'internal', 'detail': str(e)}, status=500)
    return JsonResponse(r.json(), status=r.status_code)
```
`urls.py` (project or app):
```python
from django.urls import path
from .views import search_track
urlpatterns = [ path('api/spotify/search-track', search_track) ]
```
Add to root `urls.py` if not using include.

---
## Frontend Changes
Replace existing `spotify.js` logic:
- Remove `BASIC_AUTH`, `fetchAccessToken`, playlist helpers.
- Provide a simple wrapper:
```javascript
export async function searchTrack(q) {
  const res = await fetch(`/api/spotify/search-track?q=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}
```
Update any import sites to use `searchTrack` and stop passing a token.

---
## Rate Limiting (Optional Now, Recommended Soon)
Implement simple in‑memory IP counter or use `django-ratelimit`:
```
pip install django-ratelimit
```
Example:
```python
from ratelimit.decorators import ratelimit
@require_GET
@ratelimit(key='ip', rate='30/m', block=True)
def search_track(...):
    ...
```
Adjust rate as needed.

---
## CORS
In settings:
```python
CORS_ALLOWED_ORIGINS = ["http://localhost:5173"]  # Vite dev
```
Restrict in production to your domain.

---
## Error Handling Contract (Frontend)
Map backend `error` field to UI message:
| error | Suggested Message |
|-------|-------------------|
| q required | Enter a search term. |
| query_too_long | Query too long. Shorten it. |
| token_fetch_failed | Temporary auth issue. Retry later. |
| spotify_timeout | Spotify timed out. Retry. |
| spotify_upstream_error | Spotify error. Try again. |
| internal | Unexpected server error. |

---
## Testing Checklist
- Empty query returns 400.
- Valid query returns 200 + one track.
- Multiple rapid queries still reuse token (watch logs; token fetch only first time until expiry).
- Simulate bad credentials -> token_fetch_failed.

---
## Future: Authorization Code Upgrade
When you need user-specific data (saved tracks, private playlists):
1. Implement OAuth redirect flow.
2. Store user access + refresh tokens.
3. Swap current client credentials endpoints for user-context endpoints.
4. Maintain a per-user refresh cycle.

---
## Security Notes
- Never commit `.env` with Spotify credentials.
- Rotate secrets if previously exposed (the current Base64 pair is compromised; assume leaked).
- Add simple request logging (method, path, IP, duration) for abuse detection.
- Consider WAF / reverse proxy (NGINX) rate limiting in production.

---
## Migration Steps Summary
1. Add env vars to backend.
2. Add `spotifyapi` views + URL.
3. Remove secret + token logic from frontend.
4. Replace frontend search call.
5. Test locally.
6. Rotate Spotify client secret before deploy.
7. Deploy backend + updated frontend.

---
## Minimal Diff (Conceptual)
Frontend: − ~60 lines (token + playlist) / + ~8 lines (fetch wrapper).
Backend: + one view (~60 lines) + URL.

---
## Done
After this migration, no Spotify secrets exist in browser bundles, and token churn is centralized.
