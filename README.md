# Transitions

### *Discover the moment one song becomes another.*

[![Live Demo](https://img.shields.io/badge/Live%20Demo-transitions.ro--hith.com-6366f1?style=flat-square)](https://transitions.ro-hith.com)
![Next.js](https://img.shields.io/badge/Next.js%2013-black?style=flat-square&logo=next.js)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=flat-square&logo=postgresql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-38bdf8?style=flat-square&logo=tailwindcss&logoColor=white)

Transitions is a full-stack music platform where users create and share seamless hand-offs between two songs — picking exactly where one ends and the other begins. Think of it as a curated feed of musical segues: browse what the community has crafted, like your favorites, or contribute your own.

---

## Live Demo

**[transitions.ro-hith.com](https://transitions.ro-hith.com)** — no account required to browse.

Sign in with GitHub or Google to upload transitions.

---

## Origin Story

Transitions started as a Spotify API project. After applying to lift the standard 25-user developer testing cap, Spotify rejected the request — citing a clause they had recently added restricting API access for apps that resembled mixing or DJ applications, which Transitions did. Rather than shelve the project, the stack was rebuilt around the iTunes Search API for track metadata and album art, and hidden YouTube iframes for playback, with `yt-search` automatically resolving song names to video IDs behind the scenes. The constraint became the architecture.

---

## Features

**Discover**
- Randomized community feed with YouTube-powered playback
- Album art-driven aurora gradient background (colors shift per transition)
- Animated vinyl disc, equalizer bars, and smooth crossfade animations
- Previous / next navigation; lazy-loads more without repeats

**Create**
- Search 10M+ songs via the iTunes catalog
- Millisecond-precision start-time picker with live preview
- YouTube video ID resolved automatically — no manual linking

**Profiles & Community**
- User profiles with a grid of uploaded transitions
- Like / unlike with optimistic UI updates
- Delete your own transitions
- Browse any user's profile

**Auth**
- GitHub OAuth
- Google OAuth
- Username + password (bcrypt, 12 rounds)
- Guest browsing — sign-in only required to upload

---

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js 13 (App Router), React 18, Framer Motion, TailwindCSS, React Palette |
| Backend | Next.js Server Actions, PostgreSQL, Knex.js |
| Auth | NextAuth.js v4 (JWT strategy), bcryptjs |
| External APIs | iTunes Search API, YouTube IFrame API, yt-search |

---

## Architecture Highlights

**Single YouTube player, shared state**
One YouTube iframe is mounted once and persists across the entire app. An `owner` state (`"feed"` | `"upload"` | `null`) controls which component has playback authority — preventing the upload preview modal and the main feed from fighting over the same player instance.

**Randomized feed without repeats**
`getTransitions()` runs `ORDER BY RANDOM()` in PostgreSQL and passes the current list of already-seen transition IDs as exclusions on every fetch. No pagination cursors, no repeats, always fresh.

**Dynamic aurora background**
`react-palette` extracts the dominant color from each transition's album art client-side. The background gradient animates to the new palette as the active transition changes, making every card visually distinct.

**Auto-resolved YouTube IDs with caching**
When a transition is uploaded, `yt-search` queries YouTube for each track by name and artist, returning the most relevant video ID. Results are written to a `youtube_cache` table (keyed on `"Track Name - Artist"`) so the same lookup is never made twice.

---

## Getting Started

### Prerequisites
- Node.js ≥ 18
- PostgreSQL database

### Environment Variables

Create a `.env.local` file:

```env
DATABASE_URL=postgresql://user:password@host:5432/dbname

NEXTAUTH_SECRET=your_secret_here
NEXTAUTH_URL=http://localhost:3000

GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

### Install & Run

```bash
npm install --legacy-peer-deps
npm run dev
```

---

## Database

The full schema lives in [`schema.sql`](./schema.sql). To initialize a fresh database:

```bash
psql $DATABASE_URL < schema.sql
```

Tables: `users`, `transitions`, `likes`, `comments`, `youtube_cache`. The schema is idempotent (`IF NOT EXISTS` + `ADD COLUMN IF NOT EXISTS`) and safe to run on an existing database.

---

## Project Structure

<details>
<summary>Click to expand</summary>

```
app/
├── layout.js                        # Root layout + session provider
├── login/
│   ├── page.jsx                     # Auth form (OAuth + credentials)
│   └── actions.js                   # Sign-up / bcrypt logic
├── logout/page.jsx                  # Sign-out confirmation screen
├── home/
│   ├── content.jsx                  # Client entry point for the main feed
│   ├── youtubePlayer.js             # Shared YouTube player context
│   └── _components/
│       ├── TransitionPlayer/        # Feed: randomized transitions + lazy loading
│       ├── TrackPlayer/             # Upload modal: search, start-time, preview
│       ├── Search/                  # iTunes search UI + server action
│       └── profile/                 # Profile menu, account settings, delete account
├── profile/[profile]/               # Public user profile page + transition grid
├── api/auth/[...nextauth]/
│   ├── authOptions.js               # Providers, JWT + session callbacks
│   └── route.js                     # NextAuth handler
└── _components/
    ├── transitionPlayer.jsx         # Main playback dock (vinyl, controls, metadata)
    ├── like.js                      # Like / unlike server actions
    ├── AuroraBackground.jsx         # Dynamic gradient background
    ├── VinylDisc.jsx                # Spinning vinyl animation
    └── EqualizerBars.jsx            # Animated equalizer during playback
```

</details>
