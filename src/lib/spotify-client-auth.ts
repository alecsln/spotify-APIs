// Client-side Spotify authentication for static deployment
export class SpotifyClientAuth {
  private clientId: string;
  private redirectUri: string;
  private scopes: string[];

  constructor() {
    this.clientId = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID || '';
    this.redirectUri = typeof window !== 'undefined' 
      ? `${window.location.origin}/callback` 
      : '';
    this.scopes = [
      'user-read-email',
      'user-read-private', 
      'user-top-read',
      'playlist-read-private',
      'playlist-read-collaborative',
      'user-follow-read',
    ];
  }

  generateAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: this.clientId,
      response_type: 'token',
      redirect_uri: this.redirectUri,
      scope: this.scopes.join(' '),
      show_dialog: 'true',
    });

    return `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  getTokenFromUrl(): string | null {
    if (typeof window === 'undefined') return null;
    
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    return params.get('access_token');
  }

  saveToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('spotify_access_token', token);
    }
  }

  getStoredToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('spotify_access_token');
    }
    return null;
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('spotify_access_token');
      window.location.hash = '';
    }
  }
}
