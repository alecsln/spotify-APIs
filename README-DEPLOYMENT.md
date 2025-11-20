# Deployment Guide

## 🚀 Option 1: Vercel (Recommended - Full Features)

Vercel supports all Next.js features including NextAuth.js:

### Setup Steps:
1. **Push to GitHub**
2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Set Environment Variables in Vercel:**
   ```
   NEXTAUTH_URL=https://your-app-name.vercel.app
   NEXTAUTH_SECRET=your-generated-secret
   SPOTIFY_CLIENT_ID=your-spotify-client-id
   SPOTIFY_CLIENT_SECRET=your-spotify-client-secret
   ```

4. **Update Spotify App Settings:**
   - Redirect URI: `https://your-app-name.vercel.app/api/auth/callback/spotify`

5. **Deploy:** Vercel auto-deploys on every push to main branch

---

## 📄 Option 2: GitHub Pages (Static Only - Limited)

⚠️ **Limitations:** No server-side features, client-side auth only

### Setup Steps:

1. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: GitHub Actions

2. **Set Environment Variables:**
   Create `.env.local` with:
   ```
   NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your-spotify-client-id
   ```

3. **Update Spotify App:**
   - Redirect URI: `https://yourusername.github.io/spotify-APIs/callback`
   - Use **Implicit Grant Flow** (client-side only)

4. **Push to main branch** - GitHub Actions will build and deploy

### Client-Side Auth Usage:
```typescript
import { SpotifyClientAuth } from '@/lib/spotify-client-auth';

const auth = new SpotifyClientAuth();
const authUrl = auth.generateAuthUrl();
// Redirect user to authUrl
```

---

## 🔄 Switch Between Deployments

**For Vercel (full features):**
```bash
git checkout main
# Use NextAuth.js version
```

**For GitHub Pages (static):**
```bash
# Modify components to use SpotifyClientAuth instead of NextAuth
# Remove API routes
# Use static export
```

---

## 🎯 Recommendation

**Use Vercel** for the best experience - it's free for personal projects and supports all Next.js features including the server-side authentication your app needs.
