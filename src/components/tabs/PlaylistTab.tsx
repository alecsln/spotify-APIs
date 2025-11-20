'use client';

import { useEffect, useState } from 'react';
import { SpotifyApi } from '@/lib/spotify';
import { SpotifyPlaylist } from '@/types/spotify';
import Image from 'next/image';

interface PlaylistTabProps {
  spotifyApi: SpotifyApi;
}

export function PlaylistTab({ spotifyApi }: PlaylistTabProps) {
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        setLoading(true);
        const response = await spotifyApi.getUserPlaylists(50);
        setPlaylists(response.items);
      } catch (error) {
        console.error('Error fetching playlists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaylists();
  }, [spotifyApi]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-white text-xl">Loading playlists...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Your Playlists</h2>
        <p className="text-gray-400">{playlists.length} playlists</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {playlists.map((playlist) => (
          <div
            key={playlist.id}
            className="bg-gray-900 rounded-lg p-4 hover:bg-gray-800 transition-colors"
          >
            <div className="aspect-square relative mb-4 rounded-lg overflow-hidden">
              {playlist.images[0] ? (
                <Image
                  src={playlist.images[0].url}
                  alt={playlist.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <span className="text-4xl">🎵</span>
                </div>
              )}
            </div>
            
            <h3 className="text-white font-semibold text-lg mb-2 truncate">
              {playlist.name}
            </h3>
            
            <div className="space-y-2 text-sm text-gray-400">
              <p>By {playlist.owner.display_name}</p>
              <p>{playlist.tracks.total} tracks</p>
              
              {playlist.description && (
                <p className="text-xs line-clamp-2 mt-2">
                  {playlist.description}
                </p>
              )}
              
              <div className="flex items-center gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  playlist.public ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  {playlist.public ? 'Public' : 'Private'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {playlists.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">
            No playlists found. Create some playlists on Spotify!
          </p>
        </div>
      )}
    </div>
  );
}
