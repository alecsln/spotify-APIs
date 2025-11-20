import { SpotifyUser, SpotifyArtist, SpotifyPlaylist, SpotifyApiResponse, SpotifyGenre } from '@/types/spotify';

const SPOTIFY_API_BASE = 'https://api.spotify.com/v1';

export class SpotifyApi {
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${SPOTIFY_API_BASE}${endpoint}`, {
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json();
  }

  async getCurrentUser(): Promise<SpotifyUser> {
    return this.request<SpotifyUser>('/me');
  }

  async getTopArtists(limit = 20): Promise<SpotifyApiResponse<SpotifyArtist>> {
    return this.request<SpotifyApiResponse<SpotifyArtist>>(`/me/top/artists?limit=${limit}&time_range=medium_term`);
  }

  async getUserPlaylists(limit = 20): Promise<SpotifyApiResponse<SpotifyPlaylist>> {
    return this.request<SpotifyApiResponse<SpotifyPlaylist>>(`/me/playlists?limit=${limit}`);
  }

  async getAvailableGenres(): Promise<{ genres: string[] }> {
    return this.request<{ genres: string[] }>('/recommendations/available-genre-seeds');
  }

  async getRecommendationsByGenre(genre: string, limit = 20) {
    return this.request(`/recommendations?seed_genres=${genre}&limit=${limit}`);
  }

  async getFollowedArtists(limit = 20): Promise<{ artists: SpotifyApiResponse<SpotifyArtist> }> {
    return this.request<{ artists: SpotifyApiResponse<SpotifyArtist> }>(`/me/following?type=artist&limit=${limit}`);
  }
}
