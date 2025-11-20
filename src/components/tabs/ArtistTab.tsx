'use client';

import { useEffect, useState } from 'react';
import { SpotifyApi } from '@/lib/spotify';
import { SpotifyArtist } from '@/types/spotify';
import Image from 'next/image';

interface ArtistTabProps {
  spotifyApi: SpotifyApi;
}

export function ArtistTab({ spotifyApi }: ArtistTabProps) {
  const [topArtists, setTopArtists] = useState<SpotifyArtist[]>([]);
  const [followedArtists, setFollowedArtists] = useState<SpotifyArtist[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeView, setActiveView] = useState<'top' | 'followed'>('top');

  useEffect(() => {
    const fetchArtists = async () => {
      try {
        setLoading(true);
        const [topResponse, followedResponse] = await Promise.all([
          spotifyApi.getTopArtists(20),
          spotifyApi.getFollowedArtists(20),
        ]);
        
        setTopArtists(topResponse.items);
        setFollowedArtists(followedResponse.artists.items);
      } catch (error) {
        console.error('Error fetching artists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArtists();
  }, [spotifyApi]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading artists...</div>
      </div>
    );
  }

  const currentArtists = activeView === 'top' ? topArtists : followedArtists;

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex space-x-4">
        <button
          onClick={() => setActiveView('top')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'top'
              ? 'bg-spotify-green text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          Top Artists
        </button>
        <button
          onClick={() => setActiveView('followed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeView === 'followed'
              ? 'bg-spotify-green text-white'
              : 'bg-gray-800 text-gray-400 hover:text-white'
          }`}
        >
          Followed Artists
        </button>
      </div>

      {/* Artists Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {currentArtists.map((artist) => (
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
            
            <h3 className="text-white font-semibold text-lg mb-2 truncate">
              {artist.name}
            </h3>
            
            <div className="space-y-2 text-sm text-gray-400">
              <p>{artist.followers.total.toLocaleString()} followers</p>
              <p>Popularity: {artist.popularity}/100</p>
              
              {artist.genres.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {artist.genres.slice(0, 3).map((genre) => (
                    <span
                      key={genre}
                      className="bg-gray-700 px-2 py-1 rounded-full text-xs"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {currentArtists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            {activeView === 'top' 
              ? 'No top artists found. Listen to more music to see your top artists!'
              : 'No followed artists found. Follow some artists on Spotify!'
            }
          </p>
        </div>
      )}
    </div>
  );
}
