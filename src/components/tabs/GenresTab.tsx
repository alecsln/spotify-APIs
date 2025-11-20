'use client';

import { useEffect, useState } from 'react';
import { SpotifyApi } from '@/lib/spotify';
import { SpotifyTrack } from '@/types/spotify';
import { useSpotifyData } from '@/contexts/SpotifyDataContext';
import Image from 'next/image';

interface GenresTabProps {
  spotifyApi: SpotifyApi;
}

export function GenresTab({ spotifyApi }: GenresTabProps) {
  const { getAllGenres, topArtists, followedArtists, getArtistsByGenre } = useSpotifyData();
  const [selectedGenre, setSelectedGenre] = useState<string>('');
  const [recommendations, setRecommendations] = useState<SpotifyTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const genres = getAllGenres();

  useEffect(() => {
    // Wait for artist data to be loaded
    if (topArtists.length > 0 || followedArtists.length > 0) {
      const availableGenres = getAllGenres();
      if (availableGenres.length > 0 && !selectedGenre) {
        setSelectedGenre(availableGenres[0]);
      }
      setLoading(false);
    }
  }, [topArtists, followedArtists, getAllGenres, selectedGenre]);

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

  if (loading || (topArtists.length === 0 && followedArtists.length === 0)) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">
          {topArtists.length === 0 && followedArtists.length === 0 
            ? 'Please visit the Artists tab first to load genre data...' 
            : 'Loading genres...'}
        </div>
      </div>
    );
  }

  if (genres.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="text-white text-xl mb-2">No genres found</div>
          <p className="text-gray-400">
            Your artists don't have genre information. Try following more artists or check the Artists tab.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white">Your Music Genres</h2>
          <p className="text-gray-400">{genres.length} genres from your artists</p>
        </div>
        
        {/* Genre Selection */}
        <div className="mb-6">
          <label className="block text-white text-sm font-medium mb-2">
            Select a genre to see your artists:
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

      {/* Artists by Genre */}
      {selectedGenre && (
        <div>
          <h3 className="text-xl font-semibold text-white mb-4">
            Your artists in "{selectedGenre}" genre
          </h3>
          
          {(() => {
            const artistsInGenre = getArtistsByGenre(selectedGenre);
            
            if (artistsInGenre.length === 0) {
              return (
                <div className="text-center py-8">
                  <p className="text-gray-400">No artists found for this genre.</p>
                </div>
              );
            }

            return (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {artistsInGenre.map((artist) => (
                  <div
                    key={artist.id}
                    className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors"
                  >
                    <div className="aspect-square relative mb-4 rounded-lg overflow-hidden">
                      {artist.images[0] ? (
                        <Image
                          src={artist.images[0].url}
                          alt={artist.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                          <span className="text-4xl">🎤</span>
                        </div>
                      )}
                    </div>
                    
                    <h4 className="text-white font-semibold text-lg mb-2 truncate">
                      {artist.name}
                    </h4>
                    
                    <div className="space-y-2 text-sm text-gray-400">
                      <p>{artist.followers.total.toLocaleString()} followers</p>
                      <p>Popularity: {artist.popularity}/100</p>
                      
                      <div className="flex flex-wrap gap-1 mt-2">
                        {artist.genres.slice(0, 3).map((genre) => (
                          <span
                            key={genre}
                            className={`px-2 py-1 rounded-full text-xs ${
                              genre === selectedGenre 
                                ? 'bg-spotify-green text-white' 
                                : 'bg-gray-700 text-gray-300'
                            }`}
                          >
                            {genre}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Optional: Still show recommendations if available */}
          {loadingRecommendations ? (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">
                Recommended tracks for {selectedGenre}
              </h4>
              <div className="flex items-center justify-center py-8">
                <div className="text-white">Loading recommendations...</div>
              </div>
            </div>
          ) : recommendations.length > 0 && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-white mb-4">
                Recommended tracks for {selectedGenre}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {recommendations.slice(0, 8).map((track) => (
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
                    
                    <h5 className="text-white font-medium text-sm mb-1 truncate">
                      {track.name}
                    </h5>
                    
                    <p className="text-gray-400 text-xs mb-1 truncate">
                      {track.artists.map(artist => artist.name).join(', ')}
                    </p>
                    
                    <div className="mt-2 flex justify-between items-center text-xs text-gray-400">
                      <span>♪ {track.popularity}/100</span>
                      <span>
                        {Math.floor(track.duration_ms / 60000)}:
                        {Math.floor((track.duration_ms % 60000) / 1000).toString().padStart(2, '0')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
