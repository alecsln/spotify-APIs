'use client';

import { useEffect, useState } from 'react';
import { SpotifyApi } from '@/lib/spotify';
import { SpotifyTrack } from '@/types/spotify';
import Image from 'next/image';

interface GenresTabProps {
  spotifyApi: SpotifyApi;
}

export function GenresTab({ spotifyApi }: GenresTabProps) {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [recommendations, setRecommendations] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        setLoading(true);
        const response = await spotifyApi.getAvailableGenres();
        setGenres(response.genres);
        if (response.genres.length > 0) {
          setSelectedGenre(response.genres[0]);
        }
      } catch (error) {
        console.error('Error fetching genres:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenres();
  }, [spotifyApi]);

  useEffect(() => {
    if (selectedGenre) {
      const fetchRecommendations = async () => {
        try {
          setLoadingRecommendations(true);
          const response = await spotifyApi.getRecommendationsByGenre(selectedGenre, 20);
          setRecommendations(response.tracks);
        } catch (error) {
          console.error('Error fetching recommendations:', error);
        } finally {
          setLoadingRecommendations(false);
        }
      };

      fetchRecommendations();
    }
  }, [selectedGenre, spotifyApi]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading genres...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-4">Music Genres</h2>
        
        {/* Genre Selection */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Select a genre to discover music:
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="bg-gray-800 text-white border border-gray-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-spotify-green"
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre.charAt(0).toUpperCase() + genre.slice(1).replace(/-/g, ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Recommendations */}
      {selectedGenre && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Recommended tracks for {selectedGenre.replace(/-/g, ' ')}
          </h3>
          
          {loadingRecommendations ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-white">Loading recommendations...</div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recommendations.map((track) => (
                <div
                  key={track.id}
                  className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                >
                  <div className="aspect-square relative mb-3 rounded-lg overflow-hidden">
                    {track.album.images[0] ? (
                      <Image
                        src={track.album.images[0].url}
                        alt={track.album.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <span className="text-3xl">🎶</span>
                      </div>
                    )}
                  </div>
                  
                  <h4 className="text-white font-medium text-sm mb-1 truncate">
                    {track.name}
                  </h4>
                  
                  <p className="text-gray-400 text-xs mb-1 truncate">
                    {track.artists.map(artist => artist.name).join(', ')}
                  </p>
                  
                  <p className="text-gray-500 text-xs truncate">
                    {track.album.name}
                  </p>
                  
                  <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
                    <span>Popularity: {track.popularity}/100</span>
                    <span>
                      {Math.floor(track.duration_ms / 60000)}:
                      {Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, '0')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {recommendations.length === 0 && !loadingRecommendations && (
            <div className="text-center py-8">
              <p className="text-gray-400">No recommendations found for this genre.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
