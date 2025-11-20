# Spotify Dashboard

A Next.js application that integrates with Spotify's Web API to display user data across 4 main sections: Artists, Playlists, Genres, and User Profile.

## Features

- **Spotify OAuth Authentication** - Secure login using Spotify credentials
- **Artists Tab** - View your top artists and followed artists with detailed information
- **Playlists Tab** - Browse all your Spotify playlists with metadata
- **Genres Tab** - Explore music genres and get recommendations
- **Profile Tab** - View your Spotify profile and music statistics

## Setup

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Spotify App:**
   - Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
   - Create a new app
   - Set redirect URI to: `http://localhost:3000/api/auth/callback/spotify`
   - Note your Client ID and Client Secret

3. **Environment Variables:**
   - Copy `env-template.txt` to `.env.local`
   - Fill in your Spotify credentials:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   SPOTIFY_CLIENT_ID=your-spotify-client-id
   SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open [http://localhost:3000](http://localhost:3000)** in your browser

## Tech Stack

- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **NextAuth.js** for authentication
- **Spotify Web API** for data fetching

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/auth/          # NextAuth API routes
│   ├── dashboard/         # Main dashboard page
│   ├── login/            # Login page
│   └── layout.tsx        # Root layout
├── components/
│   ├── tabs/             # Tab components (Artist, Playlist, etc.)
│   └── Providers.tsx     # Session provider wrapper
├── lib/
│   ├── auth.ts           # NextAuth configuration
│   └── spotify.ts        # Spotify API client
└── types/
    ├── spotify.ts        # Spotify API type definitions
    └── next-auth.d.ts    # NextAuth type extensions
```

## Spotify API Scopes

The app requests the following Spotify permissions:
- `user-read-email` - Access to user's email
- `user-read-private` - Access to user's profile data
- `user-top-read` - Access to user's top artists and tracks
- `playlist-read-private` - Access to user's private playlists
- `playlist-read-collaborative` - Access to collaborative playlists
- `user-follow-read` - Access to followed artists

## License

MIT License